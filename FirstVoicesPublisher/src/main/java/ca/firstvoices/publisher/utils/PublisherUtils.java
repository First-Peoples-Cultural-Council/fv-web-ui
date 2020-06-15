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

package ca.firstvoices.publisher.utils;

import ca.firstvoices.publisher.services.FirstVoicesPublisherService;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.platform.publisher.api.PublisherService;
import org.nuxeo.runtime.api.Framework;

public class PublisherUtils {

  private static final Log log = LogFactory.getLog(PublisherUtils.class);

  protected static FirstVoicesPublisherService FVPublisherService = Framework
      .getService(FirstVoicesPublisherService.class);

  /**
   * Adds proxy properties to assets (Media, Words, Phrases)
   *
   * @param asset
   * @return
   */
  public static Map<String, String> addAssetDependencies(DocumentModel asset) {

    Map<String, String> dependencies = new HashMap<String, String>();

    dependencies.put("fvcore:related_audio", "fvproxy:proxied_audio");
    dependencies.put("fvcore:related_pictures", "fvproxy:proxied_pictures");
    dependencies.put("fvcore:related_videos", "fvproxy:proxied_videos");
    dependencies.put("fvcore:source", "fvproxy:proxied_source");
    dependencies.put("fvcore:related_assets", "fvproxy:proxied_related_assets");

    if (asset.hasSchema("fvmedia")) {
      dependencies.put("fvmedia:source", "fvproxy:proxied_source");
      dependencies.put("fvmedia:recorder", "fvproxy:proxied_recorder");
      dependencies.put("fvmedia:origin", "fvproxy:proxied_origin");
    }

    if (asset.hasSchema("fv-word")) {
      dependencies.put("fv-word:categories", "fvproxy:proxied_categories");
      dependencies.put("fv-word:related_phrases", "fvproxy:proxied_phrases");
    }

    if (asset.hasSchema("fvbook")) {
      dependencies.put("fvbook:author", "fvproxy:proxied_author");
    }

    if (asset.hasSchema("fv-phrase")) {
      dependencies.put("fv-phrase:phrase_books", "fvproxy:proxied_categories");
    }

    if (asset.hasSchema("fvcharacter")) {
      dependencies.put("fvcharacter:related_words", "fvproxy:proxied_words");
    }

    return dependencies;
  }

  /**
   * Checks if a dependency is empty
   *
   * @param dependencyPropertyValue
   * @return
   */
  public static boolean dependencyIsEmpty(String[] dependencyPropertyValue) {
    return dependencyPropertyValue == null || dependencyPropertyValue.length == 0 || (
        dependencyPropertyValue.length == 1 && dependencyPropertyValue[0] == null);
  }

  /**
   * Extracts dependency values from property as a string, always returning an array for
   * simplicity.
   *
   * @param input
   * @param dependency
   * @return
   */
  public static String[] extractDependencyPropertyValueAsString(DocumentModel input,
      String dependency) {
    String[] dependencyPropertyValue = new String[1];
    String propertyValue = (String) input.getPropertyValue(dependency);

    if (propertyValue != null) {
      dependencyPropertyValue[0] = propertyValue;
    }

    return dependencyPropertyValue;
  }

  /**
   * Constructs the dependency's updated value for insertion, as an array.
   */
  public static String[] constructDependencyPropertyValueAsArray(String[] currentPropValue,
      DocumentModel publishedDep) {
    String[] updatedProperty = new String[1];

    if (currentPropValue != null) {
      updatedProperty = Arrays.copyOf(currentPropValue, currentPropValue.length + 1);
      updatedProperty[updatedProperty.length - 1] = publishedDep.getRef().toString();
    } else {
      updatedProperty[0] = publishedDep.getRef().toString();
    }
    return updatedProperty;
  }

  public static DocumentModel publishAncestors(CoreSession session, String docType,
      DocumentModel dependencyDocModel, PublisherService publisherService) {
    DocumentModel parentDependencySection;
    DocumentModel publishedDep = null;

    DocumentModelList parents = new DocumentModelListImpl();
    parents.add(dependencyDocModel);
    DocumentModel parent = session.getDocument(dependencyDocModel.getParentRef());
    while (parent != null && docType.equals(parent.getType())) {
      parents.add(parent);
      parent = session.getDocument(parent.getParentRef());
    }
    Object[] docs = parents.toArray();
    for (int i = docs.length - 1; i >= 0; i--) {
      parentDependencySection = FVPublisherService
          .getPublication(session, ((DocumentModel) docs[i]).getRef());
      if (parentDependencySection == null) {
        parentDependencySection = FVPublisherService
            .getPublication(session, ((DocumentModel) docs[i]).getParentRef());
        parentDependencySection = FVPublisherService
            .publishDocument(session, ((DocumentModel) docs[i]), parentDependencySection);
      }
      if (i == 0) {
        publishedDep = parentDependencySection;
      }
    }

    return publishedDep;
  }

}
