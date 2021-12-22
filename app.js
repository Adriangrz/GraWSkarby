const express = require('express');
const path = require('path');

const mainRoutes = require('./routes/mainRoutes');

const app = express();
app.listen(8080);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/nowy', mainRoutes.router);
