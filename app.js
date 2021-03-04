const express = require('express');
const mongoose = require('mongoose');
const mustache = require('mustache-express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
//Routes
const router = require('./routes/index');
//helpers
const helpers = require('./helpers');
//Error Handler
const errorHandler = require('./handlers/errorHandler');
// middleware

/*
PROCESSO DE LOGIN:
- Requisição
-- Validar os campos
-- Autorizar o usuário

- Resposta (Controller)
-- Positiva
-- Negativa

*/
//Config Base
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use(express.static(__dirname+'/public'));

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(flash());

app.use((req,res,next) =>{
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    next();
});

app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/User');
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', router);

app.use(errorHandler.notFound);

app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');

module.exports = app;

// Estrutura MVC => {
// Model
// View
// Controller
//}