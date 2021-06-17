package ca.firstvoices.simpleapi.representations

import ca.firstvoices.simpleapi.model.NuxeoMapping
import ca.firstvoices.simpleapi.model.NuxeoSubqueryMapping
import ca.firstvoices.simpleapi.representations.traits.HasID
import ca.firstvoices.simpleapi.representations.traits.SwaggerFix
import ca.firstvoices.simpleapi.representations.traits.Titled
import io.swagger.v3.oas.annotations.media.Schema

class SiteOverview implements Serializable, SwaggerFix, Titled, HasID {
  @NuxeoMapping(sourceField = "type", accessMethod = NuxeoMapping.PropertyAccessMethod.DIRECT)
  String type
}


trait SiteDetailCommon implements Serializable, Titled, HasID {

  @Schema(
      description = 'The geographic region for this site',
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
    description = 'A detailed view of an site including the assets and entities'
)
class SiteDetailPublic implements Serializable, SwaggerFix, SiteDetailCommon {
  @Schema(
      description = 'The set of web links within this site'
  )
  @NuxeoSubqueryMapping(subqueryName = "links", mapAs = Link.class)
  Set<Link> links = new HashSet<>()

  @Schema(
      description = 'The set of media assets (pictures, videos, audio) within this site',
      minLength = 0
  )
  Set<Asset> media = new HashSet<>()

  @Schema(
      description = 'The set of categories for entities within this site',
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

class SiteDetailPrivate implements Serializable, SwaggerFix, SiteDetailCommon {
}
