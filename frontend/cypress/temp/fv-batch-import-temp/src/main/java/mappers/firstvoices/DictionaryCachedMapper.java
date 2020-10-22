/**
 *
 */

package mappers.firstvoices;

import common.ConsoleLogger;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import mappers.CsvMapper;
import org.nuxeo.client.objects.Document;

/**
 * @author dyona
 *
 */
public abstract class DictionaryCachedMapper extends CsvMapper {

  private static Map<String, Map<String, Document>> cache = null;
  protected String prefix = "";
  protected String currentCacheId = null;
  protected String cacheProperty = Properties.TITLE;

  protected DictionaryCachedMapper(String type, Object column) {
    super(type, column);
  }

  protected abstract String getCacheQuery();

  @Override
  protected boolean preCreate() {
    return true;
  }

  @Override
  protected Document getFromCache(Document doc) {
    currentCacheId = getInstanceCacheKey();
    if (!cache.containsKey(currentCacheId)) {
      return null;
    }
    String cacheKey = (String) doc.getDirtyProperties().get(cacheProperty);
    if (cacheKey != null && cache.get(currentCacheId).containsKey(cacheKey)) {
      return cache.get(currentCacheId).get(cacheKey);
    }
    return null;
  }

  protected String getInstanceCacheKey() {
    return getClass().getName() + documents.get("Dictionary").getId();
  }

  @Override
  protected void cacheDocument(Document doc) {
    cache.get(getInstanceCacheKey()).put(doc.getPropertyValue(cacheProperty), doc);
  }

  @Override
  public void buildCache() throws IOException {
    if (cache == null) {
      cache = new HashMap<String, Map<String, Document>>();
    }
    if (cache.containsKey(getInstanceCacheKey())) {
      return;
    }
    cache.put(getInstanceCacheKey(), new HashMap<String, Document>());
    loadCache(getCacheQuery());
    ConsoleLogger
        .out("Caching " + cache.get(getInstanceCacheKey()).size() + " " + getInstanceCacheKey());
  }

  public String getPrefix() {
    return prefix;
  }

  public void setPrefix(String prefix) {
    this.prefix = prefix;
  }

}
