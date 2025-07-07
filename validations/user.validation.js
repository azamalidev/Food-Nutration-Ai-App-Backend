import Joi from "joi";

const register = {
  body: Joi.object().keys({

    email: Joi.string().required().email(),
    password: Joi.string().required(),

    role: Joi.string().valid("USER", "ADMIN").default("USER"),
  }),
};

const id = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const email = {
  params: Joi.object().keys({
    id: Joi.string().email().required(),
  }),
};

const update = {

  body: Joi.object().keys({
    name: Joi.string(),
    age: Joi.number(),
    gender: Joi.string(),
    weight: Joi.number(),
    height: Joi.number(),
    dietaryPreferance: Joi.string(),
    activityLevel: Joi.string(),
    healthGoal: Joi.string(),

    email: Joi.string().email(),
    // role: Joi.string()
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export default {
  register,
  login,
  id,
  update,
  email,
};
