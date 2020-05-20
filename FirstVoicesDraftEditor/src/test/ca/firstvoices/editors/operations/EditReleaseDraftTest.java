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

package firstvoices.editors.operations;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.editors.services.DraftEditorService;
import com.google.inject.Inject;
import firstvoices.editors.testUtil.draftDocTestUtil;
import firstvoices.editors.testUtil.draftDocTestUtilImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.elasticsearch.test.RepositoryElasticSearchFeature;

@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class,
    RepositoryElasticSearchFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesData", "org.nuxeo.ecm.platform", "org.nuxeo.ecm.platform.commandline.executor",
    "org.nuxeo.ecm.platform.picture.core", "org.nuxeo.ecm.platform.rendition.core",
    "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting", "org.nuxeo.ecm.platform.web.common",
    "org.nuxeo.ecm.automation.jsf",
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

public class EditReleaseDraftTest {

  private draftDocTestUtil testUtil;

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
  public void editReleaseDraftTest() {
    DocumentModel[] docArray = testUtil.getTestWordsArray(session);
    int initialWordCount = docArray.length;

    testUtil.startEditViaAutomation(automationService, docArray);

    session.save();

    docArray = testUtil.getTestWordsArray(session);
    int afterEditStartedWordCount = docArray.length;

    assertTrue("Should have all draft documents created",
        2 * initialWordCount == afterEditStartedWordCount);

    testUtil.checkDraftEditLock(draftEditorServiceInstance, docArray);

    testUtil
        .releaseDraftEditLockViaAutomation(automationService, draftEditorServiceInstance, docArray);

    session.save();

    docArray = testUtil.getTestWordsArray(session);

    assertTrue("Should have draft documents after lock release",
        docArray.length == afterEditStartedWordCount);

    testUtil.checkAfterReleaseSave(draftEditorServiceInstance, docArray);
  }
}
