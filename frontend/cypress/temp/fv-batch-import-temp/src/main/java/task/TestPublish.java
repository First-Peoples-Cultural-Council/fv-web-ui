package task;

import common.CsvLogWriter;
import mappers.firstvoices.WordMapper;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.cache.ResultCacheInMemory;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.spi.NuxeoClientException;
import reader.CsvReader;

public class TestPublish {

  static CsvReader reader = null;
  static Options options = new Options();
  protected CsvLogWriter logWriter = null;
  protected int limit = 0;
  protected int lines = 0;
  protected int wordCount = 0;
  NuxeoClient client = null;
  WordMapper mapper;
  String rootPath = "";

  public TestPublish(CsvReader reader, CommandLine cmd) {

    // Setup log writer
    //String csvFile = cmd.getOptionValue("csv-file");
    //csvFile = csvFile.substring(0, csvFile.length()-4) + "_missing.csv";
    //logWriter = new CsvLogWriter(csvFile);

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

      try {

        try {

          Documents docs = client.operation("Repository.Query").schemas(
              "*")
              .param("query",
                  "SELECT * FROM FVDialect WHERE  ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0"
                      + " AND ecm:currentLifeCycleState = 'Published' ORDER BY dc:title ASC")
              .param("currentPageIndex", 0).param("pageSize", 100).execute();

          int i;
          int j;

          for (i = 0; i < docs.size(); i++) {

            for (int n = 0; n < 10; n++) {
              Documents words = client.operation("Repository.Query").schemas(
                  "*")
                  .param("query",
                      "SELECT * FROM FVWord WHERE ecm:isProxy = 0 AND ecm:currentLifeCycleState "
                          + "= 'Enabled' AND fva:dialect = '"
                          + docs.getDocument(i).getId() + "' ORDER BY dc:title ASC")
                  .param("currentPageIndex", 0).execute();

              System.out.println(docs.getDocument(i).getPath());
              System.out.println(words.size());

              for (j = 0; j < words.size(); j++) {

                //System.out.println(words.get(j).getPath());

                if (!"Published".equals(words.getDocument(j).getState())) {
                  client.operation("Document.FollowLifecycleTransition")
                      .input(words.getDocument(j))
                      .param("value", "Publish")
                      .execute();
                }

                if (j % 1000 == 0) {
                  System.out.println(j);
                }
              }
            }

            System.out.println(i);
          }

        } catch (NuxeoClientException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }

        //if (results != null && results.size() > 0) {
        //    System.out.println((int) results.get(0).get("COUNT(ecm:uuid)"));
        //}
      } catch (NuxeoClientException e) {
        e.printStackTrace();
      }

      if (client == null) {
        System.err.println("Can't open a client on Nuxeo Server");
        return;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }


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
    new TestPublish(reader, cmd);
  }
}
