package models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.nuxeo.client.objects.Document;

/**
 * An object that maps to the expected output for MotherTongues apps.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppCompatiblePhrase extends AppCompatibleEntity {

    public AppCompatiblePhrase(Document doc) {
        super(doc);
        setOptional(optionalFields);
    }
}