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

import static ca.firstvoices.data.lifecycle.Constants.ENABLE_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static ca.firstvoices.data.lifecycle.Constants.REPUBLISH_TRANSITION;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.testUtil.MockStructureTestUtil;
import javax.inject.Inject;
import org.junit.After;
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
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.RuntimeFeature;
import org.nuxeo.runtime.test.runner.TargetExtensions;

@RunWith(FeaturesRunner.class)
@Features({AutomationFeature.class, PlatformFeature.class, RuntimeFeature.class})

@Deploy({"FirstVoicesData",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml",
    "org.nuxeo.ecm.platform", "org.nuxeo.ecm.platform.types.core",
    "org.nuxeo.ecm.platform.publisher.core", "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.rendition.core", "org.nuxeo.ecm.platform.video.core",
    "org.nuxeo.ecm.platform.audio.core", "org.nuxeo.ecm.automation.scripting",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})

public class CheckUnpublishedChangesTest extends MockStructureTestUtil {

  @Inject
  private CoreSession session;

  @Inject
  private AutomationService automationService;

  private DocumentModel word;

  private DocumentModel dialect;

  @Before
  public void setUp() {
    assertNotNull("Should have a valid session", session);
    session.removeChildren(session.getRootDocument().getRef());
    session.save();

    dialect = createDialectTree(session);
    dialect.followTransition(ENABLE_TRANSITION);
    session.saveDocument(dialect);

    if (!PUBLISHED_STATE.equals(dialect.getCurrentLifeCycleState())) {
      dialect.followTransition(PUBLISH_TRANSITION);
      session.saveDocument(dialect);
    }

    // Create one word
    word = session.createDocument(
        session.createDocumentModel(
            "/FV/Workspaces/Family/Language/Dialect/Dictionary",
            "TestWord",
            "FVWord"));

    word.followTransition(ENABLE_TRANSITION);
    session.saveDocument(word);
  }

  @After
  public void cleanup() {
    session.removeChildren(session.getRootDocument().getRef());
    session.save();
  }

  @Test
  public void checkUnpublishedChangesTest() throws OperationException {
    OperationContext ctx = new OperationContext(session);

    /*
            Should return false as doc is not published yet.
         */
    ctx.setInput(word);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

        /*
            Should still return false because the doc is not published.
         */
    word.setPropertyValue("dc:title", "WordOneTest");
    word = session.saveDocument(word);
    ctx.setInput(word);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

        /*
            Should return false because there are no changes since the publish.
         */
    word.followTransition(PUBLISH_TRANSITION);
    word = session.saveDocument(word);
    ctx.setInput(word);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

        /*
            Should return true because there are changes that have not been published.
         */
    word.setPropertyValue("dc:title", "WordOneTestTwo");
    word = session.saveDocument(word);
    ctx.setInput(word);
    assertTrue((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

        /*
            Should now return false because the changes have been published.
         */
    word.followTransition(REPUBLISH_TRANSITION);
    word = session.saveDocument(word);
    ctx.setInput(word);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));
  }

}
