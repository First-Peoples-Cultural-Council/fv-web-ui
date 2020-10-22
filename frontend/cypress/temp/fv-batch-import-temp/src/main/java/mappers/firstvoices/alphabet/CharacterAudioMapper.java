package mappers.firstvoices.alphabet;

import mappers.firstvoices.BinaryMapper;
import mappers.firstvoices.Properties;

public class CharacterAudioMapper extends BinaryMapper {

  protected CharacterAudioMapper() {
    super("FVAudio", "ID", "AUDIO", Properties.RELATED_AUDIO);
    cacheProperty = Properties.TITLE;
  }

}
