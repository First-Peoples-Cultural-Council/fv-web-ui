package ca.firstvoices.runner;


import java.util.concurrent.TimeUnit;
import javax.persistence.EntityManager;
import org.nuxeo.ecm.core.persistence.PersistenceProviderFactory;
import org.nuxeo.ecm.platform.audit.api.AuditLogger;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.management.ManagementFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.RunnerFeature;
import org.nuxeo.runtime.test.runner.TransactionalFeature;
import org.nuxeo.runtime.transaction.TransactionHelper;

@Features({ManagementFeature.class, PlatformFeature.class})
@Deploy({
    "org.nuxeo.runtime.datasource",
    "org.nuxeo.runtime.metrics",
    "org.nuxeo.ecm.core.persistence",
    "org.nuxeo.ecm.platform.audit",
})
@Deploy("FirstVoicesData.tests:audit-contrib.xml")
public class AuditFeature implements RunnerFeature {

  @Override
  public void initialize(FeaturesRunner runner) throws Exception {
    runner.getFeature(TransactionalFeature.class)
        .addWaiter(duration -> Framework.getService(AuditLogger.class)
            .await(duration.toMillis() - System.currentTimeMillis(), TimeUnit.MILLISECONDS));
  }

  @Override
  public void stop(FeaturesRunner runner) throws Exception {
    clear();
  }

  protected void clear() {
    boolean started = TransactionHelper.isTransactionActive() == false && TransactionHelper.startTransaction();
    try {
      doClear();
    } finally {
      if (started) {
        TransactionHelper.commitOrRollbackTransaction();
      }
    }
  }

  public void doClear() {
    EntityManager em = Framework.getService(PersistenceProviderFactory.class).newProvider("nxaudit-logs").acquireEntityManager();
    try {
      em.createNativeQuery("delete from nxp_logs_mapextinfos").executeUpdate();
      em.createNativeQuery("delete from nxp_logs_extinfo").executeUpdate();
      em.createNativeQuery("delete from nxp_logs").executeUpdate();
    } finally {
      em.close();
    }
  }
}