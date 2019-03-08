package ca.firstvoices.property_readers;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;

import java.util.ArrayList;
import java.util.List;

public class FV_IDPropertyReader extends FV_AbstractPropertyReader
{
    public FV_IDPropertyReader( CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner )
    {
        super( session, spec, specOwner );
    }

    public ReaderType readerType()
    {
        return ReaderType.ID_PROP;
    }

    public List<FV_DataBinding> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_DataBinding> readValues = new ArrayList<>();
        Object prop = word.getPropertyValue(propertyToRead);

        if( prop != null )
        {
            String propertyValue = (String) prop;
            DocumentModel refDoc = session.getDocument( new IdRef(propertyValue));

            if( refDoc != null )
            {
                readValues.add(new FV_DataBinding( columnNameForOutput, (String)refDoc.getPropertyValue( "dc:title")));
            }
            else
            {
                readValues.add(new FV_DataBinding(columnNameForOutput, "Invalid UUID: "+propertyValue ));
            }
        }
        else
        {
            readValues.add(new FV_DataBinding( columnNameForOutput," ") );
        }

        return readValues;
    }
}
