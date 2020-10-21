/**
 *
 */

package mappers.propertyreaders;

import org.nuxeo.client.objects.Document;

/**
 * @author loopingz
 *
 */
public class TrueFalsePropertyReader extends PropertyReader {

  public TrueFalsePropertyReader(String key, Object reader) {
    super(key, reader);
  }

  protected void setProperty(Document doc, String property, String value) {
    if (value == null) {
      value = "true";
    }

    switch (value) {
      case "1":
        value = "true";
        break;

      case "0":
        value = "false";
        break;

      default:
        value = "true";
        break;
    }

    System.out.println(
        "   * Setting value: '" + property + "' to '" + value + "' on doc '" + doc.getName()
            + "'");
    doc.setPropertyValue(property, value);
  }

  protected void setProperty(Document doc, String property, Object value) {
    setProperty(doc, property, value.toString());
  }
}
