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

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

/**
 * A lighter version of the ancestry enricher, sending back just the dialect
 *
 * @since TODO
 */
@Setup(mode = SINGLETON, priority = REFERENCE)
public class LightAncestryEnricher extends AbstractJsonEnricher<DocumentModel> {

  public static final String NAME = "lightancestry";

  public LightAncestryEnricher() {
    super(NAME);
  }

  // Method that will be called when the enricher is asked for
  @Override
  public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
    // We use the Jackson library to generate Json
    ObjectNode wordJsonObject = constructAncestryJSON(doc);
    jg.writeFieldName(NAME);
    jg.writeObject(wordJsonObject);
  }

  protected ObjectNode constructAncestryJSON(DocumentModel doc) {

    ObjectMapper mapper = new ObjectMapper();

    return CoreInstance.doPrivileged(doc.getCoreSession(), session -> {
      // JSON object to be returned
      ObjectNode jsonObj = mapper.createObjectNode();

      DocumentModel resolvedDoc = doc;
      String dialectId = (String) doc.getProperty("fvancestry", "dialect");

      if (StringUtils.isNotEmpty(dialectId)) {
        resolvedDoc = resolveTargetDoc(dialectId, doc.isProxy(), session);
        ObjectNode dialectDoc = mapper.createObjectNode();

        dialectDoc.put("uid", dialectId);
        dialectDoc.put("dc:title", resolvedDoc.getTitle());
        dialectDoc.put("path", resolvedDoc.getPathAsString());

        dialectDoc.put("fvdialect:country",
            (String) resolvedDoc.getPropertyValue("fvdialect:country"));
        dialectDoc.put("fvdialect:region",
            (String) resolvedDoc.getPropertyValue("fvdialect:region"));
        dialectDoc.put("fvdialect:parent_language",
            (String) resolvedDoc.getPropertyValue("fvdialect:parent_language"));

        jsonObj.set("dialect", dialectDoc);

      }
      return jsonObj;
    });
  }

  protected DocumentModel resolveTargetDoc(String docIdRef, boolean isProxy, CoreSession session) {
    DocumentModel resolvedDoc = session.getDocument(new IdRef(docIdRef));
    if (isProxy) {
      DocumentModelList proxies = session.getProxies(new IdRef(docIdRef), null);

      if (!proxies.isEmpty()) {
        resolvedDoc = proxies.get(0);
      }
    }
    return resolvedDoc;
  }
}
