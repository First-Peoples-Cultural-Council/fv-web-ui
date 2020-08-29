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

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_WORD;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import ca.firstvoices.dialect.assets.services.RelationsService;
import ca.firstvoices.nuxeo.utils.EnricherUtils;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.DocumentSecurityException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;
import org.nuxeo.runtime.api.Framework;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class WordEnricher extends AbstractJsonEnricher<DocumentModel> {

  public static final String NAME = "word";
  public static final String DC_TITLE = "dc:title";
  private static final Log log = LogFactory.getLog(WordEnricher.class);

  public WordEnricher() {
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

  private ObjectNode constructWordJSON(DocumentModel doc) {
    ObjectMapper mapper = new ObjectMapper();

    // JSON object to be returned
    ObjectNode jsonObj = mapper.createObjectNode();

    // First create the parent document's Json object content
    CoreSession session = doc.getCoreSession();

    String documentType = doc.getType();

    log.debug("Constructing word enricher for doc:" + doc.getId());

    /*
     * Properties for FVWord
     */
    if (documentType.equalsIgnoreCase(FV_WORD)) {

      // Process "fv-word:categories" values

      String[] categoryIds = (!doc.isProxy()) ? (String[]) doc.getProperty("fv-word", "categories")
          : (String[]) doc.getProperty("fvproxy", "proxied_categories");
      if (categoryIds == null) {
        categoryIds = new String[0];
      }
      ArrayNode categoryArray = mapper.createArrayNode();
      for (String categoryId : categoryIds) {

        if (categoryId == null) {
          continue;
        }

        ObjectNode categoryObj = EnricherUtils
            .getDocumentIdAndTitleAndPathJsonObject(categoryId, session);
        if (categoryObj != null) {
          categoryArray.add(categoryObj);
        }
      }
      jsonObj.set("categories", categoryArray);

      // Process "fv-word:part_of_speech" value
      String partOfSpeechId = (String) doc.getProperty("fv-word", "part_of_speech");
      String partOfSpeechLabel = EnricherUtils.getPartOfSpeechLabel(partOfSpeechId);
      jsonObj.put("part_of_speech", partOfSpeechLabel);

      // Process "fvcore:source" values
      String[] sourceIds = (!doc.isProxy()) ? (String[]) doc.getProperty("fvcore", "source")
          : (String[]) doc.getProperty("fvproxy", "proxied_source");
      if (sourceIds != null) {
        ArrayNode sourceArray = mapper.createArrayNode();
        for (String sourceId : sourceIds) {
          ObjectNode sourceObj = EnricherUtils
              .getDocumentIdAndTitleAndPathJsonObject(sourceId, session);
          if (sourceObj != null) {
            sourceArray.add(sourceObj);
          }
        }
        jsonObj.set("sources", sourceArray);
      }

      // Process "fv-word:related_phrases" values
      String[] phraseIds =
          (!doc.isProxy()) ? (String[]) doc.getProperty("fv-word", "related_phrases")
              : (String[]) doc.getProperty("fvproxy", "proxied_phrases");
      if (phraseIds != null) {
        ArrayNode phraseArray = mapper.createArrayNode();
        for (String phraseId : phraseIds) {
          IdRef ref = new IdRef(phraseId);
          DocumentModel phraseDoc = null;
          // Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
          try {
            phraseDoc = session.getDocument(ref);
          } catch (DocumentNotFoundException | DocumentSecurityException de) {
            continue;
          }

          ObjectNode phraseObj = mapper.createObjectNode();
          phraseObj.put("uid", phraseId);
          phraseObj.put("path", phraseDoc.getPath().toString());

          // Construct JSON array node for fv:definitions
          ArrayList<Object> definitionsList = (ArrayList<Object>) phraseDoc
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
          phraseObj.set("fv:definitions", definitionsJsonArray);

          // Construct JSON array node for fv:literal_translation
          ArrayList<Object> literalTranslationList = (ArrayList<Object>) phraseDoc
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
          phraseObj.set("fv:literal_translation", literalTranslationJsonArray);

          phraseObj.put(DC_TITLE, phraseDoc.getTitle());
          phraseArray.add(phraseObj);
        }
        jsonObj.set("related_phrases", phraseArray);
      }

      // Process "fv:related_assets" values
      String[] relatedAssets =
          (!doc.isProxy()) ? (String[]) doc.getProperty("fvcore", "related_assets")
              : (String[]) doc.getProperty("fvproxy", "proxied_related_assets");
      if (relatedAssets != null) {
        ArrayNode assetArray = mapper.createArrayNode();
        for (String assetId : relatedAssets) {
          IdRef ref = new IdRef(assetId);
          DocumentModel assetDoc = null;
          // Try to retrieve Nuxeo document. If it isn't found, continue to next iteration.
          try {
            assetDoc = session.getDocument(ref);
          } catch (DocumentNotFoundException | DocumentSecurityException de) {
            continue;
          }

          ObjectNode assetObj = mapper.createObjectNode();
          assetObj.put("uid", assetId);
          assetObj.put("path", assetDoc.getPath().toString());
          assetObj.put(DC_TITLE, assetDoc.getTitle());
          assetObj.put("type", assetDoc.getType());
          assetArray.add(assetObj);
        }
        jsonObj.set("related_assets", assetArray);
      }

      RelationsService relationsService = Framework.getService(RelationsService.class);
      // When this is changed to include all related assets, change to the overloaded
      // getRelations that does not take a type (relationsService.getRelations(session, doc))
      DocumentModelList relatedTo = relationsService.getRelations(session, doc, FV_WORD);
      if (relatedTo != null && !relatedTo.isEmpty()) {
        ArrayNode assetArray = mapper.createArrayNode();
        for (DocumentModel assetDoc : relatedTo) {
          ObjectNode assetObj = mapper.createObjectNode();
          assetObj.put("uid", assetDoc.getId());
          assetObj.put("path", assetDoc.getPath().toString());
          assetObj.put(DC_TITLE, assetDoc.getTitle());
          assetObj.put("type", assetDoc.getType());
          assetArray.add(assetObj);
        }
        jsonObj.set("related_by", assetArray);
      }

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

      // Process "fv:related_pictures" values
      String[] pictureIds =
          (!doc.isProxy()) ? (String[]) doc.getProperty("fvcore", "related_pictures")
              : (String[]) doc.getProperty("fvproxy", "proxied_pictures");
      if (pictureIds != null) {
        ArrayNode pictureJsonArray = mapper.createArrayNode();
        for (String pictureId : pictureIds) {
          ObjectNode binaryJsonObj = EnricherUtils
              .getBinaryPropertiesJsonObject(pictureId, session);
          if (binaryJsonObj != null) {
            pictureJsonArray.add(binaryJsonObj);
          }
        }
        jsonObj.set("related_pictures", pictureJsonArray);
      }

      // Process "fv:related_video" values
      String[] videoIds = (!doc.isProxy()) ? (String[]) doc.getProperty("fvcore", "related_videos")
          : (String[]) doc.getProperty("fvproxy", "proxied_videos");
      if (videoIds != null) {
        ArrayNode videoJsonArray = mapper.createArrayNode();
        for (String videoId : videoIds) {
          ObjectNode binaryJsonObj = EnricherUtils.getBinaryPropertiesJsonObject(videoId, session);
          if (binaryJsonObj != null) {
            videoJsonArray.add(binaryJsonObj);
          }
        }
        jsonObj.set("related_videos", videoJsonArray);
      }
    }

    return jsonObj;
  }
}
