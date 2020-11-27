package ca.firstvoices.simpleapi.representations.traits

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

/*
This stops swagger from including a bunch of extra stuff
in the generated OpenAPI Spec
*/
@JsonIgnoreProperties(["metaClass"])
trait SwaggerFix {}
