/**
 *
 */

package mappers.inuktitut;

import java.util.LinkedHashSet;
import mappers.propertyreaders.ComplexPropertyReader;
import mappers.propertyreaders.PropertyReader;

/**
 * @author loopingz
 *
 */
public class GrammarPersonReader extends ComplexPropertyReader {

  public GrammarPersonReader(String name, Integer column) {
    super(name, column, null);
    readers = new LinkedHashSet<>();
    readers.add(new PropertyReader("person", column));
    readers.add(new PropertyReader("number", column + 1));
    readers.add(new PropertyReader("change_of_subject", column + 2));
  }

}
