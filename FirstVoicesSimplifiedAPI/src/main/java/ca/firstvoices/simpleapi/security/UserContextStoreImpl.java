package ca.firstvoices.simpleapi.security;

import ca.firstvoices.simpleapi.representations.User;
import javax.inject.Singleton;

@Singleton
public class UserContextStoreImpl implements UserContextStore {

  private final ThreadLocal<User> currentUser = new ThreadLocal<>();

  @Override
  public User getCurrentUser() {
    return currentUser.get();
  }

  @Override
  public void setCurrentUser(User user) {
    currentUser.set(user);
  }

  @Override
  public void clear() {
    currentUser.remove();
  }


}
