package ca.firstvoices.simpleapi.endpoints;

import ca.firstvoices.simpleapi.AdministrativelyDisabled;
import ca.firstvoices.simpleapi.model.QueryBean;
import ca.firstvoices.simpleapi.representations.containers.Metadata;
import ca.firstvoices.simpleapi.representations.containers.SearchResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


@Path("/v1/search")
@SecurityRequirement(name = "oauth2", scopes = {"sites:public"})
@AdministrativelyDisabled("search")
public class SearchEndpoint extends AbstractServiceEndpoint {

  private static class SearchResponse extends Metadata<List<SearchResult<?>>> {
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(
      description = "Execute a search query",
      operationId = "SEARCH",
      responses = {
          @ApiResponse(
              description = "",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = SearchResponse.class
                  )
              )
          )
      },
      tags = {"Search"}
  )
  public Response doSearch(@QueryParam("q") String q,
                           @Parameter(
                               description = "The maximum number of results to return",
                               schema = @Schema(
                                   allowableValues = {"10", "25", "50", "100"}
                               )
                           )
                           @DefaultValue("25")
                           @QueryParam("pageSize")
                               long pageSize,

                           @Parameter(
                               description = "An optional parameter with the zero-based index "
                                   + "of the page to retrieve",
                               example = "0"
                           )
                           @QueryParam("index")
                           @DefaultValue("0")
                               long index) {
    return Response.ok(getFirstVoicesService().doSearch(q, new QueryBean(pageSize, index))).build();
  }

}
