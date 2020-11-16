package ca.firstvoices.rest.helpers;

import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import org.nuxeo.ecm.core.api.DocumentModel;

public class EtagHelper {

  private EtagHelper() {
  }

  public static interface ETagAttributeMapper {

    byte[] map(DocumentModel documentModel);
  }

  // choose one of these mappers or roll your own

  public static final ETagAttributeMapper CHANGE_TOKEN_MAPPER = (doc -> {
    String ct = doc.getChangeToken();
    return ct.getBytes(Charset.defaultCharset());
  });

  public static final ETagAttributeMapper DC_MODIFIED_MAPPER =
      (doc -> Optional.ofNullable(doc.getPropertyValue("dc:modified")).map(s -> {
        int hash = s.hashCode();
        byte[] result = new byte[4];
        result[0] = (byte) ((hash & 0xFF000000) >> 24);
        result[1] = (byte) ((hash & 0x00FF0000) >> 16);
        result[2] = (byte) ((hash & 0x0000FF00) >> 8);
        result[3] = (byte) (hash & 0x000000FF);
        return result;
      }).orElse(new byte[]{0x00}));

  public static String computeEtag(List<DocumentModel> docs, ETagAttributeMapper mapper) {

    MessageDigest md;

    try {
      md = MessageDigest.getInstance("SHA-256");
    } catch (NoSuchAlgorithmException e) {
      return null;
    }

    for (DocumentModel doc : docs) {
      md.update(mapper.map(doc));
    }

    return Base64.getEncoder().encodeToString(md.digest());
  }

  public static String computeEtag(List<DocumentModel> docs) {
    return computeEtag(docs, CHANGE_TOKEN_MAPPER);
  }
}
