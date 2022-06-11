CREATE TABLE account (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE, 
    email VARCHAR(50) NOT NULL UNIQUE, 
    password TEXT NOT NULL,
    pubcrawl_id INT,
    team_id INT
);
-- data:JSON stores all bar objects within the pubcrawl.
CREATE TABLE pubcrawl (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    owner_id INT NOT NULL,
    data JSON NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES account(id)
);

CREATE TABLE team (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    teamname VARCHAR(50) NOT NULL UNIQUE,
    creator_id INT NOT NULL,
    pubcrawl_id INT,
    FOREIGN KEY (creator_id) REFERENCES account(id)
);

ALTER TABLE account ADD CONSTRAINT FOREIGN KEY (pubcrawl_id) REFERENCES pubcrawl(id) ON DELETE SET NULL;
ALTER TABLE account ADD CONSTRAINT FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE SET NULL;