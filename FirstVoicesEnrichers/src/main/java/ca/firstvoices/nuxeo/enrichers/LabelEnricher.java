package ca.firstvoices.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.DocumentSecurityException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import ca.firstvoices.nuxeo.utils.EnricherUtils;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class LabelEnricher extends AbstractJsonEnricher<DocumentModel> {

    private static final Log log = LogFactory.getLog(LabelEnricher.class);

    public static final String NAME = "label";

    public LabelEnricher() {
        super(NAME);
    }

    // Method that will be called when the enricher is asked for
    @Override
    public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
        // We use the Jackson library to generate Json
        ObjectNode wordJsonObject = constructWordJSON(doc);
        jg.writeFieldName(NAME);
        jg.writeObject(wordJsonObject);
    }

    private ObjectNode constructWordJSON(DocumentModel doc)
            throws JsonGenerationException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();

        // JSON object to be returned
        ObjectNode jsonObj = mapper.createObjectNode();

        // First create the parent document's Json object content
        CoreSession session = doc.getCoreSession();

        String documentType = doc.getType();

        log.debug("Constructing label enricher for doc:" + doc.getId());

        /*
         * Properties for FVLabel
         */
        if (documentType.equalsIgnoreCase("FVLabel")) {

            // Process "fv:related_audio" values
            String[] audioIds = (!doc.isProxy()) ? (String[]) doc.getProperty("fvcore", "related_audio")
                    : (String[]) doc.getProperty("fvproxy", "proxied_audio");
            if (audioIds != null) {
                ArrayNode audioJsonArray = mapper.createArrayNode();
                for (String audioId : audioIds) {
                    ObjectNode binaryJsonObj = EnricherUtils.getBinaryPropertiesJsonObject(audioId, session);
                    if (binaryJsonObj != null) {
                        audioJsonArray.add(binaryJsonObj);
                    }
                }
                jsonObj.set("related_audio", audioJsonArray);
            }
        }

        return jsonObj;
    }
}
