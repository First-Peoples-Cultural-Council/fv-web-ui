package ca.firstvoices.tests.mocks.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.platform.usermanager.UserManager;

public interface MockUserService {

  /**
   * Generates users at all access levels for a given dialect
   *
   * @param session current session mock dialects are in
   * @param path    path to dialect
   */
  void generateUsersForDialect(CoreSession session, UserManager userManager, PathRef path);

  /**
   * Generates users at all access levels for all dialects in the Test/Test directory
   *
   * @param session current session mock dialects are in
   */
  void generateUsersForDialects(CoreSession session, UserManager userManager);

  /**
   * Removes users from a given dialect
   *
   * @param session     current session mock dialects are in
   * @param dialectName name of the dialect to remove users from
   */
  void removeUsersForDialect(CoreSession session, UserManager userManager, String dialectName);

  /**
   * Removes users from all dialects in the Test/Test directory
   *
   * @param session current session mock dialects are in
   */
  void removeUsersForDialects(CoreSession session, UserManager userManager);
}