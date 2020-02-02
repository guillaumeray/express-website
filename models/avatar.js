var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AvatarSchema = new Schema(
  {
    title: {type: String, required: true, max: 200},
    user: [{type: Schema.Types.ObjectId, ref: 'User'}]
  }
);

// Virtual for's URL
AvatarSchema
.virtual('url')
.get(function () {
  return '/user/avatar/' + this._id;
});

//Export model
module.exports = mongoose.model('Avatar', AvatarSchema);
