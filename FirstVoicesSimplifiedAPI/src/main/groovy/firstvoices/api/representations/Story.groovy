package firstvoices.api.representations

import firstvoices.api.representations.traits.Contributors
import firstvoices.api.representations.traits.HasID
import firstvoices.api.representations.traits.LexicalEntity
import firstvoices.api.representations.traits.SwaggerFix
import firstvoices.api.representations.traits.Timestamps
import firstvoices.api.representations.traits.Titled
import firstvoices.api.representations.traits.Translatable

class Story implements Serializable, SwaggerFix, LexicalEntity, Translatable,  HasID, Titled, Contributors, Timestamps {
}
