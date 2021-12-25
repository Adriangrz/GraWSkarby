const path = require('path');

const mainGet = (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
}

const testSocket = ()=>{
    console.log("połączono");
}

module.exports = {
    mainGet,
    testSocket,
}