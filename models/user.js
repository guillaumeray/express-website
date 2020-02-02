var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    login: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 20},
    about_me: {type: String, required: false, max: 200},
    created_at: {type: Date, default: Date.now},
    deleted_at: {type: Date},
    role: [{type: Schema.Types.ObjectId, required: true, ref: 'Role'}],
    avatar: [{type: Schema.Types.ObjectId, ref: 'Avatar'}]
  }
);

// Virtual for user experience in website
UserSchema
.virtual('experience')
.get(function () {
  return (moment(Date.now).format('MMMM Do, YYYY') + ' - ' + moment(this.created_at).format('MMMM Do, YYYY')).toString();
});

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);

