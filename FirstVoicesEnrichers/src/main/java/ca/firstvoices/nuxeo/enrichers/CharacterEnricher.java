/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package ca.firstvoices.nuxeo.enrichers;

import static ca.firstvoices.schemas.DialectTypesConstants.FV_CHARACTER;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import ca.firstvoices.nuxeo.utils.EnricherUtils;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.DocumentSecurityException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.security.SecurityConstants;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

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
    if (documentType.equalsIgnoreCase(FV_CHARACTER)) {

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

      // Process "fvcharacter:related_words" values
      String[] wordIds =
          (!doc.isProxy()) ? (String[]) doc.getProperty("fvcharacter", "related_words")
              : (String[]) doc.getProperty("fvproxy", "proxied_words");
      if (wordIds != null) {
        ArrayNode wordArray = mapper.createArrayNode();
        for (String wordId : wordIds) {
          if (!session.hasPermission(new IdRef(wordId), SecurityConstants.READ)) {
            continue;
          }
          DocumentModel wordDoc = null;
          // Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
          try {
            wordDoc = session.getDocument(new IdRef(wordId));
          } catch (DocumentNotFoundException | DocumentSecurityException de) {
            continue;
          }

          ObjectNode wordObj = mapper.createObjectNode();
          wordObj.put("uid", wordId);
          wordObj.put("path", wordDoc.getPath().toString());

          // Construct JSON array node for fv:definitions
          ArrayList<Object> definitionsList = (ArrayList<Object>) wordDoc
              .getProperty("fvcore", "definitions");
          ArrayNode definitionsJsonArray = mapper.createArrayNode();
          for (Object definition : definitionsList) {
            Map<String, Object> complexValue = (HashMap<String, Object>) definition;
            String language = (String) complexValue.get("language");
            String translation = (String) complexValue.get("translation");

            // Create JSON node and add it to the array
            ObjectNode jsonNode = mapper.createObjectNode();
            jsonNode.put("language", language);
            jsonNode.put("translation", translation);
            definitionsJsonArray.add(jsonNode);
          }
          wordObj.set("fv:definitions", definitionsJsonArray);

          // Construct JSON array node for fv:literal_translation
          ArrayList<Object> literalTranslationList = (ArrayList<Object>) wordDoc
              .getProperty("fvcore", "literal_translation");
          ArrayNode literalTranslationJsonArray = mapper.createArrayNode();
          for (Object literalTranslation : literalTranslationList) {
            Map<String, Object> complexValue = (HashMap<String, Object>) literalTranslation;
            String language = (String) complexValue.get("language");
            String translation = (String) complexValue.get("translation");

            // Create JSON node and add it to the array
            ObjectNode jsonNode = mapper.createObjectNode();
            jsonNode.put("language", language);
            jsonNode.put("translation", translation);
            literalTranslationJsonArray.add(jsonNode);
          }
          wordObj.set("fv:literal_translation", literalTranslationJsonArray);

          wordObj.put("dc:title", wordDoc.getTitle());
          wordArray.add(wordObj);
        }
        jsonObj.set("related_words", wordArray);
      }

    }

    return jsonObj;
  }
}
