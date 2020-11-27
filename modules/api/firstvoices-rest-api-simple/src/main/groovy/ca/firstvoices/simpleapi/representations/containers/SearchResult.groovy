package ca.firstvoices.simpleapi.representations.containers

import ca.firstvoices.simpleapi.representations.traits.SwaggerFix
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
	description = "Contains pagination and status information about the result"
)
class SearchResult<T> implements Serializable, SwaggerFix {

	@Schema(
		description = "Item details",
		nullable=false
	)
	T item

	@Schema(
		description = "The type contained in the item property",
		example = "word",
		nullable = false
	)
	String itemType

	@Schema(
		description = "Relative rank of of this search result",
		example = "1.0",
		nullable=true
	)
	float rank

}
