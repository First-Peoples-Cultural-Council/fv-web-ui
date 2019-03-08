package ca.firstvoices.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;
import ca.firstvoices.nuxeo.utils.EnricherUtils;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class DialectEnricher extends AbstractJsonEnricher<DocumentModel> {

	public static final String NAME = "dialect";

	public DialectEnricher() {
		super(NAME);
	}

	// Method that will be called when the enricher is asked for
	@Override
	public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
		// We use the Jackson library to generate Json
		ObjectNode dialectJsonObject = constructDialectJSON(doc);
		jg.writeFieldName(NAME);
		jg.writeObject(dialectJsonObject);
	}

	private ObjectNode constructDialectJSON(DocumentModel doc) {
		ObjectMapper mapper = new ObjectMapper();

		// JSON object to be returned
		ObjectNode jsonObj = mapper.createObjectNode();

		// First create the parent document's Json object content
		CoreSession session = doc.getCoreSession();

		String documentType = doc.getType();

		/*
		 * Properties for FVDialect
		 */
		if (documentType.equalsIgnoreCase("FVDialect")) {

			// Process "fvdialect:keyboards" values
			String[] keyboardLinkIds = (!doc.isProxy()) ? (String[]) doc.getProperty("fvdialect", "keyboards") : (String[]) doc.getProperty("fvproxy", "proxied_keyboards");
			if (keyboardLinkIds != null) {
				ArrayNode keyboardJsonArray = mapper.createArrayNode();
				for (String keyboardId : keyboardLinkIds) {
					ObjectNode keyboardJsonObj = EnricherUtils.getLinkJsonObject(keyboardId, session);
					if(keyboardJsonObj != null) {
						keyboardJsonArray.add(keyboardJsonObj);
					}
				}
				jsonObj.put("keyboards", keyboardJsonArray);
			}

            // Process "fvdialect:language_resources" values
            String[] languageResourcesLinkIds = (!doc.isProxy()) ? (String[]) doc.getProperty("fvdialect", "language_resources") : (String[]) doc.getProperty("fvproxy", "proxied_language_resources");
            if (languageResourcesLinkIds != null) {
                ArrayNode languageResourcesJsonArray = mapper.createArrayNode();
                for (String languageResourceId : languageResourcesLinkIds) {
                    ObjectNode languageResourceJsonObj = EnricherUtils.getLinkJsonObject(languageResourceId, session);
                    if(languageResourceJsonObj != null) {
                        languageResourcesJsonArray.add(languageResourceJsonObj);
                    }
                }
                jsonObj.put("language_resources", languageResourcesJsonArray);
            }

			jsonObj.put("roles", EnricherUtils.getRolesAssociatedWithDialect(doc, session));
		}

		return jsonObj;
	}
}