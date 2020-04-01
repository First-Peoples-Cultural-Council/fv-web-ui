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

package ca.firstvoices.workers;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

public class ComputeNativeOrderOnCharacterChangeWorker extends AbstractWork {
    private static final Log log = LogFactory.getLog(ComputeNativeOrderOnCharacterChangeWorker.class);

    private static final String COMPUTE_DIALECT_NATIVE_ORDER_TRANSLATION = "computeDialectNativeOrderTranslation";

    private NativeOrderComputeService service = Framework.getService(NativeOrderComputeService.class);
    private DocumentModel document;

    public ComputeNativeOrderOnCharacterChangeWorker(DocumentModel document) {
        super(COMPUTE_DIALECT_NATIVE_ORDER_TRANSLATION);
        this.document = document;
        setProgress(new Progress(33));
    }

    @Override
    public String getCategory() {
        return COMPUTE_DIALECT_NATIVE_ORDER_TRANSLATION;
    }

    @Override
    public void work() {
        try {
            setStatus("Starting Work");
            setProgress(new Progress(66));
            CoreInstance.doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(), coreSession -> {
                service.computeDialectNativeOrderTranslation(coreSession, document);
            });
            setProgress(new Progress(100));
        } catch (Exception e) {
            log.error(e);
        }
    }

    @Override
    public String getTitle() {
        return COMPUTE_DIALECT_NATIVE_ORDER_TRANSLATION;
    }


}
