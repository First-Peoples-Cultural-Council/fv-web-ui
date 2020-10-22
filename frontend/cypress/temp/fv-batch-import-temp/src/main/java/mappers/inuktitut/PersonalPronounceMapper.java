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
public class PersonalPronounceMapper extends CsvMapper {

  public PersonalPronounceMapper() {
    super("INPersonalPronounce", 0);
    propertyReaders.add(new PropertyReader("dc:title", 0));

    propertyReaders.add(new PropertyReader("inpersonalpronounce:grammatical_person", 2));
    propertyReaders.add(new PropertyReader("inpersonalpronounce:grammatical_number", 3));
    propertyReaders.add(new PropertyReader("inpersonalpronounce:grammatical_case", 4));

    propertyReaders.add(new UniqueTranslationReader("english", 8));
    propertyReaders.add(new PropertyReader("inmorphem:morphology", 9));
    // None for now ?
    //propertyReaders.add(new PropertyReader("inmorphem:morphology_notes", 9));

    subdocuments.add(new SampleMapper(10));
    subdocuments.add(new SampleMapper(13));
    subdocuments.add(new SampleMapper(16));
  }

}
