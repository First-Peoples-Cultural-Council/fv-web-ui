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

import static ca.firstvoices.schemas.DialectTypesConstants.FV_LABEL;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import ca.firstvoices.nuxeo.utils.EnricherUtils;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

@Setup(mode = SINGLETON, priority = REFERENCE)
public class LabelEnricher extends AbstractJsonEnricher<DocumentModel> {

  public static final String NAME = "label";
  private static final Log log = LogFactory.getLog(LabelEnricher.class);

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

  private ObjectNode constructWordJSON(DocumentModel doc) throws IOException {
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
    if (documentType.equalsIgnoreCase(FV_LABEL)) {

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
