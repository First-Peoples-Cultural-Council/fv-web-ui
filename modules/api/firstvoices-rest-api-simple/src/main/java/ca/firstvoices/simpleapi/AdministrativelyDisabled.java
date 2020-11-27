package ca.firstvoices.simpleapi;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.ws.rs.NameBinding;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@NameBinding
public @interface AdministrativelyDisabled {
  String value() default "";
}
