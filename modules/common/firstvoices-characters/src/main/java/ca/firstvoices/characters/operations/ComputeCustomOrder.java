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

package ca.firstvoices.characters.operations;

import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;
import static ca.firstvoices.data.schemas.DialectTypesConstants.FV_ALPHABET;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.characters.services.CharactersCoreService;
import ca.firstvoices.characters.services.CustomOrderComputeService;
import ca.firstvoices.characters.workers.ComputeCustomOrderWorker;
import ca.firstvoices.core.io.utils.DialectUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.maintenance.common.AbstractMaintenanceOperation;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import java.util.logging.Logger;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;

/*
 *
 */
@Operation(id = ComputeCustomOrder.ID, category = Constants.GROUP_NAME, label =
    Constants.COMPUTE_ORDER_ACTION_ID, description =
    "Computes custom order for dialect or asset, updating `fv:custom_order` field.")
public class ComputeCustomOrder extends AbstractMaintenanceOperation {

  public static final String ID = Constants.COMPUTE_ORDER_ACTION_ID;

  private static final Logger log = Logger.getLogger(ComputeCustomOrder.class.getCanonicalName());

  private final CustomOrderComputeService customOrderComputeService = Framework
      .getService(CustomOrderComputeService.class);

  private final CharactersCoreService cs = Framework
      .getService(CharactersCoreService.class);

  @Param(name = "phase", values = {"init", "work"})
  protected String phase = "init";

  @Param(name = "batchSize")
  protected int batchSize = 1000;

  @Context
  protected CoreSession session;

  @Context
  protected OperationContext ctx;

  @OperationMethod
  public void run(DocumentModel doc) throws OperationException {
    limitToSuperAdmin(session);
    executePhases(doc, phase);
  }

  @Override
  protected void executeInitPhase(DocumentModel doc) {
    if (DialectUtils.isDialect(doc)) {
      RequiredJobsUtils.addToRequiredJobs(doc, Constants.COMPUTE_ORDER_JOB_ID);
    }
  }

  /**
   * Will recompute custom order for all words/phrases in a dialect Or, for one asset if document is
   * not a dialect
   *
   * @param doc a dialect or asset type
   */
  @Override
  protected void executeWorkPhase(DocumentModel doc) {
    if (DialectUtils.isDialect(doc)) {
      // Operation for dialects: complete recompute
      DocumentModelList characters =
          cs.getCharacters(session, doc);
      DocumentModel alphabet =
          cs.getAlphabet(session, doc);

      customOrderComputeService.updateCustomOrderCharacters(
          session, alphabet, characters);

      session.save();

      if (customOrderComputeService.validateAlphabetOrder(session, alphabet)) {
        // Run worker to do computation for dialect
        WorkManager workManager = Framework.getService(WorkManager.class);
        ComputeCustomOrderWorker worker = new ComputeCustomOrderWorker(doc.getRef(),
            batchSize);
        workManager.schedule(worker);
      } else {
        log.severe("Alphabet out of order for dialect `" + doc.getTitle() + "`");
      }
    } else if (FV_ALPHABET.equals(doc.getType())) {
      // Operation for alphabet: set correct custom_order values on alphabet
      DocumentModelList characters =
          cs.getCharacters(session, doc);

      customOrderComputeService.updateCustomOrderCharacters(
          session, doc, characters);

      session.save();

      // Republish alphabet changes
      if (StateUtils.isPublished(doc)) {
        StateUtils.followTransitionIfAllowed(doc, REPUBLISH_TRANSITION);
      }

    } else {
      try {
        // Operation for assets: recompute single word, phrase, etc.
        computeForAsset(doc);
      } catch (OperationException e) {
        log.warning(e.getMessage());
      }
    }
  }

  /**
   * Computes the custom order for any asset that has the schema
   *
   * @param doc any type that has the `fvcore` schema
   * @throws OperationException if doc does not have the schema
   */
  private void computeForAsset(DocumentModel doc) throws OperationException {
    if (doc.hasSchema("fvcore")) {
      // Will compute, save and update proxy if needed
      customOrderComputeService.computeAssetNativeOrderTranslation(session, doc, true, true);
    } else {
      throw new OperationException(
          "Cannot calculate custom order on non `fvcore` type for " + doc.getType());
    }
  }
}
