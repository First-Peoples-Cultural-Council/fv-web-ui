package mappers.firstvoices.portal;

import mappers.firstvoices.BinaryMapper;
import mappers.firstvoices.Properties;

public class BackgroundTopImageMapper extends BinaryMapper {

  protected BackgroundTopImageMapper() {
    super("FVPicture", "BACKGROUND_TOP_FILENAME", "BACKGROUND_TOP",
        "fv-portal:background_top_image");
    cacheProperty = Properties.TITLE;
  }
}
