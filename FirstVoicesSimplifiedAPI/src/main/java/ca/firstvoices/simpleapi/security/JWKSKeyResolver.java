package ca.firstvoices.simpleapi.security;

import ca.firstvoices.simpleapi.nuxeo.SimpleAPINuxeoConfiguration;
import com.auth0.jwk.JwkException;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.SigningKeyResolver;
import java.security.Key;
import java.util.Optional;
import java.util.logging.Logger;
import javax.inject.Singleton;
import org.nuxeo.runtime.api.Framework;

@Singleton
public class JWKSKeyResolver implements SigningKeyResolver {
  private static final Logger log = Logger.getLogger(JWKSKeyResolver.class.getCanonicalName());

  private Optional<JwkProvider> keyStore = Optional.empty();

  public JWKSKeyResolver() {
    SimpleAPINuxeoConfiguration config = Framework.getService(SimpleAPINuxeoConfiguration.class);

    try {
      keyStore = Optional.of(new JwkProviderBuilder(config.getJwksUrl()).build());
      log.info("JWT keystore created using jwks url: " + config.getJwksUrl());
    } catch (Exception e) {
      log.severe("JWT Keystore configuration failed. Token verification will fail." + e);
    }

  }

  private Key keyForKeyID(String keyId) {
    return keyStore.map(ks -> {
      try {
        return ks.get(keyId).getPublicKey();
      } catch (JwkException e) {
        log.warning("No key could be returned\n" + e.toString());
        return null;
      }
    }).orElse(null);
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
