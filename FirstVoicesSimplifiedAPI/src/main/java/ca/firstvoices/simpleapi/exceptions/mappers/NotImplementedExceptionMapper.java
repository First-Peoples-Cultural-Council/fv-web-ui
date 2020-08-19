package ca.firstvoices.simpleapi.exceptions.mappers;

import ca.firstvoices.simpleapi.exceptions.NotImplementedException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider

public class NotImplementedExceptionMapper implements ExceptionMapper<NotImplementedException> {
  @Override
  public Response toResponse(NotImplementedException e) {
    return Response.status(Response.Status.SERVICE_UNAVAILABLE)
        .entity(new ErrorResponseEntity("This service not yet implemented"))
        .build();
  }
}
