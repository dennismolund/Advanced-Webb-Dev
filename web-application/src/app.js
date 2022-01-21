const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser')
const fp = require('path');
const session = require('express-session')

const accountRouter = require('./routers/account-router')

const app = express();

//connects the public folder
app.use(express.static(fp.join(__dirname,'/public/')))

app.engine('hbs', hbs.engine({
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

//Middleware checking if any acount is logged in
/*app.use(function(request, response, next){
	const activeAccount = request.session.activeAccount
	response.locals.activeAccount = activeAccount
	next()
})
*/

app.get('/', (req, res) => {
    //if account is active, show home page
    if(req.session.activeAccount) res.render('home.hbs');
    //if account is not active, show login page
    else res.redirect('account/login')
});




app.use("/account", accountRouter)

app.listen(8080)