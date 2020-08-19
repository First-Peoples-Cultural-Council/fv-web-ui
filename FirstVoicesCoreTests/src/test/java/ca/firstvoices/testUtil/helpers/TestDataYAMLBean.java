package ca.firstvoices.testUtil.helpers;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class TestDataYAMLBean {
  private String name;
  private String type;
  private boolean publish = false;
  private String path;
  private String publishPath;
  private String key;
  private Map<String, String> properties;
  private List<TestDataYAMLBean> children = new LinkedList<>();

  public TestDataYAMLBean() {
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public boolean isPublish() {
    return publish;
  }

  public void setPublish(boolean publish) {
    this.publish = publish;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public String getPublishPath() {
    return publishPath;
  }

  public void setPublishPath(String publishPath) {
    this.publishPath = publishPath;
  }

  public Map<String, String> getProperties() {
    return properties != null ? Collections.unmodifiableMap(properties) : Collections.emptyMap();
  }

  public void setProperties(Map<String, String> properties) {
    this.properties = properties;
  }

  public List<TestDataYAMLBean> getChildren() {
    return children;
  }

  public void setChildren(List<TestDataYAMLBean> children) {
    this.children = children;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  @Override
  public String toString() {
    return "TestDataYAMLBean{"
        + "name='" + name + '\''
        + ", type='" + type + '\''
        + ", publish=" + publish
        + ", path='" + path + '\''
        + ", publishPath='" + publishPath + '\''
        + ", properties=" + properties
        + ", key=" + key
        + ", children=[" + children
        .stream()
        .map(TestDataYAMLBean::toString)
        .collect(Collectors.joining(", "))
        + "]}";
  }

  // helper to recurse a tree and produce a flat sequence with correct nested paths
  public static Stream<TestDataYAMLBean> flatten(TestDataYAMLBean i) {
    return Stream.concat(Stream.of(i), i.getChildren().stream().peek(c -> {
      c.setPath(i.getPath() + (i.getPath().endsWith("/") ? "" : "/") + i.getName());
      if (i.getPublishPath() != null) {
        c.setPublishPath(
            i.getPublishPath()
                + (i.getPublishPath().endsWith("/") ? "" : "/")
                + i.getName()
        );
        c.setPublish(i.isPublish());
      }
    }).flatMap(TestDataYAMLBean::flatten));
  }
}
