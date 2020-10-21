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
public class NounPossessionMapper extends CsvMapper {

  public NounPossessionMapper() {
    super("INNounEnding", 0);
    propertyReaders.add(new PropertyReader("dc:title", 0));
    propertyReaders.add(new AttachmentPropertyReader("innounending:attachment", 4));
    propertyReaders.add(new PropertyReader("innounending:grammatical_case", 6));
    // 2: possessor or not
    // 3: grammatical person ( 4 number )

    propertyReaders.add(new PropertyReader("inmorphem:morphology", 9));
    propertyReaders.add(new PropertyReader("inmorphem:morphology_notes", 10));
    propertyReaders.add(new UniqueTranslationReader("english", 8));

    subdocuments.add(new SampleMapper(11));
    subdocuments.add(new SampleMapper(14));
    subdocuments.add(new SampleMapper(17));
  }

}
