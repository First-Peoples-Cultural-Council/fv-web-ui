/**
 *
 */

package mappers.propertyreaders;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import org.nuxeo.client.objects.Document;
import reader.AbstractReader;

/**
 @author loopingz
 Read/Set array of property
*/

public class NewMultiValuedReader extends PropertyReader {

  protected LinkedHashSet<PropertyReader> readers = null;

  public NewMultiValuedReader(String key, PropertyReader reader) {
    super(key, 0);
    readers = new LinkedHashSet<>();
    if (reader != null) {
      readers.add(reader);
    }
  }

  public NewMultiValuedReader(String key, LinkedHashSet<PropertyReader> readers) {
    super(key, 0);
    this.readers = readers;
  }

  public ArrayList<Object> getArrayValue(AbstractReader reader) {

    ArrayList<Object> multiValueList = new ArrayList<Object>();

    Boolean first = true;
    for (PropertyReader propertyReader : readers) {
      Object value = propertyReader.getValue(reader);
      if (value == null || value.toString().isEmpty() || value.equals("\"\"")) {
        continue;
      }
      multiValueList.add(value);
    }

    return multiValueList;
  }

  @Override
  public void read(Document document, AbstractReader reader) {
    setProperty(document, key, getArrayValue(reader));
  }
}
