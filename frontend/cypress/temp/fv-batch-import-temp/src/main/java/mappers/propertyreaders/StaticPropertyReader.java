/**
 *
 */

package mappers.propertyreaders;

import reader.AbstractReader;

/**
 * @author loopingz
 *
 */
public class StaticPropertyReader extends PropertyReader {

  protected String value;
  protected Boolean json = false;

  public StaticPropertyReader(String key, String value, Boolean json) {
    super(key, 0);
    this.value = value;
    this.json = json;
  }

  public StaticPropertyReader(String key, String value) {
    super(key, 0);
    this.value = value;
  }

  @Override
  public String getJsonValue(AbstractReader reader) {
    if (json) {
      return value;
    } else {
      return "\"" + value.replace("\\", "\\\\") + "\"";
    }
  }

}
