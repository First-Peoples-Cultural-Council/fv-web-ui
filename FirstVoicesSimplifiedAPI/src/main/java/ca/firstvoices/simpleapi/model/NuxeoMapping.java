package ca.firstvoices.simpleapi.model;


import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.TYPE})
/**
 * When used to annotate a class, mapperClass is expected to generate a representation.
 * Field-level annotations will not be processed for this class.
 *
 * When used on a field, specifies which Nuxeo DocumentModel field maps to this field.
 */
public @interface NuxeoMapping {
  String sourceField() default "";

  @SuppressWarnings("java:S1452") // Sonarqube suppress: this value must be generic to be useful
  Class<? extends NuxeoMapper<?>> mapperClass();

  PropertyAccessMethod accessMethod() default PropertyAccessMethod.NUXEO;

  enum PropertyAccessMethod {
    DIRECT,
    NUXEO
  }
}
