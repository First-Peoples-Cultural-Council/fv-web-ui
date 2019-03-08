package ca.firstvoices.nuxeo.enrichers;

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.DocumentSecurityException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

import ca.firstvoices.nuxeo.utils.EnricherUtils;


@Setup(mode = SINGLETON, priority = REFERENCE)
public class CharacterEnricher extends AbstractJsonEnricher<DocumentModel> {

	public static final String NAME = "character";

	public CharacterEnricher() {
		super(NAME);
	}

	// Method that will be called when the enricher is asked for
	@Override
	public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
		// We use the Jackson library to generate Json
		ObjectNode characterJsonObject = constructCharacterJSON(doc);
		jg.writeFieldName(NAME);
		jg.writeObject(characterJsonObject);
	}

	private ObjectNode constructCharacterJSON(DocumentModel doc) {
		ObjectMapper mapper = new ObjectMapper();

		// JSON object to be returned
		ObjectNode jsonObj = mapper.createObjectNode();

		// First create the parent document's Json object content
		CoreSession session = doc.getCoreSession();

		String documentType = doc.getType();

		/*
		 * Properties for FVCharacter
		 */
		if (documentType.equalsIgnoreCase("FVCharacter")) {

			// Process "fv:related_audio" values
            String[] audioIds = (!doc.isProxy()) ? (String []) doc.getProperty("fvcore", "related_audio") : (String []) doc.getProperty("fvproxy", "proxied_audio");

			if (audioIds != null) {
				ArrayNode audioJsonArray = mapper.createArrayNode();
				for (String audioId : audioIds) {
					ObjectNode binaryJsonObj = EnricherUtils.getBinaryPropertiesJsonObject(audioId, session);
					if(binaryJsonObj != null) {
						audioJsonArray.add(binaryJsonObj);
					}
				}
				jsonObj.put("related_audio", audioJsonArray);
			}

            // Process "fvcharacter:related_words" values
            String[] wordIds = (!doc.isProxy()) ? (String []) doc.getProperty("fvcharacter", "related_words") : (String []) doc.getProperty("fvproxy", "proxied_words");
            if (wordIds != null) {
                ArrayNode wordArray = mapper.createArrayNode();
                for (String wordId : wordIds) {
                    IdRef ref = new IdRef(wordId);
                    DocumentModel wordDoc = null;
                    // Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
                    try {
                        wordDoc = session.getDocument(ref);
                    } catch (DocumentNotFoundException | DocumentSecurityException de) {
                        continue;
                    }

                    ObjectNode wordObj = mapper.createObjectNode();
                    wordObj.put("uid", wordId);
                    wordObj.put("path", wordDoc.getPath().toString());

                    // Construct JSON array node for fv:definitions
                    ArrayList<Object> definitionsList = (ArrayList<Object>)wordDoc.getProperty("fvcore", "definitions");
                    ArrayNode definitionsJsonArray = mapper.createArrayNode();
                    for(Object definition : definitionsList) {
                        Map<String, Object> complexValue = (HashMap<String, Object>) definition;
                        String language = (String) complexValue.get("language");
                        String translation = (String) complexValue.get("translation");

                        // Create JSON node and add it to the array
                        ObjectNode jsonNode = mapper.createObjectNode();
                        jsonNode.put("language", language);
                        jsonNode.put("translation", translation);
                        definitionsJsonArray.add(jsonNode);
                    }
                    wordObj.put("fv:definitions", definitionsJsonArray);

                    // Construct JSON array node for fv:literal_translation
                    ArrayList<Object> literalTranslationList = (ArrayList<Object>)wordDoc.getProperty("fvcore", "literal_translation");
                    ArrayNode literalTranslationJsonArray = mapper.createArrayNode();
                    for(Object literalTranslation : literalTranslationList) {
                        Map<String, Object> complexValue = (HashMap<String, Object>) literalTranslation;
                        String language = (String) complexValue.get("language");
                        String translation = (String) complexValue.get("translation");

                        // Create JSON node and add it to the array
                        ObjectNode jsonNode = mapper.createObjectNode();
                        jsonNode.put("language", language);
                        jsonNode.put("translation", translation);
                        literalTranslationJsonArray.add(jsonNode);
                    }
                    wordObj.put("fv:literal_translation", literalTranslationJsonArray);

                    wordObj.put("dc:title", wordDoc.getTitle());
                    wordArray.add(wordObj);
                }
                jsonObj.put("related_words", wordArray);
            }

		}

		return jsonObj;
	}
}