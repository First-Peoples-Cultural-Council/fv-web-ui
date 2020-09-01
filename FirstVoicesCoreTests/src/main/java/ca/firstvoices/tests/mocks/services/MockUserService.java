package ca.firstvoices.tests.mocks.services;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.PathRef;

public interface MockUserService {

  /**
   * Generates users at all access levels for a given dialect
   * @param session current session mock dialects are in
   * @param path path to dialect
   */
  void generateUsersForDialect(CoreSession session, PathRef path);

  /**
   * Generates users at all access levels for all dialects in the Test/Test directory
   * @param session current session mock dialects are in
   */
  void generateUsersForDialects(CoreSession session);

  /**
   * Removes users from a given dialect
   * @param session current session mock dialects are in
   * @param path path to dialect
   */
  void removeUsersForDialect(CoreSession session, PathRef path);

  /**
   * Removes users from all dialects in the Test/Test directory
   * @param session current session mock dialects are in
   */
  void removeUsersForDialects(CoreSession session);
}