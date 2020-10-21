package mappers.firstvoices.portal;

import common.ConsoleLogger;
import java.io.IOException;
import mappers.firstvoices.DictionaryCachedMapper;
import mappers.firstvoices.Properties;
import mappers.propertyreaders.PropertyReader;
import org.nuxeo.client.objects.Document;


public class PortalMigratorMapper extends DictionaryCachedMapper {

  public static int createdPortals = 0;
  public static int updatedPortals = 0;
  protected String portalTitle = "Portal";


  public PortalMigratorMapper() {
    super("FVPortal", "DIALECT_ID");
    parentKey = "Dialect";
    cacheProperty = Properties.TITLE;

    propertyReaders.add(new PropertyReader("fv-portal:about", "PORTAL_ABOUT_TEXT"));
    propertyReaders.add(new PropertyReader("fv-portal:greeting", "PORTAL_GREETING"));
    propertyReaders.add(new PropertyReader(Properties.IMPORT_ID, "DIALECT_ID"));

    subdocuments.add(new FeaturedWordsMapper("FIRST_WORD_ONE_ID"));
    subdocuments.add(new FeaturedWordsMapper("FIRST_WORD_TWO_ID"));
    subdocuments.add(new FeaturedWordsMapper("FIRST_WORD_THREE_ID"));
    subdocuments.add(new FeaturedWordsMapper("FIRST_WORD_FOUR_ID"));
    subdocuments.add(new FeaturedWordsMapper("FIRST_WORD_FIVE_ID"));

    subdocuments.add(new PortalLogoMapper());
    subdocuments.add(new PortalAudioMapper());

    subdocuments.add(new BackgroundTopImageMapper());
    subdocuments.add(new BackgroundBottomImageMapper());


  }

  @Override
  protected Document createDocument(Document doc, Integer depth) throws IOException {
    // Set title here so it will be found in the cache
    doc.setPropertyValue("dc:title", portalTitle);
    Document result = getFromCache(doc);
    if (!fakeCreation && result == null) {
      result = client.operation("Document.Create").schemas("*")
          .input(documents.get(parentKey)).param("type", doc.getType()).param("name", portalTitle)
          .param("properties", doc).execute();

      tagAndUpdateCreator(result, doc);

      createdObjects++;
      createdPortals++;
      cacheDocument(result);

      publishDocument(result);

      // Portal was found in the cache
    } else {
      ConsoleLogger.out("Portal found in cache: " + result.getId() + " - updating.");
      result = client.operation("Document.Update").input(result).param("properties", doc)
          .execute();
      updatedPortals++;

      // If the parent document exists in the section, go ahead and publish the current document
      // to the section
      //if(documents.get("SECTION_" + parentKey) != null) {
      publishDocument(result);
      //}
    }
    if (depth == 1) {
      documents.put("main", result);
    }
    return result;
  }

  @Override
  protected String getCacheQuery() {
    return "SELECT * FROM FVPortal WHERE ecm:parentId='" + documents.get("Dialect").getId()
        + "' AND ecm:isTrashed = 0";
  }
}
