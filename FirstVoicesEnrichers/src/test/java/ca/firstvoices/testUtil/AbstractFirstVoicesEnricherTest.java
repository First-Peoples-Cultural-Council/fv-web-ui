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

package ca.firstvoices.testUtil;

import static org.junit.Assert.assertNotNull;

import ca.firstvoices.runner.FirstVoicesEnricherFeature;
import javax.inject.Inject;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesEnricherFeature.class})
public abstract class AbstractFirstVoicesEnricherTest {

  protected DocumentModel domain;
  protected DocumentModel langFamilyDoc;
  protected DocumentModel languageDoc;
  protected DocumentModel dialectDoc;
  protected DocumentModel dictionaryDoc;
  protected DocumentModel alphabetDoc;
  protected DocumentModel categories = null;
  protected DocumentModel category = null;
  protected DocumentModel subcategory = null;
  protected DocumentModel word = null;

  @Inject
  protected CoreSession session;

  @Inject
  protected AutomationService automationService;

  @Before
  public void setUp() {
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
    langFamilyDoc = createDocument(session,
        session.createDocumentModel(domain.getPathAsString(), "Family", "FVLanguageFamily"));
    assertNotNull("Should have a valid FVLanguageFamiliy", langFamilyDoc);
    languageDoc = createDocument(session,
        session.createDocumentModel(langFamilyDoc.getPathAsString(), "Language", "FVLanguage"));
    assertNotNull("Should have a valid FVLanguage", languageDoc);
    dialectDoc = createDocument(session,
        session.createDocumentModel(languageDoc.getPathAsString(), "Dialect", "FVDialect"));
    assertNotNull("Should have a valid FVDialect", dialectDoc);
    dictionaryDoc = createDocument(session,
        session.createDocumentModel(dialectDoc.getPathAsString(), "Dictionary", "FVDictionary"));
    assertNotNull("Should have a valid FVDictionary", dictionaryDoc);
    alphabetDoc = createDocument(session,
        session.createDocumentModel(dialectDoc.getPathAsString(), "Alphabet", "FVAlphabet"));
    assertNotNull("Should have a valid FVAlphabet", alphabetDoc);
    categories = session.createDocument(
        session.createDocumentModel(dialectDoc.getPathAsString(), "Categories", "FVCategories"));
    category = session.createDocument(
        session.createDocumentModel(categories.getPathAsString(), "Category", "FVCategory"));
    subcategory = session.createDocument(
        session.createDocumentModel(categories.getPathAsString(), "SubCategory", "FVCategory"));
    session.move(subcategory.getRef(), category.getRef(), "SubCategory");
    session.save();
    word = createWordorPhrase("New Word", "FVWord", null, null);
    StringList categories = new StringList();
    categories.add(subcategory.getId());
    word.setPropertyValue("dc:title", "New Word");
    word.setPropertyValue("fv-word:categories", categories.toArray());
    session.saveDocument(word);
    session.save();
  }


  protected DocumentModel createWordorPhrase(String value, String typeName, String pv, String v) {
    DocumentModel document = session
        .createDocumentModel(dictionaryDoc.getPathAsString(), value, typeName);
    if (pv != null) {
      document.setPropertyValue(pv, v);
    }

    document.setPropertyValue("fva:dialect", dialectDoc.getId());

    document = createDocument(session, document);

    return document;
  }

  protected void createWordsorPhrases(String[] orderedValues, String typeName) {
    Integer i = 0;
    for (String value : orderedValues) {
      createWordorPhrase(value, typeName, "fv:reference", String.valueOf(i));
      i++;
    }

    session.save();
  }
}