/**
 *
 */

package mappers.firstvoices;

import mappers.propertyreaders.PropertyReader;
import reader.AbstractReader;

/**
 * @author dyona
 *
 */
public class DominantLanguageReader extends PropertyReader {

  public DominantLanguageReader(Object column) {
    super("language", column);
  }

  @Override
  public String getValue(AbstractReader reader) {
    // Value should be lower case, to match the Nuxeo vocabulary ids
    String dominantLanguage = (String) super.getValue(reader);
    dominantLanguage = dominantLanguage.toLowerCase();
    if (dominantLanguage.isEmpty() || dominantLanguage.length() < 2
        || dominantLanguage == "nanaimo") {
      dominantLanguage = "english";
    }
    return dominantLanguage;
  }

}
