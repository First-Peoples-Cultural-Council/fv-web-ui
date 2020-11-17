package ca.firstvoices.rest.freshness.services;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Simple in-memory UUID based implementation of the DirectoryFreshnessService. Uses UUIDs as
 * serials.
 *
 * <p>May not work well in clustered environments if sticky-sessions are disabled (in which case
 * a more robust mechanism involving database or distributed-cache storage should be preferred).
 * </p>
 */
public class DirectoryFreshnessServiceHashMapImpl implements DirectoryFreshnessService {

  private final Map<String, String> serials = new HashMap<>();

  @Override
  public String getSerial(final String directoryName) {
    if (!serials.containsKey(directoryName)) {
      updateSerial(directoryName);
    }

    return serials.get(directoryName);
  }

  @Override
  public void updateSerial(final String directoryName) {
    serials.put(directoryName, UUID.randomUUID().toString());
  }
}
