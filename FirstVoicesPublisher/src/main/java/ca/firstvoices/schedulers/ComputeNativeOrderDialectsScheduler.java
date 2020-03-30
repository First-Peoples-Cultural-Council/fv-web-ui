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
import org.nuxeo.ecm.core.api.CoreSession;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.runtime.api.Framework;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.EventListener;

/**
 * @author david
 */
public class ComputeNativeOrderDialectsScheduler implements EventListener {

    private static final Log log = LogFactory.getLog(ComputeNativeOrderDialectsScheduler.class);


    protected NativeOrderComputeService service = Framework.getService(NativeOrderComputeService.class);

    public void handleEvent(Event event) {
        EventContext ctx = event.getContext();
        if (!(ctx instanceof DocumentEventContext)) {
            return;
        }

        computeDialectsOnSchedule(ctx.getCoreSession());

    }

    public void computeDialectsOnSchedule(CoreSession session) {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.DAY_OF_YEAR, -7);
        String date = dateFormat.format(calendar.getTime());

        // oldest/earliest dates to most recent
        String query = "SELECT * FROM FVDialect "
                + "WHERE fvdialect:last_native_order_recompute < DATE '"
                + date + "'"
                + " OR fvdialect:last_native_order_recompute IS NULL"
                + " AND ecm:isVersion = 0  AND ecm:isTrashed = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isProxy = 0"
                + " ORDER BY fvdialect:last_native_order_recompute ASC";

        DocumentModelList dialects = session.query(query);


        // Process only a subset of items each night:
        for (int i = 0, dialectsSize = dialects.size(); i < (Math.min(dialectsSize, 5)); i++) {
            DocumentModel dialect = dialects.get(i);
            try {
                service.computeDialectNativeOrderTranslation(dialect);
            } catch (Exception e) {
                log.error(e);
            }
        }

        session.save();
    }
}
