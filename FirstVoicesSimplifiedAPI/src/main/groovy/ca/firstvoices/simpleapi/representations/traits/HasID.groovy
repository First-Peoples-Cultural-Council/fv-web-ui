package ca.firstvoices.simpleapi.representations.traits

import ca.firstvoices.simpleapi.model.NuxeoMapping
import io.swagger.v3.oas.annotations.media.Schema

trait HasID {
  @Schema(
      description = 'Unique ID',
      nullable = false
  )
  @NuxeoMapping(sourceField = "id", accessMethod = NuxeoMapping.PropertyAccessMethod.DIRECT)
  String id
}
