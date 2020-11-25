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

package ca.firstvoices.export.utils;

import ca.firstvoices.export.formatproducers.FVAbstractProducer;
import ca.firstvoices.export.propertyreaders.FVAbstractPropertyReader;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.apache.commons.codec.digest.DigestUtils;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.work.api.WorkManager;

public class FVExportUtils {

  private FVExportUtils() {

  }

  public static DocumentModel findDialectChildWithRef(
      CoreSession session, DocumentRef dialectRef, String dialectChildType) {
    DocumentModelList children = session.getChildren(dialectRef);

    for (DocumentModel child : children) {
      if (child.getType().equals(dialectChildType)) {
        return child;
      }
    }

    return null;
  }

  public static DocumentModel findDialectChild(DocumentModel dialect, String dialectChildType) {
    return findDialectChildWithRef(dialect.getCoreSession(), dialect.getRef(), dialectChildType);
  }

  // TODO: replace with query
  public static DocumentModel findChildWithName(
      CoreSession session, DocumentRef parentRef, String childName) {
    DocumentModelList children = session.getChildren(parentRef);

    for (DocumentModel child : children) {
      if (child.getName().equals(childName)) {
        return child;
      }
    }

    return null;
  }

  public static String makeExportWorkerID(FVExportWorkInfo info) {
    return info.getInitiatorName() + "-" + info.getDialectGUID() + "-" + info.getExportFormat();
  }

  // TODO: need to find how this is handled in the production
  private static String getNuxeoBinariesPath() {
    Map<String, String> env = System.getenv();
    String nuxeoBinaries = env.get("PWD");
    nuxeoBinaries = nuxeoBinaries + "/nxserver/data/binaries/";

    return nuxeoBinaries;
  }

  public static String getDataBlobDirectoryPath() {
    String nuxeoBinariesPath = getNuxeoBinariesPath();

    nuxeoBinariesPath = nuxeoBinariesPath + "data/";

    return nuxeoBinariesPath;

  }

  public static String getPathToChildInDialect(
      CoreSession session, DocumentModel dialect, String childType) {
    DocumentModel resourceFolder = findDialectChildWithRef(session, dialect.getRef(), childType);
    if (resourceFolder == null) {
      return null;
    }
    return resourceFolder.getPathAsString();
  }

  public static String makeExportDigest(Principal p, String query, List<String> columns) {
    StringBuilder colStr = new StringBuilder();

    for (String s : columns) {
      colStr.append(s);
    }

    colStr.append(query).append(makePrincipalWorkDigest(p));

    return makeDigestHash(colStr.toString());
  }

  public static String makePrincipalWorkDigest(Principal p) {
    String principalName = p.getName();
    String principalHash = String.valueOf(p.hashCode());
    principalName = principalName + principalHash;

    return makeDigestHash(principalName);
  }

  public static String makeDigestHash(String hashCandidate) {
    return DigestUtils.md5Hex(hashCandidate).toUpperCase();
  }

  public static FVAbstractPropertyReader makePropertyReader(
      CoreSession session, ExportColumnRecord colR, FVAbstractProducer producer)
      throws NoSuchMethodException, IllegalAccessException, InvocationTargetException,
      InstantiationException {
    Class<?> clazz = colR.requiredPropertyReader;
    Constructor<?> constructor = clazz.getConstructor(CoreSession.class,
        ExportColumnRecord.class,
        FVAbstractProducer.class);
    FVAbstractPropertyReader instance = (FVAbstractPropertyReader) constructor.newInstance(session,
        colR,
        producer);
    instance.session = session;

    return instance;
  }

  public static boolean checkForRunningWorkerBeforeProceeding(
      String workId, WorkManager workManager) {
    if (workManager == null) {
      return false; // worker is running
    }

    return workManager.find(workId, null) != null; // worker is running
    // worker is not running
  }

}
