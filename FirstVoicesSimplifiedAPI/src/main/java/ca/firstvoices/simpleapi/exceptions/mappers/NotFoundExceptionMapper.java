package ca.firstvoices.simpleapi.exceptions.mappers;

import ca.firstvoices.simpleapi.exceptions.NotFoundException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider

public class NotFoundExceptionMapper implements ExceptionMapper<NotFoundException> {

  @Override
  public Response toResponse(NotFoundException e) {
    return Response.status(Response.Status.NOT_FOUND)
        .entity(new ErrorResponseEntity("Entity not found"))
        .build();
  }
}
