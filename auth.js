const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

// Validar variáveis de ambiente obrigatórias
const requiredEnvVars = ['ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH', 'ADMIN_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Variáveis de ambiente obrigatórias não configuradas: ${missingEnvVars.join(', ')}\n` +
    `Configure as seguintes variáveis no arquivo .env:\n` +
    `ADMIN_USERNAME=seu_usuario\n` +
    `ADMIN_PASSWORD_HASH=seu_hash_bcrypt\n` +
    `ADMIN_EMAIL=seu_email@example.com`
  );
}

const users = [{ 
    _id: 1, 
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD_HASH,
    email: process.env.ADMIN_EMAIL
}];
 
module.exports = function(passport){
   function findUsers(username){
       return users.find(user => user.username === username);
   }
    
    function findUserById(id) {
        return users.find(user => user._id === id);
    }
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser((id, done) => {
        try {
            const user = findUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    })

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        try {
            const user = findUsers(username);

            if (!user) { return done(null, false) }
            
            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) return done(null, false);
            
            return done(null, user);
        } catch (err) {
            done(err, false);
        }
    }))
}
