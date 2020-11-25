package ca.firstvoices.simpleapi.representations.traits

import ca.firstvoices.simpleapi.model.NuxeoMapping
import io.swagger.v3.oas.annotations.media.Schema

trait Titled {
  @Schema(
      description = "The display title of this object",
      example = "Sencoten",
      nullable = false
  )
  @NuxeoMapping(sourceField = "title", accessMethod = NuxeoMapping.PropertyAccessMethod.DIRECT)
  String title

}

