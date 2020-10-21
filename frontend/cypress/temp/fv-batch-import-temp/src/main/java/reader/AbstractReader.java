/**
 *
 */

package reader;

import java.text.Normalizer;
import java.text.Normalizer.Form;

/**
 * @author loopingz
 *
 */
public abstract class AbstractReader {

  public abstract void open();

  public abstract boolean next();

  public abstract void close();

  public abstract String printRow();

  public abstract String[] getRow();

  protected String cleanString(String value) {
    if (value == null) {
      return "";
    }
    // Nuxeo is using NFC normalization
    if (!Normalizer.isNormalized(value, Form.NFC)) {
      value = Normalizer.normalize(value, Form.NFC);
    }

    // Remove backslash from end of string
    value = (value.endsWith("\\")) ? value.substring(0, value.length() - 1) : value;

    return value.replace("\n", "<br />").trim();
  }

  public String getString(Object id) {
    if (id instanceof String) {
      return getString((String) id);
    } else if (id instanceof Integer) {
      return getString((Integer) id);
    } else {
      throw new RuntimeException("Reader only handle String and Integer for now");
    }
  }

  public abstract String getString(String id);

  public abstract String getString(Integer col);

  public abstract Integer getInt(String id);

}
