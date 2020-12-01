package ca.firstvoices.rest.data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.TemporalAmount;
import java.util.HashMap;
import java.util.Map;

/*
Data transfer object for serializing computed statistics
*/
public class Statistics implements Serializable {

  private final Map<String, Map<String, BigDecimal>> aggregate = new HashMap<>();
  private final Map<String, Map<TemporalRange, Map<String, BigDecimal>>> temporal = new HashMap<>();

  private final Metadata metadata;

  public Statistics(final String requestingUser, final String dialectPath) {
    this.metadata = new Metadata(requestingUser, dialectPath);
  }

  public Map<String, Map<String, BigDecimal>> getAggregate() {
    return aggregate;
  }

  public Map<String, Map<TemporalRange, Map<String, BigDecimal>>> getTemporal() {
    return temporal;
  }

  public Metadata getMetadata() {
    return metadata;
  }

  public static class Metadata {

    private final String requestingUser;
    private final String dialectPath;

    public String getDialectPath() {
      return dialectPath;
    }

    public String getRequestingUser() {
      return requestingUser;
    }

    public Metadata(final String requestingUser, final String dialectPath) {
      this.requestingUser = requestingUser;
      this.dialectPath = dialectPath;
    }

  }

  public static class TemporalRange {

    private final String friendlyName;
    private final LocalDate start;
    private final LocalDate end;

    public String getFriendlyName() {
      return friendlyName;
    }

    public LocalDate getStart() {
      return start;
    }

    public LocalDate getEnd() {
      return end;
    }

    public TemporalRange(final String friendlyName, final LocalDate start, final LocalDate end) {
      this.friendlyName = friendlyName;
      this.start = start;
      this.end = end;
    }

    public TemporalRange(final String friendlyName, TemporalAmount nowMinus) {
      this.friendlyName = friendlyName;
      this.start = LocalDate.now();
      this.end = this.start.minus(nowMinus);
    }

    @Override
    public String toString() {
      return getFriendlyName();
    }
  }

  public static final TemporalRange[] RANGE_PRESETS = {
      new TemporalRange("today", Period.ofDays(1)),
      new TemporalRange("last_3_days", Period.ofDays(3)),
      new TemporalRange("last_7_days", Period.ofDays(7)),
      new TemporalRange("last_month", Period.ofMonths(1)),
      new TemporalRange("last_3_months", Period.ofMonths(3)),
      new TemporalRange("last_6_months", Period.ofMonths(6)),
      new TemporalRange("last_year", Period.ofYears(1))
  };

}

