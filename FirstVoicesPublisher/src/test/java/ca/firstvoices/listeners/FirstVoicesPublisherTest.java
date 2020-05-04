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

/**
 *
 */

package ca.firstvoices.listeners;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.security.InvalidParameterException;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentNotFoundException;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.ecm.platform.test.PlatformFeature;
import org.nuxeo.runtime.test.runner.Deploy;
import org.nuxeo.runtime.test.runner.Features;
import org.nuxeo.runtime.test.runner.FeaturesRunner;

/**
 * @author loopingz
 */
@RunWith(FeaturesRunner.class)
@Features({ PlatformFeature.class })
@Deploy({ "org.nuxeo.ecm.platform.types.core", "org.nuxeo.ecm.platform.publisher.core",
        "org.nuxeo.ecm.platform.picture.core", "org.nuxeo.ecm.platform.video.core", "org.nuxeo.ecm.platform.audio.core",
        "org.nuxeo.ecm.automation.scripting","FirstVoicesData",
        "FirstVoicesNuxeoPublisher.tests:OSGI-INF/extensions/ca.firstvoices.fakestudio.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.templates.factories.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.schemas.ProxySchema.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.services.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.publisher.listeners.ProxyPublisherListener.xml",
        "FirstVoicesSecurity:OSGI-INF/extensions/ca.firstvoices.operations.xml",
        "FirstVoicesNuxeoPublisher:OSGI-INF/extensions/ca.firstvoices.nativeorder.services.xml" })
public class FirstVoicesPublisherTest {
    @Inject
    protected CoreSession session;

    @Inject
    protected PublisherService publisherService;

    private DocumentModel domain;

    private DocumentModel sectionRoot;

    private DocumentModel languageDoc;

    private DocumentModel dialectDoc;

    private DocumentModel familyDoc;

    private DocumentModel dialect2Doc;

    private DocumentModel language2Doc;

    private DocumentModel dialect3Doc;

    @Inject
    protected FirstVoicesPublisherService dialectPublisherService;

    private DocumentModel category;

    private DocumentModel subcategory;

    private DocumentModel contributor2;

    private DocumentModel contributor;

    private DocumentModel picture;

    private DocumentModel audio;

    private DocumentModel video;

    private DocumentModel word;

    private DocumentModel portal;

    private DocumentModel link;

    private DocumentModel link2;

    private DocumentModel phraseBook;
    private DocumentModel phrase;
    @Inject
    private FirstVoicesPublisherService firstVoicesPublisherService;

    @After
    public void cleanup() {
        session.removeChildren(session.getRootDocument().getRef());
        session.save();
    }

    @Test
    public void testDialectFactory() throws Exception {
        DocumentModel dialect = dialectDoc;
        // Check the factory is doing its job - check template
        DocumentModel child = session.getChild(dialect.getRef(), "Contributors");
        assertNotNull(child);
        assertEquals("FVContributors", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Dictionary");
        assertNotNull(child);
        assertEquals("FVDictionary", child.getDocumentType().getName());
//        child = session.getChild(dialect.getRef(), "Forum");
//        assertNotNull(child);
//        assertEquals("Forum", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Portal");
        assertNotNull(child);
        assertEquals("FVPortal", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Alphabet");
        assertNotNull(child);
        assertEquals("FVAlphabet", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Resources");
        assertNotNull(child);
        assertEquals("FVResources", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Categories");
        assertNotNull(child);
        assertEquals("FVCategories", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Links");
        assertNotNull(child);
        assertEquals("FVLinks", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Stories & Songs");
        assertNotNull(child);
        assertEquals("FVBooks", child.getDocumentType().getName());
        child = session.getChild(dialect.getRef(), "Phrase Books");
        assertNotNull(child);
        assertEquals("FVCategories", child.getDocumentType().getName());
    }

    protected void createDialectTree() throws Exception {
        familyDoc = session.createDocument(session.createDocumentModel("/", "Family", "FVLanguageFamily"));
        languageDoc = session.createDocument(session.createDocumentModel("/Family", "Language", "FVLanguage"));
        language2Doc = session.createDocument(session.createDocumentModel("/Family", "Language2", "FVLanguage"));
        dialectDoc = session.createDocument(session.createDocumentModel("/Family/Language", "Dialect", "FVDialect"));
        dialect2Doc = session.createDocument(session.createDocumentModel("/Family/Language", "Dialect2", "FVDialect"));
        dialect3Doc = session.createDocument(session.createDocumentModel("/Family/Language2", "Dialect", "FVDialect"));
        dialectDoc.followTransition("Enable");
        dialect2Doc.followTransition("Enable");
        dialect3Doc.followTransition("Enable");
    }

    @Test
    public void testDialectPublishing() throws Exception {
        // Publishing dialect
        session.followTransition(dialectDoc, "Publish");
        DocumentModel section = sectionRoot;
        // Data and SharedData are by default inside section
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertNotNull(section);
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), languageDoc.getName());
        assertNotNull(section);
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialectDoc.getName());
        assertNotNull(section);
        assertEquals(session.getChildren(section.getRef()).size(), 10);

        // Check that none is duplicated if we publish again
        dialectPublisherService.publishDialect(dialectDoc);
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), languageDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialectDoc.getName());
        assertEquals(session.getChildren(section.getRef()).size(), 10);

        // Check that none is duplicated if we publish again
        session.followTransition(dialect2Doc, "Publish");
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), languageDoc.getName());
        assertEquals(2, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialect2Doc.getName());
        assertEquals(session.getChildren(section.getRef()).size(), 10);

        // Check that none is duplicated if we publish again
        session.followTransition(dialect3Doc, "Publish");
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(2, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), language2Doc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialect3Doc.getName());
        assertEquals(session.getChildren(section.getRef()).size(), 10);

        // Test unpublish
        session.followTransition(dialect2Doc, "Unpublish");
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(2, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), languageDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), dialectDoc.getName());
        assertEquals(session.getChildren(section.getRef()).size(), 10);

        // Test unpublish
        session.followTransition(dialectDoc, "Unpublish");
        section = sectionRoot;
        assertEquals(3, session.getChildren(section.getRef()).size());
        section = session.getChild(section.getRef(), familyDoc.getName());
        assertEquals(1, session.getChildren(section.getRef()).size());
        Boolean notFound = false;
        try {
            section = session.getChild(section.getRef(), languageDoc.getName());
        } catch (DocumentNotFoundException e) {
            notFound = true;
        }
        assertTrue(notFound);

        // Test unpublish
        session.followTransition(dialect3Doc, "Unpublish");
        section = sectionRoot;
        assertEquals(2, session.getChildren(section.getRef()).size());
        notFound = false;
        try {
            section = session.getChild(section.getRef(), familyDoc.getName());
        } catch (DocumentNotFoundException e) {
            notFound = true;
        }
        assertTrue(notFound);
    }

    @Test(expected = InvalidParameterException.class)
    public void testDialectPublishingWrongDocumentType() throws Exception {
        dialectPublisherService.publishDialect(familyDoc);
    }

    @Test(expected = InvalidParameterException.class)
    public void testDialectPublishingNullDocument() throws Exception {
        dialectPublisherService.publishDialect(null);
    }

    @Before
    public void setUp() throws Exception {

        session.removeChildren(session.getRootDocument().getRef());
        session.save();

        domain = session.createDocument(session.createDocumentModel("/", "FV", "Domain"));
        sectionRoot = publisherService.getRootSectionFinder(session)
            .getDefaultSectionRoots(true, true).get(0);
        createDialectTree();
    }

    private void createWord() {
        category = session.createDocument(
            session.createDocumentModel("/Family/Language/Dialect/Categories", "Category",
                "FVCategory"));
        subcategory = session.createDocument(
            session.createDocumentModel("/Family/Language/Dialect/Categories/Category",
                "SubCategory", "FVCategory"));
        contributor = session.createDocument(
            session.createDocumentModel("/Family/Language/Dialect/Contributors", "myContributor",
                "FVContributor"));
        contributor2 = session
            .createDocument(session.createDocumentModel("/Family/Language/Dialect/Contributors",
                "myContributor2", "FVContributor"));
        picture = session.createDocument(
                session.createDocumentModel("/Family/Language/Dialect/Resources", "myPicture", "FVPicture"));
        audio = session.createDocument(
                session.createDocumentModel("/Family/Language/Dialect/Resources", "myAudio", "FVAudio"));
        video = session.createDocument(
                session.createDocumentModel("/Family/Language/Dialect/Resources", "myVideo", "FVVideo"));
        word = session.createDocumentModel("/Family/Language/Dialect/Dictionary", "myWord1", "FVWord");
        String[] values = new String[1];
        values[0] = audio.getId();
        word.setPropertyValue("fvcore:related_audio", values);
        values = new String[1];
        values[0] = picture.getId();
        word.setPropertyValue("fvcore:related_pictures", values);
        values = new String[1];
        values[0] = video.getId();
        word.setPropertyValue("fvcore:related_videos", values);
        values = new String[1];
        values[0] = subcategory.getId();
        word.setPropertyValue("fv-word:categories", values);
        values = new String[2];
        values[0] = contributor.getId();
        values[1] = contributor2.getId();
        word.setPropertyValue("fvcore:source", values);
        word = session.createDocument(word);
    }

    @Test(expected = InvalidParameterException.class)
    public void testDialectPublishingWrongPlace() throws Exception {
        dialectPublisherService.publishDialect(
            session.createDocument(session.createDocumentModel("/", "Dialect", "FVDialect")));
    }

    private DocumentModel getProxy(DocumentModel model) {
        return session.getProxies(model.getRef(), null).get(0);
    }

    @Test
    public void testDocumentPublishing() throws Exception {
        // Create a word
        createWord();
        session.followTransition(dialectDoc, "Publish");
        session.followTransition(word, "Publish");
        // Not nice to have all parameters
        verifyProxy(getProxy(word));
    }

    @Ignore
    @Test
    public void testDocumentRepublishing() throws Exception {
        createWord();
        session.followTransition(dialectDoc, "Publish");
        session.followTransition(word, "Publish");
        verifyProxy(getProxy(word));
        session.followTransition(dialectDoc, "Unpublish");
        assertEquals(0, session.getProxies(word.getRef(), null).size());
        session.followTransition(dialectDoc, "Publish");
        verifyProxy(getProxy(word));
    }

    private void createPhrase() {
        phraseBook = session.createDocument(
            session.createDocumentModel("/Family/Language/Dialect/Categories", "PhraseBook",
                "FVCategory"));
        phrase = session
            .createDocumentModel("/Family/Language/Dialect/Dictionary", "myPhrase1", "FVPhrase");
        phrase.setPropertyValue("fv-phrase:phrase_books", new String[]{phraseBook.getId()});
        phrase = session.createDocument(phrase);
    }

    @Test(expected = InvalidParameterException.class)
    public void testDocumentPublishingOnUnpublishedDialect() {
        createWord();
        dialectPublisherService.publish(word);
    }

    @Test
    public void testPortalPublishing() throws Exception {

        DocumentModel dialect = dialectDoc;
        DocumentModel portal = session.getChild(dialect.getRef(), "Portal");

        link = session.createDocument(
            session.createDocumentModel("/Family/Language/Dialect/Links", "myLink", "FVLink"));
        link2 = session.createDocument(
            session.createDocumentModel("/Family/Language/Dialect/Links", "myLink2", "FVLink"));

        DocumentModel picture = session.createDocument(
            session.createDocumentModel("/Family/Language/Dialect/Resources", "myPicture1",
                "FVPicture"));
        DocumentModel audio = session.createDocument(
            session
                .createDocumentModel("/Family/Language/Dialect/Resources", "myAudio1", "FVAudio"));

        String[] values = new String[1];

        portal.setPropertyValue("fv-portal:background_top_image", picture.getRef().toString());
        portal.setPropertyValue("fv-portal:featured_audio", audio.getRef().toString());
        portal.setPropertyValue("fv-portal:logo", picture.getRef().toString());
        values = new String[2];
        values[0] = link.getId();
        values[1] = link2.getId();
        portal.setPropertyValue("fv-portal:related_links", values);

        portal = session.createDocument(portal);

        portal.getCurrentLifeCycleState();

        if (!"Published".equals(dialectDoc.getCurrentLifeCycleState())) {
            session.followTransition(dialectDoc, "Publish");
        }

        session.followTransition(portal, "Publish");

        DocumentModel proxy = getProxy(portal);

        // Check the schema is added
        DocumentModel doc;
        assertTrue(proxy.hasSchema("fvproxy"));
        assertFalse(portal.hasSchema("fvproxy"));

        assertNotNull(portal.getPropertyValue("fv-portal:featured_audio"));

        // Check that the property has been set correctly
        verifyProxiedResource(getPropertyValueAsArray(proxy, "fvproxy:proxied_background_image"),
            picture);

        String[] audioProperty = getPropertyValueAsArray(proxy, "fvproxy:proxied_featured_audio");
        verifyProxiedResource(audioProperty, audio);

        String[] pictureProperty = getPropertyValueAsArray(proxy, "fvproxy:proxied_logo");
        verifyProxiedResource(pictureProperty, picture);

        // Specific links as there is 2 items
        String[] property = (String[]) proxy.getPropertyValue("fvproxy:proxied_related_links");
        assertEquals(2, property.length);
        assertNotEquals(link.getRef(), new IdRef(property[0]));
        doc = session.getDocument(new IdRef(property[0]));
        assertTrue(
            doc.getPathAsString().matches("/FV.*/sections/Family/Language/Dialect/Links/myLink"));
        doc = session.getSourceDocument(new IdRef(property[0]));
        assertTrue(doc.getPathAsString().matches("/Family/Language/Dialect/Links/myLink"));
        assertEquals(link.getRef().toString(), doc.getSourceId());
        assertNotEquals(link2.getRef(), new IdRef(property[1]));
        doc = session.getDocument(new IdRef(property[1]));
        assertTrue(
            doc.getPathAsString().matches("/FV.*/sections/Family/Language/Dialect/Links/myLink2"));
        doc = session.getSourceDocument(new IdRef(property[1]));
        assertTrue(doc.getPathAsString().matches("/Family/Language/Dialect/Links/myLink2"));
        assertEquals(link2.getRef().toString(), doc.getSourceId());

    }

    private void verifyProxy(DocumentModel proxy) {
        // Check the schema is added
        DocumentModel doc;
        assertTrue(proxy.hasSchema("fvproxy"));
        assertFalse(word.hasSchema("fvproxy"));
        // Check that the property has been set correctly
        verifyProxiedResource((String[]) proxy.getPropertyValue("fvproxy:proxied_audio"), audio);
        verifyProxiedResource((String[]) proxy.getPropertyValue("fvproxy:proxied_videos"), video);
        verifyProxiedResource((String[]) proxy.getPropertyValue("fvproxy:proxied_pictures"),
            picture);
        // Specific source as there is 2 items
        String[] property = (String[]) proxy.getPropertyValue("fvproxy:proxied_source");
        assertEquals(2, property.length);
        assertNotEquals(contributor.getRef(), new IdRef(property[0]));
        doc = session.getDocument(new IdRef(property[0]));
        assertTrue(doc.getPathAsString()
            .matches("/FV.*/sections/Family/Language/Dialect/Contributors/myContributor"));
        doc = session.getSourceDocument(new IdRef(property[0]));
        assertTrue(
            doc.getPathAsString().matches("/Family/Language/Dialect/Contributors/myContributor"));
        assertEquals(contributor.getRef().toString(), doc.getSourceId());
        assertNotEquals(contributor2.getRef(), new IdRef(property[1]));
        doc = session.getDocument(new IdRef(property[1]));
        assertTrue(doc.getPathAsString()
            .matches("/FV.*/sections/Family/Language/Dialect/Contributors/myContributor2"));
        doc = session.getSourceDocument(new IdRef(property[1]));
        assertTrue(
            doc.getPathAsString().matches("/Family/Language/Dialect/Contributors/myContributor2"));
        assertEquals(contributor2.getRef().toString(), doc.getSourceId());
        property = (String[]) proxy.getPropertyValue("fvproxy:proxied_categories");
        assertEquals(1, property.length);
        assertNotEquals(subcategory.getRef(), new IdRef(property[0]));
        doc = session.getDocument(new IdRef(property[0]));
        assertTrue(doc.getPathAsString()
            .matches("/FV.*/sections/Family/Language/Dialect/Categories/Category/SubCategory"));
        doc = session.getSourceDocument(new IdRef(property[0]));
        assertTrue(doc.getPathAsString()
            .matches("/Family/Language/Dialect/Categories/Category/SubCategory"));
    }

    private String[] getPropertyValueAsArray(DocumentModel proxy, String propertyName) {
        String[] property = new String[1];
        property[0] = (String) proxy.getPropertyValue(propertyName);

        return property;
    }

    private void verifyProxiedResource(String[] property, DocumentModel original) {
        assertEquals(1, property.length);
        IdRef ref = new IdRef(property[0]);
        assertNotEquals(original.getRef(), ref);
        DocumentModel doc = session.getDocument(ref);
        assertTrue(doc.getPathAsString()
            .matches("/FV.*/sections/Family/Language/Dialect/Resources/" + original.getName()));
        doc = session.getSourceDocument(ref);
        assertTrue(doc.getPathAsString()
            .matches("/Family/Language/Dialect/Resources/" + original.getName()));
        assertEquals(original.getRef().toString(), doc.getSourceId());
    }

    @Test
    public void removeCategoryFromWordsTest() {
        createWord();
        String[] categoriesProperty = (String[]) word.getPropertyValue("categories");
        Assert.assertTrue(categoriesProperty.length > 0);
        firstVoicesPublisherService
            .removeCategoryOrPhrasebooksFromWordsOrPhrases(session, subcategory);

        String wordQuery = "SELECT * FROM FVWord WHERE ecm:ancestorId='" + dialectDoc.getId()
            + "' AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
        DocumentModelList words = session.query(wordQuery);

        Assert.assertNull(words.get(0).getPropertyValue("categories"));
    }

    @Test
    public void removePhraseBookFromPhraseTest() {
        createPhrase();
        String[] phraseBookProperty = (String[]) phrase.getPropertyValue("phrase_books");
        Assert.assertTrue(phraseBookProperty.length > 0);
        firstVoicesPublisherService
            .removeCategoryOrPhrasebooksFromWordsOrPhrases(session, phraseBook);

        String phraseQuery = "SELECT * FROM FVPhrase WHERE ecm:ancestorId='" + dialectDoc.getId()
            + "' AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0";
        DocumentModelList phrases = session.query(phraseQuery);
        Assert.assertNull(phrases.get(0).getPropertyValue("phrase_books"));
    }

}