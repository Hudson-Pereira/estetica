const express = require('express');
const router = express.Router();
const passport = require('passport');

const failedAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

function getAttemptKey(req) {
    const username = (req.body?.username || '').toString().trim().toLowerCase();
    return `${req.ip}:${username}`;
}

function clearExpiredAttempt(record) {
    const now = Date.now();
    if (!record) return null;
    if (record.lockUntil && record.lockUntil <= now) return null;
    if (!record.lockUntil && record.firstFailedAt && now - record.firstFailedAt > LOCK_WINDOW_MS) {
        return null;
    }
    return record;
}

function registerFailedAttempt(key) {
    const now = Date.now();
    const existing = clearExpiredAttempt(failedAttempts.get(key));
    const record = existing || { count: 0, firstFailedAt: now, lockUntil: 0 };
    record.count += 1;

    if (record.count >= MAX_FAILED_ATTEMPTS) {
        record.lockUntil = now + LOCK_WINDOW_MS;
    }

    failedAttempts.set(key, record);
    return record;
}

function isTemporarilyLocked(req) {
    const key = getAttemptKey(req);
    const record = clearExpiredAttempt(failedAttempts.get(key));
    if (!record) {
        failedAttempts.delete(key);
        return false;
    }
    failedAttempts.set(key, record);
    return Boolean(record.lockUntil && record.lockUntil > Date.now());
}

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

router.post('/', (req, res, next) => {
    if (!req.body?.username || !req.body?.password) {
        return res.status(400).render('login', {
            title: 'Login',
            message: 'Usuário e senha são obrigatórios.',
            csrfToken: req.csrfToken()
        });
    }

    if (isTemporarilyLocked(req)) {
        return res.status(429).render('login', {
            title: 'Login',
            message: 'Muitas tentativas inválidas. Aguarde 15 minutos.',
            csrfToken: req.csrfToken()
        });
    }

    return passport.authenticate('local', (err, user) => {
        if (err) return next(err);

        if (!user) {
            registerFailedAttempt(getAttemptKey(req));
            return res.redirect('/login?fail=true');
        }

        failedAttempts.delete(getAttemptKey(req));
        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.redirect('/admin');
        });
    })(req, res, next);
});

module.exports = router;
