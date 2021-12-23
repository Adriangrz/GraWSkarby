const express = require('express');
const path = require('path');

const mainRoutes = require('./routes/mainRoutes');

const app = express();
app.listen(8081);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'dist/js')));
app.use('/styles', express.static(path.join(__dirname, 'dist/styles')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/nowy');
});
app.use('/nowy', mainRoutes.router);
