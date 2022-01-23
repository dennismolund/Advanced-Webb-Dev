const { getPlaces } = require('../service/fetch.data.service.js');

const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser')
const fp = require('path');
const session = require('express-session')
const awilix = require('awilix')

const app = express();

const engine = hbs.engine || hbs;

//connects the public folder
app.use(express.static(fp.join(__dirname,'/public/')))

app.engine('hbs', engine({
  partialsDir: [
    fp.join(__dirname, 'views/partials'),
  ],
  defaultLayout: fp.join(__dirname, 'views/mainLayout/main.hbs'),
}));
app.set('view engine', 'hbs');
app.set('views', fp.join(__dirname, 'views'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'Qp34n!wh3G',
  resave: false,
  saveUninitialized: true,
  //set true when site is available as HTTPS
  cookie: { secure: false }
}))

app.get('/', async (req, res) => {
    //if account is active, show home page
    if(req.session.activeAccount) {
      await getPlaces();
      //a.logBy('name');
      res.redirect('/bars');
      // res.render('home.hbs');
    }
    //if account is not active, show login page
    else res.redirect('account/login')
});



// Import the ones we want to use (real or mockup), real in this case.
const accountRouter = require('./routers/account-router')
const accountManager = require('../business-logic-layer/account-manager')
const accountRepository = require('../data-access-layer/account-repository')

const barsRouter = require('./routers/bars-router')
const barsManager = require('../business-logic-layer/bars-manager')
const barsRepository = require('../data-access-layer/bars-repository')

// Create a container and add the dependencies we want to use.
const container = awilix.createContainer()
container.register("accountRouter", awilix.asFunction(accountRouter))
container.register("accountManager", awilix.asFunction(accountManager))
container.register("accountRepository", awilix.asFunction(accountRepository))

container.register("barsRouter", awilix.asFunction(barsRouter))
container.register("barsManager", awilix.asFunction(barsManager))
container.register("barsRepository", awilix.asFunction(barsRepository))

// Retrieve the router, which resolves all other dependencies.
const theAccountRouter = container.resolve("accountRouter")
const theBarsRouter = container.resolve("barsRouter")

app.use("/account", theAccountRouter)
app.use("/bars", theBarsRouter)

app.listen(8080, ()=>{
  console.log("Server Running on: 3000:8080");
})