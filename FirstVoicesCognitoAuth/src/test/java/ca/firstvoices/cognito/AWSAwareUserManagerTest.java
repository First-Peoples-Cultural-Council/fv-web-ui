package ca.firstvoices.cognito;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import com.google.inject.Inject;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
import org.nuxeo.ecm.core.test.annotations.Granularity;
import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import org.nuxeo.runtime.test.runner.RuntimeFeature;


@RunWith(FeaturesRunner.class)
@Features({RuntimeFeature.class, PlatformFeature.class})
@RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
@Deploy({
    "org.nuxeo.ecm.platform",
    "org.nuxeo.ecm.platform.web.common",
    "FirstVoicesCognitoAuth:OSGI-INF/extensions/ca.firstvoices.cognito.xml",
    "FirstVoicesCognitoAuth.test:ca.firstvoices.cognito.service.xml",
    "FirstVoicesCognitoAuth.test:ca.firstvoices.cognito.usermanager.xml",
    "FirstVoicesCognitoAuth.test:ca.firstvoices.cognito.overrides.xml"
})

public class AWSAwareUserManagerTest {

  @Inject
  private UserManager userManager;

  @Test
  @Ignore
  /*
   * This test is ignored because of an issue with the Nuxeo Runtime I have not been able to
   * figure out.
   * Running with WebEngineFeature is required for this to work and it does not consistently work
   *  (it is environment-dependent)
   *
   * It seems to be a dependency issue involving Tomcat and servlet API 4.0
   **/
  public void testUserInAWSAndLocal() {
    assertTrue(userManager.checkUsernamePassword("test_aws_user_1", "password"));
  }

  @Test
  @Ignore
  /*
   * This test is ignored because of an issue with the Nuxeo Runtime I have not been able to
   *  figure out.
   * Running with WebEngineFeature is required for this to work and it does not consistently work
   *  (it is environment-dependent)
   *
   * It seems to be a dependency issue involving Tomcat and servlet API 4.0
   * */
  public void testUserInAWSAndNotLocal() {
    assertFalse(userManager.checkUsernamePassword("test_aws_user_2", "password"));
  }

}
