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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.localconfiguration.LocalConfigurationService;
import org.nuxeo.runtime.api.Framework;

@Operation(id = "LocalConfiguration.RemoveFVConfParam", category = "Local Configuration", label =
    "Remove FV Configuration Parameter", description =
    "Remove a FVLocalConf configuration "
        + "paramter from a specific document. The user removing a parameter must have WRITE "
        + "access " + "on the document")
public class RemoveFVConfParam {

  private static final Log log = LogFactory.getLog(RemoveFVConfParam.class);
  protected AutomationService automation = Framework.getService(AutomationService.class);
  @Context
  protected CoreSession session;
  @Context
  protected LocalConfigurationService localConfigurationService;
  @Context
  protected OperationContext ctx;

  @Param(name = "key")

  protected String key;

  @Param(name = "save", required = false, values = {"true"})

  protected boolean save = true;

  public RemoveFVConfParam() {
  }

  @OperationMethod
  public DocumentModel run(DocumentModel doc) {
    // there is nothing to remove if facet does not exist
    if (!doc.hasFacet(FV_CONFIGURATION_FACET)) {
      return doc;
    }

    try {
      FVLocalConf locConf = (FVLocalConf) this.localConfigurationService
          .getConfiguration(FVLocalConf.class, FV_CONFIGURATION_FACET, doc);

      locConf.remove(this.key);

      locConf.save(this.session);
      if (this.save) {
        doc = this.session.saveDocument(doc);
      }
      //}
    } catch (Exception e) {
      // NOTE
      // if you find yourself here and schema changed in FVLocalConf & fvconfiguration.xsd
      // check if changes are made in FVDocumentValidationEventListener
      // where validation is blocked for draft & live documents after draft editing is initiated
      log.warn("Exception in RemoveFVConfParam " + e);
      log.debug(e, e);
    }

    return doc;
  }

}
