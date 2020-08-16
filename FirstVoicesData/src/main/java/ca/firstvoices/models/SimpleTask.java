package ca.firstvoices.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import org.nuxeo.ecm.core.api.NuxeoPrincipal;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SimpleTask extends SimpleCoreEntity {

  private boolean isNew = false;
  private Object targetDoc;
  private NuxeoPrincipal requestedBy;
  private Date dateSubmitted;


  public boolean isNew() {
    return isNew;
  }

  public void setNew(boolean isNew) {
    this.isNew = isNew;
  }



}
