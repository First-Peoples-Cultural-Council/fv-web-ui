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

package firstvoices.editors.configuration;

import static ca.firstvoices.editors.configuration.FVLocalConf.FV_CONFIGURATION_PARAMETERS_PROPERTY;
import static ca.firstvoices.editors.configuration.FVLocalConf.FV_CONFIGURATION_PARAMETER_KEY;
import static ca.firstvoices.editors.configuration.FVLocalConf.FV_CONFIGURATION_PARAMETER_VALUE;
import static org.junit.Assert.*;

import firstvoices.editors.testUtil.draftDocTestUtil;
import firstvoices.editors.testUtil.draftDocTestUtilImpl;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.inject.Inject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.runtime.RuntimeService;
import org.nuxeo.runtime.api.Framework;

@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesData", "org.nuxeo.ecm.platform", "org.nuxeo.ecm.platform.commandline.executor",
    "org.nuxeo.ecm.platform.picture.core", "org.nuxeo.ecm.platform.rendition.core",
    "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting", "org.nuxeo.ecm.platform.web.common",
    "FirstVoicesPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/ca.firstvoices.editors.operations.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/ca.firstvoices.editors.configuration.adapter.xml",
    "FirstVoicesDraftEditor:schemas/fvconfiguration.xsd",
    "org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/fake-load-actions.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/fake-load-es-provider.xml",
    "FirstVoicesDraftEditor:OSGI-INF/extensions/fake-directory-sql-contrib.xml"})

public class FVLocalConfTest {

  private static final String TEST_KEY_NAME = "PutFVConfParamTestKey";
  private static final String TEST_KEY_VALUE = "FV_TEST_VALUE";
  private static final Log log = LogFactory.getLog(FVLocalConfTest.class);
  @Inject
  protected AutomationService automationService;
  @Inject
  CoreSession session;
  private DocumentModel dialectDoc;
  private DocumentModel word;
  private draftDocTestUtil testUtil;

  @Before
  public void setUp() throws Exception {
    testUtil = new draftDocTestUtilImpl();

    assertNotNull("Should have a valid test utilities obj", testUtil);
    assertNotNull("Should have a valid session", session);
    assertNotNull("Should have a valid automationService", automationService);

    DocumentModelList testWords = session
        .query("SELECT * FROM FVWord WHERE ecm:isCheckedInVersion = 0");

    testUtil.createSetup(session);
  }


  @Test
  public void shouldDeployNuxeoRuntime() {
    RuntimeService runtime = Framework.getRuntime();
    assertNotNull(runtime);
  }

  @Test
  public void shouldAddandRemove() throws OperationException {
    OperationContext ctx = new OperationContext(session);

    Map<String, Object> params = new HashMap<>();
    params.put(FV_CONFIGURATION_PARAMETER_KEY, TEST_KEY_NAME);
    params.put(FV_CONFIGURATION_PARAMETER_VALUE, TEST_KEY_VALUE);

    DocumentModelList testWords = session.query("SELECT * FROM FVWord WHERE ecm:isVersion = 0");

    DocumentModel rDoc;

    for (DocumentModel doc : testWords) {
      ctx.setInput(doc);
      rDoc = (DocumentModel) automationService
          .run(ctx, "LocalConfiguration.PutFVConfParam", params);
    }

    session.save();

    List<Map<String, String>> definitions = null;

    testWords = session.query("SELECT * FROM FVWord WHERE ecm:isVersion = 0");

    for (DocumentModel doc : testWords) {
      definitions = (List<Map<String, String>>) doc
          .getPropertyValue(FV_CONFIGURATION_PARAMETERS_PROPERTY);
      assertNotNull("Definitions should not be null", definitions);
      assertFalse("Should have valid definitions", definitions.isEmpty());

      for (Map<String, String> param : definitions) {
        assertTrue("Should have parameter key", param.containsKey(FV_CONFIGURATION_PARAMETER_KEY));
        String key = param.get(FV_CONFIGURATION_PARAMETER_KEY);
        assertTrue("Should have a valid key name", key.equals(TEST_KEY_NAME));
        String value = param.get(FV_CONFIGURATION_PARAMETER_VALUE);
        assertTrue("Should have a valid value for the key", value.equals(TEST_KEY_VALUE));
      }
    }

    for (DocumentModel doc : testWords) {
      ctx.setInput(doc);
      rDoc = (DocumentModel) automationService
          .run(ctx, "LocalConfiguration.RemoveFVConfParam", params);
    }

    session.save();

    testWords = session.query("SELECT * FROM FVWord WHERE ecm:isVersion = 0");

    for (DocumentModel doc : testWords) {
      definitions = (List<Map<String, String>>) doc
          .getPropertyValue(FV_CONFIGURATION_PARAMETERS_PROPERTY);
      assertNotNull("Definitions should not be null", definitions);

      for (Map<String, String> param : definitions) {
        assertFalse("FVConfParam should have been removed ",
            param.containsKey(FV_CONFIGURATION_PARAMETER_KEY));
      }
    }
  }
}
