/**
 *
 */

package task;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import common.CsvLogWriter;
import common.SkipRowException;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.FileHandler;
import java.util.logging.Logger;
import mappers.CsvMapper;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.cache.ResultCacheInMemory;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.objects.Repository;
import org.nuxeo.client.spi.NuxeoClientException;
import reader.AbstractReader;
import reader.CsvReader;

/*
@author loopingz
TODO: Remove portions of code that are related to setting up the dialect/etc - some commented.
 */
public abstract class AbstractMigrator {

  protected static JCommander jc = null;
  @Parameter(names = {"-url"}, description = "Nuxeo URL to connect to", required = true)
  protected static String url;
  @Parameter(names = {"-username"}, description = "Username to connect with", required = true)
  protected static String username;
  @Parameter(names = {
      "-password"}, description = "Password to connect with", required = true, password = true)
  protected static String password;
  @Parameter(names = {"-domain"}, description = "Nuxeo Domain to operate within", required = true)
  protected static String domain;
  @Parameter(names = {"-limit"}, description = "Limit the number of lines to process")
  protected static int limit = 0;
  @Parameter(names = {
      "-dialect-id"}, description = "The GUID of the dialect to input the entries into",
      required = true)
  protected static String dialectID;
  @Parameter(names = {
      "-language-path"}, description = "The path to the language rooted at /FV/Workspaces/Data/")
  protected static String languagePath;
  @Parameter(names = {"-csv-file"}, description = "Path to CSV file", required = true)
  protected static String csvFile;
  @Parameter(names = {"-data-path"}, description = "Path to media files")
  protected static String blobDataPath;
  @Parameter(names = {
      "-skipValidation"}, description = "Allows you to skip the validation and process valid "
      + "records")
  protected static Boolean skipValidation = false;
  @Parameter(names = {
      "-localCategories"}, description = "Allows you to skip the validation and process valid "
      + "records")
  protected static Boolean localCategories = false;
  static Options options = new Options();
  protected int lines = 0;
  protected int wordCount = 0;
  protected NuxeoClient client;
  protected Document root = null;
  protected String rootPath = null;
  protected String dataPath = null;
  protected String sharedDataPath = null;
  protected Document sectionRoot = null;
  protected String sectionRootPath = null;
  protected String sectionDataPath = null;
  protected String sectionSharedDataPath = null;
  // Prefix used to distinguish Section documents in the cache
  protected String sectionCachePrefix = "SECTION_";
  protected int errors = 0;
  protected Logger log = Logger.getLogger("Migrator");
  protected AbstractReader reader = null;
  protected Map<String, Document> folderDocumentsCache = new HashMap<String, Document>();
  protected Map<String, Map<String, Document>> baseDocumentsCache = new HashMap<String,
      Map<String, Document>>();
  protected String familyDocumentType = "FVLanguageFamily";
  protected String languageDocumentType = "FVLanguage";
  protected String dialectDocumentType = "FVDialect";
  protected CsvLogWriter logWriter = null;
  protected boolean isDialectNewlyCreated = false;
  protected String sharedCategoriesID = null;


  protected AbstractMigrator(AbstractReader reader) {
    this.reader = reader;
  }

  protected static void setOptions() {

    CsvReader.addOptions(options);
    options.addOption(
        Option.builder().longOpt("nuxeo-url").hasArg().required().desc("Nuxeo URL to connect to")
            .build());
    options.addOption(Option.builder().longOpt("nuxeo-user").hasArg()
        .desc("Nuxeo User to connect with (default: Administrator)").build());
    options.addOption(Option.builder().longOpt("nuxeo-password").hasArg()
        .desc("Nuxeo Password to connect with (default: Administrator)").build());
    options.addOption(
        Option.builder().longOpt("dialect-id").hasArg().required()
            .desc("The GUID of the dialect to input the entries into").build());
    options.addOption(
        Option.builder().longOpt("username").hasArg()
            .desc("The username to apply to the created documents").build());
    options.addOption(
        Option.builder().longOpt("domain").hasArg().required()
            .desc("Nuxeo Domain to operate within").build());
    options.addOption(
        Option.builder().longOpt("limit").hasArg().desc("Limit the number of lines to process")
            .build());
  }

  protected abstract void processRow(NuxeoClient client) throws IOException;

  public void process(String nuxeoUrl, String nuxeoUser, String nuxeoPassword, String rootPath) {
    this.rootPath = rootPath;
    dataPath = rootPath + "Data/";
    sharedDataPath = rootPath + "SharedData/";

    // TODO: handle this better
    String domain = rootPath.split("/Workspaces/")[0];
    sectionRootPath = domain + "/sections";
    sectionDataPath = sectionRootPath + "/Data/";
    sectionSharedDataPath = sectionRootPath + "/SharedData/";

    reader.open();

    String connection = nuxeoUrl + " with " + nuxeoUser + "/";
    for (int i = 0; i < nuxeoPassword.length(); i++) {
      connection += "*";
    }

    try {
      System.out.println("Starting connection to Nuxeo: " + connection);

      // Connect to Nuxeo instance
      client = new NuxeoClient.Builder()
          .cache(new ResultCacheInMemory())
          .url(nuxeoUrl)
          .authentication(username, password)
          .connect();

      client.readTimeout(180).connectTimeout(180);

      try {
        root = client.schemas("*").repository().fetchDocumentByPath(dataPath);
        sectionRoot = client.schemas("*").repository().fetchDocumentByPath(sectionDataPath);

        // Print the name out
        while (reader.next()) {
          lines++;
          if (limit > 0 && lines > limit) {
            lines--;
            break;
          }
          try {
            processRow(client);
          } catch (SkipRowException | NuxeoClientException e) {
            e.printStackTrace();
            //    if (!(e instanceof SkipRowException)) {
            errors++;
            //    }
            if (logWriter != null) {
              // Save row to another CSV
              logWriter.writeLine(reader.getRow(), e.getMessage());
            }
            log.warning(
                e.getClass().getName() + ": " + e.getMessage() + " for " + reader.printRow());
          }
        }
      } finally {
        if (reader != null) {
          reader.close();
        }
      }
      /**
       * Prepare Photo
       */

    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } finally {
      if (client != null) {
        client.disconnect();
      }
      if (logWriter != null) {
        // Save row to another CSV
        logWriter.close();
      }
    }
  }

  protected String getId(String id) {
    return id.replace("/", "_");
  }

  protected void setProperty(Document doc, String property, String value) {
    if (value == null || value.isEmpty()) {
      return;
    }
    doc.setPropertyValue(property, value);
  }

  protected Map<String, Document> getOrCreateLanguageDocument(NuxeoClient client,
      AbstractReader reader)
      throws IOException {
    return getOrCreateLanguageDocument(client, null, null, null);
  }

  protected Map<String, Document> getOrCreateLanguageDocument(NuxeoClient client, String family,
      String lang, String dialect)
      throws IOException {

    // If path to language is given as a parameter then get the ID and set dialectID to that ID
    if (languagePath != null) {
      Repository repository = client.repository();
      Document folder = repository.fetchDocumentByPath("/FV/Workspaces/Data/" + languagePath);
      dialectID = folder.getUid();
    }

    String cacheKey = dialectID;
    String key = null;

    if (baseDocumentsCache.containsKey(cacheKey)) {
      return baseDocumentsCache.get(cacheKey);
    }

    Document dialectDoc = null;
    Document sectionDialectDoc = null;

    key += dialectID;

    try {
      if (!folderDocumentsCache.containsKey(key)) {
        dialectDoc = client.schemas("*").repository().fetchDocumentById(dialectID);
        folderDocumentsCache.put(key, dialectDoc);

      } else {
        dialectDoc = folderDocumentsCache.get(key);
      }

    } catch (NuxeoClientException e) {
      e.printStackTrace();
    }

    Map<String, Document> cache = new HashMap<String, Document>();

    // Add dialect document to cache
    cache.put("Dialect", dialectDoc);

    // Add SharedData directory to cache
    cache.put("Shared Data", client.schemas("*").repository().fetchDocumentByPath(sharedDataPath));

    // Add Shared Categories to cache
    cache.put("Shared Categories",
        client.schemas("*").repository()
            .fetchDocumentByPath(sharedDataPath + "Shared Categories"));

    // Set sharedCategoriesID variable for use by FVWordMigrator
    sharedCategoriesID = cache.get("Shared Categories").getUid();

    // Add dialect children to cache
    assert dialectDoc != null;
    Documents dialectChildren = client.schemas("*").repository()
        .fetchChildrenById(dialectDoc.getId());

    for (Document dialectChild : dialectChildren.getDocuments()) {
      cache.put(dialectChild.getTitle(), dialectChild);
    }

    baseDocumentsCache.put(cacheKey, cache);
    return cache;
  }

  protected void setupErrorOutputFiles(String csvFileLocation) {
    // Set tag
    File csvFileWrapper = new File(csvFile);

    try {
      FileHandler fh = new FileHandler(
          new File(new File(csvFileWrapper.getParent()), "import.log").getAbsolutePath());
      log.addHandler(fh);
    } catch (SecurityException | IOException e) {
      e.printStackTrace();
    }

    // Create tag based on date and CSV file
    CsvMapper.setTag(LocalDate.now().toString() + "_" + csvFileWrapper.getName());

    // Remove the .csv from the file to create a file_errors.csv
    logWriter = new CsvLogWriter(csvFile.substring(0, csvFile.length() - 4) + "_errors.csv");
  }

  protected void buildCommandLine(String migratorName, Object migrator, String[] argv) {
    // Create new command line builder
    jc = JCommander.newBuilder()
        .addObject(migrator)
        .build();

    jc.setProgramName(migratorName);

    // Parse arguments
    jc.parse(argv);

    // Show usage
    jc.usage();
  }

  protected void setReader(AbstractReader reader) {
    this.reader = reader;
  }
}
