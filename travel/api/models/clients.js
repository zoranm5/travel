const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
});

module.exports = mongoose.model('Client', clientSchema)
