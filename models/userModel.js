const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // plugin for unique field
const { isEmail } = require('validator');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  givenName: {
    type: String,
    required: [true, 'Please provide an Name'],
  },
  familyName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: [true, 'Email is ready taken'],
    lowercase: true,
    validate: [isEmail, 'Please provide a valid email'],
    uniqueCaseInsensitive: true, // dont care lower or upper case
  },
  studentCardNumber: {
    type: String,
    default: '',
  },
  dateOfBirth: {
    type: String,
    default: '',
  },
  // school: {
  //   type: String,
  //   default: '',
  // },
  // major: {
  //   type: String,
  //   default: '',
  // },
  bio: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    default() {
      return `https://via.placeholder.com/150?text=${this.email.substring(0, 1)}`;
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // password: {
  //   type: String,
  //   required: [true, 'Please provide a password'],
  //   minlength: [8, 'A password must have more than 7 characters'],
  //   select: false,
  // },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, 'Please comfirm a password'],
  //   validate: {
  //     // this only works on CREATE and SAVE not Update
  //     // whenever we want to update a user
  //     // we will always have to use SAVE not FindOneAndUpdate
  //     // or using option runvalidator
  //     validator(element) {
  //       return element === this.password;
  //     },
  //     message: 'Passwords are not the same',
  //   },
  // },
  // passwordChangedAt: Date,
  // passwordResetToken: String,
  // passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
}, {
  timestamps: true,
});

// add plugin and handle message for duplication err E11000
userSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

// ------------ ENCRYPTION PASSWORD ------------
// pre-middleware on save
// the encryption is then gonna be happened
// between the moment that we receive that data
// and the moment where it's actually persisted to the database

// Need to be turn off when import old database

// userSchema.pre('save', async function (next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified('password')) return next();

//   // hash the password with cost of 13
//   this.password = await bcrypt.hash(this.password, 13);

//   // delete passwordConfirm field
//   this.passwordConfirm = undefined;
//   return next();
// });

//  ---------- Update changedPasswordAt property for the user ------------
// Need to be turn off when import old database
// userSchema.pre('save', function (next) {
//   if (!this.isModified('password') || this.isNew) return next();

//   this.passwordChangedAt = Date.now();
//   return next();
// });

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  // do not using arrow function
  // because Arrow functions explicitly prevent binding this,
  // so your method will not have access to the document

  this.find({ active: { $ne: false } });

  // add some info here
  next();
});
// delete user but not delete any data relation
userSchema.post(
  /findOneAndDelete|findOneAndRemove|deleteOne|remove/,
  { document: true },
  async () => {
    // delete some thing here
  },
);

userSchema.methods.toAuthJSON = function () {
  return {
    givenName: this.givenName,
    familyName: this.familyName || '',
    email: this.email,
    studentCardNumber: this.studentCardNumber || '',
    photo: this.photo,
    role: this.role,
    dateOfBirth: this.dateOfBirth || '',
    school: this.school || '',
    major: this.major || '',
    bio: this.bio || '',
  };
};

// ------------ an instance medthod to check password correct or not ------------
// userSchema.methods.comparePassword = async (
//   candidatePassword,
//   userPassword,
// ) => {
//   const result = await bcrypt.compare(candidatePassword, userPassword);
//   return result;
// };

// ------------ an instance method to check Password changed after Token issued or not ------------
// userSchema.methods.changedPasswordAfterToken = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = Number.parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10,
//     );
//     // TRUE = Changed = Password was changed AFTER token was issued
//     return JWTTimestamp < changedTimestamp;
//   }
//   return false; // NOT changed
// };

// userSchema.methods.createPasswordResetToken = function () {
// plain text reset token send to user
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   this.passwordResetToken = crypto // the encryted reset token saved to db
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // (valid for 10 minutes)
//   return resetToken;
// };

// Create User collection
const User = mongoose.model('User', userSchema);
module.exports = User;
