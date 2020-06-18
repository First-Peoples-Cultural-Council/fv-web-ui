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

import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;
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
      String[] languageResourcesLinkIds =
          (!doc.isProxy()) ? (String[]) doc.getProperty("fvdialect", "language_resources")
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

      jsonObj.set("roles", EnricherUtils.getRolesAssociatedWithDialect(doc, session));
    }

    return jsonObj;
  }
}
