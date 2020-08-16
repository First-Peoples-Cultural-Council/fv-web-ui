package ca.firstvoices.services;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.NuxeoException;
import org.nuxeo.ecm.core.api.SortInfo;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderDefinition;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.platform.task.Task;
import org.nuxeo.ecm.platform.task.TaskProvider;
import org.nuxeo.ecm.platform.task.TaskQueryConstant;
import org.nuxeo.ecm.platform.task.core.service.DocumentTaskProvider;
import org.nuxeo.runtime.api.Framework;

public class FVDocumentTaskProvider extends DocumentTaskProvider implements TaskProvider {
  @Override
  public List<Task> getCurrentTaskInstances(List<String> actors, CoreSession coreSession,
      List<SortInfo> sortInfos) {
    if (actors == null || actors.isEmpty()) {
      return new ArrayList<>();
    }
    return getTasks(TaskQueryConstant.GET_TASKS_FOR_ACTORS_PP, coreSession, true, sortInfos,
        actors);
  }

  public static List<Task> getTasks(String ppName, CoreSession session, boolean unrestricted,
      List<SortInfo> sortInfos, Object... params) {
    PageProviderService ppService = Framework.getService(PageProviderService.class);
    if (ppService == null) {
      throw new RuntimeException("Missing PageProvider service");
    }
    Map<String, Serializable> props = new HashMap<>();
    // first retrieve potential props from definition
    PageProviderDefinition def = ppService.getPageProviderDefinition(ppName);
    if (def != null) {
      Map<String, String> defProps = def.getProperties();
      if (defProps != null) {
        props.putAll(defProps);
      }
    }
    props.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY, (Serializable) session);
    if (unrestricted) {
      props.put(CoreQueryDocumentPageProvider.USE_UNRESTRICTED_SESSION_PROPERTY, Boolean.TRUE);
    }
    PageProvider<DocumentModel> pp = (PageProvider<DocumentModel>) ppService.getPageProvider(ppName,
        sortInfos, null, null, props, params);
    if (pp == null) {
      throw new NuxeoException("Page provider not found: " + ppName);
    }
    return wrapDocModelInTask(pp.getCurrentPage());
  }
}
