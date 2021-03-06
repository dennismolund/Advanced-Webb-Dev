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
const accountManager = require('../../business-logic-layer/account-manager');
const accountRepository = require('../../data-access-layer/account-repository');

const barsRouter = require('./routers/bars-router-api');
const barsManager = require('../../business-logic-layer/bars-manager');
const barsRepository = require('../../data-access-layer/bars-repository');
const barsRepositorySq = require('../../data-access-layer/bars-repository-sq');

// const teamsRouter = require('./routers/teams-router-api');
const teamsManager = require('../../business-logic-layer/teams-manager');
const teamsRepository = require('../../data-access-layer/teams-repository');
const teamsRepositorySq = require('../../data-access-layer/teams-repository-sq');

// Create a container and add the dependencies we want to use.
const container = awilix.createContainer();
container.register("accountRouter", awilix.asFunction(accountRouter));
container.register("accountManager", awilix.asFunction(accountManager));
container.register("accountRepository", awilix.asFunction(accountRepository));

container.register('barsRouter', awilix.asFunction(barsRouter));
container.register('barsManager', awilix.asFunction(barsManager));
container.register('barsRepository', awilix.asFunction(barsRepositorySq));

// Retrieve the router, which resolves all other dependencies.
const theAccountRouter = container.resolve("accountRouter");
const theBarsRouter = container.resolve('barsRouter');

app.use('/api/bars', verifyAccessToken, theBarsRouter);
app.use("/api/anvandare", theAccountRouter);

module.exports = app;

