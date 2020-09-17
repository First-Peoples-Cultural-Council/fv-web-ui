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
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.RuntimeFeature;
import org.nuxeo.runtime.test.runner.TargetExtensions;

@RunWith(FeaturesRunner.class)
@Features({AutomationFeature.class, PlatformFeature.class, RuntimeFeature.class, CoreFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.services.xml",
    "FirstVoicesData", "org.nuxeo.ecm.platform", "org.nuxeo.ecm.platform.types.core",
    "org.nuxeo.ecm.platform.publisher.core", "org.nuxeo.ecm.platform.picture.core",
    "org.nuxeo.ecm.platform.rendition.core", "org.nuxeo.ecm.platform.video.core",
    "org.nuxeo.ecm.platform.audio.core", "org.nuxeo.ecm.automation.scripting",
    "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
    "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners"
        + ".ProxyPublisherListener.xml",
    "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})

public class UnpublishedChangesServiceImplTest extends MockStructureTestUtil {

  @Inject
  private CoreSession session;

  @Inject
  private UnpublishedChangesService unpublishedChangesServiceInstance;

  private DocumentModel dialectDoc;


  @Before
  public void setUp() throws Exception {

    unpublishedChangesServiceInstance = new UnpublishedChangesServiceImpl();

    assertNotNull("Should have a valid session", session);

    session.removeChildren(session.getRootDocument().getRef());
    session.save();

    dialectDoc = createDialectTree(session);
    session.saveDocument(dialectDoc);

  }

  @After
  public void cleanup() {
    session.removeChildren(session.getRootDocument().getRef());
    session.save();
  }

  @Test
  public void unpublishedChanges() {

        /*
            Should return false as doc is not published yet.
         */
    assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

        /*
            Should still return false because the doc is not published.
         */
    dialectDoc.setPropertyValue("dc:title", "WordOneTest");
    dialectDoc = session.saveDocument(dialectDoc);
    assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

        /*
            Should return false because there are no changes since the publish.
         */
    dialectDoc.followTransition(PUBLISH_TRANSITION);
    dialectDoc = session.saveDocument(dialectDoc);
    assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

        /*
            Should return true because there are changes that have not been published.
         */
    dialectDoc.setPropertyValue("dc:title", "WordOneTestTwo");
    dialectDoc = session.saveDocument(dialectDoc);
    assertTrue(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

        /*
            Should now return false because the changes have been published.
         */
    dialectDoc.followTransition(REPUBLISH_TRANSITION);
    dialectDoc = session.saveDocument(dialectDoc);
    assertFalse(unpublishedChangesServiceInstance.checkUnpublishedChanges(session, dialectDoc));

  }

}
