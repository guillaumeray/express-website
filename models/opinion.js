var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OpinionSchema = new Schema(
  {
    title: {type: String, required: true, max: 50},
    content: {type: String, required: true, max: 4000},
    viewNumber: {type: Number, required: true, default: 0},
    created_at: {type: Date, default: Date.now},
    deleted_at: {type: Date},
    updated_at: {type: Date},
    category: [{type: Schema.Types.ObjectId, required: false, ref: 'OpinionCategory'}],
    user: [{type: Schema.Types.ObjectId, required: true, ref: 'User'}]
  }
);

// Virtual for opnion's URL
OpinionSchema
.virtual('url')
.get(function () {
  return '/opinion/' + this._id;
});

//Export model
module.exports = mongoose.model('Opinion', OpinionSchema);
