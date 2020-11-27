package ca.firstvoices.cognito.exceptions;

public class MiscellaneousFailureException extends Exception {
  public MiscellaneousFailureException(Exception root) {
    super(root);
  }
}
