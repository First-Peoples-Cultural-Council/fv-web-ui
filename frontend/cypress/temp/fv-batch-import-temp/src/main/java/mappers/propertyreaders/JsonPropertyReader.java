/**
 *
 */

package mappers.propertyreaders;

import org.nuxeo.client.objects.Document;
import reader.AbstractReader;

/**
 * @author loopingz
 *
 */
public abstract class JsonPropertyReader extends PropertyReader {

  public JsonPropertyReader(String key, Object column) {
    super(key, column);
  }

  public void read(Document document, AbstractReader reader) {
    setProperty(document, key, getJsonValue(reader));
  }
}
