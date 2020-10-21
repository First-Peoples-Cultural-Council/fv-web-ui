package tasks.dictionary;

import com.beust.jcommander.Parameter;
import org.nuxeo.client.objects.Document;
import org.nuxeo.client.objects.Documents;
import org.nuxeo.client.objects.RecordSet;
import tasks.AbstractTask;
import tasks.utils.DocumentUtils;
import tasks.utils.FolderUtils;

import java.util.Iterator;
import java.util.Map;

public abstract class DictionaryTask extends AbstractTask {

    // Parameters specific to this task

    @Parameter(names = { "-dictionary" }, description = "The dictionary GUID within a dialect to work on", required = true)
    protected String dictionaryId;

    @Parameter(names = { "-pageSize" }, description = "The amount of items to handle in each iteration (default: 5)")
    protected int pageSize = 1000;

    @Parameter(names = { "-where" }, description = "NXQL to append to the WHERE query, starting with 'AND'")
    protected static String where = "";

    protected static Document dictionary = null;

    protected static int iterations;
    protected static String currentIteration;

    protected static int changedObjects = 0;

    protected void setDictionaryData() throws Exception {
        int dictionaryCountResult = 0;

        dictionary = DocumentUtils.getDocument(client, dictionaryId);
        dictionaryCountResult = FolderUtils.getSize(client, dictionaryId, where);
        iterations = (int) Math.ceil(dictionaryCountResult / pageSize) + 1;

        if (!dictionary.getType().equals("FVDictionary")) {
            throw new Exception("ID supplied was not a dictionary.");
        }

        System.out.println("-> Dictionary contains " + dictionaryCountResult + " words/phrases - will run " + iterations + " iterations.");
    }

    protected RecordSet getDictionaryItems(int pageIndex) {
        return FolderUtils.getChildren(client, dictionary.getId(), pageIndex, pageSize, where);
    }

    protected void operateOnItemsAsRecordSet() throws Exception {
        for (int i = 0; i < iterations; ++i) {
            RecordSet dictionaryChildren = this.getDictionaryItems(i);
            System.out.println("-> Dictionary items in iteration #" + i + ": " + dictionaryChildren.getUuids().size());

            if (!dictionaryChildren.getUuids().isEmpty()) {
                Iterator it = dictionaryChildren.getUuids().iterator();

                int j = 0;

                for (Map<String, String> record : dictionaryChildren.getUuids()) {
                    String currentUUID = record.get("ecm:uuid");
                    currentIteration = i + "-" + j + "-" + currentUUID;

                    if (runOperation(record)) {
                        changedObjects += 1;
                    }
                    ++j;
                }
            }
        }
    }

    protected void operateOnItemsAsDocuments() throws Exception {
        for (int i = 0; i < iterations; ++i) {
            Documents dictionaryChildren = FolderUtils.getChildren(client, dictionary.getId(), i, pageSize, where, "*", true, true);
            System.out.println("-> Dictionary items in iteration #" + i + ": " + dictionaryChildren.size());

            if (dictionaryChildren.size() > 0) {
                Iterator it = dictionaryChildren.getDocuments().iterator();

                int j = 0;

                while (it.hasNext()) {
                    Document doc = (Document) it.next();
                    String currentUUID = doc.getId();
                    currentIteration = i + "-" + j + "-" + currentUUID;

//                   Enable try/catch to continue with execution despite errors
//                    try {
                        if (runOperation(doc)) {
                            changedObjects += 1;
                        }
//                    } catch (Exception e) {
//                        System.out.println("Encountered error with UID : " + currentUUID + " skipping record (!!!)");
//                    }
                    ++j;
                }
            }
        }


    }

    abstract protected Boolean runOperation(Object record) throws Exception;

    public void setWhere(String where) {
        this.where = where;
    }
}
