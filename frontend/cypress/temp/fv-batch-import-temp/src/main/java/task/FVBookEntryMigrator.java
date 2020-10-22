package task;

import common.ConsoleLogger;
import common.CsvLogWriter;
import common.SkipRowException;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.FileHandler;
import mappers.CsvMapper;
import mappers.firstvoices.BinaryMapper;
import mappers.firstvoices.book.BookEntryMigratorMapper;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.ParseException;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import reader.AbstractReader;
import reader.CsvReader;

/**
 * @author cstuart
 */
public class FVBookEntryMigrator extends AbstractMigrator {

  protected CsvMapper mapper = null;
  Map<String, Document> bookDocumentCache = null;
  Map<String, Document> sectionBookDocumentCache = null;
  Map<String, Document> cache = new HashMap<String, Document>();

  protected FVBookEntryMigrator(CommandLine cmd, AbstractReader reader) {
    super(reader);

    BinaryMapper.setDataPath(cmd.getOptionValue("data-path"));

    mapper = new BookEntryMigratorMapper();

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
    new FVBookEntryMigrator(commandLine, reader)
        .process(nuxeoUrl, nuxeoUser, nuxeoPassword, "/" + domain + "/Workspaces/");
  }

  @Override
  protected void processRow(NuxeoClient client) throws IOException {
    Map<String, Document> docs = getOrCreateLanguageDocument(client, reader);

    docs.put("parent", getParentBook(client, reader));
    docs.put(sectionCachePrefix + "parent", getSectionParentBook(client, reader));

    mapper.process(docs, client, reader);
    ConsoleLogger.out("##### " + lines + " lines, " + errors + " errors, "
        + BookEntryMigratorMapper.createdBookEntries + " Book Entries created, "
        + BookEntryMigratorMapper.updatedBookEntries + " Book Entries updated, "
        + BookEntryMigratorMapper.createdObjects + " objects created");
  }

  protected Document getParentBook(NuxeoClient client, AbstractReader reader) throws IOException {
    if (bookDocumentCache == null) {
      bookDocumentCache = new HashMap<String, Document>();
      cacheBookDocuments(client);
    }
    Document parentBookDoc = bookDocumentCache.get(reader.getString("SENTRY_BOOK_ID"));
    if (parentBookDoc == null) {
      throw new SkipRowException("Skipping...missing parent Book document.");
    }

    return parentBookDoc;
  }

  protected Document getSectionParentBook(NuxeoClient client, AbstractReader reader)
      throws IOException {
    if (sectionBookDocumentCache == null) {
      sectionBookDocumentCache = new HashMap<String, Document>();
      cacheSectionBookDocuments(client);
    }
    return sectionBookDocumentCache.get(reader.getString("SENTRY_BOOK_ID"));
  }

  protected void cacheBookDocuments(NuxeoClient client) throws IOException {
    Integer page = 0;
    int pageSize = 1000;
    System.out.println("Loading Book document cache...");
    String query = "SELECT * FROM FVBook WHERE ecm:isTrashed = 0 AND ecm:path STARTSWITH "
        + "'/FV/Workspaces'";

    while (true) {
      Documents docs = client.operation("Repository.Query").schemas(
          "*")
          .param("query", query)
          .param("currentPageIndex", page).param("pageSize", pageSize).execute();
      for (int i = 0; i < docs.size(); i++) {
        String importId = (String) docs.getDocument(i).getProperties().get("fvl:import_id");
        bookDocumentCache.put(importId, docs.getDocument(i));
      }
      if (docs.size() < pageSize) {
        break;
      }
      page++;
    }
    ConsoleLogger.out("Caching " + bookDocumentCache.size() + " Book documents");

  }

  protected void cacheSectionBookDocuments(NuxeoClient client)
      throws IOException {
    Integer page = 0;
    int pageSize = 1000;
    System.out.println("Loading section Book document cache...");
    String query = "SELECT * FROM FVBook WHERE ecm:isTrashed = 0 AND ecm:path STARTSWITH "
        + "'/FV/sections'";

    while (true) {
      Documents docs = client.operation("Repository.Query").schemas(
          "*")
          .param("query", query)
          .param("currentPageIndex", page).param("pageSize", pageSize).execute();
      for (int i = 0; i < docs.size(); i++) {
        String importId = (String) docs.getDocument(i).getProperties().get("fvl:import_id");
        sectionBookDocumentCache.put(importId, docs.getDocument(i));
      }
      if (docs.size() < pageSize) {
        break;
      }
      page++;
    }
    ConsoleLogger.out("Caching " + sectionBookDocumentCache.size() + " section Book documents");

  }

}
