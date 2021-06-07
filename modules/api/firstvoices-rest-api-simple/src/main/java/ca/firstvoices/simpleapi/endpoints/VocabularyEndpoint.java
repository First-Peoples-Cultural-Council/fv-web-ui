package ca.firstvoices.simpleapi.endpoints;

import ca.firstvoices.simpleapi.AdministrativelyDisabled;
import ca.firstvoices.simpleapi.exceptions.NotImplementedException;
import ca.firstvoices.simpleapi.model.QueryBean;
import ca.firstvoices.simpleapi.representations.Vocabulary;
import ca.firstvoices.simpleapi.representations.VocabularyEntry;
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

@Path("/v1/vocabularies")
@SecurityRequirement(name = "oauth2", scopes = {"sites:public"})
@AdministrativelyDisabled("vocabulary")
public class VocabularyEndpoint extends AbstractServiceEndpoint {

  private static class VocabularyListResponse extends Metadata<List<Vocabulary>> {
  }

  private static class VocabularyEntryResponse extends Metadata<List<VocabularyEntry>> {
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(
      description = "Get list of all vocabularies",
      operationId = "LIST VOCABULARIES",
      responses = {
          @ApiResponse(
              description = "List of vocabularies",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = VocabularyListResponse.class
                  )
              )
          ),
          @ApiResponse(
              description = "Vocabulary not found",
              responseCode = "404"
          )
      },
      tags = {"Vocabulary"}
  )
  public Response getVocabularies(
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
          description = "An optional parameter with the zero-based index of the page to retrieve",
          example = "0"
      )
      @QueryParam("index")
      @DefaultValue("0")
          long index) {
    return Response.ok(getFirstVoicesService().getVocabularies(
        new QueryBean(pageSize, index))
    ).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{vocabularyID}")
  @Operation(
      description = "Get list of all entries in a vocabulary",
      operationId = "GET VOCABULARY",
      security = {},
      responses = {
          @ApiResponse(
              description = "List of entries",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = VocabularyEntryResponse.class
                  )
              )
          )
      },
      tags = {"Vocabulary"}
  )
  public Response getWords(@PathParam("vocabularyID") String vocabularyID,
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
    throw new NotImplementedException();
  }

}
