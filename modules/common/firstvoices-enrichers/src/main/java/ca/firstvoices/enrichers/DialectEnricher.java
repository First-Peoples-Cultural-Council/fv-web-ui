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

package ca.firstvoices.enrichers;

import static ca.firstvoices.data.schemas.DomainTypesConstants.FV_DIALECT;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import ca.firstvoices.enrichers.utils.EnricherUtils;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.DocumentSecurityException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

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
    if (documentType.equalsIgnoreCase(FV_DIALECT)) {

      // Process "fvdialect:keyboards" values
      String[] keyboardLinkIds =
          (!doc.isProxy()) ? (String[]) doc.getProperty("fvdialect", "keyboards")
              : (String[]) doc.getProperty("fvproxy", "proxied_keyboards");
      if (keyboardLinkIds != null) {
        ArrayNode keyboardJsonArray = mapper.createArrayNode();
        for (String keyboardId : keyboardLinkIds) {
          ObjectNode keyboardJsonObj = EnricherUtils.getLinkJsonObject(keyboardId, session);
          if (keyboardJsonObj != null) {
            keyboardJsonArray.add(keyboardJsonObj);
          }
        }
        jsonObj.set("keyboards", keyboardJsonArray);
      }

      // Process "fvdialect:language_resources" values
      String[] languageResourcesLinkIds = (!doc.isProxy())
          ? (String[]) doc.getProperty("fvdialect", "language_resources")
          : (String[]) doc.getProperty("fvproxy", "proxied_language_resources");
      if (languageResourcesLinkIds != null) {
        ArrayNode languageResourcesJsonArray = mapper.createArrayNode();
        for (String languageResourceId : languageResourcesLinkIds) {
          ObjectNode languageResourceJsonObj = EnricherUtils
              .getLinkJsonObject(languageResourceId, session);
          if (languageResourceJsonObj != null) {
            languageResourcesJsonArray.add(languageResourceJsonObj);
          }
        }
        jsonObj.set("language_resources", languageResourcesJsonArray);
      }

      // Process "fvdialect:featured_words" values
      String[] featuredWordsIds =
          (!doc.isProxy()) ? (String[]) doc.getProperty("fvdialect", "featured_words")
              : (String[]) doc.getProperty("fvproxy", "proxied_words");
      if (featuredWordsIds != null) {
        ArrayNode featuredWordJsonArray = mapper.createArrayNode();
        for (String featuredWordId : featuredWordsIds) {
          IdRef ref = new IdRef(featuredWordId);
          DocumentModel featuredWordDoc = null;
          // Try to retrieve Nuxeo document. If it isn't found, continue to next
          // iteration.

          try {
            featuredWordDoc = session.getDocument(ref);
          } catch (DocumentNotFoundException | DocumentSecurityException de) {
            continue;
          }

          ObjectNode featuredWordJsonObj = mapper.createObjectNode();
          featuredWordJsonObj.put("uid", featuredWordId);
          featuredWordJsonObj.put("dc:title", featuredWordDoc.getTitle());
          featuredWordJsonObj.put("path", featuredWordDoc.getPathAsString());

          // Process "fv:literal translation" values
          Object literalTranslationObj = featuredWordDoc
              .getProperty("fvcore", "literal_translation");
          List<Object> literalTranslationList = (ArrayList<Object>) literalTranslationObj;
          ArrayNode literalTranslationJsonArray = mapper.createArrayNode();
          for (Object literalTranslationListItem : literalTranslationList) {
            Map<String, Object> complexValue =
                (HashMap<String, Object>) literalTranslationListItem;
            String language = (String) complexValue.get("language");
            String translation = (String) complexValue.get("translation");

            // Create JSON node and add it to the array
            ObjectNode literalTranslationJsonObj = mapper.createObjectNode();
            literalTranslationJsonObj.put("language", language);
            literalTranslationJsonObj.put("translation", translation);
            literalTranslationJsonArray.add(literalTranslationJsonObj);
          }
          featuredWordJsonObj.set("fv:literal_translation", literalTranslationJsonArray);

          // Process "fv-word:definitions" values
          Object definitionsObj = featuredWordDoc.getProperty("fvcore", "definitions");
          List<Object> definitionsList = (ArrayList<Object>) definitionsObj;
          ArrayNode definitionsJsonArray = mapper.createArrayNode();
          for (Object definitionsListItem : definitionsList) {
            Map<String, Object> complexValue = (HashMap<String, Object>) definitionsListItem;
            String language = (String) complexValue.get("language");
            String translation = (String) complexValue.get("translation");

            // Create JSON node and add it to the array
            ObjectNode definitionsJsonObj = mapper.createObjectNode();
            definitionsJsonObj.put("language", language);
            definitionsJsonObj.put("translation", translation);
            definitionsJsonArray.add(definitionsJsonObj);
          }
          featuredWordJsonObj.set("fv:definitions", definitionsJsonArray);

          // Process "fv-word:part_of_speech" value
          String partOfSpeechId = (String) featuredWordDoc
              .getProperty("fv-word", "part_of_speech");
          String partOfSpeechLabel = EnricherUtils.getPartOfSpeechLabel(partOfSpeechId);
          featuredWordJsonObj.put("fv-word:part_of_speech", partOfSpeechLabel);

          // Process "fv:related_audio" values
          String[] relatedAudioIds = (!featuredWordDoc.isProxy())
              ? (String[]) featuredWordDoc.getProperty("fvcore", "related_audio")
              : (String[]) featuredWordDoc.getProperty("fvproxy", "proxied_audio");
          if (relatedAudioIds == null) {
            relatedAudioIds = new String[0];
          }
          ArrayNode relatedAudioJsonArray = mapper.createArrayNode();

          // Retrieve additional properties from the referenced binaries, and add them to
          // the JSON
          for (String relatedAudioId : relatedAudioIds) {
            ObjectNode binaryJsonObj = EnricherUtils
                .getBinaryPropertiesJsonObject(relatedAudioId, session);
            if (binaryJsonObj != null) {
              relatedAudioJsonArray.add(binaryJsonObj);
            }
          }

          featuredWordJsonObj.set("fv:related_audio", relatedAudioJsonArray);

          // Process "fv:related_pictures" values
          String[] relatedPicturesIds = (!featuredWordDoc.isProxy())
              ? (String[]) featuredWordDoc.getProperty("fvcore", "related_pictures")
              : (String[]) featuredWordDoc.getProperty("fvproxy", "proxied_pictures");
          if (relatedPicturesIds == null) {
            relatedPicturesIds = new String[0];
          }
          ArrayNode relatedPicturesJsonArray = mapper.createArrayNode();

          // Retrieve additional properties from the referenced binaries, and add them to
          // the JSON
          for (String relatedPictureId : relatedPicturesIds) {
            ObjectNode binaryJsonObj = EnricherUtils
                .getBinaryPropertiesJsonObject(relatedPictureId,
                    session);
            if (binaryJsonObj != null) {
              relatedPicturesJsonArray.add(binaryJsonObj);
            }
          }

          featuredWordJsonObj.set("fv:related_pictures", relatedPicturesJsonArray);

          featuredWordJsonArray.add(featuredWordJsonObj);
        }
        jsonObj.set("fvdialect:featured_words", featuredWordJsonArray);
      }

      // Process "fvdialect:featured_audio" value
      String featuredAudioId =
          (!doc.isProxy()) ? (String) doc.getProperty("fvdialect", "featured_audio")
              : (String) doc.getProperty("fvproxy", "proxied_featured_audio");
      if (featuredAudioId != null) {
        // Retrieve additional properties from the referenced binaries, and add them to
        // the JSON
        ObjectNode binaryJsonObj = EnricherUtils
            .getBinaryPropertiesJsonObject(featuredAudioId, session);
        if (binaryJsonObj != null) {
          jsonObj.set("fvdialect:featured_audio", binaryJsonObj);
        }
      }

      // Process "fvdialect:background_top_image" value
      String backgroundTopImageId = (!doc.isProxy())
          ? (String) doc.getProperty("fvdialect", "background_top_image")
          : (String) doc.getProperty("fvproxy", "proxied_background_image");
      if (backgroundTopImageId != null) {
        // Retrieve additional properties from the referenced binaries, and add them to
        // the JSON
        ObjectNode binaryJsonObj = EnricherUtils
            .getBinaryPropertiesJsonObject(backgroundTopImageId, session);
        if (binaryJsonObj != null) {
          jsonObj.set("fvdialect:background_top_image", binaryJsonObj);
        }
      }

      // Process "fvdialect:logo" value
      String logoImageId = (!doc.isProxy()) ? (String) doc.getProperty("fvdialect", "logo")
          : (String) doc.getProperty("fvproxy", "proxied_logo");
      if (logoImageId != null) {
        // Retrieve additional properties from the referenced binaries, and add them to
        // the JSON
        ObjectNode binaryJsonObj = EnricherUtils
            .getBinaryPropertiesJsonObject(logoImageId, session);
        if (binaryJsonObj != null) {
          jsonObj.set("fvdialect:logo", binaryJsonObj);
        }
      }

      // Process "fvdialect:related_links" values
      String[] relatedLinkIds =
          (!doc.isProxy()) ? (String[]) doc.getProperty("fvdialect", "related_links")
              : (String[]) doc.getProperty("fvproxy", "proxied_related_links");
      if (relatedLinkIds != null) {
        ArrayNode relatedLinkJsonArray = mapper.createArrayNode();
        for (String relatedId : relatedLinkIds) {
          ObjectNode relatedLinkJsonObj = EnricherUtils.getLinkJsonObject(relatedId, session);
          if (relatedLinkJsonObj != null) {
            relatedLinkJsonArray.add(relatedLinkJsonObj);
          }
        }
        jsonObj.set("fvdialect:related_links", relatedLinkJsonArray);
      }

      jsonObj.set("roles", EnricherUtils.getRolesAssociatedWithDialect(doc, session));
    }

    return jsonObj;
  }
}
