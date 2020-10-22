package mappers.firstvoices.portal;

import mappers.firstvoices.BinaryMapper;
import mappers.firstvoices.Properties;

public class BackgroundBottomImageMapper extends BinaryMapper {

  protected BackgroundBottomImageMapper() {
    super("FVPicture", "BACKGROUND_BOTTOM_FILENAME", "BACKGROUND_BOTTOM",
        "fv-portal:background_bottom_image");
    cacheProperty = Properties.TITLE;
  }
}
