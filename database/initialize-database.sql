/*CREATE TABLE IF NOT EXISTS accounts (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username VARCHAR(50) NOT NULL UNIQUE, \
    email VARCHAR(50) NOT NULL UNIQUE, \
    password VARCHAR(50) NOT NULL) \


CREATE TABLE IF NOT EXISTS comments (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username VARCHAR(50) NOT NULL, \
    accountId INTEGER NOT NULL, \
    message VARCHAR(350) NOT NULL, \
    sourceCode VARCHAR(350) NOT NULL, \
    projectID INTEGER NOT NULL, \
    FOREIGN KEY(projectID) REFERENCES projects(id), \
    FOREIGN KEY(accountId) REFERENCES accounts(id), \
    FOREIGN KEY(username) REFERENCES accounts(username))

CREATE TABLE IF NOT EXISTS projects (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username VARCHAR(50) NOT NULL, \
    accountId INTEGER NOT NULL, \
    sourceCode VARCHAR(500) NOT NULL, \
    Title VARCHAR(50) NOT NULL, \
    Tag VARCHAR(350), \
    FOREIGN KEY(accountId) REFERENCES accounts(id), \
    FOREIGN KEY(username) REFERENCES accounts(username))*/