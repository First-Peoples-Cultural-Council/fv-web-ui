package ca.firstvoices.property_readers;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_PartOfSpeechPropertyReader extends FV_AbstractPropertyReader
{

    public FV_PartOfSpeechPropertyReader( CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner )
    {
        super( session, spec, specOwner );
    }

    public ReaderType readerType()
    {
        return ReaderType.SPEECH_PART;
    }

    public List<FV_DataBinding> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_DataBinding> readValues = new ArrayList<>();
        Object prop = word.getPropertyValue(propertyToRead);

        if( prop != null )
        {
            if (prop instanceof String)
            {
                readValues.add(new FV_DataBinding(columnNameForOutput, (String) prop));
            } else
            {
                readValues.add(new FV_DataBinding(columnNameForOutput, "unknown instance" ));
            }
        }
        else
        {
            readValues.add(new FV_DataBinding( columnNameForOutput, "" ) );
        }

        return readValues;
    }
}
