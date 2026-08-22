require('dotenv').config()
const express = require("express");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const path = require("path");
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

const port = process.env.PORT || 3000

// Validar SESSION_SECRET obrigatória
if (!process.env.SESSION_SECRET) {
  throw new Error(
    'SESSION_SECRET não configurada! Configure uma chave segura no arquivo .env:\n' +
    'SESSION_SECRET=sua_chave_secreta_segura_com_minimo_32_caracteres'
  );
}

const sessionSecret = (process.env.SESSION_SECRET || '').trim();
if (sessionSecret.length < 32) {
  throw new Error('SESSION_SECRET deve ter no mínimo 32 caracteres.');
}

const passport = require("passport");

const app = express();
app.disable('x-powered-by');

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Adicionar middleware de segurança
app.use(helmet()); // Proteção de headers HTTP

const defaultWindowMs = 15 * 60 * 1000;
const defaultMaxRequests = 300;
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || defaultWindowMs);
const rateLimitMaxRequests = Number(process.env.RATE_LIMIT_MAX || defaultMaxRequests);

const globalLimiter = rateLimit({
    windowMs: Number.isFinite(rateLimitWindowMs) ? rateLimitWindowMs : defaultWindowMs,
    max: Number.isFinite(rateLimitMaxRequests) ? rateLimitMaxRequests : defaultMaxRequests,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(globalLimiter);

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Muitas tentativas de login. Aguarde e tente novamente.'
});

app.set("view engine", "ejs");
app.set("views", "./views");

if (process.env.NODE_ENV === 'production' && process.env.ALLOW_MEMORY_STORE_IN_PRODUCTION !== 'true') {
    throw new Error(
        'MemoryStore não deve ser usado em produção. Configure Redis/Mongo para sessão ' +
        'ou defina ALLOW_MEMORY_STORE_IN_PRODUCTION=true apenas temporariamente.'
    );
}

require('./auth')(passport);
app.use(session({
    store: new MemoryStore({
        checkPeriod: 1800000,
        ttl: 3600000
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production', // HTTPS only em produção
        httpOnly: true, // Não acessível por JavaScript
        sameSite: 'strict' // Proteção CSRF no cookie
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// Proteção CSRF - aplicar após sessão
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

// Injetar csrfToken em todas as respostas renderizadas
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

function authenticationMiddleware(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login?fail=true')
}

app.get('/', (req, res) => {
    res.redirect('/cliente')
});

app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

const LoginRouter = require("./routers/login.routes");
app.use("/login", loginLimiter, LoginRouter);

const InicioRouter = require("./routers/inicio.routes")
app.use('/admin', authenticationMiddleware, InicioRouter)

const ProdutoRouter = require("./routers/produto.routes");
app.use("/produto", authenticationMiddleware, ProdutoRouter);

const ServicoRouter = require("./routers/servico.routes");
app.use("/servicos", authenticationMiddleware, ServicoRouter);

const AgendaRouter = require("./routers/agenda.routes");
app.use("/agenda", authenticationMiddleware, AgendaRouter);

const CaixaRouter = require("./routers/caixa.routes");
app.use("/caixa", authenticationMiddleware, CaixaRouter);

const ClienteRouter = require("./routers/clientes.routes");
app.use("/cliente", ClienteRouter)

app.use((req, res) => {
    res.status(404).render('error', { message: 'Página não encontrada' });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).render('error', { message: 'Token CSRF inválido ou expirado' });
    } else {
        console.error('Erro:', err.message);
        res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
});

/*app.listen(process.env.PORT, () => {
  console.log(`Rodando em http://localhost:${port}.`);
});*/
//teste celular
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
