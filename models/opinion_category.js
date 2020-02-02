var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OpinionCategorySchema = new Schema(
  {
    name: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    deleted_at: {type: Date}
  }
);

// Virtual for's URL
OpinionCategorySchema
.virtual('url')
.get(function () {
  return '/opinion/category/' + this._id;
});

//Export model
module.exports = mongoose.model('OpinionCategory', OpinionCategorySchema);
