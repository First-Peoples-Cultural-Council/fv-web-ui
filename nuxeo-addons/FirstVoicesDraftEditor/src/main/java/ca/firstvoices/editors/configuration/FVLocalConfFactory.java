package ca.firstvoices.editors.configuration;

import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.adapter.DocumentAdapterFactory;
import static ca.firstvoices.editors.configuration.FVLocalConf.FV_CONFIGURATION_FACET;

public class FVLocalConfFactory implements DocumentAdapterFactory{
    public FVLocalConfFactory() {
    }
    public Object getAdapter(DocumentModel doc, Class<?> itf) {
        return doc.hasFacet(FV_CONFIGURATION_FACET) ? new FVLocalConfAdaptor(doc) : null;
    }
}
