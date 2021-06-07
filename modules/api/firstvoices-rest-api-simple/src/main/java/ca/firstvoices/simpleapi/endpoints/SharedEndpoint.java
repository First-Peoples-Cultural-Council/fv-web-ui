package ca.firstvoices.simpleapi.endpoints;

import ca.firstvoices.simpleapi.AdministrativelyDisabled;
import ca.firstvoices.simpleapi.model.QueryBean;
import ca.firstvoices.simpleapi.representations.Asset;
import ca.firstvoices.simpleapi.representations.Link;
import ca.firstvoices.simpleapi.representations.containers.Metadata;
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
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


@Path("/v1/shared")
@SecurityRequirement(name = "oauth2", scopes = {"sites:public"})
@AdministrativelyDisabled("shared")
public class SharedEndpoint extends AbstractServiceEndpoint {

  private static class CategoryListResponse extends Metadata<List<String>> {
  }

  private static class LinkListResponse extends Metadata<List<Link>> {
  }

  private static class MediaListResponse extends Metadata<List<Asset>> {
  }

  private static class MediaReponse extends Metadata<Asset> {
  }

  @GET
  @Path("/categories")
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(
      description = "Get list of all shared categories",
      operationId = "LIST SHARED CATEGORIES",
      responses = {
          @ApiResponse(
              description = "List of categories",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = CategoryListResponse.class
                  )
              )
          )
      },
      tags = {"Shared"}
  )
  public Response getCategories(@Parameter(
      description = "The maximum number of results to return",
      schema = @Schema(
          allowableValues = {"10", "25", "50", "100"}
      )
  )
                                @DefaultValue("25")
                                @QueryParam("pageSize")
                                    long pageSize,

                                @Parameter(
                                    description = "An optional parameter with the zero-based index"
                                        + " of the page to retrieve",
                                    example = "0"
                                )
                                @QueryParam("index")
                                @DefaultValue("0")
                                    long index) {
    return Response.ok(getFirstVoicesService().getSharedCategories(
        new QueryBean(pageSize, index))
    ).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/links")
  @Operation(
      description = "Get list of all shared links",
      operationId = "LIST SHARED LINKS",
      security = {},
      responses = {
          @ApiResponse(
              description = "List of links",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = LinkListResponse.class
                  )
              )
          )
      },
      tags = {"Shared"}
  )
  public Response getLinks(@Parameter(
      description = "The maximum number of results to return",
      schema = @Schema(
          allowableValues = {"10", "25", "50", "100"}
      )
  )
                           @DefaultValue("25")
                           @QueryParam("pageSize")
                               long pageSize,

                           @Parameter(
                               description = "An optional parameter with the zero-based index"
                                   + " of the page to retrieve",
                               example = "0"
                           )
                           @QueryParam("index")
                           @DefaultValue("0")
                               long index
  ) {
    return Response.ok(getFirstVoicesService().getSharedLinks(
        new QueryBean(pageSize, index))
    ).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/media")
  @Operation(
      description = "Get list of all shared media",
      operationId = "LIST SHARED MEDIA",
      security = {},
      responses = {
          @ApiResponse(
              description = "List of media",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = MediaListResponse.class
                  )
              )
          )
      },
      tags = {"Shared"}
  )
  public Response getMedia(@Parameter(
      description = "The maximum number of results to return",
      schema = @Schema(
          allowableValues = {"10", "25", "50", "100"}
      )
  )
                           @DefaultValue("25")
                           @QueryParam("pageSize")
                               long pageSize,

                           @Parameter(
                               description = "An optional parameter with the zero-based index"
                                   + " of the page to retrieve",
                               example = "0"
                           )
                           @QueryParam("index")
                           @DefaultValue("0")
                               long index
  ) {
    return Response.ok(getFirstVoicesService().getSharedMedia(
        new QueryBean(pageSize, index))
    ).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/media/{mediaID}")
  @Operation(
      description = "Get shared media details",
      operationId = "GET SHARED MEDIA",
      security = {},
      responses = {
          @ApiResponse(
              description = "Media details",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = MediaReponse.class
                  )
              )
          ),
          @ApiResponse(
              description = "Media not found",
              responseCode = "404"
          )
      },
      tags = {"Shared"}
  )
  public Response getSharedMediaDetail(
      @PathParam("mediaID") String mediaID,
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
          description = "An optional parameter with the zero-based index"
              + " of the page to retrieve",
          example = "0"
      )
      @QueryParam("index")
      @DefaultValue("0")
          long index
  ) {
    return Response.ok(getFirstVoicesService().getSharedMediaDetail(mediaID)).build();
  }
}
