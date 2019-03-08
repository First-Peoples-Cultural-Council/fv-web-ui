package ca.firstvoices.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

import ca.firstvoices.nuxeo.utils.EnricherUtils;


@Setup(mode = SINGLETON, priority = REFERENCE)
public class MediaEnricher extends AbstractJsonEnricher<DocumentModel> {

	public static final String NAME = "media";

	public MediaEnricher() {
		super(NAME);
	}

	// Method that will be called when the enricher is asked for
	@Override
	public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
		// We use the Jackson library to generate Json
		ObjectNode mediaJsonObject = constructMediaJSON(doc);
		jg.writeFieldName(NAME);
		jg.writeObject(mediaJsonObject);
	}

	private ObjectNode constructMediaJSON(DocumentModel doc) throws JsonGenerationException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();

		// JSON object to be returned
		ObjectNode jsonObj = mapper.createObjectNode();

		// First create the parent document's Json object content
		CoreSession session = doc.getCoreSession();

		String documentType = doc.getType();

		/*
		 * Properties for media types
		 */
		if (documentType.equalsIgnoreCase("FVPicture") || documentType.equalsIgnoreCase("FVAudio") || documentType.equalsIgnoreCase("FVVideo")) {

			// Process "fvm:source" values
			String[] sourceIds = (!doc.isProxy()) ? (String []) doc.getProperty("fvmedia", "source") : (String []) doc.getProperty("fvproxy", "proxied_source");
			if (sourceIds != null) {
				ArrayNode sourceArray = mapper.createArrayNode();
				for (String sourceId : sourceIds) {
					ObjectNode sourceObj = EnricherUtils.getDocumentIdAndTitleAndPathJsonObject(sourceId, session);
					if(sourceObj != null) {
						sourceArray.add(sourceObj);
					}
				}
				jsonObj.put("sources", sourceArray);
			}

            // Process "fvm:recorder" values
            String[] recorderIds = (!doc.isProxy()) ? (String []) doc.getProperty("fvmedia", "recorder") : (String []) doc.getProperty("fvproxy", "proxied_recorder");
            if (recorderIds != null) {
                ArrayNode recorderArray = mapper.createArrayNode();
                for (String recorderId : recorderIds) {
                    ObjectNode recorderObj = EnricherUtils.getDocumentIdAndTitleAndPathJsonObject(recorderId, session);
                    if(recorderObj != null) {
                        recorderArray.add(recorderObj);
                    }
                }
                jsonObj.put("recorders", recorderArray);
            }

            // Process "fvm:origin" value
            String originId = (!doc.isProxy()) ? (String) doc.getProperty("fvmedia", "origin") : (String) doc.getProperty("fvproxy", "proxied_origin");
            if (originId != null) {
                // Retrieve additional properties from the referenced binaries, and add them to the JSON
                ObjectNode originObj = EnricherUtils.getDocumentIdAndTitleAndPathJsonObject(originId, session);
                if(originObj != null) {
                    jsonObj.put("origin", originObj);
                }
            }
		}

		return jsonObj;
	}
}
