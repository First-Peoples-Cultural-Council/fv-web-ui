package ca.firstvoices.simpleapi.representations

import ca.firstvoices.simpleapi.model.NuxeoMapping
import ca.firstvoices.simpleapi.representations.traits.HasID
import ca.firstvoices.simpleapi.representations.traits.SwaggerFix
import ca.firstvoices.simpleapi.representations.traits.Titled
import io.swagger.v3.oas.annotations.media.Schema


class Link implements Serializable, SwaggerFix, Titled, HasID {

  @Schema(
      description = 'Destination URL',
      example = 'https://www.firstvoices.com/'
  )
  @NuxeoMapping(sourceField = "url")
  URL href
}
