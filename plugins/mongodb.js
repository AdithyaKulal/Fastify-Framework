const { default: fastifySensible } = require("@fastify/sensible");
const fastify = require("fastify");
const fp = require("fastify-plugin");
const mongoose = require("mongoose");


module.exports = fp(async (fastify, opts) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        fastify.decorate("mongoose", mongoose);
        fastify.log.info("MOGNODB connected!");

    } catch (error) {
        fastify.log.error(err);
        process.exit(1);
    }
});