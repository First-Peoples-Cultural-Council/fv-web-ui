package tasks.utils;

import org.nuxeo.client.NuxeoClient;
import org.nuxeo.client.objects.Document;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * These are very custom operations that can be used as templates or independently
 */
public class CustomOperations {

    /**
     * Move word value to definition, pronunciation to word value, and remove pronunciation
     * Note: You may want to consider various listeners since some, like custom order, fire on title modifications
     * @param client
     * @param id
     * @return
     * @throws Exception
     */
    public static Boolean MovePronunciationToWord(NuxeoClient client, String id) throws Exception {
        Document doc = DocumentUtils.getDocument(client.schemas("fv-word", "dublincore", "fvcore"), id);

        if (!doc.getType().equals("FVWord")) {
            throw new Exception("Only applies to words");
        }

        String pronunciation = (String) doc.getPropertyValue("fv-word:pronunciation");
        String word = (String) doc.getPropertyValue("dc:title");
        ArrayList<HashMap<String, String>> definitions = doc.getPropertyValue("fv:definitions");

        if (pronunciation != null && !pronunciation.isEmpty()) {
            String definition = definitions.get(0).get("translation");
            if (definition.equals(word) || definition.equals("---")) {
                doc.setPropertyValue("dc:title", pronunciation.trim());
                doc.setPropertyValue("fv-word:pronunciation", null);
                client.repository().updateDocument(doc);

                return true;
            }
        }

        return false;
    }

    /**
     * Method will recalculate the custom order property on a word/phrase and republish if the word is already published.
     * @param client
     * @param uuid
     * @throws Exception
     */
    public static Boolean RecalculateCustomOrderAndRepublish(NuxeoClient client, String uuid) throws Exception {

        try {
            Document doc = client.operation("Document.ComputeNativeOrderForAsset")
                    .input(uuid)
                    .execute();

            if (doc.getState().equals("Published")) {
                client.operation("Document.FollowLifecycleTransition")
                        .input(uuid)
                        .param("value", "Republish")
                        .execute();
            }

            return true;

        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Method will assign a value to one or more fields. Value is specified in arguments.
     * @param client
     * @param uuid
     * @throws Exception
     */
    public static Boolean AssignValueToFields(NuxeoClient client, String uuid, String field, String fieldValue) throws Exception {

        try {

            Document doc = DocumentUtils.getDocument(client.schemas("fv-word", "dublincore", "fvcore"), uuid);

            if (!doc.getType().equals("FVWord")) {
                throw new Exception("Only applies to words");
            }

            Object currentFieldValue = (Object) doc.getPropertyValue(field);

//            ArrayList<String> excludedUIDs = new ArrayList<String>();
//            excludedUIDs.add("UID_TO_EXCLUDE");
//
//            // Skip a few values
//            if (excludedUIDs.contains(doc.getId())){
//                return false;
//            }

            if (currentFieldValue == null || !currentFieldValue.toString().equals(fieldValue)) {
                doc.setPropertyValue(field, fieldValue);
                client.repository().updateDocument(doc);
                return true;
            }


            return true;

        } catch (Exception e) {
            return false;
        }
    }
}
