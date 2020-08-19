package ca.firstvoices.simpleapi.exceptions.mappers;

import ca.firstvoices.simpleapi.exceptions.UnauthorizedAccessException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider

public class UnauthorizedAccessExceptionMapper
    implements ExceptionMapper<UnauthorizedAccessException> {
  @Override
  public Response toResponse(UnauthorizedAccessException e) {
    return Response.status(Response.Status.UNAUTHORIZED)
        .entity(new ErrorResponseEntity("Unauthorized"))
        .build();
  }
}
