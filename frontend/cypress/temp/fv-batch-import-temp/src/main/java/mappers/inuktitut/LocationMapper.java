/**
 *
 */

package mappers.inuktitut;

import mappers.CsvMapper;
import mappers.propertyreaders.PropertyReader;
import mappers.propertyreaders.UniqueTranslationReader;

/**
 * @author loopingz
 *
 */
public class LocationMapper extends CsvMapper {

  public LocationMapper() {
    super("INPlaceLocation", 0);
    propertyReaders.add(new PropertyReader("dc:title", 0));

    propertyReaders.add(new PropertyReader("inplacelocation:class", 2));
    propertyReaders.add(new PropertyReader("inplacelocation:grammatical_case", 4));
    // 2: possessor or not
    // 3: grammatical person ( 4 number )
    propertyReaders.add(new UniqueTranslationReader("english", 7));
    propertyReaders.add(new PropertyReader("inmorphem:morphology", 8));
    propertyReaders.add(new PropertyReader("inmorphem:morphology_notes", 9));

    subdocuments.add(new SampleMapper(10));
    subdocuments.add(new SampleMapper(13));
    subdocuments.add(new SampleMapper(16));
    subdocuments.add(new SampleMapper(19));
    subdocuments.add(new SampleMapper(22));
  }

}
