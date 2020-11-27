package ca.firstvoices.simpleapi.representations


import ca.firstvoices.simpleapi.representations.traits.HasID
import ca.firstvoices.simpleapi.representations.traits.SwaggerFix
import io.swagger.v3.oas.annotations.media.Schema

class Vocabulary implements Serializable, SwaggerFix, HasID {

  @Schema(
      description = 'A descriptive name of the vocabulary',
      example = 'Parts of speech',
      nullable = false
  )
  String description

  @Schema(
      description = 'The set of all entries within this vocabulary'
  )
  Set<VocabularyEntry> entries = new HashSet<>()
}

class VocabularyEntry implements Serializable, SwaggerFix {

  @Schema(
      description = 'Unique (within the vocabulary) name of this entry'
  )
  String name

  @Schema(
      description = 'Optional detailed descriptive text about this vocabulary entry',
      nullable = true
  )
  String detail

}

