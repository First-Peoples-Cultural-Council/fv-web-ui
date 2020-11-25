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

package ca.firstvoices.operations.dialect.categories.exceptions;

import org.nuxeo.ecm.core.api.NuxeoException;

/**
 * @author david
 */
public class InvalidCategoryException extends NuxeoException {

  public InvalidCategoryException() {
  }

  public InvalidCategoryException(int statusCode) {
    super(statusCode);
  }

  public InvalidCategoryException(String message) {
    super(message);
  }

  public InvalidCategoryException(String message, int statusCode) {
    super(message, statusCode);
  }

  public InvalidCategoryException(String message, Throwable cause) {
    super(message, cause);
  }

  public InvalidCategoryException(String message, Throwable cause, int statusCode) {
    super(message, cause, statusCode);
  }

  public InvalidCategoryException(Throwable cause) {
    super(cause);
  }

  public InvalidCategoryException(Throwable cause, int statusCode) {
    super(cause, statusCode);
  }


}
