package ca.firstvoices.simpleapi.exceptions.mappers;

public class ErrorResponseEntity {

  public ErrorResponseEntity(String reason) {
    this.reason = reason;
  }

  private String reason;

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }
}
