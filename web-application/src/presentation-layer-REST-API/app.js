const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const awilix = require('awilix');
const { verifyAccessToken } = require('./middleware/authenticateToken');

const app = express()

app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));

// app.use(verifyAccessToken);

// Import the ones we want to use (real or mockup), real in this case.
const accountRouter = require ('./routers/account-router-api');
const accountManager = require('../business-logic-layer/account-manager');
const accountRepository = require('../data-access-layer/account-repository');

const pubcrawlRouter = require('./routers/pubcrawl-router-api');
const pubcrawlManager = require('../business-logic-layer/pubcrawl-manager');
const pubcrawlRepository = require('../data-access-layer/pubcrawl-repository');
const pubcrawlRepositorySq = require('../data-access-layer/pubcrawl-repository-sq');

// const teamsRouter = require('./routers/teams-router-api');
const teamsManager = require('../business-logic-layer/teams-manager');
const teamsRepository = require('../data-access-layer/teams-repository');
const teamsRepositorySq = require('../data-access-layer/teams-repository-sq');

// Create a container and add the dependencies we want to use.
const container = awilix.createContainer();
container.register("accountRouter", awilix.asFunction(accountRouter));
container.register("accountManager", awilix.asFunction(accountManager));
container.register("accountRepository", awilix.asFunction(accountRepository));

container.register('pubcrawlRouter', awilix.asFunction(pubcrawlRouter));
container.register('pubcrawlManager', awilix.asFunction(pubcrawlManager));
container.register('pubcrawlRepository', awilix.asFunction(pubcrawlRepository));

// Retrieve the router, which resolves all other dependencies.
const theAccountRouter = container.resolve("accountRouter");
const thepubcrawlRouter = container.resolve('pubcrawlRouter');

app.use('/api/pubcrawl', verifyAccessToken, thepubcrawlRouter);
app.use("/api/anvandare", theAccountRouter);

module.exports = app;

