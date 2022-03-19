const rest = require('./REST-API/index');
const webApp = require('./presentation-layer/app');

console.log('main.js');

rest.listen(3002, ()=> {
    console.log("REST API listening to: 3002");
});

webApp.listen(8080, ()=>{
    console.log("Web server listening:  *** 8080 ***");
});