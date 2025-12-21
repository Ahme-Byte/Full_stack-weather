const joi=require('joi');
const userSchema=joi.object({
    userData:joi.object({
        username:joi.string().min(2).max(30).required(),
        email:joi.string().email().required(),
        password:joi.string().min(3).max(30).required()

    })
});
module.exports=userSchema;