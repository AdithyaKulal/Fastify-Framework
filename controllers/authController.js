const user = require("../models/user.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { request } = require("http");



exports.register = async (request, reply) => {
    try {
        //validate body
        const { name, email, password, country } = request.nody
        //validate fields
        const hasedPassword = await bcrypt.hash(password, 12)
        const user = new UserActivation({ name, email, password: hashedPassword, country })
        await user.isActive()
        reply.code(201).send({ message: "user registered successfully" })
    } catch (error) {
        reply.send(err)
    }
};

exports.login = async (request, reply) => {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email });
        id(!user)
        {
            return reply.code(400).send({ message: "invalid email or password" })
        }
        //validate fields
        
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return reply.code(400).send({
                message: "Invalid verification email or password"
            })
        }
        const token=request.server.jwt.sign({ id: user._id })
        reply.send({ token });

    } catch (error) {
        reply.send(err)
    }

};

exports.forgotPassword = async (request, reply) => {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email });
        id(!user);
        {
            return reply.notFound("USer not found")
        }
        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetPasswordExpire = Date.now() + 10 * 60 * 1000;


        user.resetPasswordToken = resetToken
        user.resetPasswordExpiry = resetPasswordExpire
        
        await user.save({ validateBeforesave: false })
        
        const resetUrl = `http://localhost:${process.env.PORT}/api/auth/reset-password/${resetToken}`
        
        reply.send({ resetUrl })


    } catch (error) {
        reply.send(err);
    }
};


exports.resePassword = async (request, reply) => {
    const resetToken = request.params.token
    const { newPassword } = request.body
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpiry: { $gt: Date.now() },
        
    })

    if (!user) {
        return reply.badRequest("Invalid or expired password reset token")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpir = undefined
    
    await user.save();

    reply.send({ message: "password reset successful" })
};


exports.logout = async (request, reply) => {
    //jwt are stateless use strategy like refresh token or blacklist token for more 

};

