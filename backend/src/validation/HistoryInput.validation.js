const Joi = require("joi");

//Schema
const historyFilterSchema = Joi.object({
    startDate: Joi.string().allow('').optional(),
    endDate: Joi.string().allow('').optional(),
    transactionID: Joi.string().allow('').optional(),
    userEmail: Joi.string().allow('').optional(),
    userPhone: Joi.string().allow('').optional(),
    deno: Joi.string().allow('').optional(),
    status: Joi.string().allow('').optional(),
})

const exportFilterSchema = Joi.object({
    fileType: Joi.string().valid('CSV', 'XLSX').required(),
    startDate: Joi.string().allow('').optional(),
    endDate: Joi.string().allow('').optional(),
    transactionID: Joi.string().allow('').optional(),
    userEmail: Joi.string().allow('').optional(),
    userPhone: Joi.string().allow('').optional(),
    deno: Joi.string().allow('').optional(),
    status: Joi.string().allow('').optional(),
})


//Validate methods
const validateHisoryFilter= (req) => {
    const { error, value } = historyFilterSchema.validate(req);
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

//Validate methods
const validateExportFilter= (req) => {
    const { error, value } = exportFilterSchema.validate(req);
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
    validateHisoryFilter,
    validateExportFilter
}