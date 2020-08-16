package ca.firstvoices.marshallers;

import org.nuxeo.ecm.automation.io.services.codec.AbstractMarshallingRegistryCodec;

public class SimpleTaskCodec extends AbstractMarshallingRegistryCodec<SimpleTaskAdapter> {

  public SimpleTaskCodec() {
    super(SimpleTaskAdapter.class, "tasks", SimpleTaskAdapterJSONReader.class,
        SimpleTaskAdapterJSONWriter.class);
  }
}

