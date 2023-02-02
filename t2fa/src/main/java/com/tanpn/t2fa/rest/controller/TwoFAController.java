package com.tanpn.t2fa.rest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.tanpn.t2fa.cache.SimpleExpirableCache;
import com.tanpn.t2fa.entity.UserEntity;
import com.tanpn.t2fa.repository.UserRepository;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;

import static dev.samstevens.totp.util.Utils.getDataUriForImage;

@RestController("/2fa")
public class TwoFAController {

    private final static Logger LOGGER = Logger.getLogger(AuthController.class.getName());
    private SecretGenerator mvSecretGenerator;
    private UserRepository mvUserRepository;
    private SimpleExpirableCache<String, String> mvSecret2FACacheImpl;
    private SimpleExpirableCache<String, String> mvLoginRequired2FACacheImpl;

    @Autowired
    public TwoFAController(SecretGenerator secretGenerator, UserRepository userRepository,
            SimpleExpirableCache<String, String> secret2FACacheImpl,
            SimpleExpirableCache<String, String> loginRequired2FACacheImpl) {
        this.mvSecretGenerator = secretGenerator;
        this.mvUserRepository = userRepository;
        this.mvSecret2FACacheImpl = secret2FACacheImpl;
        this.mvLoginRequired2FACacheImpl = loginRequired2FACacheImpl;
    }

    /**
     * @param payload
     * @retur
     * @throws QrGenerationException
     */
    @PostMapping("/generate-qrcode")
    public ResponseEntity<Map<String, String>> generateQRCode(@RequestBody JsonNode payload)
            throws QrGenerationException {
        Map<String, String> lvResp = new HashMap<>();
        String lvSecret = null;
        String lvName = payload.get("username").asText();
        if (payload.get("secret") != null) {
            lvSecret = payload.get("secret").asText();
        } else {
            lvSecret = mvSecretGenerator.generate();
        }
        LOGGER.info("Generate QRcode with secret " + lvSecret);

        UserEntity lvUser = null;
        List<UserEntity> lvListUser = mvUserRepository.findByUsername(lvName);
        if (lvListUser.size() > 0) {
            lvUser = lvListUser.get(0);
        }
        if (lvUser != null) {
            QrData data = new QrData.Builder()
                    .label(lvName)
                    .secret(lvSecret)
                    .issuer("t2FA")
                    .algorithm(HashingAlgorithm.SHA1) // More on this below
                    .digits(6)
                    .period(30)
                    .build();
            QrGenerator generator = new ZxingPngQrGenerator();
            byte[] imageData = generator.generate(data);
            String mimeType = generator.getImageMimeType();

            String dataUri = getDataUriForImage(imageData, mimeType);

            lvResp.put("s", String.valueOf(true));
            lvResp.put("v", dataUri);
            lvResp.put("m", mimeType);
            // lvResp.put("s", lvSecret);
            this.mvSecret2FACacheImpl.put(lvName, lvSecret);
        } else {
            lvResp.put("s", String.valueOf(false));
            lvResp.put("e", "Invalid user");
        }

        return new ResponseEntity<>(lvResp, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody JsonNode payload) throws QrGenerationException {
        Map<String, String> lvResp = new HashMap<>();
        String lvName = payload.get("username").asText();
        String lvCode = payload.get("code").asText();
        // String lvSecret = payload.get("secret").asText();
        String lvSecret = this.mvSecret2FACacheImpl.get(lvName);
        LOGGER.info("Login with 2FA " + lvName + " | " + lvCode);

        if (lvSecret == null) {
            lvResp.put("s", String.valueOf(false));
            lvResp.put("e", "Invalid user or QRCode is expired");
            return new ResponseEntity<>(lvResp, HttpStatus.OK);
        }
        UserEntity lvUser = null;
        List<UserEntity> lvListUser = mvUserRepository.findByUsername(lvName);
        if (lvListUser.size() > 0) {
            lvUser = lvListUser.get(0);
        }
        if (lvUser != null) {
            TimeProvider timeProvider = new SystemTimeProvider();
            CodeGenerator codeGenerator = new DefaultCodeGenerator();
            CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
            boolean successful = verifier.isValidCode(lvSecret, lvCode);

            lvResp.put("s", String.valueOf(successful));

            if (successful) {
                lvUser.setAuthenticator_secret(lvSecret);
                mvUserRepository.save(lvUser);
            } else {
                lvResp.put("e", "Invalid code");
            }
        } else {
            lvResp.put("e", "Invalid user");
        }

        return new ResponseEntity<>(lvResp, HttpStatus.OK);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verify(@RequestBody JsonNode payload) {
        Map<String, String> lvResp = new HashMap<>();
        String lvName = payload.get("username").asText();
        String lvCode = payload.get("code").asText();
        String lv2faToken = payload.get("2faToken").asText("");
        LOGGER.info("Verify 2FA " + lvName + " | " + lvCode);

        UserEntity lvUser = null;
        List<UserEntity> lvListUser = mvUserRepository.findByUsername(lvName);
        if (lvListUser.size() > 0) {
            lvUser = lvListUser.get(0);
        }
        if (lvUser != null) {
            if (lvUser.getAuthenticator_secret() == null || lvUser.getAuthenticator_secret().isBlank() ||
                    lvUser.getAuthenticator_secret().isEmpty()) {
                lvResp.put("e", "User hasn't registered 2FA yet");
            } else {
                TimeProvider timeProvider = new SystemTimeProvider();
                CodeGenerator codeGenerator = new DefaultCodeGenerator();
                CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
                boolean successful = verifier.isValidCode(lvUser.getAuthenticator_secret(), lvCode);

                lvResp.put("s", String.valueOf(successful));

                if (successful && !lv2faToken.isEmpty()) {
                    final String lvSessionToken = this.mvLoginRequired2FACacheImpl.get(lv2faToken + "_" + lvName);
                    lvResp.put("t", lvSessionToken);
                }
            }
        } else {
            lvResp.put("e", "Invalid user");
        }

        return new ResponseEntity<>(lvResp, HttpStatus.OK);
    }
}
