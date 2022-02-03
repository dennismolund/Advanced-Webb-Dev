CREATE TABLE accounts (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE, 
    email VARCHAR(50) NOT NULL UNIQUE, 
    password VARCHAR(100) NOT NULL,
    currentbarrunda INT
);
    
CREATE TABLE barrunda (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    data JSON NOT NULL
);

CREATE TABLE teams (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    teamname VARCHAR(50) NOT NULL,
    creatorid INT NOT NULL,
    FOREIGN KEY (creatorid) REFERENCES accounts(id)
);

CREATE TABLE teams_users (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    teamid INT NOT NULL,
    userid INT NOT NULL,
    FOREIGN KEY (teamid) REFERENCES teams(id),
    FOREIGN KEY (userid) REFERENCES accounts(id)
);


/*
CREATE TABLE Bars (
    Id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(80) NOT NULL,
    barrundaId INT NOT NULL,
    number INT NOT NULL,
    FOREIGN KEY (barrundaId) REFERENCES barrunda(Id)
);*/
