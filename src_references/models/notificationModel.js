const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please type your content'],
      minlength: [10, 'A Notification must have more than 10 character'],
    },
    type: {
      type: String,
    },
    action: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Notification must belong to an User'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;

/**
 * ID of Notification
 * QUESTION_CREATE[]
 * QUESTION_ACCEPT
 * QUESTION_REJECT
 * QUESTION_RESTART
 * QUESTION_REJECTED
 * ANSWER_CREATE[]
 * ANSWER_REJECTED
 * USER_COIN[]
 */
