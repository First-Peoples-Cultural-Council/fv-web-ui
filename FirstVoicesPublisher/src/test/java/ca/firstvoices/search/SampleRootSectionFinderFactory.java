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
package ca.firstvoices.search;

import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.platform.publisher.helper.RootSectionFinder;
import org.nuxeo.ecm.platform.publisher.helper.RootSectionFinderFactory;
import org.nuxeo.ecm.platform.publisher.impl.finder.DefaultRootSectionsFinder;

public class SampleRootSectionFinderFactory implements RootSectionFinderFactory {

  @Override
  public RootSectionFinder getRootSectionFinder(CoreSession session) {
    return new SampleRootSectionFinder(session);
  }

  class SampleRootSectionFinder extends DefaultRootSectionsFinder {

    public SampleRootSectionFinder(CoreSession userSession) {
      super(userSession);
    }

    // Ugly fix just for test
    @Override
    protected DocumentModelList getDefaultSectionRoots(CoreSession session) {
      return session.query(buildQuery(null));
    }

    @Override
    protected String buildQuery(String path) {
      return "SELECT * FROM Document WHERE ecm:path = '/FV/sections/Data'";

    }
  }
}
