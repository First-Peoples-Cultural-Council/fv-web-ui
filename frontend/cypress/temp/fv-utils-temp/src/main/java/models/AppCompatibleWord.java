package models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.nuxeo.client.objects.Document;

/**
 * An object that maps to the expected output for MotherTongues apps.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppCompatibleWord extends AppCompatibleEntity {

    public AppCompatibleWord(Document doc) {

        super(doc);

        // Skip setting audio based on context parameters; better done externally so they can be downloaded as well.
        // Skip setting images based on context parameters; better done externally so they can be downloaded as well.
        if (doc.getPropertyValue("fv-word:pronunciation") != null) {
            optionalFields.put("Pronunciation", doc.getPropertyValue("fv-word:pronunciation"));
        }

        if (doc.getPropertyValue("fv-word:part_of_speech") != null) {
            optionalFields.put("Part of Speech", doc.getPropertyValue("fv-word:part_of_speech"));
        }

        setOptional(optionalFields);
    }
}