const Joi = require("joi");

//Schema
const transactionStatSchema = Joi.object({
    startDate: Joi.string().allow('').optional(),
    endDate: Joi.string().allow('').optional(),
})


//Validate methods
const validateTransactionStat = (req) => {
    const { error, value } = transactionStatSchema.validate(req);
    if (error) {
        throw new Error(error.details[0].message);
    }
    if (Object.keys(value).length !== 0 ){
        if(!('startDate' in value)){
            throw new Error("startDate is required when endDate is present");
        }else if(!('endDate' in value)){
            throw new Error("startDate is required when endDate is present");
        }else if (value.startDate.length === 0 && value.endDate.length !== 0){
            throw new Error("startDate is required when endDate is present");
        }else if (value.startDate.length !== 0 && value.endDate.length === 0){
            throw new Error("endDate is required when startDate is present");
        }
    }
    return value;
};


module.exports = {
    validateTransactionStat,
}