const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// note: unique in this context is for mongoose internal indexing, not for validation like required
// the validation is being done by the mongoose-unique-validator package
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true}
});


// activate the 'angular plugin' unique validator imported above
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
