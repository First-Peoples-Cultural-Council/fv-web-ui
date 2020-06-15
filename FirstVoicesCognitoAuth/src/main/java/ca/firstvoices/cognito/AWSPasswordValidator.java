package ca.firstvoices.cognito;

import com.amazonaws.services.cognitoidp.model.PasswordPolicyType;

public class AWSPasswordValidator {

  private PasswordPolicyType ppt;

  public AWSPasswordValidator(PasswordPolicyType ppt) {
    this.ppt = ppt;
  }

  // these definitions taken from
  // https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html
  private static String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  private static String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static String NUMBERS = "0123456789";
  private static String SYMBOLS = "^$*.[]{}()?\"!@#%&/\\,><':;|_~`";
  private static String VALID_CHARS = LOWERCASE + UPPERCASE + NUMBERS + SYMBOLS + "+=";

  public boolean validatePassword(String password) {
    if (password == null) {
      return false;
    }

    //validate min length
    int minLength = ppt.getMinimumLength();
    if (minLength > 0) {
      if (password.length() < minLength) {
        return false;
      }
    }

    //validate all chars are in valid set
    if (!password.codePoints().mapToObj(ch -> String.valueOf(((char) ch)))
        .allMatch(VALID_CHARS::contains)) {
      return false;
    }

    //validate lowercase
    if (ppt.isRequireLowercase()) {
      if (password.codePoints().mapToObj(ch -> String.valueOf(((char) ch)))
          .noneMatch(LOWERCASE::contains)) {
        return false;
      }
    }

    //validate uppercase
    if (ppt.isRequireUppercase()) {
      if (password.codePoints().mapToObj(ch -> String.valueOf(((char) ch)))
          .noneMatch(UPPERCASE::contains)) {
        return false;
      }
    }

    //validate numbers
    if (ppt.isRequireNumbers()) {
      if (password.codePoints().mapToObj(ch -> String.valueOf(((char) ch)))
          .noneMatch(NUMBERS::contains)) {
        return false;
      }
    }

    //validate symbols
    if (ppt.isRequireSymbols()) {
      if (password.codePoints().mapToObj(ch -> String.valueOf(((char) ch)))
          .noneMatch(SYMBOLS::contains)) {
        return false;
      }
    }

    return true;
  }

}
