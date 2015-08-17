package uk.co.opentuned.cms.domain;

import org.springframework.hateoas.ResourceSupport;

public class Greeting extends ResourceSupport {
    
    private final String content;
    private final long id;
    
    public Greeting(long id, String content){
        this.id = id;
        this.content = content;
    }
    
    public long getCounter(){
        return id;
    }
    
    public String getContent(){
        return content;
    }
    
}
