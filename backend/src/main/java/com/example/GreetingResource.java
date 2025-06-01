package com.example;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.json.Json;
import java.io.StringReader;

@Path("/api")
public class GreetingResource {
    private static final Logger LOG = Logger.getLogger(GreetingResource.class);
    private static final String USER_INFO_URL = "https://release-raccoon.eu.auth0.com/userinfo";

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/public")
    @PermitAll
    @Produces(MediaType.TEXT_PLAIN)
    public String publicEndpoint() {
        return "This is a public endpoint";
    }

    @GET
    @Path("/secured")
    @Produces(MediaType.APPLICATION_JSON)
    public Response securedEndpoint() {
        if (jwt == null) {
            LOG.error("No JWT token found");
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"No authentication token provided\"}")
                    .build();
        }

        LOG.debug("Secured endpoint called with token: " + jwt.getRawToken());
        LOG.debug("Token claims: " + jwt.getClaimNames());
        LOG.debug("Token scopes: " + jwt.getClaim("scope"));
        
        // Verify that we have the required scope
        String scopeClaim = jwt.getClaim("scope");
        if (scopeClaim == null || !scopeClaim.contains("profile")) {
            LOG.error("Required scope 'profile' not found in token. Scopes: " + scopeClaim);
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("{\"error\": \"Insufficient permissions\"}")
                    .build();
        }

        // Fetch user info from Auth0
        Response userInfoResponse = ClientBuilder.newClient()
                .target(USER_INFO_URL)
                .request(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + jwt.getRawToken())
                .get();

        if (userInfoResponse.getStatus() != 200) {
            LOG.error("Failed to fetch user info from Auth0. Status: " + userInfoResponse.getStatus());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Failed to fetch user info\"}")
                    .build();
        }

        String userInfoString = userInfoResponse.readEntity(String.class);
        JsonReader jsonReader = Json.createReader(new StringReader(userInfoString));
        JsonObject userInfo = jsonReader.readObject();
        
        LOG.debug("User info from Auth0: " + userInfo);
        
        String email = userInfo.getString("email", "not available");
        String name = userInfo.getString("name", "not available");
        String sub = jwt.getClaim("sub");
        
        LOG.debug("Retrieved user info - email: " + email + ", name: " + name + ", sub: " + sub);
        
        String response = String.format(
            "{\"message\": \"This is a secured endpoint\", " +
            "\"user\": {" +
            "\"email\": \"%s\", " +
            "\"name\": \"%s\", " +
            "\"sub\": \"%s\", " +
            "\"scopes\": \"%s\"" +
            "}}",
            email,
            name,
            sub != null ? sub : "not available",
            scopeClaim
        );
        
        return Response.ok()
                .entity(response)
                .build();
    }
}
