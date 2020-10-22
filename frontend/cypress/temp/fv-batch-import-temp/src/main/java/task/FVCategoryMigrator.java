package task;

import common.ConsoleLogger;
import common.CsvLogWriter;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.FileHandler;
import mappers.CsvMapper;
import mappers.firstvoices.CategoryMigratorMapper;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.ParseException;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.spi.NuxeoClientException;
import reader.AbstractReader;
import reader.CsvReader;

/**
 * @author cstuart
 */
public class FVCategoryMigrator extends AbstractMigrator {

  protected CsvMapper mapper = null;
  protected String sharedCategoriesFolderName = "Shared Categories";
  Map<String, Document> cache = new HashMap<String, Document>();

  protected FVCategoryMigrator(CommandLine cmd, AbstractReader reader) {
    super(reader);

    mapper = new CategoryMigratorMapper();
    if (cmd.hasOption("limit")) {
      limit = Integer.valueOf(cmd.getOptionValue("limit"));
    }
    try {
      FileHandler fh = new FileHandler(
          new File(new File(cmd.getOptionValue("data-path")), "import.log").getAbsolutePath());
      log.addHandler(fh);
    } catch (SecurityException | IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    String csvFile = cmd.getOptionValue("csv-file");
    // Remove the .csv from the file to create a file_errors.csv
    csvFile = csvFile.substring(0, csvFile.length() - 4) + "_errors.csv";
    logWriter = new CsvLogWriter(csvFile);
  }

  public static void main(String[] argv)
      throws SQLException, ClassNotFoundException, ParseException {
    AbstractReader reader = null;
    // Handle command line option

    setOptions();

    options.addOption(
        Option.builder().longOpt("data-path").required().hasArg().desc("Where to get data from")
            .build());

    CommandLineParser parser = new DefaultParser();
    CommandLine commandLine = null;
    try {
      commandLine = parser.parse(options, argv);
    } catch (ParseException e) {
      e.printStackTrace();
      HelpFormatter formatter = new HelpFormatter();
      formatter.printHelp("Migrator", options);
      return;
    }
    if (CsvReader.enabledOptions(commandLine)) {
      reader = new CsvReader(commandLine);
    }
    // Connect to Nuxeo server
    String nuxeoPassword = commandLine.getOptionValue("nuxeo-password", "Administrator");
    String nuxeoUser = commandLine.getOptionValue("nuxeo-user", "Administrator");
    String nuxeoUrl = commandLine.getOptionValue("nuxeo-url");
    String domain = commandLine.getOptionValue("domain");
    new FVCategoryMigrator(commandLine, reader)
        .process(nuxeoUrl, nuxeoUser, nuxeoPassword, "/" + domain + "/Workspaces/");
  }

  @Override
  protected void processRow(NuxeoClient client) throws IOException {

    String dictionaryId = reader.getString("DICTIONARY_ID");

    // Only process shared categories (ones with empty dictionary id)
    if (dictionaryId.isEmpty()) {
      Map<String, Document> docs = null;

      String parentCategoryId = reader.getString("PARENT_CATEGORY");
      if (parentCategoryId.isEmpty()) {
        // Create the category at the root of /Shared Data/Categories
        docs = getOrCreateSharedCategoriesFolder(client, reader);
      } else {
        // Create the category as a child of the specified parent category
        docs = getParentCategory(parentCategoryId, client, reader);
      }

      mapper.process(docs, client, reader);
      if (lines % 1 == 0) {
        ConsoleLogger.out("##### " + lines + " lines, " + errors + " errors, "
            + CategoryMigratorMapper.createdCategories + " Categories created, "
            + CategoryMigratorMapper.updatedCategories + " Categories updated, "
            + CategoryMigratorMapper.createdObjects + " objects created");
      }
    }
  }

  protected Map<String, Document> getOrCreateSharedCategoriesFolder(NuxeoClient client,
      AbstractReader reader)
      throws IOException {

    Document sharedCategoriesFolder = null;
    Document sectionSharedCategoriesFolder = null;

    root = client.schemas("*").repository().fetchDocumentByPath(sharedDataPath);
    sectionRoot = client.schemas("*").repository().fetchDocumentByPath(sectionSharedDataPath);

    try {
      // FV/Workspaces/SharedData/Shared Categories
      sharedCategoriesFolder = client.schemas("*").repository()
          .fetchDocumentByPath(sharedDataPath + sharedCategoriesFolderName);

      // FV/Sections/SharedData/Shared Categories
      sectionSharedCategoriesFolder = client.schemas("*").repository()
          .fetchDocumentByPath(sectionSharedDataPath + sharedCategoriesFolderName);

    } catch (NuxeoClientException e) {
      // Should use exists first but prefer to reduce number of network calls
      if (!e.getCause().getMessage().contains("DocumentNotFoundException")) {
        throw e;
      }
      sharedCategoriesFolder = Document.createWithName(sharedCategoriesFolderName, "FVCategories");
      sharedCategoriesFolder.setPropertyValue("dc:title", sharedCategoriesFolderName);
      sharedCategoriesFolder = client.operation("Document.Create").schemas("*")
          .input(root).param("type", sharedCategoriesFolder.getType())
          .param("name", sharedCategoriesFolder.getId())
          .param("properties", sharedCategoriesFolder).execute();

      // Publish Shared Categories folder to the section
      sectionSharedCategoriesFolder = client.operation("Document.Publish")
          .input(sharedCategoriesFolder).param("target", sectionSharedDataPath).execute();
    }

    cache.put("parent", sharedCategoriesFolder);
    cache.put(sectionCachePrefix + "parent", sectionSharedCategoriesFolder);

    return cache;
  }

  protected Map<String, Document> getParentCategory(String parentCategoryId, NuxeoClient client,
      AbstractReader reader)
      throws IOException {

    Document parentCategory = null;
    Document sectionParentCategory = null;

    try {
      parentCategory = client.schemas("*").repository().fetchDocumentByPath(
          sharedDataPath + sharedCategoriesFolderName + "/" + parentCategoryId);
    } catch (NuxeoClientException e) {
      // Should use exists first but prefer to reduce number of network calls
      if (!e.getCause().getMessage().contains("DocumentNotFoundException")) {
        throw e;
      }
    }

    try {
      sectionParentCategory = client.schemas("*").repository().fetchDocumentByPath(
          sectionSharedDataPath + sharedCategoriesFolderName + "/" + parentCategoryId);
    } catch (NuxeoClientException e) {
      // Should use exists first but prefer to reduce number of network calls
      if (!e.getCause().getMessage().contains("DocumentNotFoundException")) {
        throw e;
      }
    }

    //Map<String, Document> cache = new HashMap<String, Document>();
    cache.put("parent", parentCategory);
    cache.put(sectionCachePrefix + "parent", sectionParentCategory);

    return cache;
  }

}
