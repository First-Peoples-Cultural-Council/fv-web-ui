package ca.firstvoices.marshallers;

import com.fasterxml.jackson.core.JsonGenerator;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.io.marshallers.json.document.DocumentModelJsonWriter;
import org.nuxeo.ecm.core.io.registry.reflect.Instantiations;
import org.nuxeo.ecm.core.io.registry.reflect.Priorities;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

import java.io.IOException;

/*
    This marshaller will add the field "additional" with the value "information" to any endpoints which return a DocumentModel
 */
@Setup(mode = Instantiations.SINGLETON, priority = Priorities.OVERRIDE_REFERENCE)
public class MarshallerExtendTest extends DocumentModelJsonWriter {
    public void extend(DocumentModel document, JsonGenerator jg) throws IOException {
        super.extend(document, jg);
        CoreSession session = document.getCoreSession();
        int major_ver = Integer.parseInt(document.getPropertyValue("uid:major_version").toString());
        String parentLanguageID = document.getPropertyValue("fva:language").toString();
        DocumentRef ref = new IdRef(parentLanguageID);
        DocumentModel doc = session.getDocument(ref);
        jg.writeObjectField("parentLanguage", doc.getPropertyValue("dc:title"));
        jg.writeObjectField("parentLanguageFamily", doc.getPropertyValue("fva:family"));
//        jg.writeObjectField("parentLanguageFamily", );
    }
}
