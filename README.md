# Simple Two-Factor Authentication with Java Spring and NextJS

## 1. Java Spring project
#### 1.1. Folder: ./t2fa/

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
</dependency>
```
Thanks for `@samstevens` brings us a Time-based One Time Password (MFA) Library for Java [Github](https://github.com/samdjstevens/java-totp)
```xml
<dependency>
    <groupId>dev.samstevens.totp</groupId>
    <artifactId>totp</artifactId>
    <version>1.7.1</version>
</dependency>
```

#### 1.2. Run project
```sh
mvn spring-boot:run
```
By default, HTTP server listens on port 8080.

#### 1.3. APIs
```
/login
/2fa/generate-qrcode
/2fa/register
/2fa/verify
```

## 2. NextJS project
### 2.1. Folder: ./web/
```
"next": "13.1.2",
"react": "18.2.0"
```
This project uses NextJS v13 with `appDir` experimental feature, more detail at [https://beta.nextjs.org/docs](https://beta.nextjs.org/docs). This project also uses Tailwinds and Tailwinds Elements for faster and easier.
### 2.2. Run Project
```sh
npm run dev
```
By default, NextJS dev server listens on port 3000.

## 3. References
1. [https://github.com/samdjstevens/java-totp](https://github.com/samdjstevens/java-totp)
2. [https://beta.nextjs.org/docs](https://beta.nextjs.org/docs)
3. [https://tailwindcss.com/docs/guides/nextjs](https://tailwindcss.com/docs/guides/nextjs)
4. [https://tailwind-elements.com/quick-start/](https://tailwind-elements.com/quick-start/)