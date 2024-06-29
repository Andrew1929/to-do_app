const {Schema, model} = require ('mongoose');

const schema = new Schema ({
    nameOfGoal: {type: String,required: true, unique: true },
    descriptionOfGoal: {type: String,required: true},
    statusOfGoal: {type: Boolean,default: false}
});

module.exports = model('Task', schema);
