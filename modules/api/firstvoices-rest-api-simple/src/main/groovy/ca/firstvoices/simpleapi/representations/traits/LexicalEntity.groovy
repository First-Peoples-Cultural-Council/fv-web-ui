package ca.firstvoices.simpleapi.representations.traits

import ca.firstvoices.simpleapi.representations.Asset
import io.swagger.v3.oas.annotations.media.Schema

trait LexicalEntity {

	@Schema(
		description = 'Related assets'
	)
	Set<Asset> assets = new HashSet<>()

	@Schema(
		description = 'Cultural information to give additional context to help the reader understand the significance of this lexical entity'
	)
	Set<String> culturalNotes = new HashSet<>()

	@Schema(
		description = 'The set of all categories this lexical entity is a part of',
		example = '["birds", "animals", "predators"]'
	)
	Set<String> categories = new HashSet<>()
}
