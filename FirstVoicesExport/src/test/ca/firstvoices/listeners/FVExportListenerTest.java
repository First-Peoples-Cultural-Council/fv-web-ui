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

package ca.firstvoices.listeners;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.google.inject.Inject;
import java.util.Arrays;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.test.AutomationFeature;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.impl.EventListenerDescriptor;
import org.nuxeo.ecm.core.test.CoreFeature;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;

@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy({"FirstVoicesData", "org.nuxeo.ecm.platform", "org.nuxeo.ecm.platform.commandline.executor",
    "org.nuxeo.ecm.platform.picture.core", "org.nuxeo.ecm.platform.rendition.core",
    "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
    "org.nuxeo.ecm.automation.scripting", "org.nuxeo.ecm.platform.web.common",
    "org.nuxeo.ecm.core.event", "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.blobmgr.xml",
    "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.listeners.xml",
    "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.operations.xml",
    "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.schedulers.xml",
    "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.type.xml",
    "FirstVoicesExport:OSGI-INF/extensions/ca.firstvoices.workers.xml",
    "FirstVoicesExport:schemas/fvexport.xsd"})
@Deploy({"org.nuxeo.elasticsearch.core:pageprovider-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:schemas-test-contrib.xml",
    "org.nuxeo.elasticsearch.core:elasticsearch-test-contrib.xml",
    "FirstVoicesExport:OSGI-INF/extensions/fake-load-actions.xml",
    "FirstVoicesExport:OSGI-INF/extensions/fake-load-es-provider.xml",
    "FirstVoicesExport:OSGI-INF/extensions/fake-directory-sql-contrib.xml"})

public class FVExportListenerTest {

  protected final List<String> events = Arrays
      .asList("produceFormattedDocument", "produceWrappedBlob", "autoProduceFormattedDocument",
          "autoWorkOnNextDialect");

  @Inject
  protected EventService eS;

  @Inject
  protected CoreSession session;


  @Before
  public void setUp() throws Exception {

    // Clean up previous data
    session.removeChildren(session.getRootDocument().getRef());
    session.save();

    assertNotNull("Should have a valid event service", eS);
    assertNotNull("Should have a valid session", session);

    //session.save();
  }

  @Test
  public void listenerRegistration() {
    // loading a list of listeners as they are registered to inspect visually what was loaded
    // it is not required for the test
    List eL = eS.getEventListeners();
    EventListenerDescriptor editLockCheckListener = eS.getEventListener("EditLockCheckListener");
    assertNotNull("Should have a valid EditLockCheckListener", editLockCheckListener);
    assertTrue(events.stream().allMatch(editLockCheckListener::acceptEvent));
  }
}
