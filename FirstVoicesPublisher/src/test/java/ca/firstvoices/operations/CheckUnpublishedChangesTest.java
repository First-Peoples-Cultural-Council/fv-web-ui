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

import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.runner.FirstVoicesCoreTestsFeature;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.OperationContext;
import org.nuxeo.ecm.automation.OperationException;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.mockito.MockitoFeature;
import org.nuxeo.runtime.mockito.RuntimeService;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.RuntimeFeature;
import org.nuxeo.runtime.test.runner.TargetExtensions;

@RunWith(FeaturesRunner.class)
@Features({AutomationFeature.class, PlatformFeature.class, RuntimeFeature.class,
    MockitoFeature.class, FirstVoicesCoreTestsFeature.class})

@Deploy({"FirstVoicesData", "FirstVoicesCoreIO",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml",
    "org.nuxeo.ecm.platform", "org.nuxeo.ecm.platform.types.core",
    "org.nuxeo.ecm.platform.publisher.core", "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.rendition.core", "org.nuxeo.ecm.platform.video.core",
    "org.nuxeo.ecm.platform.audio.core", "org.nuxeo.ecm.automation.scripting",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml",
    "test-data/test-language-unpublished.yaml"})
public class CheckUnpublishedChangesTest extends AbstractTestDataCreatorTest {

  @Inject protected CoreSession session;

  @Inject protected AutomationService automationService;

  @Mock @RuntimeService protected FirstVoicesPublisherService fvPublisherService;

  private DocumentModel dialect;

  private DocumentModel section;

  private DocumentModel dialectProxy = null;

  @Before
  public void setUp() {
    dialect = dataCreator.getReference(session, "testUnpublishedArchive");

    // We can use any section for this test
    section = session.query("SELECT * FROM Section").get(0);

    Mockito
        .when(fvPublisherService.getPublication(any(), any()))
        .thenAnswer(I -> getDialectProxy());
  }

  @Test
  public void checkUnpublishedChangesTest() throws OperationException {
    OperationContext ctx = new OperationContext(session);

    // Should return false as doc is not published yet.
    ctx.setInput(dialect);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

    // Should still return false because the doc is not published.
    dialect.setPropertyValue("dc:title", "WordOneTest");
    dialect = session.saveDocument(dialect);
    ctx.setInput(dialect);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

    dialect.followTransition(PUBLISH_TRANSITION);
    dialectProxy = session.publishDocument(dialect, section, true);

    // Should return false because there are no changes since the publish.
    ctx.setInput(dialect);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

    // Should return true because there are changes that have not been published.
    dialect.setPropertyValue("dc:title", "WordOneTestTwo");
    dialect = session.saveDocument(dialect);
    ctx.setInput(dialect);
    assertTrue((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));

    // Should now return false because the changes have been published.
    dialectProxy = session.publishDocument(dialect, section, true);

    ctx.setInput(dialect);
    assertFalse((Boolean) automationService.run(ctx, CheckUnpublishedChanges.ID));
  }

  private DocumentModel getDialectProxy() {
    return dialectProxy;
  }
}
