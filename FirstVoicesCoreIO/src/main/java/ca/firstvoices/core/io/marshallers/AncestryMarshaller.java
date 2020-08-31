package ca.firstvoices.core.io.marshallers;

import ca.firstvoices.data.models.SimpleCoreEntity;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import java.io.Serializable;
import java.util.Objects;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.io.marshallers.json.document.DocumentModelJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

/**
 * This class will convert ancestry information to human readable output appended to JSON responses
 * It is currently disabled in `ca.firstvoices.io.xml` and provided as an example only
 * Enrichment of `fvancestry` is active in FirstVoicesEnrichers -> AncestryEnricher.java
 *
 * <p>
 * IMPORTANT! Extending this should be handled with care since it will affect the output of
 * most document types. Pay careful attention to `null` values and checking for types.
 * </p>
 *
 * <p>
 * For additional details see: https://doc.nuxeo.com/nxdoc/parameterizing-reusing-marshallers/
 * </p>
 *
 * <p>
 * To user resolvers instead of marshallers, see: https://doc.nuxeo.com/nxdoc/document-json-extended-fields/
 * nuxeo-core-10.10 -> org/nuxeo/ecm/core/model/DocumentModelResolver.java
 * org/nuxeo/ecm/core/io/marshallers/json/document/DocumentPropertyJsonWriter.java
 * </p>
 */
@Setup(mode = Instantiations.SINGLETON, priority = Priorities.OVERRIDE_REFERENCE)
public class AncestryMarshaller extends DocumentModelJsonWriter {

  public static final String FV_ANCESTRY_SCHEMA = "fvancestry";
  public static final String FV_ANCESTRY_SCHEMA_LANGUAGE_FIELD = "fva:language";

  private static final Log log = LogFactory.getLog(AncestryMarshaller.class);

  @Override
  public void extend(DocumentModel document, JsonGenerator jg) throws IOException {
    super.extend(document, jg);

    if (document.hasSchema(FV_ANCESTRY_SCHEMA)) {

      // Get parent document in a privileged session
      CoreInstance
          .doPrivileged(document.getRepositoryName(),
              session -> {
                Serializable language = document
                    .getPropertyValue(FV_ANCESTRY_SCHEMA_LANGUAGE_FIELD);
                if (Objects.nonNull(language)) {
                  SimpleCoreEntity simpleTargetDoc = (SimpleCoreEntity) convertToSimpleCoreEntity(
                      session,
                      String.valueOf(language));
                  writeObject(jg, simpleTargetDoc);
                }
              });
    }
  }

  private void writeObject(JsonGenerator jg, SimpleCoreEntity simpleTargetDoc) {
    try {
      jg.writeObjectFieldStart(FV_ANCESTRY_SCHEMA);
      jg.writeObjectField(FV_ANCESTRY_SCHEMA_LANGUAGE_FIELD, simpleTargetDoc);
      jg.writeEndObject();
    } catch (IOException e) {
      log.error("Unable to marshall in " + FV_ANCESTRY_SCHEMA + " due to " + e.getMessage());
    }
  }

  private Serializable convertToSimpleCoreEntity(CoreSession session, String uid) {
    DocumentModel doc = session.getDocument(new IdRef(uid));

    if (Objects.nonNull(doc)) {
      return new SimpleCoreEntity(doc);
    }

    return uid;
  }
}
