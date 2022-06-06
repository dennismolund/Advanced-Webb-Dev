CREATE TABLE account (
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
    FOREIGN KEY (owner) REFERENCES account(id)
);

CREATE TABLE team (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    teamname VARCHAR(50) NOT NULL UNIQUE,
    creatorid INT NOT NULL,
    currentbarrunda INT,
    FOREIGN KEY (creatorid) REFERENCES account(id)
);

ALTER TABLE account ADD CONSTRAINT FOREIGN KEY (currentbarrunda) REFERENCES barrunda(id);
ALTER TABLE account ADD CONSTRAINT FOREIGN KEY (teamid) REFERENCES team(id);