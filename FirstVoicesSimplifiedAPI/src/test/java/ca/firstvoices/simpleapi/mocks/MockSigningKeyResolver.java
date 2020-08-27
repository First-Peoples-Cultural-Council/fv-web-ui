package ca.firstvoices.simpleapi.mocks;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SigningKeyResolver;
import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.logging.Logger;
import javax.inject.Singleton;

@Singleton
public class MockSigningKeyResolver implements SigningKeyResolver {

  private static final PublicKey publicKey;
  private static final PrivateKey privateKey;
  private static final String kid;

  private static final Logger log =
      Logger.getLogger(MockSigningKeyResolver.class.getCanonicalName());


  static {
    try {
      KeyPair keyPair = KeyPairGenerator.getInstance("RSA").generateKeyPair();
      publicKey = keyPair.getPublic();
      privateKey = keyPair.getPrivate();
      kid = "key_" + (new Date()).getTime();
      log.info("Generated public/private keypair for mock signing key resolver");
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("Failed to generate keyPair", e);
    }
  }

  public String generateJWT() {
    return Jwts.builder()
        .setHeaderParam("kid", MockSigningKeyResolver.kid)
        .setIssuedAt(new Date())
        .setNotBefore(Date.from(ZonedDateTime.now().minusSeconds(5).toInstant()))
        .setExpiration(Date.from(ZonedDateTime.now().plusHours(12).toInstant()))
        .claim(Claims.AUDIENCE, "fv")
        .signWith(MockSigningKeyResolver.privateKey)
        .compact();
  }

  private Key keyForKeyID(String keyId) {
    if (keyId.equals(MockSigningKeyResolver.kid)) {
      return MockSigningKeyResolver.publicKey;
    }
    log.warning("no key match: " + keyId + " != " + MockSigningKeyResolver.kid);
    return null;
  }


  @Override
  public Key resolveSigningKey(JwsHeader jwsHeader, Claims claims) {
    return keyForKeyID(jwsHeader.getKeyId());
  }

  @Override
  public Key resolveSigningKey(JwsHeader jwsHeader, String claims) {
    return keyForKeyID(jwsHeader.getKeyId());
  }
}
