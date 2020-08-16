package ca.firstvoices.marshallers;

import ca.firstvoices.models.SimpleCoreEntity;
import com.fasterxml.jackson.core.JsonGenerator;
import java.io.IOException;
import java.util.ArrayList;
import org.nuxeo.ecm.core.api.CloseableCoreSession;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.io.marshallers.json.document.DocumentModelJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;
import org.nuxeo.runtime.api.Framework;

/**
 * See https://doc.nuxeo.com/nxdoc/parameterizing-reusing-marshallers/
 */
@Setup(mode = Instantiations.SINGLETON, priority = Priorities.OVERRIDE_REFERENCE)
public class MarshallerExtendTest extends DocumentModelJsonWriter {

  public void extend(DocumentModel document, JsonGenerator jg) throws IOException {
    super.extend(document, jg);
    CoreSession session = document.getCoreSession();

    if (document.hasSchema("fvancestry")) {
      String parentLanguageID = document.getPropertyValue("fva:language").toString();
      DocumentRef ref = new IdRef(parentLanguageID);
      DocumentModel doc = session.getDocument(ref);
      jg.writeObjectField("parentLanguage", doc.getPropertyValue("dc:title"));
      jg.writeObjectField("parentLanguageFamily", doc.getPropertyValue("fva:family"));
    }

    if ("RoutingTask".equals(document.getType())) {
      ArrayList<String> targetDocs = (ArrayList<String>) document
          .getPropertyValue("nt:targetDocumentsIds");

      if (targetDocs != null && targetDocs.size() == 1) {
        // For example, if request is internal
        try (CloseableCoreSession session1 = CoreInstance.openCoreSession(
            Framework.getService(RepositoryManager.class).getDefaultRepositoryName())) {
          DocumentRef ref2 = new IdRef(targetDocs.get(0));
          DocumentModel doc1 = session1.getDocument(ref2);

          SimpleCoreEntity targetDoc = new SimpleCoreEntity();
          targetDoc.setTitle(doc1.getTitle());

          jg.writeObjectField("targetDoc", targetDoc);
        }
      }


      jg.writeStringField("type", "OKKKKK PHIL");

    }
  }
}
