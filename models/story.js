const mongoose = require('mongoose');

const StoryShema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        Enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Story', StoryShema);