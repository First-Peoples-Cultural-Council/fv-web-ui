/**
 *
 */

package mappers.firstvoices.portal;

import mappers.firstvoices.BinaryMapper;
import mappers.firstvoices.Properties;

/**
 * @author dyona
 *
 */
public class PortalAudioMapper extends BinaryMapper {

  protected PortalAudioMapper() {
    super("FVAudio", "DIALECT_ID", "AUDIO", "fv-portal:featured_audio");
    cacheProperty = Properties.TITLE;

  }

}
