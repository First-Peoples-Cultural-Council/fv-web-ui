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

package ca.firstvoices.editors.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;


public class EditingUtils {

  private static final Log log = LogFactory.getLog(EditingUtils.class);

  // TODO DRAFT_FOLDER_NAME should change for the final release
  private static final String DRAFT_FOLDER_NAME = "* DocumentDraftFolder"; // TODO change
  // DRAFT_FOLDER_NAME for release

  public static boolean canBeEdited(DocumentModel doc) {
    // cannot edit locked document
    return !doc.isLocked();
  }

  /**
   * @param doc document for which we want to find DraftFolder.
   * @return string which is a path to a dialect draft folder null if draft folder does not exist.
   */
  public static String getDraftFolderPathIfExists(DocumentModel doc) {
    DocumentModel draftFolder = getDraftFolderDocIfExists(doc);
    if (draftFolder != null) {
      return draftFolder.getPathAsString();
    }
    return null;
  }

  public static String getDraftFolderPath(DocumentModel doc) {
    DocumentModel draftFolder = getDraftFolderDoc(doc);
    if (draftFolder != null) {
      return draftFolder.getPathAsString();
    }
    return null;
  }

  /**
   * Returns Ref object for the Draft Folder. If draft folder does not exit it will be created.
   *
   * @param doc document for which we want to find DraftFolder. It serves as an identifier for a
   *            particular dialect tree.
   * @return Ref object for draft folder document.
   */
  public static DocumentRef getDraftFolderRef(DocumentModel doc) {
    DocumentModel draftFolder = getDraftFolderDoc(doc);
    if (draftFolder != null) {
      return draftFolder.getRef();
    }
    return null;
  }

  /**
   * Returns Ref object for a draft folder associated with dialect in which doc exists. It does not
   * create draft folder.
   *
   * @param doc document for which we want to find DraftFolder. It serves as an identifier for a
   *            particular dialect tree.
   * @return Ref object for draft folder if exists null if it does not
   */
  public static DocumentRef getDraftFolderRefIfExists(DocumentModel doc) {
    DocumentModel draftFolder = getDraftFolderDocIfExists(doc);
    if (draftFolder != null) {
      return draftFolder.getRef();
    }
    return null;
  }

  /**
   * Return draft folder document for specific dialect tree. Do not create draft folder if it does
   * not exist.
   *
   * @param doc document for which we want to find DraftFolder. It serves as an identifier for a
   *            particular dialect tree.
   * @return draft folder if exists or null if it does not
   */
  private static DocumentModel getDraftFolderDocIfExists(DocumentModel doc) {
    DocumentModel dialect = getDialect(doc);

    // if we found dialect we can find DraftFolder
    if (dialect != null) {
      DocumentModel draftFolder = null;
      DocumentModelList children = dialect.getCoreSession().getChildren(dialect.getRef());

      for (DocumentModel child : children) {
        if (child.getType().equals("FVDraftFolder")) {

          draftFolder = child;
          break;
        }
      }

      return draftFolder;
    }

    return null;
  }

  /**
   * Return draft folder for specific dialect tree. Create draft folder if it does not exit.
   *
   * @param doc - document for which we want to find DraftFolder. The document can be any document
   *            from a particular dialect tree. It serves as an identifier for a particular dialect
   *            tree.
   * @return draft folder document
   */
  private static DocumentModel getDraftFolderDoc(DocumentModel doc) {
    DocumentModel draftFolder = getDraftFolderDocIfExists(doc);

    // if we did not find DraftFolder create one so we are done
    if (draftFolder == null) {
      CoreSession session = doc.getCoreSession();

      DocumentModel dialect = getDialect(doc);

      if (dialect == null) {
        return null;
      }

      draftFolder = session.createDocument(session
          .createDocumentModel(dialect.getPathAsString(), DRAFT_FOLDER_NAME, "FVDraftFolder"));
    }

    return draftFolder;
  }

  /**
   * @param doc
   * @return
   */
  public static DocumentModel getDialect(DocumentModel doc) {
    DocumentModel parent = doc;
    while (parent != null && !"Root".equals(parent.getType()) && !FV_DIALECT
        .equals(parent.getType())) {
      parent = doc.getCoreSession().getDocument(parent.getParentRef());
    }

    if ("Root".equals(parent.getType())) {
      return (null);
    } else {
      return parent;
    }
  }
}


