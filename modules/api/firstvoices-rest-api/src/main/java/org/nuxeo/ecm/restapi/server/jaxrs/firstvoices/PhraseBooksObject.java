package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;

import ca.firstvoices.rest.data.PhraseBook;
import ca.firstvoices.rest.data.PhraseBookList;
import java.io.Serializable;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.runtime.api.Framework;

@WebObject(type = "phrasebook")
@Produces(MediaType.APPLICATION_JSON)
public class PhraseBooksObject extends DefaultObject {

  public static final String FIND_PHRASEBOOKS_PP = "FIND_PHRASEBOOKS_PP";
  public static final String FIND_PHRASEBOOKS_IN_PHRASEBOOK_PP =
      "FIND_PHRASEBOOKS_IN_PHRASEBOOK_PP";
  public static final String FIND_PHRASES_WITH_PHRASEBOOK_PP = "FIND_PHRASES_WITH_PHRASEBOOK_PP";
  public static final String FIND_PHRASES_WITH_PHRASEBOOK_PROXIED_PP =
      "FIND_PHRASES_WITH_PHRASEBOOK_PROXIED_PP";

  /**
   * Accepts the ID of a dialect for which to return all phrase books (and their item counts)
   * inUseOnly queryParam, if true, filters out zero-usage phrasebooks
   */
  @GET
  @Path("/{dialectId}")
  public Response getPhraseBooks(
      @PathParam("dialectId") String id,
      @QueryParam(value = "inUseOnly") @DefaultValue("true") boolean inUseOnly) {

    // First find fvcategories with title 'Phrase Books' that are descendant of id (the dialect)
    // then descendant FVCategory instances are the phrase books
    // Then any FVPhrase having a phrase book record containing the id of one of those books

    final PageProviderService pageProviderService = Framework.getService(PageProviderService.class);
    final Map<String, Serializable> props = new HashMap<>();

    final CoreSession session = getContext().getCoreSession();

    props.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY, (Serializable) session);

    PageProvider<DocumentModel> pageProvider =
        (PageProvider<DocumentModel>) pageProviderService.getPageProvider(FIND_PHRASEBOOKS_PP,
            null,
            null,
            null,
            props,
            id);

    List<PhraseBook> list = new LinkedList<>();

    DocumentModel phraseBooksDoc = pageProvider.getCurrentEntry();
    if (phraseBooksDoc == null) {
      return Response.ok(new PhraseBookList(list)).build();
    }

    pageProvider = (PageProvider<DocumentModel>) pageProviderService
        .getPageProvider(FIND_PHRASEBOOKS_IN_PHRASEBOOK_PP,
        null,
        null,
        null,
        props,
        phraseBooksDoc.getId());

    List<DocumentModel> allPhrasebooks = new LinkedList<>();
    allPhrasebooks.addAll(pageProvider.getCurrentPage());
    while (pageProvider.isNextPageAvailable()) {
      pageProvider.nextPage();
      allPhrasebooks.addAll(pageProvider.getCurrentPage());
    }

    String phrasesInPhraseBookPP = FIND_PHRASES_WITH_PHRASEBOOK_PP;
    if (phraseBooksDoc.getPathAsString().toLowerCase().startsWith("/fv/sections")) {
      phrasesInPhraseBookPP = FIND_PHRASES_WITH_PHRASEBOOK_PROXIED_PP;
    }


    for (DocumentModel phraseBook : allPhrasebooks) {

      PageProvider<DocumentModel> phrasesInPhrasebookPageProvider =
          (PageProvider<DocumentModel>) pageProviderService
              .getPageProvider(phrasesInPhraseBookPP,
              null,
              null,
              null,
              props,
              phraseBook.getId());


      List<DocumentModel> allPhrases =
          new LinkedList<>(phrasesInPhrasebookPageProvider.getCurrentPage());
      while (phrasesInPhrasebookPageProvider.isNextPageAvailable()) {
        phrasesInPhrasebookPageProvider.nextPage();
        allPhrases.addAll(phrasesInPhrasebookPageProvider.getCurrentPage());
      }

      int entryCount = allPhrases.size();

      if (!inUseOnly || entryCount > 0) {
        PhraseBook p = new PhraseBook(phraseBook.getId(), phraseBook.getTitle(), entryCount);
        list.add(p);
      }
    }

    return Response.ok(new PhraseBookList(list)).build();

  }
}
