/**
 *
 */

package mappers.inuktitut;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import mappers.CsvMapper;
import mappers.propertyreaders.PropertyReader;
import mappers.propertyreaders.UniqueTranslationReader;
import org.nuxeo.client.objects.Document;

/**
 * @author loopingz
 *
 */
public class VerbEndingMapper extends CsvMapper {

  protected static Map<String, Document> cache = null;

  public VerbEndingMapper() {
    super("INVerbEnding", 0);
    propertyReaders.add(new PropertyReader("dc:title", 0));
    propertyReaders.add(new PropertyReader("inverbending:transitivity", 2));
    propertyReaders.add(new PropertyReader("inverbending:grammatical_mood", 3));

    propertyReaders.add(new PropertyReader("inmorphem:morphology", 13));
    propertyReaders.add(new PropertyReader("inmorphem:morphology_notes", 14));
    propertyReaders.add(new GrammarPersonReader("inverbending:subject", 6));
    propertyReaders.add(new GrammarPersonReader("inverbending:object", 9));
    propertyReaders.add(new UniqueTranslationReader("english", 12));

    subdocuments.add(new SampleMapper(15));
    subdocuments.add(new SampleMapper(18));
    subdocuments.add(new SampleMapper(21));

    subdocuments.add(new VerbEndingVariationMapper(26));
    subdocuments.add(new VerbEndingVariationMapper(40));
    subdocuments.add(new VerbEndingVariationMapper(54));
    // 26 for variation 1
  }

  @Override
  public void buildCache() throws IOException {
    if (cache != null) {
      return;
    }
    cache = new HashMap<String, Document>();
    String query =
        "SELECT * FROM INVerbEnding WHERE ecm:parentId='" + documents.get("Dictionary").getId()
            + "'";
    loadCache(query);
    if (cache.size() > 0) {
      throw new RuntimeException(
          "Import on non-empty data is not handled by this type of importer");
    }
  }
}
