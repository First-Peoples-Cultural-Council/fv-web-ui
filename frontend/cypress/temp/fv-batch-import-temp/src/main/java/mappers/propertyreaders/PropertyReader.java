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
public class PropertyReader {

  protected Object column;
  protected String key;

  public PropertyReader(String key, Object column) {
    this.column = column;
    this.key = key;
  }

  public String getKey() {
    return key;
  }

  public Object getValue(AbstractReader reader) {
    return reader.getString(column);
  }

  protected void setProperty(Document doc, String property, String value) {
    if (value == null || value.isEmpty()) {
      return;
    }
    System.out.println(
        "   * Setting value: '" + property + "' to '" + value + "' on doc '" + doc.getName()
            + "'");
    doc.setPropertyValue(property, value);
  }

  protected void setProperty(Document doc, String property, Object value) {
    if (value == null || value.toString().isEmpty()) {
      return;
    }
    System.out.println(
        "   * Setting value: '" + property + "' to '" + value.toString() + "' on doc '" + doc
            .getName() + "'");
    doc.setPropertyValue(property, value);
  }

  public String getJsonValue(AbstractReader reader) {
    return "\"" + ((String) getValue(reader)).replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
  }

  public void read(Document document, AbstractReader reader) {
    setProperty(document, key, getValue(reader));
  }
}
