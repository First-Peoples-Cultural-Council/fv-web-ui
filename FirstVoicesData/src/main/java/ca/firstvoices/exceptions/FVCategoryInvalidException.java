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

package ca.firstvoices.exceptions;

import org.nuxeo.ecm.core.api.NuxeoException;

/**
 * @author david
 */
public class FVCategoryInvalidException extends NuxeoException {

  public FVCategoryInvalidException() {
  }

  public FVCategoryInvalidException(int statusCode) {
    super(statusCode);
  }

  public FVCategoryInvalidException(String message) {
    super(message);
  }

  public FVCategoryInvalidException(String message, int statusCode) {
    super(message, statusCode);
  }

  public FVCategoryInvalidException(String message, Throwable cause) {
    super(message, cause);
  }

  public FVCategoryInvalidException(String message, Throwable cause, int statusCode) {
    super(message, cause, statusCode);
  }

  public FVCategoryInvalidException(Throwable cause) {
    super(cause);
  }

  public FVCategoryInvalidException(Throwable cause, int statusCode) {
    super(cause, statusCode);
  }


}
