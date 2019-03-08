package ca.firstvoices.nativeorder.services;

import org.nuxeo.ecm.core.api.DocumentModel;

public interface NativeOrderComputeService {

    void computeAssetNativeOrderTranslation(DocumentModel asset);

    void computeDialectNativeOrderTranslation(DocumentModel dialect);

}