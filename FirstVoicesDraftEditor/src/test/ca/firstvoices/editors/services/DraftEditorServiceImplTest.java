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

package firstvoices.editors.services;

import static ca.firstvoices.editors.configuration.FVLocalConf.DRAFT_UUID_REF;
import static ca.firstvoices.editors.configuration.FVLocalConf.LIVE_UUID_REF;
import static org.junit.Assert.*;

import ca.firstvoices.editors.services.DraftEditorService;
import ca.firstvoices.editors.utils.EditingUtils;
import firstvoices.editors.testUtil.draftDocTestUtil;
import firstvoices.editors.testUtil.draftDocTestUtilImpl;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;

//, RepositoryElasticSearchFeature.class

@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class,
    RepositoryElasticSearchFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesData", "org.nuxeo.ecm.platform", "org.nuxeo.ecm.platform.commandline.executor",
    "org.nuxeo.ecm.platform.picture.core", "org.nuxeo.ecm.platform.rendition.core",
    "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting", "org.nuxeo.ecm.platform.web.common",
    "FirstVoicesPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/ca.firstvoices.editors.operations.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/ca.firstvoices.editors.configuration.adapter.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/ca.firstvoices.editors.schedulers.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/ca.firstvoices.editors.services.xml",
    "FirstVoicesDraftEditor:schemas/fvconfiguration.xsd",
    "org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/fake-load-actions.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/fake-load-es-provider.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/fake-directory-sql-contrib.xml"})

public class DraftEditorServiceImplTest {

  private draftDocTestUtil testUtil;

  private DocumentModel draftFolder;

  @Inject
  private CoreSession session;

  @Inject
  private AutomationService automationService;

  @Inject
  private DraftEditorService draftEditorServiceInstance;

  @Before
  public void setUp() throws Exception {
    testUtil = new draftDocTestUtilImpl();

    assertNotNull("Should have a valid test utilities obj", testUtil);
    assertNotNull("Should have a valid session", session);
    assertNotNull("Should have a valid automationService", automationService);
    assertNotNull("Should have a valid DraftEditorServiceImpl", draftEditorServiceInstance);

    testUtil.createSetup(session);
  }

  @Test
  public void getDraftFolder() {
    DocumentModel dialect = testUtil.getCurrentDialect();
    assertNotNull("Dialect cannot be null", dialect);

    DocumentRef draftFolderRef = EditingUtils.getDraftFolderRef(dialect);
    assertNotNull("DraftFolderRef cannot be null", draftFolderRef);

    // draft folder reference can be used from this point in other tests
    draftFolder = session.getDocument(draftFolderRef);
    assertNotNull("Should have a valid draftFolder", draftFolder);
  }

  @Test
  public void getUUID() {
    // get created words
    DocumentModel[] docArray = testUtil.getTestWordsArray(session);
    assertNotNull("Should always have a valid array of words(1)", docArray);

    // there are 10 words .. for testing we can use first 4 as original and next 4 as draft
    //
    for (int i = 0; i < 4; i++) {
      String masterId = docArray[i].getId();
      String draftId = docArray[i + 4].getId();

      draftEditorServiceInstance.putUUIDInfo(session, docArray[i], DRAFT_UUID_REF, draftId);
      draftEditorServiceInstance.putUUIDInfo(session, docArray[i + 4], LIVE_UUID_REF, masterId);
    }

    session.save();

    // re-load words
    docArray = testUtil.getTestWordsArray(session);
    assertNotNull("Should always have a valid array of words(2)", docArray);

    for (int i = 0; i < 4; i++) {
      String draftUuid = draftEditorServiceInstance.getUUID(docArray[i], DRAFT_UUID_REF);
      assertNotNull("Should always have a valid draft doc UUID", draftUuid);

      DocumentModel draftDoc = session.getDocument(new IdRef(draftUuid));
      assertNotNull("Should retrieve a valid draft document", draftDoc);

      String liveUuid = draftEditorServiceInstance.getUUID(docArray[i + 4], LIVE_UUID_REF);
      assertNotNull("Should always have a valid live doc UUID", liveUuid);

      DocumentModel liveDoc = session.getDocument(new IdRef(liveUuid));
      assertNotNull("Should retrieve a valid live document", liveDoc);

      // since we are in the loop we can just as well clear records for the next step
      draftEditorServiceInstance.removeUUIDInfo(docArray[i], DRAFT_UUID_REF);
      draftEditorServiceInstance.removeUUIDInfo(docArray[i + 4], LIVE_UUID_REF);
    }

    session.save();

    // re-load words
    docArray = testUtil.getTestWordsArray(session);
    assertNotNull("Should always have a valid array of words(3)", docArray);

    for (int i = 0; i < 4; i++) {
      String draftUuid = draftEditorServiceInstance.getUUID(docArray[i], DRAFT_UUID_REF);
      assertNull("Should NOT have a draft doc UUID", draftUuid);

      String liveUuid = draftEditorServiceInstance.getUUID(docArray[i], DRAFT_UUID_REF);
      assertNull("Should NOT have a live doc UUID", liveUuid);
    }

    session.save();
  }

  private void startEdit(DocumentModel[] wordArray) {
    DocumentModel draftDoc = null;

    for (DocumentModel aWord : wordArray) {
      draftDoc = draftEditorServiceInstance.editDraftForDocument(aWord);
      assertNotNull("Should have a valid draft document when starting edit", draftDoc);
    }
  }

  @Test
  public void editDraftForDocument() {
    DocumentModel[] wordArray = testUtil.getTestWordsArray(session);
    DocumentModel draftDoc = null;
    String draftUuid = null;

    startEdit(wordArray);

    session.save();

    for (DocumentModel aWord : wordArray) {
      // check if we have a valid uuid attached to live doc
      draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);

      // we have 20 words 10 live & 10 draft
      if (draftUuid != null) {
        draftDoc = session.getDocument(new IdRef(draftUuid));
        assertNotNull("Should have a valid draft document", draftDoc);
        String liveUuid = draftEditorServiceInstance.getUUID(draftDoc, LIVE_UUID_REF);
        assertEquals("Saved and true uuids should match", liveUuid, aWord.getId());
      }
    }
  }

  @Test
  public void saveEditedDraftDocument() {
    DocumentModel[] wordArray = testUtil.getTestWordsArray(session);
    DocumentModel draftDoc = null;
    String draftUuid = null;

    startEdit(wordArray);

    session.save();

    wordArray = testUtil.getTestWordsArray(session);

    for (DocumentModel aWord : wordArray) {
      draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);

      if (draftUuid != null) {
        // we have 20 words 10 live & 10 draft
        draftDoc = session.getDocument(new IdRef(draftUuid));
        assertNotNull("Should always have a valid draft doc", draftDoc);
        assertTrue("Live document should be LOCKED", aWord.isLocked());
        draftEditorServiceInstance.saveEditedDraftDocument(draftDoc);
      }
    }

    session.save();

    // check if lock on the live document is released but we still have draft uuid attached
    wordArray = testUtil.getTestWordsArray(session);

    // note we will have 20 words since we should have draft document for each word
    for (DocumentModel aWord : wordArray) {
      String liveUuid;

      draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);

      // if draftUuid is null (we are looking at draft document or error)
      if (draftUuid != null) {
        assertFalse("Live document should be unlocked", aWord.isLocked());
      } else {
        liveUuid = draftEditorServiceInstance.getUUID(aWord, LIVE_UUID_REF);
        // if liveUUid is null this is an error
        assertNotNull("Live UUID should not be null", liveUuid);
      }
    }
  }

  private void testEndCheck(int initialNumberOfWords, int editedNumberOfWords, Boolean condSwitch) {
    DocumentModel[] wordArray = null;
    String draftUuid = null;

    wordArray = testUtil.getTestWordsArray(session);

    if (condSwitch) {
      assertEquals("We should have only initial number of words after termination/publishing",
          wordArray.length, initialNumberOfWords);
      assertEquals("We should have exactly 1/2 of words after termination/publishing",
          editedNumberOfWords, 2 * initialNumberOfWords);
    } else {
      assertEquals("We should have exactly the same number of words as we did after edit started",
          editedNumberOfWords, 2 * initialNumberOfWords);
    }

    for (DocumentModel aWord : wordArray) {
      String liveUuid;

      draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);

      if (condSwitch) {
        assertNull("DraftUuid should be NULL", draftUuid);
      } else {
        liveUuid = draftEditorServiceInstance.getUUID(aWord, LIVE_UUID_REF);
        if (liveUuid == null) {
          // we have drafts mixed with live documents at this point
          // we have to filter out live documents
          assertNotNull("DraftUuid should NOT be NULL", draftUuid);
        }
      }

      assertFalse("Live document should be UNLOCKED", aWord.isLocked());
    }
  }

  @Test
  public void releaseTimedOutLock() {
    DocumentModel[] wordArray = testUtil.getTestWordsArray(session);
    DocumentModel draftDoc = null;
    String draftUuid = null;

    int initialNumberOfWords = wordArray.length;

    startEdit(wordArray);

    session.save();

    wordArray = testUtil.getTestWordsArray(session);

    int editedNumberOfWords = wordArray.length;

    for (DocumentModel aWord : wordArray) {
      draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);

      if (draftUuid != null) {
        // we have a mix of live and draft documents
        draftEditorServiceInstance.releaseTimedOutLock(aWord);
      }
    }

    session.save();

    testEndCheck(initialNumberOfWords, editedNumberOfWords, false);
  }


  @Test
  public void terminateDraftEditSession() {
    DocumentModel[] wordArray = testUtil.getTestWordsArray(session);
    DocumentModel draftDoc = null;
    String draftUuid = null;

    int initialNumberOfWords = wordArray.length;

    startEdit(wordArray);

    session.save();

    wordArray = testUtil.getTestWordsArray(session);
    int editedNumberOfWords = wordArray.length;

    for (DocumentModel aWord : wordArray) {
      draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);
      if (draftUuid != null) {
        // we have 20 words 10 live & 10 draft
        assertNotNull("Should have a valid draft dcoument uuid", draftUuid);
        draftDoc = session.getDocument(new IdRef(draftUuid));
        assertNotNull("Should always have a valid draft doc", draftDoc);
        assertTrue("Live document should be LOCKED", aWord.isLocked());
        draftEditorServiceInstance.terminateDraftEditSession(draftDoc);
      }
    }

    session.save();

    testEndCheck(initialNumberOfWords, editedNumberOfWords, true);
  }

  @Test
  public void publishDraftDocument() {
    DocumentModel[] wordArray = testUtil.getTestWordsArray(session);
    DocumentModel draftDoc = null;
    String draftUuid = null;
    int initialNumberOfWords = wordArray.length;

    String[] keys = {"ONE", "TWO", "THREE", "FOUR", "FIVE"};
    String[] values = {"VALUE-ONE", "VALUE-TWO", "VALUE-THREE", "VALUE-FOUR", "VALUE-FIVE"};
    ArrayList<Map<String, String>> testList = testUtil.createListMapTestData(keys, values);

    // property labels
    String[] propertiesToCheck = {"fv:related_pictures", "fv:cultural_note", "fv:related_audio",
        "fv:related_videos"};

    String[] relatedAudiouuids = {"Pict-1", "Pict-2"};
    String[] relatedCulturalNotesUuids = {"CulturalNote-1", "CulturalNote-2", "CulturalNote-3"};
    String[] relatedAudioUuids = {"RelatedAudio-1", "RelatedAudio-2", "RelatedAudio-3",
        "RelatedAudio-4"};
    String[] relatedVideoUuids = {"RelatedVideo-1", "RelatedVideo-2", "RelatedVideo-3",
        "RelatedVideo-4", "RelatedVideo-5"};

    HashMap<String, String[]> testPropertyDict = new HashMap<>();

    testPropertyDict.put(propertiesToCheck[0], relatedAudiouuids);
    testPropertyDict.put(propertiesToCheck[1], relatedCulturalNotesUuids);
    testPropertyDict.put(propertiesToCheck[2], relatedAudioUuids);
    testPropertyDict.put(propertiesToCheck[3], relatedVideoUuids);

    startEdit(wordArray);

    session.save();

    wordArray = testUtil.getTestWordsArray(session);

    // we have a double number of words ... live and corresponding drafts
    for (DocumentModel aWord : wordArray) {
      draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);
      // alter draft document
      // if draftUuid is null we are looking at a draft document
      if (draftUuid == null) {
        if (!aWord.isCheckedOut()) {
          aWord.checkOut();
        }

        // change draft name
        String wordTitle = aWord.getTitle() + "-1";
        aWord.setPropertyValue("fv:reference", wordTitle);
        aWord.setPropertyValue("fv-word:available_in_games", true);

        //add complex properties
        aWord.setPropertyValue("fvcore:definitions", testList);
        aWord.setPropertyValue("fvcore:literal_translation", testList);

        // "edit" draft documents
        for (String key : testPropertyDict.keySet()) {
          aWord.setPropertyValue(key, testPropertyDict.get(key));
        }

        DocumentModel savedDraft = session.saveDocument(aWord);
      }
    }

    wordArray = testUtil.getTestWordsArray(session);
    int editedNumberOfWords = wordArray.length;

    for (DocumentModel aWord : wordArray) {
      draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);
      if (draftUuid != null) {
        // we have 20 words 10 live & 10 draft
        assertNotNull("Should have a valid draft document uuid", draftUuid);
        draftDoc = session.getDocument(new IdRef(draftUuid));
        assertNotNull("Should always have a valid draft doc", draftDoc);
        assertTrue("Live document should be LOCKED", aWord.isLocked());
        draftEditorServiceInstance.publishDraftDocument(draftDoc);
      }
    }

    session.save();

    // check if live document has property values copied from draft
    wordArray = testUtil.getTestWordsArray(session);
    for (DocumentModel aWord : wordArray) {
      String wordTitle = (String) aWord.getPropertyValue("fv:reference");

      assertTrue("fv:reference has to have word name appened with '-1'", wordTitle.endsWith("-1"));

      Boolean availableInGames = (Boolean) aWord.getPropertyValue("fv-word:available_in_games");
      assertTrue("Available_in_games has to be TRUE", availableInGames);

      // check complex properties
      testUtil
          .checkListMapTestData((ArrayList<Object>) aWord.getPropertyValue("fvcore:definitions"),
              keys, values);
      testUtil.checkListMapTestData(
          (ArrayList<Object>) aWord.getPropertyValue("fvcore:literal_translation"), keys, values);

      for (String key : testPropertyDict.keySet()) {
        String[] propertyValue = (String[]) aWord.getPropertyValue(key);
        String[] setPropertyValue = testPropertyDict.get(key);

        assertEquals("Should have the same number of elements in synchronized property",
            propertyValue.length, setPropertyValue.length);

        for (String property : setPropertyValue) {
          Boolean found = false;

          for (String item : propertyValue) {
            if (property.equals(item)) {
              found = true;
              break;
            }
          }

          assertTrue("Property content should match with original", found);
        }
      }
    }

    testEndCheck(initialNumberOfWords, editedNumberOfWords, true);
  }

  // TODO add tests for change of state during editing to verify correct behaviour
}