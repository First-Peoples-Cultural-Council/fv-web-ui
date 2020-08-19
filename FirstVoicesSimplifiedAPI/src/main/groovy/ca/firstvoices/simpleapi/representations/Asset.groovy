package ca.firstvoices.simpleapi.representations


import ca.firstvoices.simpleapi.representations.traits.Contributors
import ca.firstvoices.simpleapi.representations.traits.SwaggerFix
import ca.firstvoices.simpleapi.representations.traits.Timestamps
import ca.firstvoices.simpleapi.representations.traits.Titled
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
	description = "Represents a media asset such as picture, audio file, or video"
)
class Asset implements Serializable, Titled, SwaggerFix, Contributors, Timestamps {
	enum AssetType {
		AUDIO,
		VIDEO,
		PHOTO,
		UNKNOWN
	}

	String id
	URL url
	long size
	String contentType
	AssetType type
}
