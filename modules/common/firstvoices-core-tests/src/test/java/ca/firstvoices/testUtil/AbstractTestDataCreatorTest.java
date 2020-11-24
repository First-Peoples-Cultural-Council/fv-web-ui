package ca.firstvoices.testUtil;

import ca.firstvoices.testUtil.annotations.TestDataConfiguration;
import javax.inject.Inject;
import org.junit.Before;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.event.EventService;
import org.nuxeo.ecm.core.event.impl.EventListenerDescriptor;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Deploys;
import org.nuxeo.runtime.test.runner.PartialDeploy;
import org.nuxeo.runtime.test.runner.TargetExtensions;
import org.nuxeo.runtime.transaction.TransactionHelper;

@Deploys({@Deploy("org.nuxeo.binary.metadata"), @Deploy("org.nuxeo.ecm.platform.url.core"),
    @Deploy("org.nuxeo.ecm.platform.types.api"), @Deploy("org.nuxeo.ecm.platform.types.core"),
    @Deploy("org.nuxeo.ecm.platform.webapp.types"), @Deploy("org.nuxeo.ecm.platform.video.core"),
    @Deploy("org.nuxeo.ecm.platform.picture.core"), @Deploy("FirstVoicesCoreTests")})
@PartialDeploy(bundle = "FirstVoicesData", extensions = {TargetExtensions.ContentModel.class})
public abstract class AbstractTestDataCreatorTest {

  @Inject protected TestDataCreator dataCreator;

  @Inject private CoreSession session;

  @Before
  public void initData() {
    this.dataCreator.reset();

    Class<? extends AbstractTestDataCreatorTest> clz = this.getClass();

    if (clz.isAnnotationPresent(TestDataConfiguration.class)) {
      TestDataConfiguration config = clz.getAnnotation(TestDataConfiguration.class);

      for (int i = 0; i < config.yaml().length; i++) {
        String res = config.yaml()[i];
        dataCreator.addYaml(this.session, res);
      }
    }
    // Always start a transaction if one isn't available for the test
    if (!TransactionHelper.isTransactionActive()) {
      TransactionHelper.startTransaction();
    }
  }

  /**
   * Unregister events so that they do not interfere with tests
   * @param listenersToDisable list of listener names to deactivate
   */
  public static void unregisterEvents(String[] listenersToDisable) {
    // Remove ancestry, publish, and bulk life cycle listeners
    // To help isolate testing to the service
    EventService eventService = Framework.getService(EventService.class);

    for (String listener : listenersToDisable) {
      EventListenerDescriptor listenerDescriptor = eventService.getEventListener(listener);

      if (listenerDescriptor != null) {
        eventService.removeEventListener(listenerDescriptor);
      }
    }
  }

}