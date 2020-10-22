/**
 *
 */

package mappers.inuktitut;

import java.util.Arrays;
import mappers.propertyreaders.PropertyReader;
import reader.AbstractReader;

/**
 * @author loopingz
 *
 */
public class AttachmentPropertyReader extends PropertyReader {

  public AttachmentPropertyReader(String key, Object column) {
    super(key, column);
    // TODO Auto-generated constructor stub
  }

  @Override
  public String getValue(AbstractReader reader) {
    String value = (String) super.getValue(reader);
    if (value == null) {
      return value;
    }
    String[] dict = {"singular", "dual", "plural", "None"};
    for (String key : dict) {
      if (value.contains(key)) {
        return key;
      }
    }
    throw new RuntimeException(
        "Should contain values from : " + String.join(",", Arrays.asList(dict)));
  }

}
