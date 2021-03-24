package org.nuxeo.ecm.restapi.server.jaxrs.firstvoices;


import ca.firstvoices.rest.data.Alphabet;
import ca.firstvoices.rest.data.Character;
import ca.firstvoices.rest.data.RelatedMedia;
import ca.firstvoices.rest.data.Word;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.IdRef;
import org.nuxeo.ecm.core.api.model.BlobNotFoundException;
import org.nuxeo.ecm.platform.query.api.PageProvider;
import org.nuxeo.ecm.platform.query.api.PageProviderService;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;
import org.nuxeo.ecm.webengine.model.WebObject;
import org.nuxeo.ecm.webengine.model.impl.DefaultObject;
import org.nuxeo.runtime.api.Framework;

@WebObject(type = "alphabet")
@Produces(MediaType.APPLICATION_JSON)
public class AlphabetObject extends DefaultObject {

  public static final String FIND_ALPHABET_PP = "FIND_ALPHABET_PP";
  public static final String FIND_CHARACTERS_IN_ALPHABET_PP = "FIND_CHARACTERS_IN_ALPHABET_PP";

  @GET
  @Path("/{dialectId}")
  public Response getAlphabet(
      @PathParam("dialectId") String id) {

    final PageProviderService pageProviderService = Framework.getService(PageProviderService.class);

    final Map<String, Serializable> props = new HashMap<>();

    final CoreSession session = getContext().getCoreSession();

    props.put(CoreQueryDocumentPageProvider.CORE_SESSION_PROPERTY, (Serializable) session);

    PageProvider<DocumentModel> pageProvider =
        (PageProvider<DocumentModel>) pageProviderService.getPageProvider(FIND_ALPHABET_PP,
            null,
            null,
            null,
            props,
            id);


    DocumentModel doc = pageProvider.getCurrentEntry();
    if (doc == null) {
      return Response.status(404).build();
    }

    Alphabet alphabet = new Alphabet(doc.getId());

    pageProvider = (PageProvider<DocumentModel>) pageProviderService.getPageProvider(
        FIND_CHARACTERS_IN_ALPHABET_PP,
        null,
        null,
        null,
        props,
        doc.getId());

    List<DocumentModel> allCharacters = new LinkedList<>();
    allCharacters.addAll(pageProvider.getCurrentPage());
    while (pageProvider.isNextPageAvailable()) {
      pageProvider.nextPage();
      allCharacters.addAll(pageProvider.getCurrentPage());
    }

    for (DocumentModel charDoc : allCharacters) {
      Character c = new Character(charDoc.getId(), charDoc.getTitle());

      String[] words = (String[]) charDoc.getPropertyValue("fvcharacter:related_words");
      if (words != null) {
        for (String s : words) {
          Word w = wordFromId(session, s);
          if (w != null) {
            c.getRelatedWords().add(w);
          }
        }
      }

      String[] relatedAudio = (String[]) charDoc
          .getPropertyValue("fvcore:related_audio");
      if (relatedAudio != null) {
        for (String audioId: relatedAudio) {
          RelatedMedia m = mediaFromId(session, audioId);
          if (m != null) {
            c.getRelatedAudio().add(m);
          }
        }
      }

      String[] relatedPictures =  (String[]) charDoc
          .getPropertyValue("fvcore:related_pictures");
      if (relatedPictures != null) {
        for (String pictureId: relatedPictures) {
          RelatedMedia m = mediaFromId(session, pictureId);
          if (m != null) {
            c.getRelatedPictures().add(m);
          }
        }
      }

      String[] relatedVideo = (String[]) charDoc
          .getPropertyValue("fvcore:related_videos");
      if (relatedVideo != null) {
        for (String videoId: relatedVideo) {
          RelatedMedia m = mediaFromId(session, videoId);
          if (m != null) {
            c.getRelatedVideo().add(m);
          }
        }
      }

      alphabet.getCharacters().add(c);
    }

    return Response.ok(alphabet).build();

  }

  private static Word wordFromId(CoreSession session, String id) {
    DocumentModel dom = session.getDocument(new IdRef(id));
    if (dom != null) {
      Word w = new Word(id, (String) dom.getPropertyValue("fv-word:part_of_speech"),
          dom.getTitle());

      ArrayList<HashMap<String, String>> definitions =
          (ArrayList<HashMap<String, String>>) dom.getPropertyValue("fv:definitions");
      if (definitions != null) {
        for (HashMap<String, String> definition: definitions) {
          w.getTranslations().put(definition.get("language"), definition.get("translation"));
        }
      }

      String[] relatedAudio = (String[]) dom.getPropertyValue("fvcore:related_audio");
      if (relatedAudio != null) {
        for (String audioId: relatedAudio) {
          RelatedMedia m = mediaFromId(session, audioId);
          if (m != null) {
            w.getRelatedAudio().add(m);
          }
        }
      }

      return w;
    }
    return null;
  }

  private static RelatedMedia mediaFromId(CoreSession session, String id) {
    DocumentModel dom = session.getDocument(new IdRef(id));

    if (dom != null) {
      Blob fileObj = null;

      String filename = null;
      String mimeType = null;
      String binaryPath = null;

      try {
        fileObj = (Blob) dom.getPropertyValue("file:content");

        if (fileObj != null) {
          filename = fileObj.getFilename();
          mimeType = fileObj.getMimeType();
          binaryPath = "nxfile/default/" + dom.getId() + "/file:content/" + filename;
        }

      } catch (BlobNotFoundException e) {
        // why does this trigger an exception? Nuxeo is astonishing.
      }

      return new RelatedMedia(id,
          dom.getTitle(),
          mimeType,
          binaryPath
         );
    }
    return null;
  }

}

