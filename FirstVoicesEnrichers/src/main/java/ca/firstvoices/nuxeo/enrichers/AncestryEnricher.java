package ca.firstvoices.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class AncestryEnricher extends AbstractJsonEnricher<DocumentModel> {

    private static final Log log = LogFactory.getLog(AncestryEnricher.class);

    public static final String NAME = "ancestry";

    public AncestryEnricher() {
        super(NAME);
    }

    // Method that will be called when the enricher is asked for
    @Override
    public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
        // We use the Jackson library to generate Json
        ObjectNode wordJsonObject = constructAncestryJSON(doc);
        jg.writeFieldName(NAME);
        jg.writeObject(wordJsonObject);
    }

    protected ObjectNode constructAncestryJSON(DocumentModel doc) {

        ObjectMapper mapper = new ObjectMapper();

        return CoreInstance.doPrivileged(doc.getCoreSession(), session -> {
            // JSON object to be returned
            ObjectNode jsonObj = mapper.createObjectNode();
            /*
             * Process fvancestry values
             */

            // Process Language Family
            log.debug("Constructing ancestry for doc: " + doc.getId());

            DocumentModel resolvedDoc = doc;
            String languageFamilyId = (String) doc.getProperty("fvancestry", "family");

            if (StringUtils.isNotEmpty(languageFamilyId)) {
                resolvedDoc = resolveTargetDoc(languageFamilyId, doc.isProxy(), session);
                ObjectNode languageFamilyObj = mapper.createObjectNode();
                if (resolvedDoc != null) {
                    languageFamilyObj.put("uid", languageFamilyId);
                    languageFamilyObj.put("dc:title", resolvedDoc.getTitle());
                }
                jsonObj.set("family", languageFamilyObj);
            }

            // Process Language

            String languageId = (String) doc.getProperty("fvancestry", "language");

            if (StringUtils.isNotEmpty(languageId)) {
                resolvedDoc = resolveTargetDoc(languageId, doc.isProxy(), session);
                ObjectNode languageObj = mapper.createObjectNode();
                if (resolvedDoc != null) {
                    languageObj.put("uid", languageId);
                    languageObj.put("dc:title", resolvedDoc.getTitle());
                }
                jsonObj.set("language", languageObj);
            }

            // Process Dialect

            String dialectId = (String) doc.getProperty("fvancestry", "dialect");

            if (StringUtils.isNotEmpty(dialectId)) {
                resolvedDoc = resolveTargetDoc(dialectId, doc.isProxy(), session);
                ObjectNode dialectDoc = mapper.createObjectNode();
                if (resolvedDoc != null) {
                    dialectDoc.put("uid", dialectId);
                    dialectDoc.put("dc:title", resolvedDoc.getTitle());
                    dialectDoc.put("path", resolvedDoc.getPathAsString());
                    dialectDoc.put("fvdialect:country", (String) resolvedDoc.getPropertyValue("fvdialect:country"));
                    dialectDoc.put("fvdialect:region", (String) resolvedDoc.getPropertyValue("fvdialect:region"));

                }
                jsonObj.set("dialect", dialectDoc);

            }
            return jsonObj;
        });
    }

    protected DocumentModel resolveTargetDoc(String docIdRef, boolean isProxy, CoreSession session) {
        if (!session.hasPermission(new IdRef(docIdRef), SecurityConstants.READ)) {
            return null;
        }
        DocumentModel resolvedDoc = session.getDocument(new IdRef(docIdRef));
        if (isProxy) {
            DocumentModelList proxies = session.getProxies(new IdRef(docIdRef), null);

            if (proxies.size() > 0) {
                resolvedDoc = proxies.get(0);
            }
        }
        return resolvedDoc;
    }
}