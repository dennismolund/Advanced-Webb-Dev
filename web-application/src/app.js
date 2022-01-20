const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser')
const fp = require('path');

const app = express();

//connects the public folder
app.use(express.static(fp.join(__dirname,'/public/')))
app.use(bodyParser.json())

app.engine('hbs', hbs.engine({
  partialsDir: [
    fp.join(__dirname, 'views/partials'),
  ],
  defaultLayout: fp.join(__dirname, 'views/mainLayout/main.hbs'),
}));
app.set('view engine', 'hbs');
app.set('views', fp.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('login.hbs');
});


const accountRouter = require('./routers/account-router')

app.use("/account", accountRouter)

app.listen(8080)