package ca.firstvoices.simpleapi.services;

import ca.firstvoices.simpleapi.exceptions.NotFoundException;
import ca.firstvoices.simpleapi.model.AnnotationNuxeoMapper;
import ca.firstvoices.simpleapi.model.QueryBean;
import ca.firstvoices.simpleapi.representations.ArchiveDetailPublic;
import ca.firstvoices.simpleapi.representations.ArchiveOverview;
import ca.firstvoices.simpleapi.representations.Word;
import ca.firstvoices.simpleapi.representations.containers.Metadata;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.security.auth.login.LoginContext;
import javax.security.auth.login.LoginException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CloseableCoreSession;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.runtime.api.Framework;
import org.nuxeo.runtime.transaction.TransactionHelper;

@Singleton
public class NuxeoFirstVoicesServiceImplementation extends AbstractFirstVoicesService {

  private final MapperRegistry mapperRegistry;

  public NuxeoFirstVoicesServiceImplementation() {
    this.mapperRegistry = Framework.getService(MapperRegistry.class);
  }

  private static final Log LOG = LogFactory.getLog(NuxeoFirstVoicesServiceImplementation.class);

  private <V> Metadata<List<V>> buildListResponse(Class<V> resultClass, String ppName, QueryBean queryParams, Object... params) {
    Metadata<List<V>> md = new Metadata<>();

    try {
      LoginContext login = Framework.login();
    } catch (LoginException e) {
      LOG.error(e);
    }
    TransactionHelper.startTransaction();

    try (CloseableCoreSession session = CoreInstance.openCoreSession(null)) {

      Map<String, Serializable> props = new HashMap<>();
      props.put(
          CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY,
          (Serializable) session
      );
      PageProviderService pageProviderService = Framework.getService(PageProviderService.class);

      PageProvider<DocumentModel> pageProvider = (PageProvider<DocumentModel>) pageProviderService
          .getPageProvider(ppName, null, null, null, props);

      pageProvider.setPageSize(queryParams.pageSize);
      pageProvider.setCurrentPage(queryParams.index);

      List<DocumentModel> results = pageProvider.getCurrentPage();
//      ResultMapper<V> mapper = mapperRegistry.mapper(resultClass);
      md.setCount(pageProvider.getResultsCount());
      md.setDetailType("archive");
      md.setStatus(pageProvider.hasError() ? "error" : "success");
      md.setDetail(results.stream().map(dm -> AnnotationNuxeoMapper.mapFrom(resultClass, dm)).collect(Collectors.toList()));

      TransactionHelper.commitOrRollbackTransaction();

      return md;
    }
  }


  private <V> Metadata<V> buildSingleResponse(
      String ppName,
      QueryBean queryParams,
      Object... params) {
    Metadata<V> md = new Metadata<>();

    try {
      LoginContext login = Framework.login();
    } catch (LoginException e) {
      e.printStackTrace();
    }
    TransactionHelper.startTransaction();

    try (CloseableCoreSession session = CoreInstance.openCoreSession(null)) {

      Map<String, Serializable> props = new HashMap<>();
      props.put(
          CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY,
          (Serializable) session
      );
      PageProviderService pageProviderService = Framework.getService(PageProviderService.class);

      PageProvider<DocumentModel> pageProvider = (PageProvider<DocumentModel>) pageProviderService
          .getPageProvider(ppName, null, null, null, props);

      pageProvider.setPageSize(queryParams.pageSize);
      pageProvider.setCurrentPage(queryParams.index);

      List<DocumentModel> results = pageProvider.getCurrentPage();
      TransactionHelper.commitOrRollbackTransaction();

      return md;
    }
  }


  @Override
  public Metadata<List<ArchiveOverview>> getArchives(QueryBean queryParams) {
    LOG.info("running query");
    return buildListResponse(ArchiveOverview.class, "LIST_ARCHIVES_PP", queryParams);
  }

  @Override
  public Metadata<List<Word>> getWordsInArchive(String archiveID, QueryBean queryParameters) throws NotFoundException {
    throw new NotFoundException();
//    return buildListResponse()
//    return super.getWordsInArchive(archiveID, queryParameters);
  }
}
