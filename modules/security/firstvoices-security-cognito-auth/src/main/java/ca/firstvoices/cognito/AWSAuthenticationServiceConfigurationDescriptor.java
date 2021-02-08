package ca.firstvoices.cognito;

import org.nuxeo.common.xmap.annotation.XNode;
import org.nuxeo.common.xmap.annotation.XObject;

@XObject("configuration")
public class AWSAuthenticationServiceConfigurationDescriptor {

  @XNode("enable") public boolean enable;

  @XNode("userPool") public String userPool;

  @XNode("accessKey") public String accessKey;

  @XNode("secretKey") public String secretKey;

  @XNode("clientID") public String clientID;

  @XNode("region") public String region;

  @Override
  public String toString() {
    return "AWSAuthenticationServiceConfigurationDescriptor{" + "enable=" + enable + ", userPool='"
        + userPool + "', accessKey='" + accessKey + '\'' + ", secretKey='" + "REDACTED, length=" + (
        secretKey != null
            ? secretKey.length()
            : "NULL") + '\'' + ", clientID='" + clientID + '\'' + ", region='" + region + '\''
        + '}';
  }
}
