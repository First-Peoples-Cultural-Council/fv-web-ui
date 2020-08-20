package ca.firstvoices.simpleapi.model;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.TYPE})
public @interface NuxeoSubqueryMapping {
  String subqueryName();

  Class<?> mapAs();

  CollectionType collectionType() default CollectionType.SET;

  enum CollectionType {
    SET,
    LIST
  }
}
