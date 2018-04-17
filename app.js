const express = require('express');

const app = express();
const router = require('./routes/index');
const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');

app.use('/public', express.static('public/'));
app.use(router);

app.listen(PORT,function() {
    console.log(`Express listening on port ${PORT}`);
});
