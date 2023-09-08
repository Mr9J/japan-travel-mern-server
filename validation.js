const Joi = require("joi");

//register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(6).max(50).required().messages({
      "string.empty": "用戶名稱不可以空白",
      "any.required": "用戶名稱不可以空白",
      "string.alphanum": "用戶名稱只能包含大小寫英文字母或數字",
      "string.max": "用戶名稱長度不可超過 50",
      "string.min": "用戶名稱長度不可小於 6",
      "*": "用戶名稱格式錯誤",
    }),
    email: Joi.string().min(8).max(50).required().email().messages({
      "string.empty": "信箱不可以空白",
      "any.required": "信箱不可以空白",
      "string.max": "信箱長度不可超過 50",
      "string.min": "信箱長度不可小於 8",
      "*": "信箱格式錯誤",
    }),
    password: Joi.string()
      .alphanum()
      .min(8)
      .max(50)
      .required()
      .label("Password")
      .messages({
        "string.empty": "密碼不可以空白",
        "any.required": "密碼不可以空白",
        "string.alphanum": "密碼只能包含大小寫英文字母或數字",
        "string.max": "密碼長度不可超過 50",
        "string.min": "密碼長度不可小於 8",
        "*": "密碼格式錯誤",
      }),
    password_confirm: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "*": "密碼與確認密碼不符合" }),
    //   .options({ messages: { "any.only": "密碼與確認密碼不符合" } }),
  });

  return schema.validate(data);
};

//login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(8).max(50).required().email().messages({
      "string.empty": "信箱不可以空白",
      "any.required": "信箱不可以空白",
      "string.max": "信箱長度不可超過50",
      "string.min": "信箱長度不可小於 8",
      "*": "信箱格式錯誤",
    }),
    password: Joi.string().min(8).max(50).required().messages({
      "string.empty": "密碼不可以空白",
      "any.required": "密碼不可以空白",
      "string.alphanum": "密碼只能包含大小寫英文字母或數字",
      "string.max": "密碼長度不可超過 50",
      "string.min": "密碼長度不可小於 8",
      "*": "密碼格式錯誤",
    }),
  });

  return schema.validate(data);
};

//post tour validation
const tourValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(30).required().messages({
      "string.empty": "主題不可以空白",
      "any.required": "主題不可以空白",
      "string.max": "主題長度不可超過 30",
      "string.min": "主題長度不可低於 6",
      "*": "主題格式錯誤",
    }),
    description: Joi.string().min(30).required().messages({
      "string.empty": "行程不可以空白",
      "any.required": "行程不可以空白",
      "string.min": "行程長度不可低於 30",
      "*": "行程格式錯誤",
    }),
    budget: Joi.number().min(10).max(999999).required().messages({
      "number.empty": "預算不可以空白",
      "any.required": "預算不可以空白",
      "number.max": "預算不可高於 999999",
      "number.min": "預算不可低於 10",
      "*": "預算格式錯誤",
    }),
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  tourValidation,
};
