package ca.firstvoices.property_readers;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.*;

public class FV_WordTranslationReader extends FV_AbstractPropertyReader
{
    public FV_WordTranslationReader( CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner )
    {
        super( session, spec, specOwner );
    }

    public ReaderType readerType()
    {
        return ReaderType.WORD_TRANSLATION;
    }

    public List<FV_DataBinding> readPropertyFromObject(Object o)
    {
        DocumentModel word = (DocumentModel)o;
        List<FV_DataBinding> readValues = new ArrayList<>();

        Object prop = word.getPropertyValue(propertyToRead);
        Object[] colA = columns.toArray();

        if (prop!= null && prop instanceof List)
        {
            ArrayList<HashMap<String, String>> property = (ArrayList<HashMap<String, String>>) prop;
            Integer counter = 0;

            for( Integer i = 0; i < maxColumns; i++ )
            {
                if( property.size() > i )
                {
                    HashMap<String, String> map = property.get(counter);
                    Collection<String> hashMapValues = map.values();
                    Iterator iter = hashMapValues.iterator();

                    String output = (String)iter.next();
                    if( iter.hasNext() )
                    {
                        output = output + " (" + iter.next() + ")";
                    }

                    readValues.add( new FV_DataBinding( (String)colA[i], output));
                }
                else
                {
                    readValues.add( new FV_DataBinding( (String)colA[i]," "));
                }

                counter++;
            }
        }
        else
        {
            if( prop!= null && !(prop instanceof List) ) log.warn("FV_WordTranslationReader: incorrect type");
            readValues = writeEmptyRow();
        }

        return readValues;
    }
}
