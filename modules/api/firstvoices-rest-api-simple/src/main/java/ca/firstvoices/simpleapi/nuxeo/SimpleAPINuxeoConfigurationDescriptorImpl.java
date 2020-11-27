package ca.firstvoices.simpleapi.nuxeo;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import org.nuxeo.common.xmap.annotation.XNode;
import org.nuxeo.common.xmap.annotation.XObject;

@XObject("configuration")
public class SimpleAPINuxeoConfigurationDescriptorImpl implements SimpleAPINuxeoConfiguration {

  @XNode("jwksUrl")
  public String jwksUrl;

  @XNode("disabledEndpoints")
  public String disabledEndpoints;

  @Override
  public String getJwksUrl() {
    return jwksUrl;
  }

  @Override
  public Set<String> getDisabledEndpoints() {
    return Arrays.stream(disabledEndpoints.split(","))
        .map(String::trim)
        .collect(Collectors.toSet());
  }
}
