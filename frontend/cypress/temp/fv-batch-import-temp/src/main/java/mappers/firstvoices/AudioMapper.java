/**
 *
 */

package mappers.firstvoices;

/**
 * @author dyona
 *
 */
public class AudioMapper extends BinaryMapper {

  public AudioMapper() {
    super("FVAudio", "AUDIO_" + Columns.FILENAME, "AUDIO", Properties.RELATED_AUDIO);
  }

  public AudioMapper(int number) {
    super("FVAudio", "AUDIO_" + number + "_" + Columns.FILENAME, "AUDIO_" + number,
        Properties.RELATED_AUDIO);
  }

  public AudioMapper(String prefix) {
    super("FVAudio", prefix + "_AUDIO_" + Columns.FILENAME, prefix + "_AUDIO",
        Properties.RELATED_AUDIO);
  }

  public AudioMapper(String prefix, int number) {
    super("FVAudio", prefix + "_AUDIO_" + number + "_" + Columns.FILENAME,
        prefix + "_AUDIO_" + number, Properties.RELATED_AUDIO);
  }

}
