CREATE TABLE test.person
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(64) NOT NULL,
    surname VARCHAR(64) NOT NULL
);
ALTER TABLE test.person ADD CONSTRAINT unique_id UNIQUE (id);

select * from test.person;