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

package ca.firstvoices.export.formatproducers;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.StringJoiner;

/*
    Helper class to write CSV data to a file
 */

public class FVSimpleCSVWriter {

  protected FileWriter fileHandle;

  FVSimpleCSVWriter(FileWriter writer) {
    fileHandle = writer;
  }

  public void writeNext(List<String> row) throws IOException {
    StringJoiner joiner = new StringJoiner(",");

    for (String s : row) {
      joiner.add(s);
    }

    String output = joiner.toString() + "\n";
    fileHandle.write(output);
  }

  public void flush() throws IOException {
    fileHandle.flush();
  }

  public void close() throws IOException {
    fileHandle.close();
  }
}
