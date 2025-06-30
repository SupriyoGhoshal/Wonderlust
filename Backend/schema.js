const joi = require("joi");
// const review = require("./Models/review.js");

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required(),
        image: joi.string().allow("",null),
    }).required(),
})
module.exports.userSchema = joi.object({
    user: joi.object({
        username: joi.string().required(),
        email: joi.string().required(),
        password: joi.object().required()
    })
})

module.exports.contactSchema = joi.object({
    contact : joi.object({
        firstname: joi.string().required(),
        lastname: joi.string().required(),
        email: joi.string().required(),
        subject: joi.string().required(),
        message: joi.string().required(),
    }),
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
})