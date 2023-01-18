package com.tanpn.t2fa.rest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
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

@RestController
@CrossOrigin
public class T2faController {
    private final static Logger LOGGER = Logger.getLogger(T2faController.class.getName());
    private SecretGenerator mvSecretGenerator;
    private UserRepository mvUserRepository;

    @Autowired
    public T2faController(SecretGenerator secretGenerator, UserRepository userRepository) {
        this.mvSecretGenerator = secretGenerator;
        this.mvUserRepository = userRepository;
    }

    /**
     * @param payload
     * @retur
     * @throws QrGenerationException
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody JsonNode payload) throws QrGenerationException {
        Map<String, String> lvResp = new HashMap<>();
        String lvName = payload.get("username").asText();
        LOGGER.info("Register 2FA with user " + lvName);

        UserEntity lvUser = null;
        List<UserEntity> lvListUser = mvUserRepository.findByUsername(lvName);
        if (lvListUser.size() > 0) {
            lvUser = lvListUser.get(0);
        }
        if (lvUser != null) {
            final String lvSecret = mvSecretGenerator.generate();

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

            lvResp.put("v", dataUri);
            lvResp.put("m", mimeType);

            lvUser.setAuthenticator_secret(lvSecret);

            mvUserRepository.save(lvUser);
        } else {

        }
        return new ResponseEntity<>(lvResp, HttpStatus.OK);
    }

    @PostMapping("/login/2fa")
    public ResponseEntity<Map<String, String>> loginBy2FA(@RequestBody JsonNode payload) throws QrGenerationException {
        Map<String, String> lvResp = new HashMap<>();
        String lvName = payload.get("username").asText();
        String lvCode = payload.get("code").asText();
        LOGGER.info("Login with 2FA " + lvName + " | " + lvCode);

        UserEntity lvUser = null;
        List<UserEntity> lvListUser = mvUserRepository.findByUsername(lvName);
        if (lvListUser.size() > 0) {
            lvUser = lvListUser.get(0);
        }
        if (lvUser != null) {
            if (lvUser.getAuthenticator_secret() == null || lvUser.getAuthenticator_secret().isBlank() ||
                    lvUser.getAuthenticator_secret().isEmpty()) {
                lvResp.put("e", "Invalid secret code");
            } else {
                TimeProvider timeProvider = new SystemTimeProvider();
                CodeGenerator codeGenerator = new DefaultCodeGenerator();
                CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
                boolean successful = verifier.isValidCode(lvUser.getAuthenticator_secret(), lvCode);

                lvResp.put("s", String.valueOf(successful));
            }
        } else {
            lvResp.put("e", "User hasn't registered 2FA yet");
        }

        return new ResponseEntity<>(lvResp, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody JsonNode payload) throws QrGenerationException {
        Map<String, String> lvResp = new HashMap<>();
        String lvName = payload.get("username").asText();
        String lvPasswd = payload.get("password").asText();
        LOGGER.info("Login by password " + lvName);

        UserEntity lvUser = null;
        List<UserEntity> lvListUser = mvUserRepository.findByUsername(lvName);
        if (lvListUser.size() > 0) {
            lvUser = lvListUser.get(0);
        }
        if (lvUser != null) {
            if (lvPasswd.equals(lvUser.getPassword())) {
                lvResp.put("s", String.valueOf(true));
                lvResp.put("t", "token-123");
            } else {
                lvResp.put("s", String.valueOf(false));
                lvResp.put("e", "Wrong username or password");
            }
        } else {
            lvResp.put("e", "Wrong username or password");
        }

        return new ResponseEntity<>(lvResp, HttpStatus.OK);
    }

}
