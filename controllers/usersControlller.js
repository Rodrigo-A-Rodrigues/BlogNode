const User = require('../models/User');

exports.login = (req, res)=>{
    res.render('login');
}

exports.loginAction = (req,res) => {
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result) => {
        if(!result) {
            req.flash('error', 'Seu email e/ou senha está incorreto');
            res.redirect('/users/login');
            return;
        }

        req.flash('success', 'Você está conectado!');
        res.redirect('/');
    });
}

exports.register = (req,res) => {
    res.render('register');
}

exports.registerAction = (req,res) => {
    const newUser = new User(req.body);
    User.register(newUser, req.body.password, (error) => {
        if(error) {
            req.flash('error', 'Ocorreu um erro')
            console.log('Erro ao registrar:', error);
            res.redirect('/users/register');
            return;
        }

        req.flash('success', 'Registro realizado com sucesso');
        res.redirect('/users/login');

    });
}