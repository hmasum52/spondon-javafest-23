const validations = {
    email: {
        regex: /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
        message: "Email must be a valid email address."
    },
    username: {
        regex: /^[a-zA-Z]\w{4,29}$/,
        message: "Username must be between 5 and 30 characters long and can only contain alphanumeric characters and underscores, starting with an alphabet."
    },
    password: {
        regex: /^.{8,20}$/,
        message: "Password must be between 8 and 20 characters long."
    },
}

export function validate(object) {
    for (let key in object)
        if (validations[key] && !validations[key].regex.test(object[key]))
            return validations[key].message
    return null
}
