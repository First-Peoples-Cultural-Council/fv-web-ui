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

package ca.firstvoices.nativeorder.workers;

import ca.firstvoices.nativeorder.services.NativeOrderComputeService;
import org.nuxeo.ecm.core.api.CoreInstance;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentRef;
import org.nuxeo.ecm.core.api.PathRef;
import org.nuxeo.ecm.core.api.repository.RepositoryManager;
import org.nuxeo.ecm.core.work.AbstractWork;
import org.nuxeo.runtime.api.Framework;

/**
 * @author david
 */
public class ComputeNativeOrderDialectWorker extends AbstractWork {

  private static final String COMPUTE_NATIVE_ORDER_DIALECT = "computeNativeOrderDialect";
  private DocumentRef dialect;
  private NativeOrderComputeService service = Framework.getService(NativeOrderComputeService.class);

  public ComputeNativeOrderDialectWorker(DocumentRef dialectRef) {
    super(COMPUTE_NATIVE_ORDER_DIALECT);
    this.dialect = dialectRef;
  }

  @Override
  public void work() {
    CoreInstance
        .doPrivileged(Framework.getService(RepositoryManager.class).getDefaultRepositoryName(),
            session -> {
              DocumentModel dialectWithSession = session.getDocument(dialect);
              DocumentModel alphabet = session
                  .getDocument(new PathRef(dialectWithSession.getPathAsString() + "/Alphabet"));
              service.computeDialectNativeOrderTranslation(session, dialectWithSession, alphabet);
              alphabet.setPropertyValue("custom_order_recompute_required", false);
              session.saveDocument(alphabet);
            });
  }

  @Override
  public String getCategory() {
    return COMPUTE_NATIVE_ORDER_DIALECT;
  }

  @Override
  public String getTitle() {
    return COMPUTE_NATIVE_ORDER_DIALECT;
  }


}
