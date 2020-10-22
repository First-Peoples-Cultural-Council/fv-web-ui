/**
 *
 */

package mappers.propertyreaders;

import java.util.HashMap;
import java.util.LinkedHashSet;
import org.nuxeo.client.objects.Document;
import reader.AbstractReader;

/**
 @author loopingz
 Read a complex property
*/

public class NewComplexPropertyReader extends PropertyReader {

  protected LinkedHashSet<PropertyReader> readers = null;

  public NewComplexPropertyReader(Object column, LinkedHashSet<PropertyReader> readers) {
    super("", column);
    this.readers = readers;
  }

  public NewComplexPropertyReader(String property, Integer column,
      LinkedHashSet<PropertyReader> readers) {
    super(property, column);
    this.readers = readers;
  }

  @Override
  public HashMap<String, String> getValue(AbstractReader reader) {
    HashMap<String, String> resultMap = new HashMap<String, String>();

    if (reader.getString(column).isEmpty()) {
      return null;
    }
    if (readers.size() == 0) {
      return resultMap;
    }

    for (PropertyReader propertyReader : readers) {
      resultMap.put(propertyReader.key, (String) propertyReader.getValue(reader));
    }

    return resultMap;
  }

  @Override
  public void read(Document document, AbstractReader reader) {
    if (reader.getString(column).isEmpty()) {
      return;
    }
    setProperty(document, key, getValue(reader));
  }
}
