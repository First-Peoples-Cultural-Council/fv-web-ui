package ca.firstvoices.simpleapi.model;

import ca.firstvoices.simpleapi.representations.VocabularyEntry;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import javax.annotation.Nullable;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.reflect.FieldUtils;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.PropertyException;

/*
 * The purpose of this class is to map Nuxeo query results (DocumentModel instances) to the groovy
 * representations in the ca.firstvoices.simpleapi.representations package.
 *
 * The actual mapping is created through application of hte NuxeoMapping and NuxeoSubqueryMapping
 * annotations
 */
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
    final T origin;
    try {
      origin = clazz.getConstructor().newInstance();
    } catch (InstantiationException
        | IllegalAccessException
        | InvocationTargetException
        | NoSuchMethodException e) {
      log.severe(e::toString);
      return null;
    }

    Arrays.asList(declaredFields).stream().filter(df ->
        (df.getAnnotation(NuxeoMapping.class) != null)
            || (df.getAnnotation(NuxeoSubqueryMapping.class) != null)
    ).forEach(df -> {
      NuxeoMapping mapping = df.getAnnotation(NuxeoMapping.class);
      NuxeoSubqueryMapping subQueryMapping = df.getAnnotation(NuxeoSubqueryMapping.class);

      if (mapping != null) {
        String source = mapping.sourceField();

        if (mapping.accessMethod() == NuxeoMapping.PropertyAccessMethod.NUXEO) {
          try {
            Serializable value = mapValue(df, dm.getPropertyValue(source));
            FieldUtils.writeField(df, origin, value, true);
          } catch (PropertyException | IllegalAccessException e) {
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
  }

  private static Serializable mapValue(final Field df, final Serializable value) {

    if (df.getType().isAssignableFrom(java.net.URL.class)) {
      try {
        return new URL(value.toString());
      } catch (MalformedURLException e) {
        return null;
      }
    }
    if (df.getType().isAssignableFrom(VocabularyEntry.class)) {
      VocabularyEntry ve = new VocabularyEntry();
      ve.setName(value.toString());
      return ve;
    }
    if (df.getType().isAssignableFrom(Instant.class)) {
      try {
        return ((Calendar) value).toInstant();
      } catch (Exception e) {
        return null;
      }
    }

    return value;
  }
}
