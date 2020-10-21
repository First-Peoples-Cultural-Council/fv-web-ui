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
public class NounMapper extends CsvMapper {

  public NounMapper() {
    super("INNounEnding", 0);
    propertyReaders.add(new PropertyReader("dc:title", 0));
    propertyReaders.add(new AttachmentPropertyReader("innounending:attachment", 5));
    propertyReaders.add(new PropertyReader("innounending:grammatical_case", 3));

    propertyReaders.add(new PropertyReader("inmorphem:morphology", 7));
    propertyReaders.add(new PropertyReader("inmorphem:morphology_notes", 8));
    propertyReaders.add(new UniqueTranslationReader("english", 6));

    subdocuments.add(new SampleMapper(9));
    subdocuments.add(new SampleMapper(12));
    subdocuments.add(new SampleMapper(15));
  }

}
