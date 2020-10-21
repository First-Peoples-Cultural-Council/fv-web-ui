# FirstVoices Batch Import #

The following scripts enable processing a CSV file and creating the appropriate documents and blob within FirstVoices.
It can be used to import words, phrases, songs, stories, alphabets and potentially more items into FirstVoices with audio, images and videos.

## IMPORTANT NOTE ##
Currently only FVWordMigrator has been tested and refactored.
Others will need more testing with data and may need some tweaking to run.

Tasks in standalone_tasks have been removed and are gradually being re-done in: https://github.com/First-Peoples-Cultural-Council/fv-utils

## How to Use ##
There are a number of 'Migrators' included that can be generated as runnable jar files.
To change which 'Migrator' is being used, update pom.xml, changing the mainClass in the maven-jar-plugin:

```
            <plugin> 
                <groupId>org.apache.maven.plugins</groupId> 
                <artifactId>maven-jar-plugin</artifactId>
                <configuration>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix>lib/</classpathPrefix>
                            <mainClass>*main.java.task/FVWordMigrator*</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
```

Run `mvn clean install` to generate the jar file (will be in target/fv-batch-import.x.x.x.jar)

To execute the batch upload for words, for example, run the following command:

```
java -Xmx1g -jar target/fv-batch-import-1.0.0.jar \
    -url "http://localhost:8080/nuxeo"
    -username YOUR_USER
    -domain FV
    -dialect-id 00f00f0-aef0-468f-adc7-d0e00000d09
    -csv-file
    /path/to/csv/words.csv
    -data-path
    /path/to/media/files/
    -password
```

You will be promoted for a password once you run the command.
Parameters will differ depending on the Migrator being executed; memory allocation on the size of the import.
The optional "-language-path" parameter will override the "-dialect-id" parameter by going to the path, getting the id from Nuxeo and using that instead.

## AbstractMigrator Parameters

-url = "Nuxeo URL to connect to", required = true)
	protected static String url;

-username = "Username to connect with", required = true)
	protected static String username;

-password = "Password to connect with", required = true, password = true)
	protected static String password;

-domain = "Nuxeo Domain to operate within", required = true)
    protected static String domain;

-limit = "Limit the number of lines to process")
    protected static int limit = 0;

-dialect-id = "The GUID of the dialect to input the entries into", required = true)
    protected static String dialectID;
    
-language-path = "The path to the language to input the entries into, rooted at /FV/Workspace/Data/")
    protected static String languagePath;

-csv-file = "Path to CSV file", required = true)
    protected static String csvFile;

-data-path = "Path to media files")
    protected static String blobDataPath;

-skipValidation = "Allows you to skip the validation and process valid records")
    protected static Boolean skipValidation = false;
    
-localCategories = "Allows you to specify use of local dialect categories for word uploads"
    protected static Boolean localCategories = false;
