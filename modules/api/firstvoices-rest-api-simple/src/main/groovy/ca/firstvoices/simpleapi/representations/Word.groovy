package ca.firstvoices.simpleapi.representations

import ca.firstvoices.simpleapi.model.NuxeoMapping
import ca.firstvoices.simpleapi.representations.traits.Contributors
import ca.firstvoices.simpleapi.representations.traits.HasID
import ca.firstvoices.simpleapi.representations.traits.LexicalEntity
import ca.firstvoices.simpleapi.representations.traits.SwaggerFix
import ca.firstvoices.simpleapi.representations.traits.Timestamps
import ca.firstvoices.simpleapi.representations.traits.Titled
import ca.firstvoices.simpleapi.representations.traits.Translatable
import io.swagger.v3.oas.annotations.media.Schema

class Word implements Serializable, SwaggerFix, Titled, Timestamps, HasID, LexicalEntity, Translatable, Contributors {

  @Schema(
      description = 'The word\'s part of speech (Noun, verb, etc.)'
  )
  @NuxeoMapping(sourceField = "part_of_speech")
  VocabularyEntry partOfSpeech
}

