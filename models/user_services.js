const bcrypt = require('bcryptjs');
const key = require('../config/keys').SECRET_KEY;
const ValidationError = require('../errors/good_errors');

const registerUser = User => async (req, res) => {
    const { name, email, password, password2, secretKey } = req.body;
    var errors = [];

    //Check required fields
    if(!name || !email || !password || !password2 || !secretKey) {
        errors.push({ msg: 'Please fill in all fields!'});
    }

    //Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match!'});
    }

    //Check pass length
    if(password.length < 6){
        errors.push({ msg: 'Password need to be at least 6 characters'});
    }

    if(secretKey !== key){
        errors.push({msg: 'Wrong secret key!'});
    }

    if(errors.length > 0){
        throw new ValidationError(errors);
    } else {
        // Validation passed
        await User.findOne( { email: email})
        .then(user => {
            if(user){
                // User already exists
                errors.push({ msg: 'Email is already registered'})
                throw new ValidationError(errors);
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        //Save user
                        newUser.save()
                        .then(user => {
                            //success
                        })
                        .catch(err => console.log(err));
                }))
            }
        })
        //do not catch!
    }
};

module.exports = User => {
    return {
        registerUser: registerUser(User)
    };
}