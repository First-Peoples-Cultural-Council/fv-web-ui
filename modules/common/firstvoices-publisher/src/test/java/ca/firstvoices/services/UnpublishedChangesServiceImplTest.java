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

package ca.firstvoices.services;

import static ca.firstvoices.data.lifecycle.Constants.PUBLISH_TRANSITION;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import ca.firstvoices.publisher.services.UnpublishedChangesService;
import ca.firstvoices.publisher.services.UnpublishedChangesServiceImpl;
import ca.firstvoices.runner.FirstVoicesCoreTestsFeature;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
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
@Features({PlatformFeature.class, RuntimeFeature.class, CoreFeature.class, MockitoFeature.class,
    FirstVoicesCoreTestsFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesCoreIO",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml", "FirstVoicesData",
    "org.nuxeo.ecm.platform", "org.nuxeo.ecm.platform.types.core",
    "org.nuxeo.ecm.platform.publisher.core", "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.rendition.core", "org.nuxeo.ecm.platform.video.core",
    "org.nuxeo.ecm.platform.audio.core", "org.nuxeo.ecm.automation.scripting",
    "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml",
    "test-data/test-language-unpublished.yaml"})

public class UnpublishedChangesServiceImplTest extends AbstractTestDataCreatorTest {

  @Inject protected CoreSession session;

  @Mock @RuntimeService protected FirstVoicesPublisherService fvPublisherService;

  @Inject private UnpublishedChangesService unpublishedChangesServiceInstance;

  private DocumentModel dialectDoc;

  private DocumentModel section;

  private DocumentModel dialectProxy = null;

  @Before
  public void setUp() {

    unpublishedChangesServiceInstance = new UnpublishedChangesServiceImpl();

    dialectDoc = dataCreator.getReference(session, "testUnpublishedArchive");

    // We can use any section for this test
    section = session.query("SELECT * FROM Section").get(0);

    Mockito
        .when(fvPublisherService.getPublication(any(), any()))
        .thenAnswer(I -> getDialectProxy());
  }

  @Test
  public void unpublishedChanges() {

    //Should return false as doc is not published yet.
    assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

    //Should still return false because the doc is not published.
    dialectDoc.setPropertyValue("dc:title", "WordOneTest");
    dialectDoc = session.saveDocument(dialectDoc);
    assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

    //   Should return false because there are no changes since the publish.

    dialectDoc.followTransition(PUBLISH_TRANSITION);
    dialectProxy = session.publishDocument(dialectDoc, section, true);

    dialectDoc = session.saveDocument(dialectDoc);
    assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

    // Should return true because there are changes that have not been published.

    dialectDoc.setPropertyValue("dc:title", "WordOneTestTwo");
    dialectDoc = session.saveDocument(dialectDoc);
    assertTrue(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

    // Should now return false because the changes have been published.
    dialectProxy = session.publishDocument(dialectDoc, section, true);
    dialectDoc = session.saveDocument(dialectDoc);

    assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

  }

  private DocumentModel getDialectProxy() {
    return dialectProxy;
  }

}
