const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const roleSchema = new mongoose.Schema({
  roleId: {
    type: String,
    default: '',
    required: true,
    unique: [true, 'This role has been included in this list'],
  },

  roleName: {
    type: String,
    enum: ['student', 'provider'],
    default: 'student',
  },

  roleDescription: {
    type: String,
    default: '',
  },
});

roleSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
