/**
 *
 */

package mappers.firstvoices;

import common.ConsoleLogger;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import mappers.CsvMapper;
import mappers.propertyreaders.PropertyReader;
import org.nuxeo.client.objects.Document;

/**
 * @author dyona
 *
 */
public class SourcesMapper extends CsvMapper {

  private static Map<String, Map<String, Document>> cache = null;
  protected String currentCacheId = null;
  protected String cacheProperty = Properties.TITLE;
  private String linkKey;

  public SourcesMapper(int number) {
    super("FVContributor", Columns.CONTRIBUTOR + "_" + number);
    propertyReaders.add(new PropertyReader(Properties.SOURCE, Columns.CONTRIBUTOR + "_" + number));
  }

  public SourcesMapper() {
    super("FVContributor", Columns.CONTRIBUTOR);
    parentKey = "Contributors";
    linkKey = Properties.SOURCE;
    propertyReaders.add(new PropertyReader(Properties.TITLE, Columns.CONTRIBUTOR));
  }

  public SourcesMapper(String column) {
    super("FVContributor", column);
    parentKey = "Contributors";
    linkKey = Properties.SOURCE;
    propertyReaders.add(new PropertyReader(Properties.TITLE, Columns.CONTRIBUTOR));
  }

  public SourcesMapper(String linkKey, String column) {
    super("FVContributor", column);
    parentKey = "Contributors";
    this.linkKey = linkKey;
    propertyReaders.add(new PropertyReader(Properties.TITLE, column));
  }

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
    cache.get(getInstanceCacheKey()).put(doc.getTitle(), doc);
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

  protected String getCacheQuery() {
    // Include all contributors from Dialect
    return "SELECT * FROM FVContributor WHERE ecm:parentId='" + documents.get("Contributors")
        .getId() + "' AND ecm:isTrashed = 0";
  }

  private void updateMainDocumentReference(String linkKey, ArrayList<String> sourcesIds) {
    // Get current sources, and append new values if exists
    if (documents.get("current").getPropertyValue(linkKey) != null) {
      ArrayList<String> existingSourcesIds = documents.get("current").getPropertyValue(linkKey);
      sourcesIds.addAll(existingSourcesIds);
    }
    documents.get("current").setPropertyValue(linkKey, sourcesIds);
  }

  @Override
  protected Document createDocument(Document doc, Integer depth) throws IOException {
    String title = doc.getPropertyValue("dc:title");
    String value = "";
    Document remoteDoc = null;

    ArrayList<String> sourcesIds = new ArrayList<String>();

    String trimmedTitle = title.trim();

    Document fakeLookupDoc = Document.createWithName(trimmedTitle, "FVContributor");
    fakeLookupDoc.setPropertyValue("dc:title", trimmedTitle);

    Document cachedDoc = getFromCache(fakeLookupDoc);

    if (cachedDoc != null) {
      sourcesIds.add(cachedDoc.getId());
    } else {
      remoteDoc = super.createDocument(doc, depth);
      sourcesIds.add(remoteDoc.getId());
    }

    updateMainDocumentReference(linkKey, sourcesIds);
    return remoteDoc;
  }
}
