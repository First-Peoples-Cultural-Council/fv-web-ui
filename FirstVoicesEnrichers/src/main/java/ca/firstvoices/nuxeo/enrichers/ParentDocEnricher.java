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

import static org.nuxeo.ecm.core.io.registry.reflect.Instantiations.SINGLETON;
import static org.nuxeo.ecm.core.io.registry.reflect.Priorities.REFERENCE;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.io.marshallers.json.enrichers.AbstractJsonEnricher;
import org.nuxeo.ecm.core.io.registry.reflect.Setup;

// This example is from https://doc.nuxeo.com/display/NXDOC/Content+Enricher

// The class will be instanciated as a singleton
// Priority defines which marshaller will be used in case of conflict. Priority is an integer.
// The higher the number, the more priority you get: 10 > 1 for instance.
@Setup(mode = SINGLETON, priority = REFERENCE)
public class ParentDocEnricher extends
    AbstractJsonEnricher<DocumentModel> { // You could also enrich a user or anything
  // else

  // The enricher will be called using enrichers.document: name (name being parentDoc here)
  // If you were enriching a user,
  // you would call it using enrichers.user: name (enrichers.entity-type)
  public static final String NAME = "parentDoc";

  public ParentDocEnricher() {
    super(NAME);
  }

  // Method that will be called when the enricher is asked for
  @Override
  public void write(JsonGenerator jg, DocumentModel doc) throws IOException {
    // We use the Jackson library to generate Json
    ObjectNode parentDocJsonObject = addParentDocAsJson(doc);
    jg.writeFieldName(NAME);
    jg.writeObject(parentDocJsonObject);
  }

  private ObjectNode addParentDocAsJson(DocumentModel doc) {
    ObjectMapper o = new ObjectMapper();

    // First create the parent document's Json object content
    CoreSession session = doc.getCoreSession();
    DocumentModel parentDoc = session.getDocument(doc.getParentRef());

    ObjectNode parentObject = o.createObjectNode();
    parentObject.put("id", parentDoc.getRef().toString());
    parentObject.put("title", parentDoc.getTitle());
    parentObject.put("type", parentDoc.getType());

    return parentObject;
  }
}
