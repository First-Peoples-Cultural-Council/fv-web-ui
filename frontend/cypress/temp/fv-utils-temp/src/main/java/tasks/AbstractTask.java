package tasks;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.cache.ResultCacheInMemory;

public class AbstractTask {

    protected static NuxeoClient client = null;
    protected static JCommander jc = null;

    @Parameter(description = "Task to execute (main parameter)", required = true)
    protected String task;

    @Parameter(names = { "-url" }, description = "Nuxeo URL to connect to", required = true)
    protected static String url;

    @Parameter(names = { "-username" }, description = "Username to connect with", required = true)
    protected String username;

    @Parameter(names = { "-password" }, description = "Password to connect with", required = true, password = true)
    protected String password;

    public AbstractTask() {
    }

    public NuxeoClient connect() {

        // Strip slash from end of URL
        if (url != null && url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }

        // Connect to Nuxeo instance
        client = new NuxeoClient.Builder()
                .cache(new ResultCacheInMemory())
                .url(url)
                .authentication(username, password)
                .connect();

        client.readTimeout(120).connectTimeout(120);

        return client;
    }

    protected void setupCommandLine(String programName, String[] argv) {

        // Create new command line builder
        jc = JCommander.newBuilder()
                .addObject(this)
                .build();

        jc.setProgramName(programName);

        // Parse arguments
        jc.parse(argv);

        // Show usage
        jc.usage();
    }

    protected void describeConnection() {
        System.out.println("***************");
        System.out.println("You are connected to: " + url + " with username " + username);
        System.out.println("***************");
    }
}
