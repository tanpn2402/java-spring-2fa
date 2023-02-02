package com.tanpn.t2fa;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.tanpn.t2fa.cache.SimpleExpirableCache;

import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;

@Component
class AppConfigure {

    @Bean
    public SecretGenerator secretGenerator() {
        SecretGenerator secretGenerator = new DefaultSecretGenerator();
        return secretGenerator;
    }

    @Bean
    public SimpleExpirableCache<String, String> loginRequired2FACacheImpl() {
        return new SimpleExpirableCache<>(60 * 5);
    }

    @Bean
    public SimpleExpirableCache<String, String> secret2FACacheImpl() {
        return new SimpleExpirableCache<>(60 * 5);
    }
}