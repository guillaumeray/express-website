var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoleSchema = new Schema(
  {
    name: {type: String, required: true}
  }
);

// Virtual for's URL
RoleSchema
.virtual('url')
.get(function () {
  return '/admin/role/' + this._id;
});

//Export model
module.exports = mongoose.model('Role', RoleSchema);
