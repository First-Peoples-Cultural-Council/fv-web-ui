package ca.firstvoices.simpleapi.representations

import ca.firstvoices.simpleapi.model.NuxeoMapping
import ca.firstvoices.simpleapi.model.NuxeoSubqueryMapping
import ca.firstvoices.simpleapi.representations.traits.HasID
import ca.firstvoices.simpleapi.representations.traits.SwaggerFix
import ca.firstvoices.simpleapi.representations.traits.Titled
import io.swagger.v3.oas.annotations.media.Schema

class ArchiveOverview implements Serializable, SwaggerFix, Titled, HasID {
  @NuxeoMapping(sourceField = "type", accessMethod = NuxeoMapping.PropertyAccessMethod.DIRECT)
  String type
}


trait ArchiveDetailCommon implements Serializable, Titled, HasID {

  @Schema(
      description = 'The geographic region for this archive',
      example = "British Columbia"
  )
  @NuxeoMapping(sourceField = "region")
  String region

  @Schema(
      description = 'Country or Nation',
      example = 'Canada'
  )
  @NuxeoMapping(sourceField = "country")
  String country

  @Schema(
      description = 'A sentence or phrase to greet community visitors',
      example = '大家好',
      nullable = true
  )
  @NuxeoMapping(sourceField = "greeting")
  String greetingPhrase
}

@Schema(
    description = 'A detailed view of an archive including the assets and entities'
)
class ArchiveDetailPublic implements Serializable, SwaggerFix, ArchiveDetailCommon {
  @Schema(
      description = 'The set of web links within this archive'
  )
  @NuxeoSubqueryMapping(subqueryName = "links", mapAs = Link.class)
  Set<Link> links = new HashSet<>()

  @Schema(
      description = 'The set of media assets (pictures, videos, audio) within this archive',
      minLength = 0
  )
  Set<Asset> media = new HashSet<>()

  @Schema(
      description = 'The set of categories for entities within this archive',
      example = '["animals", "people", "places"]',
      minLength = 0
  )
  Set<String> categories = new HashSet<>()

  @Schema(
      description = 'The set of valid symbols in this language (one per element)',
      example = '["a", "b", "c", "四"， "😄"]',
      nullable = false,
      minLength = 0
  )
  Set<String> alphabet = new HashSet<>()
}

class ArchiveDetailPrivate implements Serializable, SwaggerFix, ArchiveDetailCommon {
}
