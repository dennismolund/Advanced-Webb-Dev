const { isSignedIn } = require('./middlewares/auth.middleware.js');
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser')
const fp = require('path');
const session = require('express-session')
const awilix = require('awilix')

let RedisStore = require("connect-redis")(session)
 
const { createClient } = require("redis")
const { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env
let redisClient = createClient({ 
  url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
  legacyMode: true
})
redisClient.connect().catch(console.error)

//Sequilze DB connection
require('../data-access-layer/sequelize/connection-sq');

const app = express();

const engine = hbs.engine || hbs;

//connects the public folder
app.use(express.static(fp.join(__dirname,'/public/')));

app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: fp.join(__dirname, 'views/mainLayout/main.hbs'),
  partialsDir: fp.join(__dirname, '/views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', fp.join(__dirname, 'views'));

var hbshelper = hbs.create({});

//helper function
hbshelper.handlebars.registerHelper("counter", function (index){
  return index + 1;
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'Qp34n!wh3G',
  resave: false,
  saveUninitialized: true,
  //set true when site is available as HTTPS
  cookie: { secure: false }
}))

app.get('/', async (req, res) => {
    //if account is active, show home page
    if(req.session.activeAccount) {
      const account = req.session.activeAccount
      if(req.session.activeAccount.team_id) res.redirect('/teams');
      else if(req.session.activeAccount.pubcrawl_id) res.redirect('/pubcrawl');
      else res.render('start.hbs', {activeAccount: account});
    }
    //if account is not active, show login page
    else res.redirect('anvandare/login')
});

// Import the ones we want to use (real or mockup), real in this case.
const accountRouter = require('./routers/account-router');
const accountManager = require('../business-logic-layer/account-manager');
const accountRepository = require('../data-access-layer/mysql/account-repository');
const accountRepositorySq = require('../data-access-layer/sequelize/account-repository-sq');

const pubcrawlRouter = require('./routers/pubcrawl-router');
const pubcrawlManager = require('../business-logic-layer/pubcrawl-manager');
const pubcrawlRepository = require('../data-access-layer/mysql/pubcrawl-repository');
const pubcrawlRepositorySq = require('../data-access-layer/sequelize/pubcrawl-repository-sq');

const teamsRouter = require('./routers/teams-router');
const teamsManager = require('../business-logic-layer/teams-manager');
const teamsRepository = require('../data-access-layer/mysql/teams-repository');
const teamsRepositorySq = require('../data-access-layer/sequelize/teams-repository-sq');

// Create a container and add the dependencies we want to use.
const container = awilix.createContainer()
container.register("accountRouter", awilix.asFunction(accountRouter))
container.register("accountManager", awilix.asFunction(accountManager))
container.register("accountRepository", awilix.asFunction(accountRepository))

container.register("pubcrawlRouter", awilix.asFunction(pubcrawlRouter))
container.register("pubcrawlManager", awilix.asFunction(pubcrawlManager))
container.register("pubcrawlRepository", awilix.asFunction(pubcrawlRepository))

container.register("teamsRouter", awilix.asFunction(teamsRouter))
container.register("teamsManager", awilix.asFunction(teamsManager))
container.register("teamsRepository", awilix.asFunction(teamsRepository))

// Retrieve the router, which resolves all other dependencies.
const theAccountRouter = container.resolve("accountRouter")
const thepubcrawlRouter = container.resolve("pubcrawlRouter")
const theTeamsRouter = container.resolve("teamsRouter")

app.use("/anvandare", theAccountRouter)
app.use("/pubcrawl", isSignedIn, thepubcrawlRouter)
app.use("/teams", isSignedIn, theTeamsRouter)


module.exports = app;