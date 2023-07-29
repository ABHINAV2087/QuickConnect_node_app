const mongoose = require('mongoose')


var postschema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'  //jo humne users.js me export kiya tha wo yha likhenge jis naam se export kiya  wo 
    },

    caption: String,
    Image: String,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]

})

module.exports = mongoose.model('post', postschema)