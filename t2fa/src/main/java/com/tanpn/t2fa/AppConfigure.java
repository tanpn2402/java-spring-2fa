package com.tanpn.t2fa;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;

@Component
class AppConfigure {

    @Bean
    public SecretGenerator secretGenerator() {
        SecretGenerator secretGenerator = new DefaultSecretGenerator();
        return secretGenerator;
    }
}