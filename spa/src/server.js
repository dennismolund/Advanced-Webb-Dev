const express = require('express');
const path = require('path');
const server = express();

server.use(express.static(path.join(__dirname, 'public')));

server.get('*', (_, res) => {
    res.sendFile(__dirname+"/public/index.html");
});

server.listen(3001, () => {
    console.log('SPA served on port: ', 3001);
})