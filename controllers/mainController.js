
const mainGet = (req, res) => {
    res.render('main', { title: 'Strona główna' });
}

module.exports = {
    mainGet,
}