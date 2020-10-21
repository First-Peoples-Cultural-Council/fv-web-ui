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

package ca.firstvoices.operations;

import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.maintenance.common.AbstractMaintenanceOperation;
import ca.firstvoices.maintenance.common.RequiredJobsUtils;
import ca.firstvoices.publisher.Constants;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.workers.CreateProxiesWorker;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.work.api.WorkManager;
import org.nuxeo.runtime.api.Framework;
import org.picocontainer.annotations.Inject;

@Operation(id = PublishDialect.ID, category = Constants.GROUP_NAME, label =
    Constants.PUBLISH_DIALECT_ACTION_ID, description =
    "Operation to queue/work on publishing a dialect")
public class PublishDialect extends AbstractMaintenanceOperation {

  public static final String ID = Constants.PUBLISH_DIALECT_ACTION_ID;

  @Context
  protected CoreSession session;

  @Context
  protected WorkManager workManager;

  @Param(name = "phase", values = {"init", "work"})
  protected String phase = "init";

  @Param(name = "batchSize")
  protected int batchSize = 1000;

  @Inject
  FirstVoicesPublisherService fvPublisherService =
      Framework.getService(FirstVoicesPublisherService.class);

  @OperationMethod
  public void run(DocumentModel dialect) throws OperationException {
    limitToSuperAdmin(session);
    limitToDialect(dialect);
    executePhases(dialect, phase);
  }

  @Override
  protected void executeInitPhase(DocumentModel dialect) {
    // Add job to fully create proxies overnight
    RequiredJobsUtils.addToRequiredJobs(dialect, Constants.PUBLISH_DIALECT_JOB_ID);
  }

  @Override
  protected void executeWorkPhase(DocumentModel dialect) {
    // Transition dialect to publish if it is not already
    if (!StateUtils.isPublished(dialect)) {
      fvPublisherService.transitionDialectToPublished(session, dialect);
    }

    // Initiate worker to create proxies for everything relevant inside a dialect
    CreateProxiesWorker proxyWorker = new CreateProxiesWorker(dialect.getRef(), batchSize);
    workManager.schedule(proxyWorker, true);
  }
}
