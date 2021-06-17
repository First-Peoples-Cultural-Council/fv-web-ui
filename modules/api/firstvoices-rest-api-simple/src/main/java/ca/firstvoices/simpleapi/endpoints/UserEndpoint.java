package ca.firstvoices.simpleapi.endpoints;

import ca.firstvoices.simpleapi.AdministrativelyDisabled;
import ca.firstvoices.simpleapi.representations.User;
import ca.firstvoices.simpleapi.security.JWTAuth;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/v1/users")
@SecurityRequirement(name = "oauth2", scopes = {"sites:public"})
@JWTAuth //requiredScopes omitted -- only requires a successful decode/key verification
@AdministrativelyDisabled("user")
public class UserEndpoint extends AbstractServiceEndpoint {

  @GET
  @Path("/current")
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(
      description = "Get details for the currently-authenticated user",
      operationId = "GET CURRENT USER",
      responses = {
          @ApiResponse(
              description = "The current user",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = User.class
                  )
              )

          )
      }
      ,
      tags = {"Access", "User"}
  )
  public Response getCurrentUser(@QueryParam(value = "username") String username) {
    return Response.ok(getUserContextStore().getCurrentUser()).build();
  }

}
