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

import ca.firstvoices.editors.services.DraftEditorService;
import java.util.ArrayList;
import java.util.Map;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public interface draftDocTestUtil {

  public DocumentModel getCurrentDialect();

  public void createSetup(CoreSession session);

  public DocumentModel[] getTestWordsArray(CoreSession session);

  public void publishWords(CoreSession session);

  public DocumentModel createDialectTree(CoreSession session);

  public DocumentModel createDocument(CoreSession session, DocumentModel model);

  public void createWords(CoreSession session);

  public ArrayList<Map<String, String>> createListMapTestData(String[] keys, String[] values);

  public void checkListMapTestData(ArrayList<Object> property, String[] keys, String values[]);

  public void startEditViaAutomation(AutomationService automationService, DocumentModel[] docArray);

  public void publishDraftViaAutomation(AutomationService automationService,
      DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray);

  public void checkDraftEditLock(DraftEditorService draftEditorServiceInstance,
      DocumentModel[] docArray);

  public void checkAfterReleaseSave(DraftEditorService draftEditorServiceInstance,
      DocumentModel[] docArray);

  public void releaseDraftEditLockViaAutomation(AutomationService automationService,
      DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray);

  public void saveDraftViaAutomation(AutomationService automationService,
      DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray);

  public void terminateDraftEditViaAutomation(AutomationService automationService,
      DraftEditorService draftEditorServiceInstance, DocumentModel[] docArray);

}
