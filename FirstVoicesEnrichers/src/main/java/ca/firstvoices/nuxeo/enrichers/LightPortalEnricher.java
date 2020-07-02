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

import static ca.firstvoices.schemas.DialectTypesConstants.FV_PORTAL;
import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import ca.firstvoices.nuxeo.utils.EnricherUtils;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

/**
 * A lighter version of the portal enricher, sending back just the logo docs
 */

@Setup(mode = SINGLETON, priority = REFERENCE)
public class LightPortalEnricher extends AbstractJsonEnricher<DocumentModel> {

  public static final String NAME = "lightportal";

  private static final Log log = LogFactory.getLog(LightPortalEnricher.class);

  public LightPortalEnricher() {
    super(NAME);
  }

  // Method that will be called when the enricher is asked for
  @Override
  public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
    // We use the Jackson library to generate Json
    ObjectNode portalJsonObject = constructPortalJSON(doc);
    jg.writeFieldName(NAME);
    jg.writeObject(portalJsonObject);
  }

  private ObjectNode constructPortalJSON(DocumentModel doc) {
    ObjectMapper mapper = new ObjectMapper();

    // JSON object to be returned
    ObjectNode jsonObj = mapper.createObjectNode();

    // First create the parent document's Json object content
    CoreSession session = doc.getCoreSession();

    String documentType = doc.getType();

    /*
     * Properties for FVPortal
     */
    if (documentType.equalsIgnoreCase(FV_PORTAL)) {

      // Process "fv-portal:logo" value
      String logoImageId = (!doc.isProxy()) ? (String) doc.getProperty("fv-portal", "logo")
          : (String) doc.getProperty("fvproxy", "proxied_logo");
      if (logoImageId != null) {
        // Retrieve additional properties from the referenced binaries, and add them to the JSON
        ObjectNode binaryJsonObj = EnricherUtils
            .getBinaryPropertiesJsonObject(logoImageId, session);
        if (binaryJsonObj != null) {
          jsonObj.set("fv-portal:logo", binaryJsonObj);
        }
      }

    }
    jsonObj.set("roles", EnricherUtils
        .getRolesAssociatedWithDialect(session.getDocument(doc.getParentRef()), session));

    return jsonObj;
  }
}
