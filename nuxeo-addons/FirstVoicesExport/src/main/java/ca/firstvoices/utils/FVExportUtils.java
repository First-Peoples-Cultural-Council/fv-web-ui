package ca.firstvoices.utils;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.property_readers.FV_AbstractPropertyReader;
import org.apache.commons.codec.digest.DigestUtils;
import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.work.api.WorkManager;

import java.lang.reflect.Constructor;
import java.security.Principal;
import java.util.List;
import java.util.Map;

import static ca.firstvoices.utils.FVExportConstants.DIALECT_RESOURCES_TYPE;

public class FVExportUtils
{
    public static DocumentModel findDialectChildWithRef( CoreSession session, DocumentRef dialectRef, String dialectChildType )
    {
        DocumentModelList children = session.getChildren( dialectRef );

        DocumentModel foundChild = null;

        for (DocumentModel child : children)
        {
            if (child.getType().equals(dialectChildType))
            {
                foundChild = child;
                break;
            }
        }

        return foundChild;
    }

    public static DocumentModel findDialectChild( DocumentModel dialect, String dialectChildType )
    {
       return findDialectChildWithRef( dialect.getCoreSession(), dialect.getRef(), dialectChildType );
    }

    //TODO: replace with query
    public static DocumentModel findChildWithName( CoreSession session, DocumentRef parentRef, String childName )
    {
        DocumentModelList children = session.getChildren( parentRef );

        DocumentModel foundChild = null;

        for (DocumentModel child : children)
        {
            if (child.getName().equals(childName))
            {
                foundChild = child;
                break;
            }
        }

        return foundChild;
    }

    public static DocumentModel findExportFileWithName( CoreSession session, DocumentRef dialectRef, String exportFileName )
    {
        DocumentModel resDoc = findDialectChildWithRef( session, dialectRef, DIALECT_RESOURCES_TYPE );
        DocumentModel exportDoc = findChildWithName( session, resDoc.getRef(), exportFileName );

        return exportDoc;
    }

    //ctx.getProperty(INITIATING_PRINCIPAL)+"-"+ctx.getProperty(DIALECT_NAME_EXPORT)+"-"+ctx.getProperty(EXPORT_FORMAT);

    public static String makeExportWorkerID( FVExportWorkInfo info )
    {
        return info.initiatorName + "-" + info.dialectGUID + "-" + info.exportFormat;
    }

    // TODO: need to find how this is handled in the production
    private static String getNuxeoBinariesPath()
    {
        Map<String, String> env = System.getenv();
        String nuxeo_binaries = env.get("PWD" );
        nuxeo_binaries = nuxeo_binaries + "/nxserver/data/binaries/";

        return nuxeo_binaries;
    }

    public static String getTEMPBlobDirectoryPath()
    {
        String nuxeo_tmp_path = getNuxeoBinariesPath();

        nuxeo_tmp_path = nuxeo_tmp_path + "tmp/";

        return nuxeo_tmp_path;
    }

    public static String getDataBlobDirectoryPath()
    {
        String nuxeo_data_path = getNuxeoBinariesPath();

        nuxeo_data_path = nuxeo_data_path + "data/";

        return nuxeo_data_path;

    }

    public static String getPathToChildInDialect(CoreSession session, DocumentModel dialect, String childType )
    {
         DocumentModel resourceFolder =  findDialectChildWithRef( session, dialect.getRef(), childType );

         return resourceFolder.getPathAsString();
    }

    public static String makeExportDigest(Principal p, String query, List<String> columns )
    {
        String colStr = "";

        for(String s : columns )
        {
            colStr = colStr + s;
        }

        colStr = colStr + query + makePrincipalWorkDigest( p );


        return makeDigestHash( colStr );
    }

    public static String makePrincipalWorkDigest( Principal p)
    {
        String pName = p.getName();
        String pHashS = String.valueOf( p.hashCode() );
        pName = pName+pHashS;

        return makeDigestHash( pName );
    }

    public static String makeDigestHash( String hashCandidate )
    {
        String md5Hex = DigestUtils.md5Hex(hashCandidate).toUpperCase();
        return  md5Hex;
    }

    public static FV_AbstractPropertyReader makePropertyReader(CoreSession session, ExportColumnRecord colR, FV_AbstractProducer producer) throws Exception
    {
        Class<?> clazz = colR.requiredPropertyReader;
        Constructor<?> constructor = clazz.getConstructor( CoreSession.class, ExportColumnRecord.class , FV_AbstractProducer.class );
        FV_AbstractPropertyReader instance = (FV_AbstractPropertyReader) constructor.newInstance( session, colR, producer );
        instance.session = session;

        return instance;
    }

    public static boolean checkForRunningWorkerBeforeProceeding( String workId, WorkManager workManager )
    {
        if( workManager == null ) return false; // worker is running
        if( workManager.find( workId, null ) != null ) return true; // worker is running
        return false; // worker is not running
    }

}

