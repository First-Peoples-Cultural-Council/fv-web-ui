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

import static ca.firstvoices.editors.configuration.FVLocalConf.FV_CONFIGURATION_FACET;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.adapter.DocumentAdapterFactory;

public class FVLocalConfFactory implements DocumentAdapterFactory {

  public FVLocalConfFactory() {
  }

  public Object getAdapter(DocumentModel doc, Class<?> itf) {
    return doc.hasFacet(FV_CONFIGURATION_FACET) ? new FVLocalConfAdaptor(doc) : null;
  }
}
