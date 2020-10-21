/**
 *
 */

package mappers.firstvoices;

/**
 * @author dyona
 *
 */
public class VideoMapper extends BinaryMapper {

  public VideoMapper() {
    super("FVVideo", "VIDEO_" + Columns.FILENAME, "VIDEO", Properties.RELATED_VIDEOS);
  }

  public VideoMapper(int number) {
    super("FVVideo", "VIDEO_" + number + "_" + Columns.FILENAME, "VIDEO_" + number,
        Properties.RELATED_VIDEOS);
  }

  public VideoMapper(String prefix) {
    super("FVVideo", prefix + "_VIDEO_" + Columns.FILENAME, prefix + "_VIDEO",
        Properties.RELATED_VIDEOS);
  }

  public VideoMapper(String prefix, int number) {
    super("FVVideo", prefix + "_VIDEO_" + number + "_" + Columns.FILENAME,
        prefix + "_VIDEO_" + number, Properties.RELATED_VIDEOS);
  }

}
