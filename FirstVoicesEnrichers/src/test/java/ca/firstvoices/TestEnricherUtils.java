// package ca.firstvoices;

// import ca.firstvoices.nuxeo.operations.DocumentEnrichedQuery;
// import ca.firstvoices.nuxeo.utils.EnricherUtils;
// import org.junit.Before;
// import org.junit.Ignore;
// import org.junit.Test;
// import org.junit.runner.RunWith;
// import org.nuxeo.ecm.automation.AutomationService;
// import org.nuxeo.ecm.automation.OperationContext;
// import org.nuxeo.ecm.automation.OperationException;
// import org.nuxeo.ecm.automation.core.util.StringList;
// import org.nuxeo.ecm.automation.test.AutomationFeature;
// import org.nuxeo.ecm.core.api.CoreSession;
// import org.nuxeo.ecm.core.api.DocumentModel;
// import org.nuxeo.ecm.core.api.DocumentModelList;
// import org.nuxeo.ecm.core.test.CoreFeature;
// import org.nuxeo.ecm.core.test.DefaultRepositoryInit;
// import org.nuxeo.ecm.core.test.annotations.Granularity;
// import org.nuxeo.ecm.core.test.annotations.RepositoryConfig;
// import org.nuxeo.ecm.platform.test.PlatformFeature;
// import org.nuxeo.runtime.test.runner.*;

// import javax.inject.Inject;
// import java.util.HashMap;
// import java.util.Map;

// import static org.junit.Assert.assertEquals;

// @RunWith(FeaturesRunner.class)
// @Features({RuntimeFeature.class, CoreFeature.class, AutomationFeature.class} )
// @RepositoryConfig(init = DefaultRepositoryInit.class, cleanup = Granularity.METHOD)
// @Deploy( {"FirstVoicesData",
//         "org.nuxeo.ecm.platform",
//         "org.nuxeo.ecm.platform.commandline.executor",
//         "org.nuxeo.ecm.automation.core",
//         "org.nuxeo.ecm.platform.picture.core",
//         "org.nuxeo.ecm.platform.video.core",
//         "org.nuxeo.ecm.platform.audio.core",
//         "org.nuxeo.ecm.automation.scripting",
//         "org.nuxeo.ecm.platform.web.common",
//         "FirstVoicesPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
//         "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
//         "FirstVoicesEnrichers:OSGI-INF/extensions/ca.firstvoices.enrichers.operations.xml",
//         "FirstVoicesEnrichers:OSGI-INF/extensions/fake-load-actions.xml",
//         "FirstVoicesEnrichers:OSGI-INF/extensions/fake-studio.xml"
// })
// public class TestEnricherUtils {

//     @Inject
//     protected CoreSession session;

//     @Inject
//     protected AutomationService automationService;

//     DocumentModel domain = null;

//     DocumentModel dialectDoc = null;

//     DocumentModel languageDoc = null;

//     DocumentModel familyDoc = null;

//     DocumentModel category = null;

//     DocumentModel subcategory = null;

//     DocumentModel word = null;

//     String categoryQuery = "";

//     @Before
//     public void setUp() throws Exception {
//         session.removeChildren(session.getRootDocument().getRef());
//         session.save();

//         domain = session.createDocument(session.createDocumentModel("/", "FV", "Domain"));

//         familyDoc = session.createDocument(session.createDocumentModel("/FV", "Family", "FVLanguageFamily"));
//         languageDoc = session.createDocument(session.createDocumentModel("/FV/Family", "Language", "FVLanguage"));
//         dialectDoc = session.createDocument(session.createDocumentModel("/FV/Family/Language", "Dialect", "FVDialect"));

//         category = session.createDocument(session.createDocumentModel("/FV/Family/Language/Dialect/Categories", "Category", "FVCategory"));
//         subcategory = session.createDocument(session.createDocumentModel("/FV/Family/Language/Dialect/Categories/Category", "SubCategory", "FVCategory"));

//         word = session.createDocument(session.createDocumentModel("/FV/Family/Language/Dialect/Dictionary", "NewWord", "FVWord"));

//         StringList categories = new StringList();
//         categories.add(subcategory.getId());

//         word.setPropertyValue("fv-word:categories", categories.toArray());
//         session.save();
//     }

//     @Test
//     public void shouldExpandCategoriesToChildren() {

//         setQueryWithCategory(category.getId());

//         String modifiedQuery = EnricherUtils.expandCategoriesToChildren(session, categoryQuery);

//         String queryWithCategoriesAndChildren =
//                 "SELECT * FROM FVWord WHERE " +
//                         "fv-word:categories/* IN (\"" + category.getId() + "\",\"" + subcategory.getId() + "\")";


//         assertEquals(modifiedQuery, queryWithCategoriesAndChildren);
//     }

//     @Test
//     public void wordHasCategory() {
//         String[] categories = (String[]) word.getPropertyValue("fv-word:categories");
//         assertEquals(subcategory.getId(), categories[0]);
//     }

//     /**
//      * Fix test. Does it fail due to elastic search not indexing the word fast enough?
//      * Calling operation directly works.
//      * @throws OperationException
//      */
//     @Test
//     @Ignore
//     public void shouldReturnWordFromSubCategory() throws OperationException {

//         setQueryWithCategory(category.getId());

//         OperationContext ctx = new OperationContext(session);
//         Map<String, Object> params = new HashMap<>();

//         params.put("query", categoryQuery);
//         params.put("currentPageIndex", 0);
//         params.put("pageSize", 10);
//         params.put("enrichment", "category_children");

//         DocumentModelList docs = (DocumentModelList) automationService.run(ctx, DocumentEnrichedQuery.ID, params);
//         assertEquals(1, docs.size());
//     }

//     private void setQueryWithCategory(String categoryId) {
//         categoryQuery =
//                 "SELECT * FROM FVWord WHERE " +
//                         "fv-word:categories/* IN (\"" + category.getId() + "\")";
//     }
// }
