/**
 *
 */

package common;

/**
 * @author loopingz
 *
 */
public class ConsoleLogger {

  public static boolean disable = true;
  private static Integer depth = 0;

  public static void increaseDepth() {
    depth++;
  }

  public static void decreaseDepth() {
    depth--;
  }

  private static String getDepth() {
    String result = "";
    if (depth == 0) {
      return result;
    }
    Integer i = depth;
    while (i-- > 0) {
      result += "|";
    }
    result += "-";
    return result;
  }

  public static void out(String value) {
    if (disable && !value.startsWith("#")) {
      return;
    }
    System.out.println(getDepth() + value);
  }
}
