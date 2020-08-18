package ca.firstvoices.simpleapi.representations.traits

import ca.firstvoices.simpleapi.model.NuxeoMapping

import java.time.Instant

trait Timestamps {
	@NuxeoMapping(sourceField = "dc:created")
	Instant created
	@NuxeoMapping(sourceField = "dc:modified")
	Instant modified
}
