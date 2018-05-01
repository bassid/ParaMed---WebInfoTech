const mongoose = require('mongoose');

const loginSchema = mongoose.Schema(
    {
        "username" : String,
        "password" : String
    }
);

mongoose.model('login', loginSchema);