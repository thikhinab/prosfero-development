const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        firstName: { 
            type: String,
            required: true, 
            trim: true,
        },
        lastName: { 
            type: String,
            required: true, 
            trim: true,
        },
        username: { 
            type: String,
            required: true, 
            unique: true, 
            trim: true,
            minlength: 3
        },
        email: { 
            type: String,
            required: true, 
            unique: true, 
            trim: true,
        },
        password: {
            type: String,
            required: true
        }, 
        profilePicture: {
            type: String,
            default: ""
        },
        achievementLevel: {
            type: String,
            default: "Newbie"
        },
        noOfPosts: {
            type: Number,
            default: 0
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        notifications: {
            type: Array,
            required: false
        },
        telebot: {
            type: String
        }
}, {
        collection: 'users',
        timestamps: true
    })

userSchema.pre(
    'save',
    async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
    }
);

userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}


const model =  mongoose.model('userScheme', userSchema)

module.exports = model