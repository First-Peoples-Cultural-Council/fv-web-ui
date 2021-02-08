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

package ca.firstvoices.characters;

public class Constants {

  public static final String GROUP_NAME = "Alphabet";

  // Character workers queue
  public static final String CHARACTER_WORKERS_QUEUE = "charactersWorkerQueue";

  // Clean Confusables Operations
  public static final String CLEAN_CONFUSABLES_JOB_ID = GROUP_NAME + ".CleanConfusables";
  public static final String CLEAN_CONFUSABLES_ACTION_ID = CLEAN_CONFUSABLES_JOB_ID;

  // Add Confusables Operations
  public static final String ADD_CONFUSABLES_JOB_ID = GROUP_NAME + ".AddConfusables";
  public static final String ADD_CONFUSABLES_ACTION_ID = ADD_CONFUSABLES_JOB_ID;

  // Add Custom Reorder Operations
  public static final String COMPUTE_ORDER_JOB_ID = GROUP_NAME + ".ComputeCustomOrder";
  public static final String COMPUTE_ORDER_ACTION_ID = COMPUTE_ORDER_JOB_ID;

  // Status Operations
  public static final String CONFUSABLES_STATUS_ACTION_ID = GROUP_NAME + ".ConfusablesStatus";
  public static final String CUSTOM_ORDER_STATUS_ACTION_ID = GROUP_NAME + ".CustomOrderStatus";

  private Constants() {
    throw new IllegalStateException("Utility class");
  }
}
