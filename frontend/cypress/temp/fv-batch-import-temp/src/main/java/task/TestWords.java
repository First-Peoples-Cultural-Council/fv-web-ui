package task;

import common.CsvLogWriter;
import java.io.IOException;
import java.util.Map;
import mappers.firstvoices.WordMapper;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.cache.ResultCacheInMemory;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.RecordSet;
import org.nuxeo.client.spi.NuxeoClientException;
import reader.CsvReader;

public class TestWords {

  protected static Map<String, Document> cache = null;
  static CsvReader reader = null;
  static Options options = new Options();
  protected CsvLogWriter logWriter = null;
  protected int limit = 0;
  protected int lines = 0;
  protected int wordCount = 0;
  NuxeoClient client = null;
  WordMapper mapper;
  String rootPath = "";

  public TestWords(CsvReader reader, CommandLine cmd) {

    // Setup log writer
    String csvFile = cmd.getOptionValue("csv-file");
    csvFile = csvFile.substring(0, csvFile.length() - 4) + "_missing.csv";
    logWriter = new CsvLogWriter(csvFile);

    if (cmd.hasOption("limit")) {
      limit = Integer.valueOf(cmd.getOptionValue("limit"));
    }

    String nuxeoPassword = cmd.getOptionValue("nuxeo-password", "Administrator");
    String nuxeoUser = cmd.getOptionValue("nuxeo-user", "Administrator");
    String nuxeoUrl = cmd.getOptionValue("nuxeo-url");
    String domain = cmd.getOptionValue("domain");

    rootPath = "/" + domain + "/Workspaces/";

    if (!nuxeoUrl.endsWith("/site/automation")) {
      nuxeoUrl += "/site/automation";
    }

    try {
      // Connect to Nuxeo instance
      client = new NuxeoClient.Builder()
          .cache(new ResultCacheInMemory())
          .url(nuxeoUrl)
          .authentication(nuxeoUser, nuxeoPassword)
          .connect();

      if (client == null) {
        System.err.println("Can't open a client on Nuxeo Server");
        return;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    // Setup mapper
    mapper = new WordMapper(client);

    try {
      mapper.buildCache();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }

    System.out.println("Cache loaded (" + cache.size() + " Records)");

    // process rows
    process();
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
        Option.builder().longOpt("domain").hasArg().required()
            .desc("Nuxeo Domain to operate within").build());
    options.addOption(
        Option.builder().longOpt("limit").hasArg().desc("Limit the number of lines to process")
            .build());
  }

  private static CommandLine getCommandLine(String[] argv) {
    CommandLineParser parser = new DefaultParser();
    CommandLine commandLine = null;

    options.addOption(
        Option.builder().longOpt("limit").hasArg().desc("Limit the number of lines to process")
            .build());

    try {
      commandLine = parser.parse(options, argv);
    } catch (ParseException e) {
      e.printStackTrace();
      System.out.println("Error parsing...");
    }

    return commandLine;
  }

  public static void main(String[] argv) {

    setOptions();

    CommandLine cmd = getCommandLine(argv);

    reader = new CsvReader(cmd);
    new TestWords(reader, cmd);
  }

  public int wordExists(String id) {
    try {
      RecordSet results = null;

      try {
        results = client.operation("Repository.ResultSetQuery").schemas(
            "dublincore")
            .param("query", "SELECT COUNT(ecm:uuid) FROM FVWord WHERE fvl:import_id = " + id
                + " AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0")
            .param("currentPageIndex", 0).param("pageSize", 1000).execute();
      } catch (NuxeoClientException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }

      if (results != null && results.getPageSize() > 0) {
        return Integer.parseInt(results.getUuids().get(0).get("COUNT(ecm:uuid)"));
      }
    } catch (NuxeoClientException e) {
      e.printStackTrace();
    }

    return 0;
  }

  public void process() {

    reader.open();

    try {

      while (reader.next()) {
        lines++;
        if (limit > 0 && lines > limit) {
          lines--;
          break;
        }

        try {

          String originalImportID = reader.getString("WORD_ID");

          int occurences = wordExists(originalImportID);

          System.out.println(occurences);

          if (occurences > 1) {
            logWriter.writeLine(reader.getRow(), "WARN: " + occurences + "occurences found");
          } else if (occurences == 0) {
            logWriter.writeLine(reader.getRow(), "ERROR: Missing word!");
          }
        } catch (NuxeoClientException e) {
          e.printStackTrace();
          System.out.println(
              e.getClass().getName() + ": " + e.getMessage() + " for " + reader.printRow());
        }
      }
    } catch (Exception e) {
      //
    } finally {

      if (client != null) {
        client.disconnect();
      }

      if (logWriter != null) {
        logWriter.writeLine(new String[]{"Lines", String.valueOf(lines)}, "ERROR: Missing word!");
        logWriter.close();
      }

      if (reader != null) {
        reader.close();
      }
    }
  }
}
