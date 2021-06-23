package ca.firstvoices.simpleapi.nuxeo;

import java.util.Set;

public interface SimpleAPINuxeoConfiguration {

  String getJwksUrl();

  Set<String> getDisabledEndpoints();

  Set<String> getAllowedSites();
}
