package ca.firstvoices.widgets.operations;/*
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

import static org.junit.Assert.assertTrue;

import ca.firstvoices.core.io.utils.PropertyUtils;
import ca.firstvoices.maintenance.common.CommonConstants;
import ca.firstvoices.testUtil.AbstractFirstVoicesDataTest;
import ca.firstvoices.testUtil.FirstVoicesDataFeature;
import ca.firstvoices.widgets.services.WidgetService;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.mockito.MockitoFeature;
import org.nuxeo.runtime.mockito.RuntimeService;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class, AutomationFeature.class, FirstVoicesDataFeature.class,
    MockitoFeature.class})
@Deploy({"org.nuxeo.ecm.platform.types.core",
    "FirstVoicesWidgets:OSGI-INF/ca.firstvoices.operations.xml",
    "org.nuxeo.ecm.platform.publisher.core", "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting", "FirstVoicesData",
    "FirstVoicesCoreTests:OSGI-INF/nuxeo.conf.override.xml", "FirstVoicesMaintenance",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml"})
@RepositoryConfig(cleanup = Granularity.METHOD, init = DefaultRepositoryInit.class)
public class OperationsTests extends AbstractFirstVoicesDataTest {

  @Mock @RuntimeService
  WidgetService widgetService;

  Map<String, Object> defaultInitParams = new HashMap<>();
  LinkedHashMap<String, String> operations = new LinkedHashMap<>();

  public OperationsTests() {
    defaultInitParams.put("phase", "init");
    defaultInitParams.put("batchSize", 2);
  }

  @Test
  @Ignore
  public void testOperationsInitPhase() throws RuntimeException {
    operations.forEach((k, v) -> {
      try {
        // Call operation
        OperationContext ctx = new OperationContext(session);
        ctx.putChainParameters(defaultInitParams);
        ctx.setInput(dialect);
        automationService.run(ctx, k);

        // Get confirmation operation was successful
        DocumentModel newDoc = session.getDocument(dialect.getRef());

        List<String> requiredJobs =
            PropertyUtils.getValuesAsList(newDoc, CommonConstants.REQUIRED_JOBS_FULL_FIELD);

        assertTrue("Required jobs contains " + v, requiredJobs.contains(v));
      } catch (OperationException e) {
        throw new RuntimeException(e);
      }
    });
  }
}
