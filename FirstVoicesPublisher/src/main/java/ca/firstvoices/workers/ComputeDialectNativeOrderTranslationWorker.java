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
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

public class ComputeDialectNativeOrderTranslationWorker extends AbstractWork {

    private static final String COMPUTE_DIALECT_NATIVE_ORDER_TRANSLATION = "computeDialectNativeOrderTranslation";
    private static final String COMPUTE_DIALECT_NATIVE_ORDER_TRANSLATION_QUEUE = "computeDialectNativeOrderTranslationQueue";

    private NativeOrderComputeService service = Framework.getService(NativeOrderComputeService.class);
    private String repositoryName;
    private DocumentModel document;
    private String userName;


    public ComputeDialectNativeOrderTranslationWorker(String userName, DocumentModel dialect) {
        super(COMPUTE_DIALECT_NATIVE_ORDER_TRANSLATION);
        setStatus("Instantiating worker " + getId());
        this.userName = userName;
        this.document = dialect;
        this.repositoryName = Framework.getService(RepositoryManager.class).getDefaultRepositoryName();
        setStatus("Finished Instantiating worker " + getId());
        setProgress(new Progress(20));
    }

    @Override
    public String getCategory() {
        return COMPUTE_DIALECT_NATIVE_ORDER_TRANSLATION_QUEUE;
    }

    @Override
    public void work() {
        setStatus("Setting fields for worker " + getId());
        setOriginatingUsername(userName);
        setDocument(repositoryName, document.getId(), true);
        setStatus("Finished setting fields for worker " + getId());
        setProgress(new Progress(40));
        setStatus("Opening a user session for user: " + userName + " for worker " + getId());
        openUserSession();
        setStatus("Finished opening a user session for user: " + userName + " for worker " + getId());
        setStatus("Starting Work");
        setProgress(new Progress(60));
        DocumentModel documentModel = session.getDocument(getDocument().getDocRef());
        service.computeDialectNativeOrderTranslation(session, documentModel);
        setStatus("Done work. Closing user session for user: " + userName + " for worker " + getId());
        setProgress(new Progress(80));
        closeSession();
        setStatus("Finsihed closing user session for user: " + userName + " for worker " + getId());
        setProgress(new Progress(100));
    }

    @Override
    public String getTitle() {
        return COMPUTE_DIALECT_NATIVE_ORDER_TRANSLATION;
    }


}
