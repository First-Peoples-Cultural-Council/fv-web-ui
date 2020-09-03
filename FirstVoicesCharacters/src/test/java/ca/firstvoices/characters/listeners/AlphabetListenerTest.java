package ca.firstvoices.characters.listeners;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.characters.Constants;
import ca.firstvoices.maintenance.common.CommonConstants;
import ca.firstvoices.testUtil.AbstractTestDataCreatorTest;
import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.transaction.TransactionHelper;

@RunWith(FeaturesRunner.class)
@Features({PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.CLASS)
@Deploy({"FirstVoicesData"})
@TestDataConfiguration(yaml = {"test-data/basic-structure.yaml", "test-data/test-language.yaml"})
public class AlphabetListenerTest extends AbstractTestDataCreatorTest {

  DocumentModel dialect = null;
  DocumentModel alphabet = null;

  @Inject
  CoreSession session;

  @Before
  public void initAlphabetTests() {
    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }

    DocumentModel dialect = session.getDocument(new IdRef(this.dataCreator.getReference("testArchive")));
    DocumentModel alphabet = session.getChild(dialect.getRef(), "Alphabet");
  }


  @Test
  public void testHandleEvent() {
    // Edit alphabet
    alphabet.setPropertyValue(AlphabetListener.IGNORED_CHARS, new String[]{"-", "?"});

    // Wait for events to complete
    EventService event = Framework.getService(EventService.class);
    event.waitForAsyncCompletion(3000);

    assertEquals(Constants.COMPUTE_ORDER_JOB_ID, dialect.getPropertyValue(CommonConstants.REQUIRED_JOBS_FULL_FIELD));
  }

  @Test
  public void testDisableEvent() {

    EventService event = Framework.getService(EventService.class);
    event.waitForAsyncCompletion(3000);

    assertNotNull(session);
  }

  @Test
  public void testUnacceptedTypes() {

    EventService event = Framework.getService(EventService.class);
    event.waitForAsyncCompletion(3000);

    assertNotNull(session);
  }
}