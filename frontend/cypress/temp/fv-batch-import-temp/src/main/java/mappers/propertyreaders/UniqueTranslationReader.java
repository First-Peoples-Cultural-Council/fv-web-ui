/**
 *
 */

package mappers.propertyreaders;

import java.util.LinkedHashSet;

/**
 * @author loopingz
 *
 */
public class UniqueTranslationReader extends TranslationReader {

  public UniqueTranslationReader(String language, Object column) {
    super("fv:literal_translation", null);
    LinkedHashSet<PropertyReader> set = new LinkedHashSet<>();
    set.add(new PropertyReader("translation", column));
    set.add(new StaticPropertyReader("language", language));
    readers.add(new ComplexPropertyReader(column, set));
  }
}
