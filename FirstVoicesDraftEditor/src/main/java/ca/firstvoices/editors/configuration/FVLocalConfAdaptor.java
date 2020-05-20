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

package ca.firstvoices.editors.configuration;

import java.io.Serializable;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.PropertyException;
import org.nuxeo.ecm.core.api.localconfiguration.AbstractLocalConfiguration;

public class FVLocalConfAdaptor extends AbstractLocalConfiguration<FVLocalConf> implements
    FVLocalConf {

  private static final Log log = LogFactory.getLog(FVLocalConfAdaptor.class);
  protected DocumentModel detachedDocument;
  protected Map<String, String> parameters;

  public FVLocalConfAdaptor(DocumentModel doc) {
    this.loadFromDocument(doc);
  }

  protected void loadFromDocument(DocumentModel doc) {
    this.detachedDocument = doc;
    this.parameters = this.computeParametersFromDocument(doc);
  }

  protected Map<String, String> computeParametersFromDocument(DocumentModel doc) {
    HashMap parameters = new HashMap();

    try {
      List<Map<String, String>> parametersFromDocument = (List) doc
          .getPropertyValue(FV_CONFIGURATION_PARAMETERS_PROPERTY);
      if (parametersFromDocument != null) {
        Iterator iter = parametersFromDocument.iterator();

        while (iter.hasNext()) {
          Map<String, String> parameter = (Map) iter.next();
          parameters.put(parameter.get("key"), parameter.get("value"));
        }
      }
    } catch (PropertyException e) {
      log.warn("Unable to retrieve FVLocalConf parameters: " + e);
      log.debug(e, e);
    }

    return parameters;
  }

  public String get(String key) {
    return this.get(key, (String) null);
  }

  public String get(String key, String defaultValue) {
    String value = (String) this.parameters.get(key);
    return value != null ? value : defaultValue;
  }

  public String put(String key, String value) {
    return (String) this.parameters.put(key, value);
  }

  public void remove(String key) {
    if (this.parameters.containsKey(key)) {
      this.parameters.remove(key);
    }
  }

  public DocumentRef getDocumentRef() {
    return this.detachedDocument.getRef();
  }

  public boolean canMerge() {
    return false;
  }

  @Override
  public FVLocalConf merge(FVLocalConf other) {
    if (other == null) {
      return this;
    } else {
      FVLocalConfAdaptor adapter = (FVLocalConfAdaptor) other;
      this.detachedDocument = adapter.detachedDocument;
      Iterator iter = adapter.parameters.entrySet().iterator();

      while (iter.hasNext()) {
        Map.Entry<String, String> otherParameter = (Map.Entry) iter.next();

        if (!this.parameters.containsKey(otherParameter.getKey())) {
          this.parameters.put(otherParameter.getKey(), otherParameter.getValue());
        }
      }

      return this;
    }
  }

  public void save(CoreSession session) {
    List<Map<String, String>> parametersForDocument = this
        .computeParametersForDocument(this.parameters);
    this.detachedDocument.setPropertyValue(FV_CONFIGURATION_PARAMETERS_PROPERTY,
        (Serializable) parametersForDocument);
    DocumentModel doc = session.saveDocument(this.detachedDocument);
    session.save();
    this.loadFromDocument(doc);
  }

  protected List<Map<String, String>> computeParametersForDocument(Map<String, String> parameters) {
    List<Map<String, String>> parametersForDocument = new ArrayList();
    Iterator iter = parameters.entrySet().iterator();

    while (iter.hasNext()) {
      Map.Entry<String, String> entry = (Map.Entry) iter.next();
      Map<String, String> parameter = new HashMap();

      parameter.put("key", entry.getKey());
      parameter.put("value", entry.getValue());
      parametersForDocument.add(parameter);
    }

    return parametersForDocument;
  }


}
