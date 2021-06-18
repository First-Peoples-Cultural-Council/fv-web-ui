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

package ca.firstvoices.maintenance.listeners;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;

import ca.firstvoices.core.io.services.AssignAncestorsService;
import ca.firstvoices.core.io.utils.SessionUtils;
import ca.firstvoices.core.io.utils.StateUtils;
import ca.firstvoices.maintenance.Constants;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.util.ArrayList;
import java.util.logging.Logger;
import org.nuxeo.ecm.core.CoreService;
import org.nuxeo.ecm.core.api.AbstractSession;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.model.Document;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.transaction.TransactionHelper;

/**
 * Listener will be called by schedule (see fv-maintenace-contrib.xml)
 * Intended to handle global jobs not related to a specific dialect
 */
public class ExecuteGlobalJobsListener implements EventListener {

  public static final String SITE_JOIN_REQUEST_SCHEMA = "FVSiteJoinRequest";

  // Get logger
  private static final Logger log = Logger
      .getLogger(ExecuteGlobalJobsListener.class.getCanonicalName());

  @Override
  public void handleEvent(Event event) {
    CoreService coreService = Framework.getService(CoreService.class);
    if (coreService == null) {
      // CoreService failed to start, no need to go further
      return;
    }

    if (!event.getName().equals(Constants.EXECUTE_GLOBAL_JOBS_EVENT_ID)) {
      return;
    }

    processAssignAncestry();
    processRepublishDocuments();
    processMigrateUserRequests();
  }

  /**
   * Will convert older user registration documents to newer ones
   * Cut off date is March 2021, previous registration requests will remain untouched
   */
  private void processMigrateUserRequests() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              // Get all user registrations after March 2021
              // Only 'accepted' meaning the user account was created
              String query = "SELECT * FROM FVUserRegistration WHERE "
                  + "dc:created NOT BETWEEN DATE '2010-01-01' AND DATE '2021-03-01' "
                  + "AND ecm:currentLifeCycleState = 'accepted' "
                  + "AND docinfo:documentId IS NOT NULL";

              long pageSize = 500;

              DocumentModelList requests = session.query(query, null, pageSize, 0, true);

              // Nothing to process
              if (requests == null || requests.isEmpty()) {
                return;
              }

              // Log warning since we shouldn't get to this situation
              log.warning(
                  () -> "GLOBAL JOB: Found " + requests.totalSize()
                      + " user requests to convert.");

              for (DocumentModel oldUserRequest : requests) {
                try {
                  final DocumentModel joinRequest =
                      session.createDocumentModel(SITE_JOIN_REQUEST_SCHEMA);

                  String username = String.valueOf(
                      oldUserRequest.getPropertyValue("userinfo:email"));

                  if (username != null) {

                    if (!joinRequestExists(session, username)) {
                      // A new join request does not exist
                      joinRequest.setProperty(SITE_JOIN_REQUEST_SCHEMA, "user", username);

                      joinRequest.setProperty(SITE_JOIN_REQUEST_SCHEMA, "dialect",
                          oldUserRequest.getPropertyValue("docinfo:documentId"));

                      joinRequest.setProperty(SITE_JOIN_REQUEST_SCHEMA, "requestTime",
                          oldUserRequest.getPropertyValue("dc:created"));

                      joinRequest.setProperty(SITE_JOIN_REQUEST_SCHEMA, "status", "NEW");

                      final DocumentModel joinRequestDocument = session.createDocument(joinRequest);
                      session.saveDocument(joinRequestDocument);
                    }

                    // Modify original user registration
                    StateUtils.followTransitionIfAllowed(oldUserRequest, "process");
                    session.saveDocument(oldUserRequest);
                  }
                } catch (Exception e) {
                  log.severe(
                      () -> "Failed when trying to execute global jobs with message: " + e
                          .getMessage()
                          + " user registration migration with id " + oldUserRequest.getId());
                }
              }

              session.save();

              // commit the first page
              TransactionHelper.commitOrRollbackTransaction();
            });
  }

  private boolean joinRequestExists(CoreSession session, String username) {
    String query = "SELECT * FROM FVSiteJoinRequest "
        + "WHERE fvjoinrequest:user LIKE '" + username + "'";

    DocumentModelList existingRequests = session.query(query, null, 1, 0, true);

    return (existingRequests != null && !existingRequests.isEmpty());
  }

  /**
   * Will get all documents with missing ancestry information, and correct them
   * excluding documents in the republished state
   */
  private void processAssignAncestry() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              // Get all relevant types to populate ancestry information
              String query = "SELECT * FROM FVWord, FVPhrase, FVBook WHERE "
                  + " fva:dialect IS NULL AND "
                  + " ecm:currentLifeCycleState NOT LIKE 'Republish' AND "
                  + " ecm:isTrashed = 0 AND "
                  + " ecm:isProxy = 0 AND "
                  + " ecm:isVersion = 0";

              long pageSize = 1000;

              DocumentModelList documents = session.query(query, null, pageSize, 0, true);

              // Nothing to process
              if (documents == null || documents.isEmpty()) {
                return;
              }

              // Log warning since we shouldn't get to this situation
              log.warning(
                  () -> "GLOBAL JOB: Found " + documents.totalSize()
                      + " docs to fix ancestry.");

              populateAncestryAndPublish(session, documents);
              session.save();
            });
  }

  private void populateAncestryAndPublish(CoreSession session, DocumentModelList docs) {
    AssignAncestorsService assignAncestorsService =
        Framework.getService(AssignAncestorsService.class);

    ArrayList<String> eventsToDisable = new ArrayList<>();
    eventsToDisable.add("disableCharacterAssetListener");
    eventsToDisable.add("disableAncestryListener");

    for (DocumentModel docWithoutAncestors : docs) {
      try {
        DocumentModel doc = assignAncestorsService.assignAncestors(docWithoutAncestors);
        DocumentModel savedDoc =
            SessionUtils.saveDocumentWithoutEvents(session, doc, true, eventsToDisable);

        if (StateUtils.isPublished(savedDoc)) {
          StateUtils.followTransitionIfAllowed(savedDoc, REPUBLISH_TRANSITION);
        }
      } catch (Exception e) {
        log.severe(
            () -> "Failed when trying to execute global jobs with message: " + e
                .getMessage()
                + " republish failed on doc with id " + docWithoutAncestors.getId());
      }
    }
  }

  /**
   * Will get all documents stuck in republished
   * and ensure they are transitioned to published.
   */
  private void processRepublishDocuments() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {

              // Publish anything that is stuck in republish state
              String query = "SELECT * FROM Document WHERE "
                  + " ecm:currentLifeCycleState LIKE 'Republish' AND "
                  + " ecm:isTrashed = 0 AND "
                  + " ecm:isVersion = 0";

              long pageSize = 1000;

              DocumentModelList documents = session.query(query, null, pageSize, 0, true);

              // Nothing to process
              if (documents == null || documents.isEmpty()) {
                return;
              }

              // Log warning since we shouldn't get to this situation
              log.warning(
                  () -> "GLOBAL JOB: Found " + documents.totalSize()
                      + " docs to republish.");

              republishDocuments(session, documents);
              session.save();

              // commit the first page
              TransactionHelper.commitOrRollbackTransaction();

              // loop on other children
              long nbChildren = documents.totalSize();
              for (long offset = pageSize; offset < nbChildren; offset += pageSize) {
                long i = offset;
                // start a new transaction
                TransactionHelper.runInTransaction(() -> {
                  DocumentModelList docs =
                      session.query(query, null, pageSize, i, false);
                  republishDocuments(session, docs);
                  session.save();
                });
              }

              // start a new transaction for following
              TransactionHelper.startTransaction();
            });
  }

  private void republishDocuments(CoreSession session, DocumentModelList docs) {
    FirstVoicesPublisherService publisherService =
        Framework.getService(FirstVoicesPublisherService.class);

    for (DocumentModel docInRepublishState : docs) {
      try {
        if (docInRepublishState.isProxy()) {
          // For proxies set to PUBLIC directly
          Document lowLevelDoc = ((AbstractSession) session).getSession()
              .getDocumentByUUID(docInRepublishState.getId());
          lowLevelDoc.setCurrentLifeCycleState(PUBLISHED_STATE);
        } else {
          // For workspaces documents, republish
          publisherService.republish(docInRepublishState);
        }
      } catch (Exception e) {
        log.severe(
            () -> "Failed when trying to execute global jobs with message: " + e
                .getMessage()
                + " republish failed on doc with id " + docInRepublishState.getId());
      }
    }
  }
}
