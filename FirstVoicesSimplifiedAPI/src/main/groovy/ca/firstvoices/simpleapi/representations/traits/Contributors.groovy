package ca.firstvoices.simpleapi.representations.traits

import io.swagger.v3.oas.annotations.media.Schema

import java.time.Instant

trait Contributors {
	@Schema(
		description = "The set of contributing users for this entity",
		nullable = false
	)
	Set<String> contributors = new HashSet<>()

}
