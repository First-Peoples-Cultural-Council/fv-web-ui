package ca.firstvoices.simpleapi.representations.containers

import ca.firstvoices.simpleapi.representations.traits.SwaggerFix
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
	description = "Contains pagination and status information about the result"
)
class Metadata<T> implements Serializable, SwaggerFix {
	@Schema(
		description = "Status",
		allowableValues = ["success", "failure", "error"]
	)
	String status

	@Schema(
		description = "Detailed response data or error messaging"
	)
	T detail

	@Schema(
		description = "The type contained in the detail property",
		example = "word",
		title = "title",
		type = "type",
		nullable = false
	)
	String detailType

	@Schema(
		description = "Total number of results"
	)
	long count
}
