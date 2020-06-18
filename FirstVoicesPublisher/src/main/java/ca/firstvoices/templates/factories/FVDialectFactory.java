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

package ca.firstvoices.templates.factories;

import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.content.template.factories.SimpleTemplateBasedFactory;

/**
 * Script ignores creation of structured templates within sections
 *
 * @author dyona
 */
public class FVDialectFactory extends SimpleTemplateBasedFactory {

  @Override
  public void createContentStructure(DocumentModel eventDoc) {

    // Only apply to one type
    if (FV_DIALECT.equals(eventDoc.getType())) {
      if (eventDoc.isProxy()) {
        return;
      }
    }

    super.createContentStructure(eventDoc);
  }

}
