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

package ca.firstvoices.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;

public class UtilityTestWordGenerator {

  private static String path =
      "/FV/Workspaces/Data/Test-Language-Familiy-2/Test-language-2/Test" + "-Dialect-2/Dictionary";

  public static void createWords(CoreSession session) {
    // "/FV/Family/Language/Dialect/Dictionary"
    String testWord = "Test_Word_";

    for (int i = 6001; i < 7001; i++) {
      String wordValue = testWord + i;

      Map<String, Object> complexValue = new HashMap<String, Object>();
      complexValue.put("language", "english");
      complexValue.put("translation", "translation" + wordValue);
      ArrayList<Object> definitionsList = new ArrayList<>();
      definitionsList.add(complexValue);
      DocumentModel word = session.createDocumentModel(path, wordValue, "FVWord");
      word.setPropertyValue("fvcore:definitions", definitionsList);
      word.setPropertyValue("fv:reference", wordValue);
      word.setPropertyValue("fv-word:part_of_speech", "Basic");
      word.setPropertyValue("dc:title", wordValue + "#");
      word = session.createDocument(word);

      if (i % 20 == 0) {
        session.save();
      }
    }

    session.save();
  }

}
