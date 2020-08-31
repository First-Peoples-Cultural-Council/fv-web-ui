package ca.firstvoices.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

/**
 * Simple Principal Entity is intended to represent a simplified view of any user in FirstVoices
 * It is mostly to be used by an enricher or marshaller to represent a sub-document
 * It should reference fields that are relevant to all types
 */
public class SimplePrincipalEntity {

  @JsonProperty("firstName")
  private final String firstName;

  @JsonProperty("lastName")
  private final String lastName;

  @JsonProperty("email")
  private final String email;

  public SimplePrincipalEntity(NuxeoPrincipal user) {
    this.firstName = user.getFirstName();
    this.lastName = user.getLastName();
    this.email = user.getEmail();
  }

  public SimplePrincipalEntity(String email) {
    this.firstName = "";
    this.lastName = "";
    this.email = email;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public String getEmail() {
    return email;
  }
}
