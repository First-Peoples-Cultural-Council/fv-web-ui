package ca.firstvoices.simpleapi.model;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import javax.annotation.Nullable;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.reflect.FieldUtils;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PropertyException;

public class AnnotationNuxeoMapper {

  private AnnotationNuxeoMapper() {
  }

  private static final Logger log = Logger.getLogger(
      AnnotationNuxeoMapper.class.getCanonicalName()
  );

  public static <T> T mapFrom(Class<T> clazz, DocumentModel dm) {
    return mapFrom(clazz, dm, null);
  }

  public static <T> T mapFrom(Class<T> clazz,
                              DocumentModel dm,
                              @Nullable Map<String, List<DocumentModel>> extraQueryResults
  ) {

    NuxeoMapping ax = clazz.getAnnotation(NuxeoMapping.class);
    if (ax != null) {
      try {
        NuxeoMapper<T> nuxeoMapper;
        nuxeoMapper = (NuxeoMapper<T>) ax.mapperClass().getConstructor().newInstance();
        return nuxeoMapper.mapFrom(dm);
      } catch (InstantiationException
          | IllegalAccessException
          | InvocationTargetException
          | NoSuchMethodException e) {
        log.severe(e::toString);
      }
    }

    Field[] declaredFields = clazz.getDeclaredFields();

    try {
      T origin = clazz.getConstructor().newInstance();

      Arrays.asList(declaredFields).stream().filter(df ->
          (df.getAnnotation(NuxeoMapping.class) != null)
              || (df.getAnnotation(NuxeoSubqueryMapping.class) != null)
      ).forEach(df -> {
        NuxeoMapping mapping = df.getAnnotation(NuxeoMapping.class);
        NuxeoSubqueryMapping subQueryMapping = df.getAnnotation(NuxeoSubqueryMapping.class);

        if (mapping != null) {
          String source = mapping.sourceField();
          try {
            if (mapping.accessMethod() == NuxeoMapping.PropertyAccessMethod.NUXEO) {
              try {
                Serializable value = dm.getPropertyValue(source);
                FieldUtils.writeField(df, origin, value, true);
              } catch (PropertyException e) {
                log.warning("Could not map property " + source + ", exception: " + e.toString());
              }
            } else if (mapping.accessMethod() == NuxeoMapping.PropertyAccessMethod.DIRECT) {
              try {
                Object value = PropertyUtils.getProperty(dm, source);
                FieldUtils.writeField(df, origin, value, true);
              } catch (NoSuchMethodException
                  | InvocationTargetException
                  | IllegalAccessException e
              ) {
                log.warning("Could not map property " + source + ", exception: " + e.toString());
              }
            }
          } catch (IllegalAccessException e) {
            log.severe("error mapping property field " + source + ":\n" + e.toString());
          }
        }
        if (subQueryMapping != null) {

          String subQuery = subQueryMapping.subqueryName();
          List<DocumentModel> sqResults = extraQueryResults.get(subQuery);
          log.warning("Trying to map a subquery (with " + sqResults.size() + " results)");
          try {
            FieldUtils.writeField(
                df,
                origin,
                sqResults.stream().map(
                    sqdm -> mapFrom(subQueryMapping.mapAs(), sqdm)
                ).collect(Collectors.toSet()),
                true
            );
          } catch (IllegalAccessException e) {
            log.warning("Could not map property "
                + subQueryMapping.subqueryName()
                + ", exception: " + e.toString()
            );
          }
        }
      });
      return origin;
    } catch (InstantiationException
        | IllegalAccessException
        | InvocationTargetException
        | NoSuchMethodException e) {
      log.severe(e::toString);
    }
    return null;
  }

}
