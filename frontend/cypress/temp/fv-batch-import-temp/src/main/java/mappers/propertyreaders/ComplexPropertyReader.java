/**
 *
 */

package mappers.propertyreaders;

import java.util.LinkedHashSet;
import org.nuxeo.client.objects.Document;
import reader.AbstractReader;

/*
@author loopingz
Read a complex property
*/

public class ComplexPropertyReader extends JsonPropertyReader {

  protected LinkedHashSet<PropertyReader> readers = null;

  public ComplexPropertyReader(Object column, LinkedHashSet<PropertyReader> readers) {
    super("", column);
    this.readers = readers;
  }

  public ComplexPropertyReader(String property, Integer column,
      LinkedHashSet<PropertyReader> readers) {
    super(property, column);
    this.readers = readers;
  }

  @Override
  public String getJsonValue(AbstractReader reader) {
    if (reader.getString(column).isEmpty()) {
      return null;
    }
    if (readers.size() == 0) {
      return "{}";
    }
    String result = "{";
    for (PropertyReader propertyReader : readers) {
      result += "\"" + propertyReader.key + "\":" + propertyReader.getJsonValue(reader) + ",";
    }
    // Remove last comma
    result = result.substring(0, result.length() - 1);
    result += "}";
    return result;
  }

  @Override
  public void read(Document document, AbstractReader reader) {
    if (reader.getString(column).isEmpty()) {
      return;
    }
    super.read(document, reader);
  }
}
