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
import com.tanpn.t2fa.cache.SimpleExpirableCache;
import com.tanpn.t2fa.entity.UserEntity;
import com.tanpn.t2fa.repository.UserRepository;

import dev.samstevens.totp.secret.SecretGenerator;

@RestController
@CrossOrigin
public class AuthController {
    private final static Logger LOGGER = Logger.getLogger(AuthController.class.getName());
    private SecretGenerator mvSecretGenerator;
    private UserRepository mvUserRepository;
    private SimpleExpirableCache<String, String> mvLoginRequired2FACacheImpl;

    @Autowired
    public AuthController(SecretGenerator secretGenerator, UserRepository userRepository,
            SimpleExpirableCache<String, String> loginRequired2FACacheImpl) {
        this.mvSecretGenerator = secretGenerator;
        this.mvUserRepository = userRepository;
        this.mvLoginRequired2FACacheImpl = loginRequired2FACacheImpl;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody JsonNode payload) {
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
                final String lvSessionToken = "token-123";
                if (lvUser.getAuthenticator_secret() == null || lvUser.getAuthenticator_secret().isEmpty()) {
                    lvResp.put("s", String.valueOf(true));
                    lvResp.put("t", lvSessionToken);
                } else {
                    final String twoFAToken = this.mvSecretGenerator.generate();
                    lvResp.put("s", String.valueOf(true));
                    lvResp.put("2faToken", twoFAToken);
                    lvResp.put("m", "2FA verification");

                    this.mvLoginRequired2FACacheImpl.put(twoFAToken + "_" + lvName, lvSessionToken);
                }
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
