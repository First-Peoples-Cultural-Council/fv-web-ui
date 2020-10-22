package mappers.firstvoices.portal;

import mappers.firstvoices.BinaryMapper;
import mappers.firstvoices.Properties;

public class PortalLogoMapper extends BinaryMapper {

  protected PortalLogoMapper() {
    super("FVPicture", "DIALECT_ID", "IMG", "fv-portal:logo");
    cacheProperty = Properties.TITLE;
  }

}
