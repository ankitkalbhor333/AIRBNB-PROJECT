import Joi from "joi";

export const listjoiSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().uri().required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  country: Joi.string().required()
});
export const reviewjoiSchema = Joi.object({
  comment: Joi.string(),
  rating: Joi.number(),
  
});



