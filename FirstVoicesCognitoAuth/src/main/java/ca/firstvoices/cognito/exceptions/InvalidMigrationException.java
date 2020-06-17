package ca.firstvoices.cognito.exceptions;

public class InvalidMigrationException extends Exception {
  public InvalidMigrationException(String reason) {
    super(reason);
  }

  public InvalidMigrationException(Exception root) {
    super(root);
  }
}
