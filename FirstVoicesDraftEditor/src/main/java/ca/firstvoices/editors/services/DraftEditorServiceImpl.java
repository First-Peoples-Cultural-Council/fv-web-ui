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

package ca.firstvoices.editors.services;

import static ca.firstvoices.editors.configuration.FVLocalConf.*;

import ca.firstvoices.editors.synchronizers.AbstractSynchronizer;
import ca.firstvoices.editors.synchronizers.SynchronizerFactory;
import ca.firstvoices.editors.utils.EditingUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.runtime.api.Framework;


/**
 *
 */
public class DraftEditorServiceImpl implements DraftEditorService {

  private static final Log log = LogFactory.getLog(DraftEditorServiceImpl.class);

  protected AutomationService autoService = Framework.getService(AutomationService.class);

  /**
   * Utility method to end draft session . UUID link from a live document is removed. Draft document
   * is deleted.
   *
   * @param liveDoc       - draft edit source
   * @param draftRef      - reference to draft used in edit session
   * @param checkinOption - one of the 3 options (MAAJOR, MINOR, NONE)
   * @param checkinMsg    - msg which will desribe check-in action
   */
  private void endDraftEditSession(DocumentModel liveDoc, DocumentRef draftRef,
      VersioningOption checkinOption, String checkinMsg) {
    CoreSession session = liveDoc.getCoreSession();

    if (liveDoc.isLocked()) {
      liveDoc.removeLock();
    }

    removeUUIDInfo(liveDoc, DRAFT_UUID_REF);

    if (!liveDoc.isCheckedOut()) {
      liveDoc.checkOut();
    }
    liveDoc.checkIn(checkinOption, checkinMsg);

    if (draftRef != null) {
      session.removeDocument(draftRef);
      session.save(); // TODO not sure we need this ... need more testing
    }
  }

  /**
   * Get VALUE from key-value pair saved in FVLocalConf attached to a document.
   * <p>
   * Name of this method sugegst very specifc use which applies to context we are using it in. In
   * fact this is a generic method for retrieval of value for any key from FVlocalConf.
   *
   * @param doc - with attached key-value pair
   * @param key - key we need a value for
   * @return - retrieved value or null if property does nto exist.
   */
  public String getUUID(DocumentModel doc, String key) {
    List<Map<String, String>> definitions;

    try {
      definitions = (List<Map<String, String>>) doc
          .getPropertyValue(FV_CONFIGURATION_PARAMETERS_PROPERTY);
    } catch (Exception e) {
      definitions = null;

      log.warn("Property does not exist in getUUID " + e);
      log.warn(e);
    }

    if (definitions == null) {
      return null;
    }
    if (definitions.isEmpty()) {
      return null;
    }

    // loop through values - since we may use this to attach other parameters
    for (Map<String, String> param : definitions) {
      if (key.equals(param.get(FV_CONFIGURATION_PARAMETER_KEY))) {
        String value = param.get(FV_CONFIGURATION_PARAMETER_VALUE);

        return value;
      }
    }

    return null;
  }

  /**
   * RemoveProperty service removes ALL information stored in FV_CONFIGURATION_PARAMETERS_PROPERTY
   * this is not acceptable if FVlocalConf is used to store any other information Left here as an
   * example.
   *
   * @param doc - where FVLOcalCOnf will be completely cleared
   */
  private void clearFVLocalConf(DocumentModel doc) {
    OperationContext ctx = new OperationContext(doc.getCoreSession());

    ctx.setInput(doc);

    Map<String, Object> params = new HashMap<String, Object>();
    params.put("xpath", FV_CONFIGURATION_PARAMETERS_PROPERTY);

    try {
      autoService.run(ctx, "Document.RemoveProperty", params);
    } catch (OperationException e) {
      log.warn("Exception in clearFVLocalConf " + e);
    }
  }


  /**
   * Remove key-value pair for the provided key.
   * <p>
   * Name of this method suggests very specifc use which applies to context we are using it in. In
   * fact this is a generic method for removal of any key from FVlocalConf.
   *
   * @param liveDoc      - live document to remove uuid inframtion for draft edit session
   * @param referenceKey - key to remove
   */
  public void removeUUIDInfo(DocumentModel liveDoc, String referenceKey) {
    OperationContext ctx = new OperationContext(liveDoc.getCoreSession());

    ctx.setInput(liveDoc);

    Map<String, Object> params = new HashMap<String, Object>();
    params.put(FV_CONFIGURATION_PARAMETER_KEY, referenceKey);

    try {
      autoService.run(ctx, "LocalConfiguration.RemoveFVConfParam", params);
    } catch (OperationException e) {
      log.warn("Exception in removeUUIDInfo " + e);
    }
  }

  /**
   * Place key-value pair in FVLocalConf space. NOTE: if the key is already present it will be
   * replaced with a new value. NOTE: facet FvLocalConf will be attached to passed to this document
   * if not present.
   * <p>
   * Name of this method sugegst very specifc use which is based applies to context we are using it
   * in. In fact this is a generic method for placemnt of any key-value pair in FVlocalConf.
   *
   * @param session - session associated with a document to which key-value pair will ba attached
   * @param doc     - location for key-value pair
   * @param key     - key to store the value under
   * @param value   - value for the key
   */
  public void putUUIDInfo(CoreSession session, DocumentModel doc, String key, String value) {
    // Input setting
    OperationContext ctx = new OperationContext(session);

    ctx.setInput(doc);

    Map<String, Object> params = new HashMap<>();
    params.put(FV_CONFIGURATION_PARAMETER_KEY, key);
    params.put(FV_CONFIGURATION_PARAMETER_VALUE, value);

    try {
      autoService.run(ctx, "LocalConfiguration.PutFVConfParam", params);
    } catch (OperationException e) {
      log.warn("Exception in putUUIDInfo " + e);
      log.debug(e, e);

    }
  }

  /**
   * Note: this method WILL create a draft document if one was not found
   *
   * @param doc source for creating of a draft document
   * @return draft document ref or null if document could not be created
   */
  private DocumentRef getDraftDocumentRef(DocumentModel doc) {
    // find draft folder where to create draft document for editing
    DocumentRef draftFolderRef = EditingUtils.getDraftFolderRef(doc);
    DocumentRef draftDocRef = getDraftDocumentRefIfExists(doc);
    DocumentModel draftDoc = null;

    // if we have draft folder and we do not have draft document
    // we create one in here
    if (draftFolderRef != null && draftDocRef == null) {
      CoreSession session = doc.getCoreSession();

      // copy live document to create draft which will be edited
      draftDoc = session.copy(doc.getRef(), draftFolderRef, doc.getTitle());
      CoreSession session2 = draftDoc.getCoreSession();
      //draftDoc = session.saveDocument(draftDoc); it seems we do not need explicit save

      if (draftDoc != null) {
        try {
          // bind current live folder to a draft document and draft document to current live
          // document
          // by placing corresponding document uuids in each
          // the schema used is generic "fvconf:"
          // recommended by Nuxeo -> SimpleConfiguration
          putUUIDInfo(session, doc, DRAFT_UUID_REF, draftDoc.getId());

          putUUIDInfo(session, draftDoc, LIVE_UUID_REF, doc.getId());
        } catch (Exception e) {
          log.warn("Exception in getDraftDocumentRef " + e);
          log.debug(e, e);
        }
      } else {
        return null;
      }

      return draftDoc.getRef();
    }

    return draftDocRef;
  }

  /**
   * Note: this method will NOT create draft document if one is not found
   *
   * @param liveDoc document which is a source of a draft
   * @return draft document ref or null if document was not found
   */
  public DocumentRef getDraftDocumentRefIfExists(DocumentModel liveDoc) {
    // find draft folder where to create draft document for editing
    DocumentRef draftFolderRef = EditingUtils.getDraftFolderRef(liveDoc);

    if (draftFolderRef != null) {
      CoreSession session = liveDoc.getCoreSession();

      // check if we already have a draft document for this doc
      // if so we should have property holding draft document ref
      try {
        // if we do not have facet we should not be here
        if (!liveDoc.hasFacet(FV_CONFIGURATION_FACET)) {
          return null;
        }

        String uuid = getUUID(liveDoc, DRAFT_UUID_REF);

        // we should always have uuid of a ref document here
        if (uuid == null) {
          return null;
        }

        return (new IdRef(uuid));
      } catch (Exception e) {
        log.warn("Exception in getDraftDocumentRefIfExists " + e);
      }
    }

    return null;
  }

  /**
   * Note: this method will create a draft document if one does not exist
   *
   * @param liveDoc source for creating of draft document
   * @return draft document or null is there is an error
   */
  private DocumentModel getDraftDocument(DocumentModel liveDoc) {

    DocumentRef draftDocumentRef = getDraftDocumentRef(liveDoc);

    if (draftDocumentRef == null) {
      return null;
    }

    return liveDoc.getCoreSession().getDocument(draftDocumentRef);
  }

  /**
   * @param liveDoc for which we want to check if editing can happen
   * @return true if we can edit false otherwise (it may indicate an error)
   */
  public boolean canEditDraftDocument(DocumentModel liveDoc) {
    // TODO something does not work here - do not use it until debugged

    // we cannot edit locked document
    if (liveDoc.isLocked()) {
      return false;
    }

    // check if we have a draft document
    DocumentRef draftDocumentRef = getDraftDocumentRef(liveDoc);

    // if null we encountered an error somewhere
    if (draftDocumentRef == null) {
      return false;
    }

    // we have a draft document and document is not locked
    // we may edit
    return true;
  }


  /**
   * @param liveDoc
   * @param draftDoc
   */
  private void updateLiveDocumentFromDraftWithCleanup(DocumentModel liveDoc,
      DocumentModel draftDoc) {
    updateLiveDocumentFromDraftWithCleanup(liveDoc, draftDoc.getRef());
  }

  /**
   * NOTE: need to introduce lock and synchronization to avoid collision when attempting to edit a
   * draft for a live document
   *
   * @param doc to check if associated draft can be edited
   * @return draft document which can be edited null if live document is locked indicating edit
   * session on the draft null if an error happened
   */
  public DocumentModel editDraftForDocument(DocumentModel doc) {
    CoreSession session = doc.getCoreSession();
    DocumentRef draftDocRef = null;
    String docLifecycleState = doc.getCurrentLifeCycleState();

    // NOTE: checking if document is locked should happen before we call in here

    // check if we have associated draft document
    draftDocRef = getDraftDocumentRefIfExists(doc);

    switch (docLifecycleState) {
      case "Published":
        if (draftDocRef == null) {
          draftDocRef = getDraftDocumentRef(doc);

          if (draftDocRef == null) {
            // something went wrong
            log.warn("editDraftForDocument: Unable to create draft document.");
            return null;
          }
        }

        // lock original document so it cannot be edited
        // since we have a valid draftDocument
        doc.setLock();
        break;

      case "New":
        // document was never published so we return original input.
        return doc;
      // break;

      case "Disabled":
      case "Enabled":
        if (draftDocRef != null) {
          // lifecycle state for live document changed between edits
          // TODO verify with dyona if this is an acceptable action - perhaps we should just
          //  ignore draft ?
          // card 454
          updateLiveDocumentFromDraftWithCleanup(doc, draftDocRef);
          log.warn("editDraftForDocument: Live document lifecycle state changed between edits.");
        }
        // editing live document
        return doc;
      // break;

      case "Deleted":
        // this should never happen
        // TODO if it does gather information and log it
        return null;
      // break;

      default:
        break;

    }

    // we will be editing a valid draft document
    return session.getDocument(draftDocRef);
  }

  /**
   * Save edited document. It is possible we are given a live doc. We can possibly deal with saving
   * of live doc if it is not published.
   *
   * @param doc which needs to be saved doc can be either draft or live document we check and handle
   *            each situation (inline comments below)
   */
  @Override
  public void saveEditedDraftDocument(DocumentModel doc) {
    DocumentRef liveDocRef;
    CoreSession session = doc.getCoreSession();

    // we edited the document we need to save changes
    // only if data changed
    if (doc.isDirty()) {
      session.saveDocument(doc);
    }

    String liveUuid = getUUID(doc, LIVE_UUID_REF);

    if (liveUuid != null) {
      // we were editing draft document for an existing live document
      liveDocRef = new IdRef(liveUuid);
      DocumentModel liveDoc = session.getDocument(liveDocRef);

      if (liveDoc.isLocked()) {
        liveDoc.removeLock();
      } else {
        log.warn("saveEditedDraftDocument: Seems we updated live unlocked document");

      }
    } else {
      // A live document was edited. What was given to use was not a draft document.
      // A lifecycle change could occur between edits.
      // Check if we have hanging draft document.
      DocumentModel liveDocument = doc;
      // check if we have draft document associated with live document
      // perhaps lifecyclestate of live document changed during editing?
      String draftUuid = getUUID(doc, DRAFT_UUID_REF);

      if (draftUuid != null) {
        removeUUIDInfo(liveDocument, DRAFT_UUID_REF);
        DocumentRef draftDocRef = new IdRef(draftUuid);
        // lifecycle state changed between edits and we missed it
        // since live document was edit all we can do is
        // delete draft, and remove reference from live doc
        // is this case possible?
        // remove draft document which we lost editing connection with
        session.removeDocument(draftDocRef);
        log.warn("saveEditedDraftDocument: lifeCycle of live document changed between edits.");

      } else {
        // something went wrong - clean up as much as possible
        if (liveDocument.isLocked()) {
          liveDocument.removeLock();
        }
      }
    }
  }

  /**
   * Unlock live document ending edit session. This method can be used from REST endpoint
   * ReleaseDraftEditLock or from FVEditLockWork scanning for locks held over 30 minutes. If draft
   * edit session is ended draft docuemt will be saved. The data relating draft & Live documents is
   * left in place.
   *
   * @param doc - Live document being edited
   * @return - true when lock is released false if we encounter error of some kind
   */
  public boolean releaseTimedOutLock(DocumentModel doc) {
    DocumentModel docToSave = doc;

    String draftUuid = getUUID(doc, DRAFT_UUID_REF);

    // check if live document is used
    if (draftUuid != null) {
      CoreSession session = doc.getCoreSession();
      DocumentRef draftDocRef = new IdRef(draftUuid);
      docToSave = session.getDocument(draftDocRef);
    } else {
      String liveUuid = getUUID(doc, LIVE_UUID_REF);

      // check if this is draft document and we have real live doc uuid
      // if not this is not a valid document to process here
      if (liveUuid == null) {
        log.warn("releaseTimedOutLock: Seems liveUUID is not present.");
        return false;
      }
    }

    saveEditedDraftDocument(docToSave);
    log.warn(
        "releaseTimedOutLock: Lock removed. Draft document saved. UUID = " + docToSave.getId());

    // TODO should we inform the user associated with the lock? How?

    return true;
  }

  /**
   * Driver for draft session termination or publishing of a draft. Both operations are very similar
   * and only differ because of the use of synchronization step in publishing.
   *
   * @param doc       - either draft or live document
   * @param terminate - true if we want terminate draft edit, false if we want publish and than
   *                  terminate
   * @return - live document (after session was terminated or after it was synchronzied) null
   * indicates an error
   */
  private DocumentModel terminateOrPublish(DocumentModel doc, boolean terminate) {
    String liveUuid = null;
    String draftUuid = getUUID(doc, DRAFT_UUID_REF);
    DocumentRef draftRef = null;
    DocumentModel liveDoc = doc;
    CoreSession session = doc.getCoreSession();

    try {
      // check if we were given a draft document
      if (draftUuid == null) {
        liveUuid = getUUID(doc, LIVE_UUID_REF);

        // if liveUuid is null we do not have a valid document
        if (liveUuid == null) {
          log.warn(
              "terminateOrPublish: liveUuid is null. It is invalid document. UUID " + doc.getId());
          return null;
        }
        draftRef = doc.getRef();
        DocumentRef liveRef = new IdRef(liveUuid);
        liveDoc = session.getDocument(liveRef);

        if (liveDoc == null) {
          log.warn("terminateOrPublish: Live document uuid " + liveUuid
              + " could not be loaded or was not found.");
          return null;
        }
      } else {
        // we have a valid live doc and a valid draftUuid
        draftRef = new IdRef(draftUuid);
      }

      if (terminate) {
        endDraftEditSession(liveDoc, draftRef, VersioningOption.NONE,
            "Document check-in without version number change. Not needed.");
      } else {
        updateLiveDocumentFromDraftWithCleanup(liveDoc, draftRef);
      }
    } catch (Exception e) {
      liveDoc = null;
      log.warn(
          "terminateOrPublish: While terminating (true) or publishing document (false) " + terminate
              + " Exception " + e);
    }

    return liveDoc;

  }

  /**
   * Wrapper exposed to REST end-point of the same name
   *
   * @param doc - live or draft document
   * @return live document null if error
   */
  public DocumentModel terminateDraftEditSession(DocumentModel doc) {

    DocumentModel liveDoc = terminateOrPublish(doc, true);

    return liveDoc;
  }

  /**
   * Wrapper exposed to REST end-point of the same name
   *
   * @param doc - live or draft document
   * @return live document null if error
   */
  @Override
  public DocumentModel publishDraftDocument(DocumentModel doc) {

    DocumentModel liveDoc = terminateOrPublish(doc, false);

    return liveDoc;
  }

  /**
   * Synchronize draft to live document remove reference to draft from live and remove draft
   * document.
   *
   * @param liveDoc     live document to be updated from draft
   * @param draftDocRef reference to document to update live document from
   */
  private void updateLiveDocumentFromDraftWithCleanup(DocumentModel liveDoc,
      DocumentRef draftDocRef) {

    CoreSession session = liveDoc.getCoreSession();
    String checkInMsg = null;
    VersioningOption checkinOption;

    // always remove live document lock
    // even if something goes wrong later
    if (liveDoc.isLocked()) {
      liveDoc.removeLock();
    }

    try {
      // if we had a valid synchronization between draft and live documents
      // we will update version number
      if (updateLiveDocumentFromDraft(liveDoc, draftDocRef)) {
        // TODO figure out why we bump version by 2
        // always upgrade the major version of the live document after changes
        checkinOption = VersioningOption.MAJOR;
        checkInMsg = "Document updated from draft and checked in.";
      } else {
        // we checked out document we need to check it in back with no version update
        checkinOption = VersioningOption.NONE;
        checkInMsg = "Document check-in without version number change. Not needed.";
      }

      endDraftEditSession(liveDoc, draftDocRef, checkinOption, checkInMsg);
    } catch (Exception e) {
      log.warn(
          "updateLiveDocumentFromDraftWithCleanup:  Exception " + e + " checkInMsg " + checkInMsg);
    }
  }

  /**
   * Driver for synchronziation of draft document into live document. Live document changed its
   * state or there was a request to publish draft document. Need to make sure all changes are
   * placed in live document. To run this method document has to be unlocked and checked out.
   *
   * @param liveDoc     live document to be updated from draft
   * @param draftDocRef reference to document to update live document from
   * @return true if documents were different false if there was no update performed or there was no
   * information to synchronize
   */
  private boolean updateLiveDocumentFromDraft(DocumentModel liveDoc, DocumentRef draftDocRef) {
    CoreSession session = liveDoc.getCoreSession();
    DocumentModel draftDoc = session.getDocument(draftDocRef);

    AbstractSynchronizer sync = SynchronizerFactory.produceSynchronizer(liveDoc);

    if (sync != null && sync.initialize(draftDoc, liveDoc)) {

      sync.synchronize();

      Map<String, String> audit = sync.getAuditTrail();

      if (audit.isEmpty()) {
        return false;
      }

      // TODO: What to do with the audit data, where to write?

      session.saveDocument(liveDoc);
      return true;
    }

    return false;
  }
}
