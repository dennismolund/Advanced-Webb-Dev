CREATE TABLE accounts (
    Id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE, 
    email VARCHAR(50) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL);


INSERT INTO accounts (username, email, password) VALUES("John Doe", "JD@gmail.com", "pass123");