export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://mongodb:27017/clean-node-api',
    port: process.env.PORT || 3030,
    bcryptSalt: process.env.BCRYPT_SALT || 12,
    jwtSecret: process.env.JWT_SECRET || 'secret_key',
}
