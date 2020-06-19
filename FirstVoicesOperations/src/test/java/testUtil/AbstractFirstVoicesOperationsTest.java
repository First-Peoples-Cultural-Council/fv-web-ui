/*
 *
 *  *
 *  * Copyright 2020 First People's Cultural Council
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  * /
 *
 */

package testUtil;

import static ca.firstvoices.lifecycle.Constants.PUBLISHED_STATE;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_ALPHABET;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CATEGORIES;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_CATEGORY;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_DICTIONARY;
import static ca.firstvoices.schemas.DialectTypesConstants.FV_WORD;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_DIALECT;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_LANGUAGE;
import static ca.firstvoices.schemas.DomainTypesConstants.FV_LANGUAGE_FAMILY;
import static org.junit.Assert.assertNotNull;

import ca.firstvoices.dialect.categories.services.CategoryService;
import java.util.ArrayList;
import java.util.List;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;
import runner.FirstVoicesOperationsFeature;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesOperationsFeature.class})
public abstract class AbstractFirstVoicesOperationsTest {

  protected DocumentModel domain;
  protected DocumentModel languageFamily;
  protected DocumentModel language;
  protected DocumentModel dialect;
  protected DocumentModel dictionary;
  protected DocumentModel word;
  protected DocumentModel alphabet;
  protected DocumentModel categories;
  protected DocumentModel parentCategory;
  protected DocumentModel childCategory;
  protected DocumentModel parentCategory2;

  @Inject
  protected CoreSession session;

  @Inject
  protected CategoryService categoryService;

  @Before
  public void setUp() throws Exception {
    assertNotNull("Should have a valid session", session);
    createSetup(session);
  }

  @After
  public void tearDown() {
    if (domain != null) {
      session.removeDocument(domain.getRef());
      session.save();
    }
  }

  public void createSetup(CoreSession session) {
    startFresh(session);

    createDialectTree(session);
    session.save();
  }

  public DocumentModel createDocument(CoreSession session, DocumentModel model) {
    model.setPropertyValue("dc:title", model.getName());
    DocumentModel newDoc = session.createDocument(model);
    session.save();

    return newDoc;
  }

  public void startFresh(CoreSession session) {
    DocumentRef dRef = session.getRootDocument().getRef();
    DocumentModel defaultDomain = session.getDocument(dRef);

    DocumentModelList children = session.getChildren(defaultDomain.getRef());

    for (DocumentModel child : children) {
      recursiveRemove(session, child);
    }
  }

  private void recursiveRemove(CoreSession session, DocumentModel parent) {
    DocumentModelList children = session.getChildren(parent.getRef());

    for (DocumentModel child : children) {
      recursiveRemove(session, child);
    }

    session.removeDocument(parent.getRef());
    session.save();
  }

  public void createDialectTree(CoreSession session) {
    domain = createDocument(session, session.createDocumentModel("/", "FV", "Domain"));
    languageFamily = createDocument(session,
        session.createDocumentModel(domain.getPathAsString(), "Family", FV_LANGUAGE_FAMILY));
    assertNotNull("Should have a valid FVLanguageFamily", languageFamily);
    language = createDocument(session,
        session.createDocumentModel(languageFamily.getPathAsString(), "Language", FV_LANGUAGE));
    assertNotNull("Should have a valid FVLanguage", language);
    dialect = createDocument(session,
        session.createDocumentModel(language.getPathAsString(), "Dialect", FV_DIALECT));
    assertNotNull("Should have a valid FVDialect", dialect);
    dictionary = createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Dictionary", FV_DICTIONARY));
    assertNotNull("Should have a valid FVDictionary", dictionary);
    alphabet = createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Alphabet", FV_ALPHABET));
    assertNotNull("Should have a valid FVAlphabet", alphabet);
    categories = createDocument(session,
        session.createDocumentModel(dialect.getPathAsString(), "Categories", FV_CATEGORIES));
    assertNotNull("Should have a valid Categories", categories);
    parentCategory = createDocument(session, session
        .createDocumentModel(categories.getPathAsString(), "TestParentCategory1", FV_CATEGORY));
    assertNotNull("Should have a valid Parent Category", parentCategory);
    childCategory = createDocument(session,
        session.createDocumentModel(parentCategory.getPathAsString(), "Category", FV_CATEGORY));
    assertNotNull("Should have a valid category", childCategory);
    parentCategory2 = createDocument(session, session
        .createDocumentModel(categories.getPathAsString(), "TestParentCategory2", FV_CATEGORY));
    assertNotNull("Should have a valid Parent Category2", parentCategory2);
    word = createDocument(session, session
        .createDocumentModel("/FV/Family/Language/Dialect/Dictionary", " Test Word ", FV_WORD));
    assertNotNull("Should have a valid Word", word);
  }

  protected DocumentModel createWordorPhrase(String value, String typeName, String pv, String v) {
    DocumentModel document = session
        .createDocumentModel("/FV/Family/Language/Dialect/Dictionary", value, typeName);
    if (pv != null) {
      document.setPropertyValue(pv, v);
    }

    document = createDocument(session, document);

    return document;
  }

  protected List<DocumentModel> createWordsorPhrases(String[] orderedValues, String typeName) {
    List<DocumentModel> documentModelList = new ArrayList<>();
    Integer i = 0;
    for (String value : orderedValues) {
      documentModelList.add(createWordorPhrase(value, typeName, "fv:reference", String.valueOf(i)));
      i++;
    }

    session.save();
    return documentModelList;
  }

  protected Boolean isPublished(DocumentModel doc) {
    return doc.getLifeCyclePolicy().equals("fv-lifecycle") && doc.getCurrentLifeCycleState()
        .equals(PUBLISHED_STATE);
  }
}
