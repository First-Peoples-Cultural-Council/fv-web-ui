package ca.firstvoices.property_readers;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.*;

import java.util.ArrayList;
import java.util.List;

public class FV_CategoryPropertyReader extends FV_AbstractPropertyReader
{
    public FV_CategoryPropertyReader( CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner )
    {
        super( session, spec, specOwner );
    }

    public ReaderType readerType()
    {
        return ReaderType.CATEGORY;
    }

    public List<FV_DataBinding> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_DataBinding> readValues = new ArrayList<>();
        Object[] categoryIds = (Object[])word.getPropertyValue(propertyToRead);
        Object[] colA = columns.toArray();
        //StringList categories = new StringList();

        int colCounter = 0;

        for (Object categoryId : categoryIds)
        {
            if (categoryId == null)
            {
                log.warn("Null Category in FV_CategoryPropertyReader");
                readValues.add(new FV_DataBinding( (String)colA[colCounter], "") );
                colCounter++;
                continue;
            }

            try
            {
                if( !(categoryId instanceof String) ) throw new Exception("Wrong GUID type for category");

                DocumentModel categoryDoc = session.getDocument(new IdRef((String)categoryId));

                readValues.add(new FV_DataBinding( (String)colA[colCounter], categoryDoc.getTitle() ) );
                colCounter++;
            }
            catch( Exception e )
            {
                log.warn("Null category document in FV_CategoryPropertyReader.");
                readValues.add(new FV_DataBinding( (String)colA[colCounter], "Null category document") );
                colCounter++;
                e.printStackTrace();
            }
        }

        for( ; colCounter < maxColumns; colCounter++ )
        {
            readValues.add(new FV_DataBinding( (String)colA[colCounter], ""));
        }

        return readValues;
    }

}
