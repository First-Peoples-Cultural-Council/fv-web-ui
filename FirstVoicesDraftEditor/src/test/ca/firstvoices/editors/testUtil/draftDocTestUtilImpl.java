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

package firstvoices.editors.testUtil;

import static ca.firstvoices.editors.configuration.FVLocalConf.*;
import static org.junit.Assert.*;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.editors.services.DraftEditorService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;

public class draftDocTestUtilImpl implements draftDocTestUtil {

  private static int numMapsInTestList = 4;
  private String[] words = {"ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
      "TEN"};
  private DocumentModel word;
  private DocumentModel dialectDoc;
  private DocumentModel[] wordArray = null;

  public DocumentModel getCurrentDialect() {
    return dialectDoc;
  }

  private void recursiveRemove(CoreSession session, DocumentModel parent) {
    DocumentModelList children = session.getChildren(parent.getRef());

    for (DocumentModel child : children) {
      recursiveRemove(session, child);
    }

    session.removeDocument(parent.getRef());
    session.save();
  }

  private void startFresh(CoreSession session) {
    DocumentRef dRef = new PathRef("/FV");
    DocumentModel defaultDomain = session.getDocument(dRef);

    DocumentModelList children = session.getChildren(defaultDomain.getRef());

    for (DocumentModel child : children) {
      recursiveRemove(session, child);
    }
  }

  public DocumentModel[] getTestWordsArray(CoreSession session) {
    DocumentModelList testWords = session.query("SELECT * FROM FVWord WHERE ecm:isVersion = 0");
    assertNotNull("Should always have valid list of FVWords", testWords);
    DocumentModel[] docArray = new DocumentModel[testWords.size()];
    int i = 0;

    for (DocumentModel doc : testWords) {
      docArray[i] = doc;
      i++;
    }
    // keep converted array for later
    wordArray = docArray;

    return docArray;
  }


  public void publishWords(CoreSession session) {
    IntStream.range(0, wordArray.length).forEach(i -> assertTrue("Should succesfully publish word",
        session.followTransition(wordArray[i], "Publish")));
  }

  public void createSetup(CoreSession session) {
    startFresh(session);

    DocumentModel domain = createDocument(session,
        session.createDocumentModel("/", "FV", "Domain"));

    createDialectTree(session);

    createWords(session);

    session.save();

    wordArray = getTestWordsArray(session);

    assertNotNull("Should have a valid word array(1)", wordArray);
    publishWords(session);
    session.save();
  }

  public DocumentModel createDialectTree(CoreSession session) {
    assertNotNull("Should have a valid FVLanguageFamiliy",
        createDocument(session, session.createDocumentModel("/FV", "Family", FV_LANGUAGE_FAMILY)));
    assertNotNull("Should have a valid FVLanguage", createDocument(session,
        session.createDocumentModel("/FV/Family", "Language", FV_LANGUAGE)));
    dialectDoc = createDocument(session,
        session.createDocumentModel("/FV/Family/Language", "Dialect", FV_DIALECT));
    assertNotNull("Should have a valid FVDialect", dialectDoc);

    return dialectDoc;
  }

  public DocumentModel createDocument(CoreSession session, DocumentModel model) {
    model.setPropertyValue("dc:title", model.getName());
    DocumentModel newDoc = session.createDocument(model);
    session.save();

    return newDoc;
  }

  public void createWords(CoreSession session) {
    Integer i = 0;

    for (String wordValue : words) {
      word = session
          .createDocumentModel("/FV/Family/Language/Dialect/Dictionary", wordValue, FV_WORD);
      assertNotNull("Should have a valid FVWord model", word);
      word.setPropertyValue("fv:reference", wordValue);
      word = createDocument(session, word);
      assertNotNull("Should have a valid FVWord", word);
      i++;
    }
  }

  private void commonOperationRunner(AutomationService automationService,
      DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray,
      String operationSignature, String uuidKey) {
    for (DocumentModel aWord : docArray) {
      String uuid = draftEditorServiceInstance.getUUID(aWord, uuidKey);

      if (uuid != null) {
        Object returnObj;
        OperationContext ctx = new OperationContext(aWord.getCoreSession());
        ctx.setInput(aWord);

        Map<String, Object> params = new HashMap<String, Object>();

        try {
          returnObj = automationService.run(ctx, operationSignature, params);
        } catch (OperationException e) {

        }
      }
    }
  }

  public ArrayList<Map<String, String>> createListMapTestData(String[] keys, String[] values) {
    assertTrue("Data for setting List<Map<String,String>> is not correct",
        keys.length == values.length);

    ArrayList<Map<String, String>> property = new ArrayList<>();
    int index = 0;

    for (int numProperties = 0; numProperties < keys.length; numProperties++) {
      Map<String, String> entry = new HashMap<String, String>();

      // keys have to match the schema
      entry.put("language", keys[index]);
      entry.put("translation", values[index]);

      index++;
      property.add(entry);
    }

    return property;
  }

  public void checkListMapTestData(ArrayList<Object> property, String[] keys, String values[]) {
    assertTrue("Should have List with " + keys.length + " HashMaps",
        property.size() == keys.length);
    int index = 0;

    for (Object obj : property) {
      Map<String, String> map = (HashMap<String, String>) obj;

      assertTrue("Map should have key 'language'", map.containsKey("language"));
      assertTrue("Map should have key 'translation'", map.containsKey("translation"));
      String key1V = map.get("language");
      String key2V = map.get("translation");
      assertTrue("Key 'language' value should match " + keys[index], keys[index].equals(key1V));
      assertTrue("Key 'translation' value should match " + values[index],
          values[index].equals(key2V));
      index++;
    }
  }

  public void checkDraftEditLock(DraftEditorService draftEditorServiceInstance,
      DocumentModel[] docArray) {
    for (DocumentModel aWord : docArray) {
      String draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);

      if (draftUuid != null) {
        assertTrue("Live document should be locked", aWord.isLocked());
      }
    }
  }

  public void checkAfterReleaseSave(DraftEditorService draftEditorServiceInstance,
      DocumentModel[] docArray) {
    for (DocumentModel aWord : docArray) {
      String draftUuid = draftEditorServiceInstance.getUUID(aWord, DRAFT_UUID_REF);

      if (draftUuid != null) {
        assertTrue("Live document should be unlocked", !aWord.isLocked());
      } else {
        String liveUuid = draftEditorServiceInstance.getUUID(aWord, LIVE_UUID_REF);
        assertNotNull("Draft should have live document uuid", liveUuid);
      }
    }

  }


  public void startEditViaAutomation(AutomationService automationService,
      DocumentModel[] docArray) {
    assertNotNull("Should always have a valid word array", docArray);
    assertTrue("Word array should not be empty", docArray.length > 0);

    for (DocumentModel aWord : docArray) {
      OperationContext ctx = new OperationContext(aWord.getCoreSession());
      ctx.setInput(aWord);

      Map<String, Object> params = new HashMap<String, Object>();

      try {
        Object returnObj = automationService.run(ctx, "Document.EditDocument", params);
        assertNotNull("Draft document should not be null", returnObj);
      } catch (OperationException e) {

      }
    }
  }

  public void publishDraftViaAutomation(AutomationService automationService,
      DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray) {
    commonOperationRunner(automationService, draftEditorServiceInstance, docArray,
        "Document.PublishDraftDocument", LIVE_UUID_REF);
    ;
  }

  public void releaseDraftEditLockViaAutomation(AutomationService automationService,
      DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray) {
    commonOperationRunner(automationService, draftEditorServiceInstance, docArray,
        "Document.ReleaseDraftEditLock", DRAFT_UUID_REF);
  }

  public void saveDraftViaAutomation(AutomationService automationService,
      DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray) {
    commonOperationRunner(automationService, draftEditorServiceInstance, docArray,
        "Document.SaveDraftDocument", LIVE_UUID_REF);
  }

  public void terminateDraftEditViaAutomation(AutomationService automationService,
      DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray) {
    commonOperationRunner(automationService, draftEditorServiceInstance, docArray,
        "Document.TerminateDraftEditSession", DRAFT_UUID_REF);
  }
}
