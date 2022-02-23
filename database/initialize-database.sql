CREATE TABLE accounts (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE, 
    email VARCHAR(50) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL,
    currentbarrunda INT,
    teamid INT
);
    
CREATE TABLE barrunda (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    owner INT NOT NULL,
    data JSON NOT NULL,
    FOREIGN KEY (owner) REFERENCES accounts(id)
);

CREATE TABLE teams (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    teamname VARCHAR(50) NOT NULL UNIQUE,
    creatorid INT NOT NULL,
    currentbarrunda INT,
    FOREIGN KEY (creatorid) REFERENCES accounts(id)
);