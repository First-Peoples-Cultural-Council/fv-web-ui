package ca.firstvoices.simpleapi.representations.traits

import io.swagger.v3.oas.annotations.media.Schema

trait Translatable {
	static class Translation implements Serializable, SwaggerFix {
		@Schema(
			description = "The language for this translation",
			example = "English",
			nullable = false,
			allowableValues = ["English", "French"]
		)
		String language
		@Schema(
			description = "The translated text",
			nullable = false
		)
		String translation

		@Schema(
			description = "True if this is a literal translation",
			nullable = false
		)
		boolean literal = false
	}
	@Schema(
		description = "The set of translations for this entity",
		nullable = false
	)
	Set<Translation> translations = new HashSet<>()
}
