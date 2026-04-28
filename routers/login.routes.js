const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', async (req, res) => {
    try {
        if (req.query.fail) {
            res.status(200).render('login', { 
                message: 'Usuário e/ou senha incorretos!', 
                title: 'Login',
                csrfToken: req.csrfToken()
            });
        } else {
            res.status(200).render('login', { 
                title: 'Login', 
                message: null,
                csrfToken: req.csrfToken()
            });
        }
    } catch (err) {
        console.error(`Rota /login: ${err.message}`);
        res.status(500).render('error', { message: 'Erro ao carregar página de login' });
    }
});

router.post(
    '/',
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login?fail=true',
        failureMessage: true
    })
);

module.exports = router;
