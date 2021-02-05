package ca.firstvoices.security.lockout;


import java.util.ArrayList;
import java.util.WeakHashMap;
import org.nuxeo.ecm.platform.usermanager.UserManagerImpl;


/**
 * Keep a record of login attempts in memory and lock accounts for a cooldown period if they exceed
 * the number of permitted failed attempts in a given timespan
 */

public class LockoutUserManager extends UserManagerImpl {

  private transient WeakHashMap<String, LoginAttemptRecord> loginAttempts = new WeakHashMap<>();

  public boolean isUserLocked(String username) {
    final LoginAttemptRecord record = loginAttempts.get(username);

    return record != null && record.isLocked();
  }

  @Override
  public boolean checkUsernamePassword(String username, String password) {

    LoginAttemptRecord record = loginAttempts.get(username);

    if (record != null && record.isLocked()) {
      return false;
    }

    if (super.checkUsernamePassword(username, password)) {
      // no need to keep the attempt records around if they succeeded
      loginAttempts.remove(username);

      return true;
    }

    // failed. log the attempt
    if (record == null) {
      record = new LoginAttemptRecord();
      loginAttempts.put(username, record);
    }

    record.logAttempt();

    return false;
  }


  private static class LoginAttemptRecord {

    private final ArrayList<Long> attempts = new ArrayList<>();

    public static final int LOCK_TIME = 5 * 60 * 1000; // 5 minutes in ms
    public static final int FAILED_ATTEMPTS_EXPIRY_TIME = 2 * 60 * 1000; // 2 minutes
    public static final int FAILED_ATTEMPTS_TO_LOCK = 3;

    private Long lockedAt = null;

    public void logAttempt() {

      long now = System.currentTimeMillis();

      // purge expired records
      attempts.removeIf(l -> (now - l) > FAILED_ATTEMPTS_EXPIRY_TIME);

      attempts.add(now);

      if (attempts.size() >= FAILED_ATTEMPTS_TO_LOCK) {
        attempts.clear();
        lockedAt = now;
      }
    }

    public boolean isLocked() {
      if (lockedAt == null) {
        return false;
      }
      long now = System.currentTimeMillis();

      if (now - lockedAt > LOCK_TIME) {
        this.lockedAt = null;
        return false;
      }

      return true;
    }

  }

}
