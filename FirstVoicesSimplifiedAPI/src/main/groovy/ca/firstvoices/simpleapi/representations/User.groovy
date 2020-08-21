package ca.firstvoices.simpleapi.representations

import ca.firstvoices.simpleapi.representations.traits.HasID
import ca.firstvoices.simpleapi.representations.traits.SwaggerFix
import io.swagger.v3.oas.annotations.media.Schema

class User implements Serializable, SwaggerFix, HasID {
	@Schema(
		description = 'Unique username',
		example = 'jsmith'
	)
	String username

	@Schema(
		description = 'Display Name',
		example = 'John Smith'
	)
	String displayName
}
