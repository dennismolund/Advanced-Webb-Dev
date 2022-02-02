const express = require('express')
const bodyParser = require('body-parser')
const awilix = require('awilix')

const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

// Import the ones we want to use (real or mockup), real in this case.
const accountRouter = require ('./routers/account-router-api')
const accountManager = require('../business-logic-layer/account-manager')
const accountRepository = require('../data-access-layer/account-repository')

// Create a container and add the dependencies we want to use.
const container = awilix.createContainer()
container.register("accountRouter", awilix.asFunction(accountRouter))
container.register("accountManager", awilix.asFunction(accountManager))
container.register("accountRepository", awilix.asFunction(accountRepository))

// Retrieve the router, which resolves all other dependencies.
const theAccountRouter = container.resolve("accountRouter")

app.use("/api/anvandare", theAccountRouter)

app.listen(8080, ()=>{
    console.log("API running on: 8080");
})

