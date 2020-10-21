/**
 *
 */

package mappers.firstvoices;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import mappers.CsvMapper;
import mappers.propertyreaders.PropertyReader;
import org.apache.commons.lang3.text.WordUtils;
import org.nuxeo.client.objects.Document;

/**
 * @author cstuart
 *
 */
public class CategoryMigratorMapper extends CsvMapper {

  public static int createdCategories = 0;
  public static int updatedCategories = 0;
  protected static Map<String, Document> cache = null;

  public CategoryMigratorMapper() {
    super("FVCategory", Columns.ID);
    // Parent document can either be the "Shared Categories" folder, or a parent category
    parentKey = "parent";
    propertyReaders.add(new PropertyReader(Properties.TITLE, Columns.CODE));
    propertyReaders.add(new PropertyReader(Properties.IMPORT_ID, Columns.ID));

    //subdocuments.add(new PictureMapper());
  }

  @Override
  protected Document getFromCache(Document doc) {
    if (cache.containsKey(doc.getDirtyProperties().get(Properties.IMPORT_ID))) {
      return cache.get(doc.getDirtyProperties().get(Properties.IMPORT_ID));
    }
    return null;
  }

  @Override
  protected void cacheDocument(Document doc) {
    cache.put(doc.getPropertyValue(Properties.IMPORT_ID), doc);
  }

  @Override
  public void buildCache() throws IOException {
    if (cache != null) {
      return;
    }
    cache = new HashMap<String, Document>();
    String query = "SELECT * FROM FVCategory WHERE ecm:isTrashed = 0 AND ecm:path STARTSWITH "
        + "'/FV/Workspaces'";
    loadCache(query);
  }

  @Override
  protected Document createDocument(Document doc, Integer depth) throws IOException {
    Document result = getFromCache(doc);

    // Perform some cleanup on the category title
    String cleanCategoryTitle = cleanupCategoryTitle(
        (String) doc.getDirtyProperties().get("dc:title"));
    doc.setPropertyValue("title", cleanCategoryTitle);

    // Category doesn't exist - create it
    if (!fakeCreation && result == null) {
      result = client.operation("Document.Create").schemas("*")
          .input(documents.get(parentKey)).param("type", doc.getType()).param("name", doc.getId())
          .param("properties", doc).execute();

      tagAndUpdateCreator(result, doc);

      createdObjects++;
      if (doc.getType().endsWith("Category")) {
        createdCategories++;
      }

      cacheDocument(result);

      publishDocument(result);

    }

    if (depth == 1) {
      documents.put("main", result);
    }
    return result;
  }

  protected String cleanupCategoryTitle(String categoryTitle) {
    // Remove leading "- " that appears in 2nd level categories
    String newCategoryTitle = categoryTitle.replace("- ", "");
    // Convert " / " to "/"
    newCategoryTitle = newCategoryTitle.replace(" / ", "/");
    // Capitalize words after " " and after "/"
    newCategoryTitle = WordUtils.capitalizeFully(newCategoryTitle, ' ', '/');
    return newCategoryTitle;
  }
}
