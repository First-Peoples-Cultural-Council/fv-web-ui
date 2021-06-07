package ca.firstvoices.simpleapi.endpoints;

import ca.firstvoices.simpleapi.AdministrativelyDisabled;
import ca.firstvoices.simpleapi.model.QueryBean;
import ca.firstvoices.simpleapi.representations.Phrase;
import ca.firstvoices.simpleapi.representations.SiteDetailPrivate;
import ca.firstvoices.simpleapi.representations.SiteDetailPublic;
import ca.firstvoices.simpleapi.representations.SiteOverview;
import ca.firstvoices.simpleapi.representations.Song;
import ca.firstvoices.simpleapi.representations.Story;
import ca.firstvoices.simpleapi.representations.Word;
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


@Path("/v1/sites")
@SecurityRequirement(name = "oauth2", scopes = {"sites:public"})
@AdministrativelyDisabled("site")
public class SiteEndpoint extends AbstractServiceEndpoint {

  private static class WordOverviewResponse extends Metadata<List<Word>> {
  }

  private static class WordDetailResponse extends Metadata<Word> {
  }

  private static class StoryOverviewResponse extends Metadata<List<Story>> {
  }

  private static class PhraseOverviewResponse extends Metadata<List<Phrase>> {
  }

  private static class SongOverviewResponse extends Metadata<List<Song>> {
  }

  private static class SongDetailResponse extends Metadata<Song> {
  }

  private static class PhraseDetailResponse extends Metadata<Phrase> {
  }

  private static class StoryDetailResponse extends Metadata<Story> {
  }

  private static class PublicLanguageResponse extends Metadata<SiteDetailPublic> {
  }

  private static class AdminLanguageResponse extends Metadata<SiteDetailPrivate> {
  }

  private static class LanguageOverviewResponse extends Metadata<List<SiteOverview>> {
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Operation(
      description = "Get list of all sites",
      operationId = "LIST SITES",
      responses = {
          @ApiResponse(
              description = "List of sites",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = LanguageOverviewResponse.class
                  )
              )
          )
      },
      tags = {"Site"}
  )
  public Response getSites(
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
          long index
  ) {
    return Response.ok(getFirstVoicesService().getSites(new QueryBean(pageSize, index))).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{siteID}/words")
  @Operation(
      description = "Get list of all words in an site",
      operationId = "LIST WORDS",
      security = {},
      responses = {
          @ApiResponse(
              description = "List of words",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = WordOverviewResponse.class
                  )
              )
          ),
          @ApiResponse(
              description = "Site not found",
              responseCode = "404"
          )
      },
      tags = {"Site"}
  )
  public Response getWords(@PathParam("siteID") String site,
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
                               long index

  ) {
    return Response.ok(getFirstVoicesService().getWordsInSite(
        site, new QueryBean(pageSize, index))
    ).build();
  }


  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{siteID}/phrases")
  @Operation(
      description = "Get list of all phrases in an site",
      operationId = "LIST PHRASES",
      security = {},
      responses = {
          @ApiResponse(
              description = "List of phrases",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = PhraseOverviewResponse.class
                  )
              )
          )
          ,
          @ApiResponse(
              description = "Site not found",
              responseCode = "404"
          )
      },
      tags = {"Site"}
  )
  public Response getPhrases(@PathParam("siteID") String site,
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
    return Response.ok(getFirstVoicesService().getPhrasesInSite(
        site, new QueryBean(pageSize, index))
    ).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{siteID}/songs")
  @Operation(
      description = "Get list of all songs in an site",
      operationId = "LIST SONGS",
      security = {
      },
      responses = {
          @ApiResponse(
              description = "List of songs",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = SongOverviewResponse.class
                  )
              )
          )
          ,
          @ApiResponse(
              description = "Site not found",
              responseCode = "404"
          )
      },
      tags = {"Site"}
  )
  public Response getSongs(@PathParam("siteID") String site,
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
    return Response.ok(getFirstVoicesService().getSongsInSite(
        site, new QueryBean(pageSize, index))
    ).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{siteID}/stories")
  @Operation(
      description = "Get list of all stories in an site",
      operationId = "LIST STORIES",
      security = {
      },
      responses = {
          @ApiResponse(
              description = "List of stories",
              responseCode = "200",
              content = @Content(
                  schema = @Schema(
                      implementation = StoryOverviewResponse.class
                  )
              )
          )
          ,
          @ApiResponse(
              description = "Site not found",
              responseCode = "404"
          )
      },
      tags = {"Site"}
  )
  public Response getStories(
      @PathParam("siteID") String site,
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
          long index
  ) {
    return Response.ok(getFirstVoicesService().getStoriesInSite(
        site, new QueryBean(pageSize, index))
    ).build();
  }


  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{siteID}")
  @Operation(
      description = "Get site detail",
      operationId = "GET SITE",
      security = {
          @SecurityRequirement(name = "oauth2", scopes = {"communities:public"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:recorder"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:admin"})
      },
      responses = {
          @ApiResponse(
              description = "Community details",
              content = @Content(
                  schema = @Schema(
                      type = "object",
                      oneOf = {
                          PublicLanguageResponse.class,
                          AdminLanguageResponse.class
                      },
                      discriminatorProperty = "responseType"
                  )
              ),
              responseCode = "200"
          ),
          @ApiResponse(responseCode = "404", description = "Language not found")
      },
      tags = {"Site"}
  )
  public Response getLanguage(@PathParam("siteID") String site) {
    return Response.ok(getFirstVoicesService().getSiteDetail(site)).build();
  }


  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{siteID}/words/{wordID}")
  @Operation(
      description = "Get word detail",
      operationId = "GET WORD",
      security = {
          @SecurityRequirement(name = "oauth2", scopes = {"communities:public"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:recorder"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:admin"})
      },
      responses = {
          @ApiResponse(
              description = "Word details",
              content = @Content(
                  schema = @Schema(
                      implementation = WordDetailResponse.class
                  )
              ),
              responseCode = "200"
          ),
          @ApiResponse(responseCode = "404", description = "Word not found")
      },
      tags = {"Site"}
  )
  public Response getWord(
      @PathParam("siteID") String siteId,
      @PathParam("wordID") String wordId
  ) {
    return Response.ok(getFirstVoicesService().getWordDetail(wordId)).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{siteID}/phrases/{phraseID}")
  @Operation(
      description = "Get phrase detail",
      operationId = "GET PHRASE",
      security = {
          @SecurityRequirement(name = "oauth2", scopes = {"communities:public"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:recorder"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:admin"})
      },
      responses = {
          @ApiResponse(
              description = "Phrase details",
              content = @Content(
                  schema = @Schema(
                      implementation = PhraseDetailResponse.class
                  )
              ),
              responseCode = "200"
          ),
          @ApiResponse(responseCode = "404", description = "Phrase not found")
      },
      tags = {"Site"}
  )
  public Response getPhrase(
      @PathParam("siteID") String siteId,
      @PathParam("phraseID") String phraseID
  ) {
    return Response.ok(getFirstVoicesService().getPhraseDetail(phraseID)).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{siteID}/songs/{songID}")
  @Operation(
      description = "Get song detail",
      operationId = "GET SONG",
      security = {
          @SecurityRequirement(name = "oauth2", scopes = {"communities:public"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:recorder"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:admin"})
      },
      responses = {
          @ApiResponse(
              description = "Song details",
              content = @Content(
                  schema = @Schema(
                      implementation = SongDetailResponse.class
                  )
              ),
              responseCode = "200"
          ),
          @ApiResponse(responseCode = "404", description = "Song not found")
      },
      tags = {"Site"}
  )
  public Response getSong(@PathParam("siteID") String siteId,
                          @PathParam("songID") String songID) {
    return Response.ok(getFirstVoicesService().getWordDetail(songID)).build();
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  @Path("/{siteID}/stories/{storyID}")
  @Operation(
      description = "Get story detail",
      operationId = "GET STORY",
      security = {
          @SecurityRequirement(name = "oauth2", scopes = {"communities:public"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:recorder"}),
          @SecurityRequirement(name = "oauth2", scopes = {"communities:admin"})
      },
      responses = {
          @ApiResponse(
              description = "Word details",
              content = @Content(
                  schema = @Schema(
                      implementation = StoryDetailResponse.class
                  )
              ),
              responseCode = "200"
          ),
          @ApiResponse(responseCode = "404", description = "Story not found")
      },
      tags = {"Site"}
  )
  public Response getStory(@PathParam("siteID") String siteId,
                           @PathParam("storyID") String storyID) {
    return Response.ok(getFirstVoicesService().getStoryDetail(storyID)).build();
  }
}
