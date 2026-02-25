const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', async (req, res) => {
    try {
        if (req.query.fail) {
            res.status(200).render('login', { message: 'Usuario e/ou senha incorretos!', title: 'Login' });
        } else {
            res.status(200).render('login', { title: 'Login', message: null });
        }
    } catch (err) {
        console.error(`Rota /login: ${err.message}`);
        throw new Error('Erro!!!!');
    }
});

router.post(
    '/',
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login?fail=true'
    })
);

module.exports = router;
