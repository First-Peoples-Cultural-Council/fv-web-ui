package ca.firstvoices.cognito;


import ca.firstvoices.cognito.exceptions.InvalidMigrationException;
import ca.firstvoices.cognito.exceptions.MiscellaneousFailureException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.platform.usermanager.UserManagerImpl;
import org.nuxeo.runtime.api.Framework;


/**
 * Extend Nuxeo's builtin UserManagerImpl to intercept the checkUsernamePassword method
 */
public class AWSAwareUserManager extends UserManagerImpl {

  private static Log LOG = LogFactory.getLog(AWSAwareUserManager.class);

  private AWSAuthenticationService aws;
  private AWSAwareUserManagerConfigurationService configurationService;

  private boolean awsConnectionSucceeded = false;
  private boolean awsAuthenticationEnabled;
  private Set<String> blacklistUsers = new HashSet<>();


  private AWSAuthenticationService getAWSAuthenticationService() {
    if (this.aws != null) {
      return this.aws;
    }

    this.aws = Framework.getService(AWSAuthenticationService.class);
    return this.aws;
  }

  private AWSAwareUserManagerConfigurationService getAWSAwareUserManagerConfigurationService() {
    if (this.configurationService != null) {
      return this.configurationService;
    }
    return Framework.getService(AWSAwareUserManagerConfigurationService.class);
  }

  public AWSAwareUserManager() {
    this.awsAuthenticationEnabled = getAWSAwareUserManagerConfigurationService()
        .getConfig().authenticateWithCognito;

    String rawBlackList = getAWSAwareUserManagerConfigurationService()
        .getConfig()
        .blacklistUsers;
    if (rawBlackList != null) {
      blacklistUsers.addAll(Arrays.asList(rawBlackList.split("\\s*,\\s*")));
    }

    LOG.error("Startup. AWS Authentication is "
        + (this.awsAuthenticationEnabled ? "enabled" : "disabled")
        + "\nblacklisting users: " + String.join(", ", blacklistUsers)
    );

    if (this.awsAuthenticationEnabled) {
      try {
        getAWSAuthenticationService().testConnection();
        this.awsConnectionSucceeded = true;
      } catch (MiscellaneousFailureException e) {
        LOG.error("AWS Connection failed. Authentication will fallback to local for this session");
      }
    }
  }

  @Override
  /** If the config option `authenticateWithCognito` is false, this simply delegates to the
   * default functionality (local auth)
   *
   * Otherwise, attempt to authenticate with Cognito. If the user exists (or was migrated),
   * also check that it exists locally (since this code does not yet provide a method to retrieve
   * a NuxeoPrincipal from Cognito directory data)
   */
  public boolean checkUsernamePassword(String username, String password) {

    if (!this.awsAuthenticationEnabled) {
      return super.checkUsernamePassword(username, password);
    }

    if (!this.awsConnectionSucceeded) {
      return super.checkUsernamePassword(username, password);
    }

    if (this.blacklistUsers.contains(username)) {
      LOG.info("skipping Cognito check for blacklisted user: " + username);
      return super.checkUsernamePassword(username, password);
    }

    try {
      if (getAWSAuthenticationService().authenticate(username, password)) {
        /* AWS Authentication succeeded, but we only consider this a success if the local user
        actually exists */
        return this.getPrincipal(username) != null;
      } else {
        // The user failed to authenticate

        if (getAWSAuthenticationService().userExists(username)) {
          // the user exists in AWS, so they must have forgotten the password
          return false;
        }

        // the user does not exist yet in Cognito. Do they exist locally with this password?
        if (super.checkUsernamePassword(username, password)) {
          // yes, so migrate them
          try {
            getAWSAuthenticationService().migrateUser(
                username,
                password,
                this.getPrincipal(username).getEmail()
            );
          } catch (InvalidMigrationException e) {
            LOG.warn("Migration failed", e);
          }
          return true;
        }

        return false;
      }
    } catch (MiscellaneousFailureException e) {
      LOG.error("An error occurred while verifying credentials with AWS Cognito."
          + " Falling back to local auth.");
      return super.checkUsernamePassword(username, password);
    }

  }

  /**
   * update the user's Cognito password in response to a reset password action
   */
  @Override
  public void updateUser(DocumentModel userModel, DocumentModel context) {
    // we must always update the local directory too, to satisfy checks in FVUserRegistration
    super.updateUser(userModel, context);

    if (!this.awsAuthenticationEnabled || !this.awsConnectionSucceeded) {
      return;
    }

    try (Session userDir = this.dirService.open(this.userDirectoryName, context)) {

      String schema = this.dirService.getDirectorySchema(this.userDirectoryName);
      String username = (String) userModel.getProperty(schema, userDir.getIdField());
      String password = (String) userModel.getProperty(schema, userDir.getPasswordField());
      try {
        if (this.blacklistUsers.contains(username)) {
          LOG.info("skipping Cognito update for blacklisted user: " + username);
          return;
        }
        getAWSAuthenticationService().updatePassword(username, password);
      } catch (MiscellaneousFailureException e) {
        // We don't handle this -- it will have been logged by the authentication service
      }

    }
  }

}
