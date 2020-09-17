package ca.firstvoices.core.io.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PropertyException;
import org.nuxeo.ecm.core.api.model.Property;

public final class PropertyUtils {
  private PropertyUtils() {
    throw new IllegalStateException("Utility class");
  }

  public static List<String> getValuesAsList(DocumentModel doc, String key) {
    Property prop = doc.getProperty(key);

    if (!prop.isList()) {
      throw new PropertyException("Property is not of type list.");
    }

    String[] propValues = (String[]) prop.getValue();

    if (propValues != null) {
      return new ArrayList<>(Arrays.asList(propValues));
    } else {
      return new ArrayList<>();
    }
  }

  public static boolean isEmpty(DocumentModel doc, String key) {
    Property prop = doc.getProperty(key);

    if (prop.getValue() == null) {
      return true;
    }

    if (prop.isList()) {
      return getValuesAsList(doc, key).isEmpty();
    }

    if (prop.getType().isSimpleType()) {
      return "".equals(prop.getValue());
    }

    // If we can't determine the type, throw an exception
    throw new PropertyException("Can't determine if property is ");
  }
}
