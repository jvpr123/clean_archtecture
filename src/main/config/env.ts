export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb+srv://labluby:clean-node-api@clean-node-api.xqmqodn.mongodb.net/?retryWrites=true&w=majority',
    port: process.env.PORT || 3030,
    bcryptSalt: process.env.BCRYPT_SALT || 12,
    jwtSecret: process.env.JWT_SECRET || 'secret_key',
}
