/*
 *
 * Copyright 2020 First People's Cultural Council
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * /
 */

package ca.firstvoices.testUtil;

import ca.firstvoices.runner.FirstVoicesDataFeature;
import ca.firstvoices.services.AssignAncestorsService;
import ca.firstvoices.services.CleanupCharactersService;
import ca.firstvoices.services.SanitizeDocumentService;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.automation.AutomationService;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.platform.usermanager.UserManager;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

import javax.inject.Inject;

import static org.junit.Assert.assertNotNull;

@RunWith(FeaturesRunner.class)
@Features({FirstVoicesDataFeature.class})
public abstract class AbstractFirstVoicesDataTest {

    private DocumentModel langFamilyDoc;
    private DocumentModel languageDoc;
    private DocumentModel dialectDoc;
    private DocumentModel dictionaryDoc;
    private DocumentModel alphabetDoc;

    @Inject
    protected CoreSession session;

    @Inject
    protected UserManager userManager;

    @Inject
    protected AutomationService automationService;

    @Inject
    protected AssignAncestorsService assignAncestorsService;

    @Inject
    protected SanitizeDocumentService sanitizeDocumentService;

    @Inject
    protected CleanupCharactersService cleanupCharactersService;


    @Before
    public void setUp() throws Exception {
        assertNotNull("Should have a valid session", session);
        createSetup(session);
    }

    public DocumentModel getCurrentLanguageFamily() {
        return langFamilyDoc;
    }

    public DocumentModel getCurrentLanguage() {
        return languageDoc;
    }

    public DocumentModel getCurrentDialect() {
        return dialectDoc;
    }

    public DocumentModel getCurrentDictionary(){
        return dictionaryDoc;
    }

    public DocumentModel getAlphabetDoc() {
        return alphabetDoc;
    }

    public void createSetup(CoreSession session) {
        startFresh(session);

        DocumentModel domain = createDocument(session, session.createDocumentModel("/", "FV", "Domain"));

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
        langFamilyDoc = createDocument(session, session.createDocumentModel("/FV", "Family", "FVLanguageFamily"));
        assertNotNull("Should have a valid FVLanguageFamiliy", langFamilyDoc);
        languageDoc = createDocument(session, session.createDocumentModel("/FV/Family", "Language", "FVLanguage"));
        assertNotNull("Should have a valid FVLanguage", languageDoc);
        dialectDoc = createDocument(session, session.createDocumentModel("/FV/Family/Language", "Dialect", "FVDialect"));
        assertNotNull("Should have a valid FVDialect", dialectDoc);
        dictionaryDoc = createDocument(session, session.createDocumentModel("/FV/Family/Language/Dialect", "Dictionary", "FVDictionary"));
        assertNotNull("Should have a valid FVDictionary", dictionaryDoc);
        alphabetDoc = createDocument(session, session.createDocumentModel(dialectDoc.getPathAsString(), "Alphabet", "FVAlphabet"));
        assertNotNull("Should have a valid FVAlphabet", alphabetDoc);
    }
}