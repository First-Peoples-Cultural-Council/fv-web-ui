package ca.firstvoices.property_readers;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.ArrayList;
import java.util.List;

public class FV_BooleanPropertyReader extends FV_AbstractPropertyReader
{
    public FV_BooleanPropertyReader( CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner )
    {
        super( session, spec, specOwner );
    }

    public ReaderType readerType()
    {
        return ReaderType.BOOLEAN;
    }

    public List<FV_DataBinding> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_DataBinding> readValues = new ArrayList<>();
        Boolean prop = (Boolean)word.getPropertyValue(propertyToRead);

        if( prop == null )
        {
            prop = false;
        }

        String propertyValue = prop ? "true" : "false";

        readValues.add(new FV_DataBinding( columnNameForOutput, propertyValue));

        return readValues;
    }
}
