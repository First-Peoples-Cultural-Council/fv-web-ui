package tasks;

import com.beust.jcommander.Parameter;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;

public class AbstractImportTask extends AbstractTask {

    protected static CSVReader csvReader = null;

    @Parameter(names = { "-import-file" }, description = "File with user import information")
    private String importFile = "";

    protected void setupCSVInput() {

        // See https://www.callicoder.com/java-read-write-csv-file-opencsv/ for useful reference

        if (importFile != null) {

            if (!importFile.endsWith("/")) {
                importFile += "/";
            }


            try {
                Reader reader = Files.newBufferedReader(Paths.get(importFile));

                // Read CSV (skipping headers)
                csvReader = new CSVReaderBuilder(reader).withSkipLines(1).build();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    }

    public AbstractImportTask() {
        super();
    }
}
