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

package ca.firstvoices.operations;

import java.security.Principal;
import java.util.Arrays;
import java.util.GregorianCalendar;
import java.util.List;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import org.nuxeo.ecm.automation.core.Constants;
import org.nuxeo.ecm.automation.core.annotations.Context;
import org.nuxeo.ecm.automation.core.annotations.Operation;
import org.nuxeo.ecm.automation.core.annotations.OperationMethod;
import org.nuxeo.ecm.automation.core.annotations.Param;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.blob.StringBlob;

/**
 * @author cstuart
 */
@Operation(id = FVGenerateJsonStatistics.ID, category = Constants.CAT_FETCH, label =
    "FVGenerateJsonStatistics", description = "")
public class FVGenerateJsonStatistics {

  public static final String ID = "FVGenerateJsonStatistics";
  protected final String baseDocsQuery = "SELECT * FROM %s WHERE ecm:path STARTSWITH '%s' AND "
      + "ecm:currentLifeCycleState <> 'deleted'";
  private final List<String> allowedDocTypes = Arrays
      .asList("words", "phrases", "characters", "songs", "stories");
  @Context
  protected CoreSession session;
  @Param(name = "dialectPath")
  protected String dialectPath;
  @Param(name = "docTypes")
  protected StringList docTypes;
  protected String sectionDialectId;
  protected String principalName;
  protected int maxQueryResults = 5;
  protected ObjectMapper mapper = new ObjectMapper();

  @OperationMethod
  public Blob run() {

    // JSON object to be returned
    ObjectNode rootJsonObj = mapper.createObjectNode();

    rootJsonObj.put("dialectPath", dialectPath);

    // Get current user
    Principal principal = session.getPrincipal();
    principalName = principal.getName();
    rootJsonObj.put("user", principalName);

    // Generate statistics for each specified docType, and add them to the root JSON object
    for (String docType : docTypes) {
      // Perform some validation on provided parameters
      if (allowedDocTypes.contains(docType) && (dialectPath.startsWith("/FV/Workspaces/")
          || dialectPath.startsWith("/FV/sections/"))) {
        ObjectNode jsonObj = generateDocumentStatsJson(docType);
        rootJsonObj.put(docType, jsonObj);
      }
    }
    return new StringBlob(rootJsonObj.toString(), "application/json");
  }

  private ObjectNode generateDocumentStatsJson(String docType) {

    ArrayNode recentlyModifiedJsonArray = mapper.createArrayNode();
    ArrayNode recentlyCreatedJsonArray = mapper.createArrayNode();
    ArrayNode userRecentlyModifiedJsonArray = mapper.createArrayNode();

    ObjectNode documentJsonObj = mapper.createObjectNode();

    // Build query for the specified document type
    String query = constructQuery(docType);

    if (query != null) {

      // Total docs
      DocumentModelList resultDocs = session.query(query, null, 1, 0, true);
      documentJsonObj.put("total", resultDocs.totalSize());

      // Docs in 'New' state
      DocumentModelList newDocs = session
          .query(query + " AND ecm:currentLifeCycleState='New'", null, 1, 0, true);
      documentJsonObj.put("new", newDocs.totalSize());

      // Docs in 'Enabled' state
      DocumentModelList enabledDocs = session
          .query(query + " AND ecm:currentLifeCycleState='Enabled'", null, 1, 0, true);
      documentJsonObj.put("enabled", enabledDocs.totalSize());

      // Docs in 'Published' state
      DocumentModelList publishedDocs = session
          .query(query + " AND ecm:currentLifeCycleState='Published'", null, 1, 0, true);
      documentJsonObj.put("published", publishedDocs.totalSize());

      // Docs in 'Disabled' state
      DocumentModelList disabledDocs = session
          .query(query + " AND ecm:currentLifeCycleState='Disabled'", null, 1, 0, true);
      documentJsonObj.put("disabled", disabledDocs.totalSize());

      // Get current date
      GregorianCalendar today = new GregorianCalendar();
      int currentYear = today.get(GregorianCalendar.YEAR);
      int currentMonth = today.get(GregorianCalendar.MONTH) + 1;
      int currentDay = today.get(GregorianCalendar.DAY_OF_MONTH);
      String todayDateString =
          currentYear + "-" + (currentMonth < 10 ? ("0" + currentMonth) : (currentMonth)) + "-"
              + currentDay;

      // Count documents created today
      String createdTodayQuery = query + " AND dc:created >= DATE '" + todayDateString + "'";
      DocumentModelList createdTodayDocs = session.query(createdTodayQuery, null, 1, 0, true);
      documentJsonObj.put("created_today", createdTodayDocs.totalSize());

      // Count documents modified today
      String modifiedTodayQuery = query + " AND dc:modified >= DATE '" + todayDateString + "'";
      DocumentModelList modifiedTodayDocs = session.query(modifiedTodayQuery, null, 1, 0, true);
      documentJsonObj.put("modified_today", modifiedTodayDocs.totalSize());

      // Count documents created within the last 7 days
      GregorianCalendar sevenDaysAgo = new GregorianCalendar();
      sevenDaysAgo.add(GregorianCalendar.DAY_OF_MONTH, -7);
      int sevenDaysAgoYear = sevenDaysAgo.get(GregorianCalendar.YEAR);
      int sevenDaysAgoMonth = sevenDaysAgo.get(GregorianCalendar.MONTH) + 1;
      int sevenDaysAgoDay = sevenDaysAgo.get(GregorianCalendar.DAY_OF_MONTH);
      String sevenDaysAgoDateString =
          sevenDaysAgoYear + "-" + (sevenDaysAgoMonth < 10 ? ("0" + sevenDaysAgoMonth)
              : (sevenDaysAgoMonth)) + "-" + sevenDaysAgoDay;
      String createdWithinSevenDaysQuery =
          query + " AND dc:created >= DATE '" + sevenDaysAgoDateString + "'";
      DocumentModelList createdWithin7DaysDocs = session
          .query(createdWithinSevenDaysQuery, null, 1, 0, true);
      documentJsonObj.put("created_within_7_days", createdWithin7DaysDocs.totalSize());

      // Count available in childrens archive
      DocumentModelList childrensArchiveDocs = session
          .query(query + " AND fv:available_in_childrens_archive=1", null, 1, 0, true);
      documentJsonObj.put("available_in_childrens_archive", childrensArchiveDocs.totalSize());
      // List of most recently created docs
      //  DocumentModelList recentlyCreatedDocs = session.query(query + " ORDER BY
      //  dc:created
      //  DESC", null, maxQueryResults, 0, true);
      //  for (DocumentModel doc : recentlyCreatedDocs) {
      //      ObjectNode recentlyCreatedJsonObj = mapper.createObjectNode();
      //      recentlyCreatedJsonObj.put("ecm:uuid", doc.getId());
      //      recentlyCreatedJsonObj.put("dc:title", doc.getTitle());
      //      recentlyCreatedJsonObj.put("ecm:path", doc.getPathAsString());
      //      GregorianCalendar dateCreated = (GregorianCalendar)doc.getPropertyValue
      //      ("dc:created");
      //      recentlyCreatedJsonObj.put("dc:created", dateCreated.getTime().toString
      //      ());
      //      recentlyCreatedJsonObj.put("dc:lastContributor", (String)doc
      //      .getPropertyValue
      //      ("dc:lastContributor"));
      //      recentlyCreatedJsonArray.add(recentlyCreatedJsonObj);
      //  }
      //    documentJsonObj.put("most_recently_created", recentlyCreatedJsonArray);
      //
      //  // List of most recently modified docs
      //  DocumentModelList recentlyModifiedDocs = session.query(query + " ORDER BY
      //  dc:modified DESC", null, maxQueryResults, 0, true);
      //  for (DocumentModel doc : recentlyModifiedDocs) {
      //      ObjectNode recentlyModifiedJsonObj = mapper.createObjectNode();
      //      recentlyModifiedJsonObj.put("ecm:uuid", doc.getId());
      //      recentlyModifiedJsonObj.put("dc:title", doc.getTitle());
      //      recentlyModifiedJsonObj.put("ecm:path", doc.getPathAsString());
      //      GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue
      //      ("dc:modified");
      //      recentlyModifiedJsonObj.put("dc:modified", dateModified.getTime()
      //      .toString());
      //      recentlyModifiedJsonObj.put("dc:lastContributor", (String)doc
      //      .getPropertyValue
      //      ("dc:lastContributor"));
      //      recentlyModifiedJsonArray.add(recentlyModifiedJsonObj);
      //  }
      //    documentJsonObj.put("most_recently_modified", recentlyModifiedJsonArray);
      //
      //  // List of user most recently modified docs
      //  DocumentModelList userMostRecentlyModifiedDocs = session.query(query + " AND
      //  dc:lastContributor='" + principalName + "' ORDER BY dc:modified DESC", null,
      //  maxQueryResults, 0, true);
      //  for (DocumentModel doc : userMostRecentlyModifiedDocs) {
      //      ObjectNode userRecentlyModifiedJsonObj = mapper.createObjectNode();
      //      userRecentlyModifiedJsonObj.put("ecm:uuid", doc.getId());
      //      userRecentlyModifiedJsonObj.put("dc:title", doc.getTitle());
      //      userRecentlyModifiedJsonObj.put("ecm:path", doc.getPathAsString());
      //      GregorianCalendar dateModified = (GregorianCalendar)doc.getPropertyValue
      //      ("dc:modified");
      //      userRecentlyModifiedJsonObj.put("dc:modified", dateModified.getTime()
      //      .toString
      //      ());
      //      userRecentlyModifiedJsonObj.put("dc:lastContributor", (String)doc
      //      .getPropertyValue("dc:lastContributor"));
      //      userRecentlyModifiedJsonArray.add(userRecentlyModifiedJsonObj);
      //  }
      //    documentJsonObj.put("user_most_recently_modified",
      //    userRecentlyModifiedJsonArray);
    }
    return documentJsonObj;
  }

  // Build the query for a specified document type
  private String constructQuery(String docType) {

    String query = null;
    String proxyQueryParams = null;

    // Query parameters depending on path
    if (dialectPath.contains("/Workspaces/")) {
      proxyQueryParams = " AND ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0";
    } else if (dialectPath.contains("/sections/")) {
      proxyQueryParams = " AND ecm:isProxy = 1";
    }

    if (docType.equalsIgnoreCase("words")) {
      query = String.format(baseDocsQuery, "FVWord", dialectPath) + proxyQueryParams;
    } else if (docType.equalsIgnoreCase("phrases")) {
      query = String.format(baseDocsQuery, "FVPhrase", dialectPath) + proxyQueryParams;
    } else if (docType.equalsIgnoreCase("characters")) {
      query = String.format(baseDocsQuery, "FVCharacter", dialectPath) + proxyQueryParams;
    } else if (docType.equalsIgnoreCase("songs")) {
      query = String.format(baseDocsQuery, "FVBook", dialectPath) + proxyQueryParams
          + " AND fvbook:type = 'song'";
    } else if (docType.equalsIgnoreCase("stories")) {
      query = String.format(baseDocsQuery, "FVBook", dialectPath) + proxyQueryParams
          + " AND fvbook:type = 'story'";
    }

    return query;
  }

}
