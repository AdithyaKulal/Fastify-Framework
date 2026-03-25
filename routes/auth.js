const authController = require("../controllers/authController.js"
);

module.exports = async function (fastify, opts) {
    fastify.post("/register", authController.register)
    fastify.post("/login", authController.login)
    fastify.post("/forgot-password", authController.forgot - password)
    fastify.post("/reset-password/:token", authController.resePassword)
    fastify.post("/logout", {
        preHandler: [fastify.authenticate
        ]
    },
        authController.logout);
};