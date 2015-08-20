package Person;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import uk.co.opentuned.cms.Application;
import uk.co.opentuned.cms.domain.Person;

import java.net.MalformedURLException;
import java.net.URL;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.core.IsInstanceOf.instanceOf;
import static org.springframework.test.util.MatcherAssertionErrors.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest({"server.port=0"})
public class PersonControllerIT {
    
    @Value("${local.server.port}")
    private int port;
    private URL base;
    private URL createdEntity;
    private RestTemplate template;
    private Person person;
    
    @Before
    public void setUp() throws MalformedURLException {
        this.base = new URL("http://localhost:" + port + "/people/");
        template = new RestTemplate();
        person = new Person("Dave", "Smith");
    }

    @Test
    public void createPerson() throws Exception {
        
        ResponseEntity<String> response = template.postForEntity(base.toString(), person, String.class);
        createdEntity = new URL(response.getHeaders().get("Location").get(0));
        
        assertThat(response.getStatusCode(), equalTo(HttpStatus.CREATED));
        assertThat(response.getHeaders().get("Location").get(0), instanceOf(String.class));
        
        // Tear down
        template.delete(createdEntity.toString());
    }
    
    @Test
    public void getPerson() throws Exception {

        // Set up Person record
        ResponseEntity<String> create = template.postForEntity(base.toString(), person, String.class);
        createdEntity = new URL(create.getHeaders().get("Location").get(0));

        assertThat(create.getStatusCode(), equalTo(HttpStatus.CREATED));
        assertThat(create.getHeaders().get("Location").get(0), instanceOf(String.class));
        
        // Get our recently created record
        ResponseEntity<String> response = template.getForEntity(createdEntity.toString(), String.class);
        assertThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        assertThat(response.getBody(), equalTo("{\n" +
                "  \"firstName\" : \"Dave\",\n" +
                "  \"lastName\" : \"Smith\",\n" +
                "  \"_links\" : {\n" +
                "    \"self\" : {\n" +
                "      \"href\" : \"" + createdEntity + "\"\n" +
                "    }\n" +
                "  }\n" +
                "}"));

        // Tear down
        template.delete(createdEntity.toString());
    }


    @Test
    public void putPerson() throws Exception {

        // Set up Person record
        ResponseEntity<String> create = template.postForEntity(base.toString(), person, String.class);
        createdEntity = new URL(create.getHeaders().get("Location").get(0));

        assertThat(create.getStatusCode(), equalTo(HttpStatus.CREATED));
        assertThat(create.getHeaders().get("Location").get(0), instanceOf(String.class));
        
        // Put our updated record
        person.setLastName("UPDATED");
        person.setFirstName("UPDATED");
        template.put(createdEntity.toString(), person);
        ResponseEntity<String> response = template.getForEntity(createdEntity.toString(), String.class);
        assertThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        assertThat(response.getBody(), equalTo("{\n" +
                "  \"firstName\" : \"UPDATED\",\n" +
                "  \"lastName\" : \"UPDATED\",\n" +
                "  \"_links\" : {\n" +
                "    \"self\" : {\n" +
                "      \"href\" : \"" + createdEntity + "\"\n" +
                "    }\n" +
                "  }\n" +
                "}"));
        
        // Tear down
        template.delete(createdEntity.toString());
    }
    
    @Test
    public void deletePerson() throws Exception{

        // Set up Person record
        ResponseEntity<String> create = template.postForEntity(base.toString(), person, String.class);
        createdEntity = new URL(create.getHeaders().get("Location").get(0));

        assertThat(create.getStatusCode(), equalTo(HttpStatus.CREATED));
        assertThat(create.getHeaders().get("Location").get(0), instanceOf(String.class));
        
        // Delete our record
        template.delete(createdEntity.toString());
        try{
            ResponseEntity<String> response = template.getForEntity(createdEntity.toString(), String.class);
        } catch (HttpClientErrorException e) {
            assertThat(e.getStatusCode(), equalTo(HttpStatus.NOT_FOUND));
        }
        
        
    }


}
