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

package ca.firstvoices.listeners;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.directory.Session;
import org.nuxeo.ecm.directory.api.DirectoryService;
import org.nuxeo.runtime.api.Framework;

/**
 * Remove all forgottenPassword keys created the day before.
 */
public class FVCleanForgottenPasswordKeysListener implements EventListener {

  public static final Log log = LogFactory.getLog(FVCleanForgottenPasswordKeysListener.class);

  @Override
  public void handleEvent(Event event) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
    Calendar yesterday = Calendar.getInstance();
    yesterday.add(Calendar.DATE, -1);
    String simpleDate = sdf.format(yesterday.getTime());

    try (Session session = Framework.getService(DirectoryService.class).open("resetPasswordKeys")) {
      Map<String, Serializable> filter = new HashMap<String, Serializable>();
      filter.put("creationDate", simpleDate);
      DocumentModelList keysToRemove = session.query(filter);
      for (DocumentModel key : keysToRemove) {
        session.deleteEntry(key);
      }
    }
  }
}
