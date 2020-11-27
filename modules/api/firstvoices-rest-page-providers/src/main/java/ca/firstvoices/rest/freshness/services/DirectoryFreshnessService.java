package ca.firstvoices.rest.freshness.services;

/**
 * This service maintains an opaque identifier for each of these directories that can be used to
 * detect modification and trigger cache invalidation.
 */
public interface DirectoryFreshnessService {

  static final String FV_LABEL_DIRECTORY = "fv_labels";
  static final String FV_LABEL_CATEGORIES_DIRECTORY = "fv_label_category";

  /**
   * @param directoryName Use one of the interface constants to reference a specific directory
   * @return an opaque serial for this directory that will change if any entry is updated
   */
  String getSerial(final String directoryName);

  /**
   * Trigger an update of the serial associated with this directory (the serial can be a timestamp,
   * uuid, etc.). Implementations should keep it in state so that subsequent calls to getSerial
   * will return this value until updated again.
   *
   * @param directoryName Use one of the interface constants to reference a specific directory
   */
  void updateSerial(final String directoryName);
}
