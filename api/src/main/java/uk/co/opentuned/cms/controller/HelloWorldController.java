package uk.co.opentuned.cms.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import uk.co.opentuned.cms.domain.Greeting;

import java.util.concurrent.atomic.AtomicLong;

@RestController
public class HelloWorldController {

    private static final String template = "Hello, %s";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @RequestMapping("/hello-world")
    @ResponseBody
    public HttpEntity<Greeting> sayHello(@RequestParam(value = "name", defaultValue = "Stranger") String name){
        Greeting greeting = new Greeting(counter.incrementAndGet(), String.format(template, name));
        greeting.add(linkTo(methodOn(HelloWorldController.class).sayHello(name)).withSelfRel());
        
        return new ResponseEntity<Greeting>(greeting, HttpStatus.OK);
    }
}
