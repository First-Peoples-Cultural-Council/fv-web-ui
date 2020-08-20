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

import java.util.ArrayList;
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

  //Template with excluded items as they were already set in the mock data operation
  protected List<TemplateItemDescriptor> mockTemplate;
  //List of original template items to used to reset list
  protected List<TemplateItemDescriptor> normalTemplate;

  private void resetTemplate() {
    this.template = new ArrayList<>(this.normalTemplate);
  }

  @Override
  public void createContentStructure(DocumentModel eventDoc) {
    //re-add removed items
    resetTemplate();
    // Only apply to one type
    if (FV_DIALECT.equals(eventDoc.getType())) {
      if (eventDoc.isProxy()) {
        return;
      }
      //if dialect is mock data, remove items
      if (eventDoc.getPathAsString().contains("/FV/Workspaces/Data/Test/Test/")) {
        this.mockTemplate = new ArrayList<>(template);
        mockTemplate.removeIf(t -> t.getTypeName().equals("FVAlphabet"));
        mockTemplate.removeIf(t -> t.getTypeName().equals("FVDictionary"));
        this.template = new ArrayList<>(mockTemplate);
      }

    }

    super.createContentStructure(eventDoc);
  }


  @Override
  public boolean initFactory(Map<String, String> options, List<ACEDescriptor> rootAcl,
      List<TemplateItemDescriptor> template) {
    //init reset list
    if (normalTemplate == null) {
      normalTemplate = new ArrayList<>(template);
    }
    this.template = template;
    this.acl = rootAcl;
    return true;
  }

}
