/**
 *
 */

package mappers.firstvoices;

/**
 * @author dyona
 *
 */
public class PictureMapper extends BinaryMapper {

  public PictureMapper() {
    super("FVPicture", "IMG_" + Columns.FILENAME, "IMG", Properties.RELATED_PICTURES);
  }

  public PictureMapper(int number) {
    super("FVPicture", "IMG_" + number + "_" + Columns.FILENAME, "IMG_" + number,
        Properties.RELATED_PICTURES);
  }

  public PictureMapper(String prefix) {
    super("FVPicture", prefix + "_IMG_" + Columns.FILENAME, prefix + "_IMG",
        Properties.RELATED_PICTURES);
  }

  public PictureMapper(String prefix, int number) {
    super("FVPicture", prefix + "_IMG_" + number + "_" + Columns.FILENAME,
        prefix + "_IMG_" + number, Properties.RELATED_PICTURES);
  }
}
