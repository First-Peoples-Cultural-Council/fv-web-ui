/*
 *
 * Copyright 2020 First People's Cultural Council
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * /
 */

package ca.firstvoices.schedulers;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public class ComputeNativeOrderDialectsScheduler implements EventListener {

    private static final Log log = LogFactory.getLog(ComputeNativeOrderDialectsScheduler.class);

    protected NativeOrderComputeService service = Framework.getService(NativeOrderComputeService.class);

    @Override
    public void handleEvent(Event event) {
        try {
            if (event.getName().equals("computeNativeOrder")) {
                CoreInstance.doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(), session -> {
                    computeDialectsOnSchedule(session);
                });
            }
        } catch (Exception e) {
            log.error(e);
        }
    }

    public DocumentModelList computeDialectsOnSchedule(CoreSession session) {
        log.info("Performing Routine Recompute of Custom Orders");
        String query = "SELECT * FROM FVDialect WHERE ecm:isProxy = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0 ORDER BY fvdialect:last_native_order_recompute ASC";

        DocumentModelList dialects = session.query(query);

        // Process only a subset of items each night:
        if (dialects != null && dialects.size() > 0) {
            for (int i = 0; i < (Math.min(dialects.size(), 5)); i++) {
                DocumentModel dialect = dialects.get(i);
                service.computeDialectNativeOrderTranslation(dialect);
                log.info("Completed recompute of custom order for " + dialect.getPropertyValue("dc:title"));
            }

            session.save();
        }

        return dialects;
    }
}
