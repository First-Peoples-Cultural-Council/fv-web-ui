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

import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_AUDIO;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_PICTURE;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_VIDEO;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import ca.firstvoices.nuxeo.utils.EnricherUtils;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

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

  private ObjectNode constructMediaJSON(DocumentModel doc) throws IOException {
    ObjectMapper mapper = new ObjectMapper();

    // JSON object to be returned
    ObjectNode jsonObj = mapper.createObjectNode();

    // First create the parent document's Json object content
    CoreSession session = doc.getCoreSession();

    String documentType = doc.getType();

    /*
     * Properties for media types
     */
    if (documentType.equalsIgnoreCase(FV_PICTURE) || documentType.equalsIgnoreCase(FV_AUDIO)
        || documentType.equalsIgnoreCase(FV_VIDEO)) {

      // Process "fvm:source" values
      String[] sourceIds = (!doc.isProxy()) ? (String[]) doc.getProperty("fvmedia", "source")
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

      // Process "fvm:recorder" values
      String[] recorderIds = (!doc.isProxy()) ? (String[]) doc.getProperty("fvmedia", "recorder")
          : (String[]) doc.getProperty("fvproxy", "proxied_recorder");
      if (recorderIds != null) {
        ArrayNode recorderArray = mapper.createArrayNode();
        for (String recorderId : recorderIds) {
          ObjectNode recorderObj = EnricherUtils
              .getDocumentIdAndTitleAndPathJsonObject(recorderId, session);
          if (recorderObj != null) {
            recorderArray.add(recorderObj);
          }
        }
        jsonObj.set("recorders", recorderArray);
      }

      // Process "fvm:origin" value
      String originId = (!doc.isProxy()) ? (String) doc.getProperty("fvmedia", "origin")
          : (String) doc.getProperty("fvproxy", "proxied_origin");
      if (originId != null) {
        // Retrieve additional properties from the referenced binaries, and add them to the JSON
        ObjectNode originObj = EnricherUtils
            .getDocumentIdAndTitleAndPathJsonObject(originId, session);
        if (originObj != null) {
          jsonObj.set("origin", originObj);
        }
      }
    }

    return jsonObj;
  }
}
