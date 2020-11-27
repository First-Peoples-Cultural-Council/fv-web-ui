package ca.firstvoices.simpleapi.security;

import ca.firstvoices.simpleapi.representations.User;

public interface UserContextStore {
  User getCurrentUser();

  void setCurrentUser(User user);

  void clear();
}
