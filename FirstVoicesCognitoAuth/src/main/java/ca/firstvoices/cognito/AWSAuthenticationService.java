package ca.firstvoices.cognito;

import ca.firstvoices.cognito.exceptions.InvalidMigrationException;
import ca.firstvoices.cognito.exceptions.MiscellaneousFailureException;

/*
 * AWS Authentication high-level interface
 * */
public interface AWSAuthenticationService {

  /**
   * Test the connection to Cognito
   *
   * @throws MiscellaneousFailureException when misconfigured or otherwise unavailable. Callers
   *                                       are expected to handle this gracefully (eg by falling
   *                                       back to local auth)
   */
  void testConnection() throws MiscellaneousFailureException;

  /**
   * Check if the given username exists in AWS
   *
   * @return true when the user exists in Cognito, false otherwise
   **/
  boolean userExists(String username);

  /**
   * Initiate a username and password authentication flow with the given credentials.
   *
   * @return false when the username exists in Cognito and the password does not match,
   *         false when the username does not exist in Cognito and migration is disabled
   *         true otherwise
   * @throws MiscellaneousFailureException if a communication failure occurred or the migration
   *                                       script threw an Exception (possible when attempting to
   *                                       migrate a user that does not exist in Nuxeo)
   **/
  boolean authenticate(String username, String password) throws MiscellaneousFailureException;

  /**
   * Create a user with this username and password in the Cognito database
   *
   * @param username
   * @param password
   * @param email
   */
  void migrateUser(String username, String password, String email)
      throws MiscellaneousFailureException, InvalidMigrationException;

  /**
   * Update the existing Cognito user to have a new password
   *
   * @param username
   * @param password
   */
  void updatePassword(String username, String password) throws MiscellaneousFailureException;

}

