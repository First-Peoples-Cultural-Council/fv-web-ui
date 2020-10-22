/**
 *
 */

package mappers.inuktitut;

import common.ConsoleLogger;
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
public class SampleMapper extends CsvMapper {

  protected static Map<String, Document> cache = null;

  protected SampleMapper(Integer column) {
    super("INPhrase", column);
    propertyReaders.add(new PropertyReader("dc:title", column));
    propertyReaders.add(new UniqueTranslationReader("english", column + 1));
    // Source
    propertyReaders.add(new PropertyReader("dc:description", column + 2));
  }

  @Override
  protected Document getFromCache(Document doc) {
    String cacheKey = doc.getPropertyValue("dc:title");
    if (cache.containsKey(cacheKey)) {
      return cache.get(cacheKey);
    }
    return null;
  }

  @Override
  protected Document createDocument(Document doc, Integer depth)
      throws IOException {
    doc.setPropertyValue("inphrase:related_morpheme", documents.get("current").getId());
    doc = super.createDocument(doc, depth);
    return doc;
  }

  @Override
  protected void cacheDocument(Document doc) {
    cache.put(doc.getTitle(), doc);
  }

  @Override
  public void buildCache() throws IOException {
    if (cache != null) {
      return;
    }
    cache = new HashMap<String, Document>();
    String query =
        "SELECT * FROM INPhrase WHERE ecm:parentId='" + documents.get("Dictionary").getId() + "'";
    loadCache(query);
    ConsoleLogger.out("Caching " + cache.size() + " INPhrase");
  }

  @Override
  protected Boolean skipValue(String value) {
    if (value.equals("M.K.")) {
      return true;
    }
    return super.skipValue(value);
  }

}
