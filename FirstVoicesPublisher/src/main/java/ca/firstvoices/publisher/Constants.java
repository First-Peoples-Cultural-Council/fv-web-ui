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

package ca.firstvoices.publisher;

public class Constants {

  public static final String GROUP_NAME = "Publishing";

  // Publishing workers queue
  public static final String PUBLISHING_WORKERS_QUEUE = "publishingWorkerQueue";

  // Publish Dialect operations
  public static final String PUBLISH_DIALECT_JOB_ID = GROUP_NAME + ".PublishDialect";
  public static final String PUBLISH_DIALECT_ACTION_ID = PUBLISH_DIALECT_JOB_ID;

  // Confusables Status Operation
  public static final String CONFUSABLES_STATUS_ACTION_ID = GROUP_NAME + ".PublishDialectStatus";

  private Constants() {
    throw new IllegalStateException("Utility class");
  }
}
