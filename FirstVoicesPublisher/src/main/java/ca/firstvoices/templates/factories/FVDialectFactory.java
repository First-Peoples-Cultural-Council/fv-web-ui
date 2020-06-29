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

import java.util.List;
import java.util.Map;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.content.template.factories.SimpleTemplateBasedFactory;
import org.nuxeo.ecm.platform.content.template.service.ACEDescriptor;
import org.nuxeo.ecm.platform.content.template.service.TemplateItemDescriptor;

/**
 * Script ignores creation of structured templates within sections
 *
 * @author dyona
 */
public class FVDialectFactory extends SimpleTemplateBasedFactory {

  //Set true if the Dialect creates is in the Test/Test folder
  //Indicating that it is mock data


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

  @Override
  public boolean initFactory(Map<String, String> options, List<ACEDescriptor> rootAcl,
      List<TemplateItemDescriptor> template) {

    //If the dialect created is mock data, need to prevent alphabet from being created
    //Need condition for mock data WIP
    //Can't use get path, null

    template.removeIf(t -> t.getTypeName().equals("FVAlphabet"));

    this.template = template;
    this.acl = rootAcl;
    return true;
  }

}
