package ca.firstvoices.rest.helpers;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.runtime.api.Framework;

public class PageProviderHelper {

  private PageProviderHelper() {
  }

  public static List<DocumentModel> getPageProviderResults(CoreSession session,
                                                           String ppName,
                                                           Integer pageSize,
                                                           Integer currentPage,
                                                           Object... params) {
    PageProviderService pageProviderService = Framework.getService(PageProviderService.class);
    Map<String, Serializable> props = new HashMap<>();

    props.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY, (Serializable) session);


    PageProvider<DocumentModel> pageProvider =
        (PageProvider<DocumentModel>) pageProviderService.getPageProvider(ppName,
            null,
            null,
            null,
            props,
            params);

    if (pageSize != null) {
      pageProvider.setPageSize(pageSize);
    }
    if (currentPage != null) {
      pageProvider.setCurrentPage(currentPage);
    }


    return pageProvider.getCurrentPage();
  }

}
