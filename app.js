const express = require('express');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({limit: '10mb'}));

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

require('./models/db.js');

const router = require('./routes/routes.js');

app.use('/public', express.static('public/'));
app.use('/controllers', express.static('controllers/'));

app.use(router);

app.listen(PORT,function() {
    console.log(`Express listening on port ${PORT}`);
});