package ca.firstvoices.listeners;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.Blob;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.model.Property;
import org.nuxeo.ecm.core.api.model.impl.ArrayProperty;
import org.nuxeo.ecm.core.api.model.impl.primitives.BlobProperty;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;
import org.nuxeo.ecm.platform.audit.api.AuditLogger;
import org.nuxeo.ecm.platform.audit.api.ExtendedInfo;
import org.nuxeo.ecm.platform.audit.api.LogEntry;
import org.nuxeo.runtime.api.Framework;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author david
 */
public class PropertyModifiedAuditListener implements EventListener {

  private static final Log log = LogFactory.getLog(PropertyModifiedAuditListener.class);

  private static final List<String> SYSTEM_PROPS = Arrays
      .asList("dc:created", "dc:creator", "dc:modified",
          "dc:contributors");

  public static final String EVENT_ID = "Property Modification";
  public static final String FIELD_NAME = "fieldname";
  public static final String OLD_VALUE = "oldValue";
  public static final String NEW_VALUE = "newValue";
  public static final String EMPTY_VALUE = "EMPTY";

  private String[] types = {
      "FVAlphabet",
      "FVAudio",
      "FVBook",
      "FVBookEntry",
      "FVBooks",
      "FVCategories",
      "FVCategory",
      "FVCharacter",
      "FVContributor",
      "FVContributors",
      "FVDialect",
      "FVDictionary",
      "FVGallery",
      "FVLanguage",
      "FVLanguageFamily",
      "FVLink",
      "FVLinks",
      "FVPhrase",
      "FVPicture",
      "FVPortal",
      "FVResources",
      "FVVideo",
      "FVWord",
  };

  @Override
  public void handleEvent(Event event) {
    EventContext ectx = event.getContext();
    if (!(ectx instanceof DocumentEventContext)) {
      return;
    }

    AuditLogger logger = Framework.getService(AuditLogger.class);
    if (logger == null) {
      log.error("No AuditLogger implementation is available");
      return;
    }

    DocumentEventContext docCtx = (DocumentEventContext) ectx;
    DocumentModel newDoc = docCtx.getSourceDocument();

    DocumentModel oldDoc = newDoc.getCoreSession().getDocument(newDoc.getRef());

    if (!Arrays.stream(types).parallel()
        .anyMatch(oldDoc.getDocumentType().toString()::contains)) {
      return;
    }

    Context context = new Context(newDoc, oldDoc, event, logger);
    processDocument(context);
  }

  protected void processDocument(Context context) {
    List<LogEntry> entries = new ArrayList<>();

    String[] schemas = context.newDoc.getSchemas();
    for (String schema : schemas) {
      Collection<Property> properties = context.newDoc.getPropertyObjects(schema);
      for (Property property : properties) {
        String fieldName = property.getName();
        if (SYSTEM_PROPS.contains(fieldName)) {
          continue;
        }

        if (property.isDirty()) {
          Property oldProperty = context.oldDoc.getProperty(fieldName);
          entries.addAll(processProperty(context, oldProperty, property));
        }
      }
    }

    if (entries.size() > 0) {
      context.logger.addLogEntries(entries);
    }
  }

  protected List<LogEntry> processProperty(Context context, Property oldProperty,
      Property newProperty) {

    List<LogEntry> entries = new ArrayList<>();

    // Handle Scalar Properties
    if (oldProperty.isScalar()) {
      entries.add(processScalarProperty(context, oldProperty, newProperty));
    }

    // Handle Complex Properties
    if (oldProperty.isComplex() && !oldProperty.isList()) {
      if (oldProperty instanceof BlobProperty) {
        entries.add(processBlobProperty(context, oldProperty, newProperty));
      } else {
        entries.addAll(processComplexProperty(context, oldProperty, newProperty));
      }
    }

    // Handle Scalar List Properties
    if (oldProperty instanceof ArrayProperty) {
      entries.addAll(
          processScalarList(context, oldProperty.getPath(), oldProperty.getValue(),
              newProperty.getValue()));
    }
    // org.nuxeo.ecm.core.api.model.Property
    return entries;
  }

  protected LogEntry processScalarProperty(Context context, Property oldProperty,
      Property newProperty) {
    return getEntry(context, oldProperty.getPath(), oldProperty.getValue(), newProperty.getValue());
  }

  protected List<LogEntry> processScalarList(Context context, String fieldName, Object oldValue,
      Object newValue) {
    List<LogEntry> entries = new ArrayList<>();

    List<Serializable> oldList = null;
    if (oldValue != null) {
      oldList = Arrays.asList((Serializable[]) oldValue);
    }
    List<Serializable> newList = Arrays.asList((Serializable[]) newValue);

    fieldName = normalizeFieldName(fieldName);

    // get Added Values
    List<Serializable> added = new ArrayList<>(newList);
    if (oldList != null) {
      added.removeAll(oldList);
    }
    for (Serializable addedValue : added) {
      LogEntry entry = getEntry(context, fieldName, null, addedValue);
      entry.setComment(fieldName + " : Added " + formatPropertyValue(addedValue));
      entries.add(entry);
    }

    // get Removed Value
    if (oldList != null) {
      List<Serializable> removed = new ArrayList<>(oldList);
      removed.removeAll(newList);
      for (Serializable removedValue : removed) {
        LogEntry entry = getEntry(context, fieldName, removedValue, null);
        entry.setComment(fieldName + " : Removed " + formatPropertyValue(removedValue));
        entries.add(entry);
      }
    }

    return entries;
  }

  protected List<LogEntry> processComplexProperty(Context context, Property oldProperty,
      Property newProperty) {
    List<LogEntry> entries = new ArrayList<>();
    Iterator<Property> dirtyProperties = newProperty.getDirtyChildren();
    while (dirtyProperties.hasNext()) {
      Property dirtyProperty = dirtyProperties.next();
      entries.addAll(
          processProperty(context, oldProperty.get(dirtyProperty.getName()), dirtyProperty));
    }
    return entries;
  }

  protected LogEntry processBlobProperty(Context context, Property oldProperty,
      Property newProperty) {
    Blob oldBlob = (Blob) oldProperty.getValue();
    String oldFilename = oldBlob != null ? oldBlob.getFilename() : null;
    Blob newBlob = (Blob) newProperty.getValue();
    String newFilename = newBlob != null ? newBlob.getFilename() : null;
    return getEntry(context, oldProperty.getPath(), oldFilename, newFilename);
  }

  protected LogEntry getEntry(Context context, String fieldName, Serializable oldValue,
      Serializable newValue) {

    AuditLogger logger = context.logger;
    Event event = context.event;
    DocumentModel doc = context.newDoc;

    LogEntry entry = logger.newLogEntry();
    entry.setEventId(EVENT_ID);
    entry.setCategory("Document");
    entry.setEventDate(new Date(event.getTime()));
    entry.setDocUUID(doc.getRef());
    entry.setDocType(doc.getType());
    entry.setDocPath(doc.getPathAsString());
    entry.setDocLifeCycle(doc.getCurrentLifeCycleState());
    entry.setPrincipalName(doc.getCoreSession().getPrincipal().getName());
    entry.setRepositoryId(doc.getRepositoryName());

    fieldName = normalizeFieldName(fieldName);

    Map<String, ExtendedInfo> extended = new HashMap<>();
    extended.put(FIELD_NAME, logger.newExtendedInfo(fieldName));

    String formatedOldValue = formatPropertyValue(oldValue);
    String formatedNewValue = formatPropertyValue(newValue);

    extended.put(OLD_VALUE, logger.newExtendedInfo(formatedOldValue));
    extended.put(NEW_VALUE, logger.newExtendedInfo(formatedNewValue));
    entry.setExtendedInfos(extended);

    entry.setComment(fieldName + " : " + formatedOldValue + " -> " + formatedNewValue);
    return entry;
  }

  protected String formatPropertyValue(Serializable value) {
    if (value instanceof Calendar) {
      Calendar calendar = (Calendar) value;
      String pattern = "MM/dd/yyyy";
      SimpleDateFormat format = new SimpleDateFormat(pattern);
      return format.format(calendar.getTime());
    } else if (value != null) {
      return value.toString();
    } else {
      return EMPTY_VALUE;
    }
  }

  protected String normalizeFieldName(String fieldName) {
    if (fieldName.startsWith("/")) {
      return fieldName.substring(1);
    } else {
      return fieldName;
    }
  }

  class Context {

    private DocumentModel newDoc;
    private DocumentModel oldDoc;
    private Event event;
    private AuditLogger logger;

    public Context(DocumentModel newDoc, DocumentModel oldDoc, Event event, AuditLogger logger) {
      this.newDoc = newDoc;
      this.oldDoc = oldDoc;
      this.event = event;
      this.logger = logger;
    }
  }
}