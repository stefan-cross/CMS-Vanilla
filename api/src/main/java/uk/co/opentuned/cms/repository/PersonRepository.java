package uk.co.opentuned.cms.repository;

import java.util.List;

import uk.co.opentuned.cms.domain.Person;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {

    List<Person> findAll();
    
    List<Person> findByLastName(@Param("name") String name);

}