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

import static org.junit.Assert.assertEquals;

import ca.firstvoices.nativeorder.operations.ComputeNativeOrderForDialect;
import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class, AutomationFeature.class})
@Deploy({"org.nuxeo.ecm.automation.jsf", "org.nuxeo.ecm.platform.types.core",
    "org.nuxeo.ecm.platform.publisher.core", "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting", "FirstVoicesData", "FirstVoicesNuxeoPublisher",
    "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",})
public class TestComputeNativeOrderForDialect {

  @Inject
  protected CoreSession session;

  @Inject
  protected AutomationService automationService;

  DocumentModel dialectDoc = null;

  @Before
  public void setUp() throws Exception {
    session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
    session.createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
    session.createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));

    dialectDoc = session
        .createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
  }

  @Test
  public void testOperation() throws OperationException {

    final String path = "/default-domain";
    OperationContext ctx = new OperationContext(session);
    ctx.setInput(dialectDoc);

    DocumentModel doc = (DocumentModel) automationService.run(ctx, ComputeNativeOrderForDialect.ID);
    assertEquals("/Family/Language/Dialect", doc.getPathAsString());

    Map<String, Object> params = new HashMap<>();
    params.put("path", path);
    doc = (DocumentModel) automationService.run(ctx, ComputeNativeOrderForDialect.ID, params);
    assertEquals("/Family/Language/Dialect", doc.getPathAsString());
  }
}