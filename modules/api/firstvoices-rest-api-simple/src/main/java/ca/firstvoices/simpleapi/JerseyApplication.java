package ca.firstvoices.simpleapi;


import ca.firstvoices.simpleapi.endpoints.AuthorizationEndpoint;
import ca.firstvoices.simpleapi.endpoints.SearchEndpoint;
import ca.firstvoices.simpleapi.endpoints.SharedEndpoint;
import ca.firstvoices.simpleapi.endpoints.SiteEndpoint;
import ca.firstvoices.simpleapi.endpoints.UserEndpoint;
import ca.firstvoices.simpleapi.endpoints.VocabularyEndpoint;
import ca.firstvoices.simpleapi.exceptions.mappers.NotFoundExceptionMapper;
import ca.firstvoices.simpleapi.exceptions.mappers.NotImplementedExceptionMapper;
import ca.firstvoices.simpleapi.exceptions.mappers.UnauthorizedAccessExceptionMapper;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.OAuthScope;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("/*")
@OpenAPIDefinition(
    info = @Info(
        title = "First Voices API",
        version = "0.0.3/prerelease",
        description = "First Voices API documentation",
        license = @License(name = "Unspecified License"),
        contact = @Contact(
            name = "First Peoples' Cultural Council",
            url = "http://www.fpcc.ca/",
            email = "info@fpcc.ca")
    ),
    security = {
        @SecurityRequirement(name = "List Sites", scopes = {"sites:public"})
    },
    servers = {
        @Server(
            description = "Local Development Server",
            url = "http://localhost:8000/"
        )
    }
)
@SecurityScheme(name = "oauth2",
    type = SecuritySchemeType.OAUTH2,
    flows = @OAuthFlows(
        implicit = @OAuthFlow(authorizationUrl = "http://localhost:8888/auth",
            scopes = {
                @OAuthScope(name = "sites:public",
                    description = "read public site data"),
                @OAuthScope(name = "sites:recorder",
                    description = "view unpublished content and submit new content"),
                @OAuthScope(name = "sites:admin",
                    description = "administer sites and publish new content")
            }
        )
    )
)
public class JerseyApplication extends Application {

  private static final Logger log = Logger.getLogger(JerseyApplication.class.getCanonicalName());


  @Override
  public Set<Object> getSingletons() {
    Set<Object> singletons = new HashSet<>();

    singletons.add(new SiteEndpoint());
    singletons.add(new AuthorizationEndpoint());
    singletons.add(new SearchEndpoint());
    singletons.add(new SharedEndpoint());
    singletons.add(new UserEndpoint());
    singletons.add(new VocabularyEndpoint());

    singletons.add(new NotFoundExceptionMapper());
    singletons.add(new NotImplementedExceptionMapper());
    singletons.add(new UnauthorizedAccessExceptionMapper());

    return singletons;
  }


  public JerseyApplication() {
    log.info("startup complete");
  }


}
