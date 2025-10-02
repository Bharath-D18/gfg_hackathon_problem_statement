// Problem Model

const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    problemId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    detailedDescription: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: true,
        enum: ['Web Development', 'AI/ML', 'Mobile App', 'Blockchain', 'IoT', 'Other']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    },
    maxTeams: {
        type: Number,
        default: 2
    },
    selectedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Virtual field for availability
problemSchema.virtual('slotsAvailable').get(function() {
    return this.maxTeams - this.selectedBy.length;
});

// Method to check if problem is available
problemSchema.methods.isAvailable = function() {
    return this.selectedBy.length < this.maxTeams && this.isActive;
};

// Ensure virtuals are included when converting to JSON
problemSchema.set('toJSON', { virtuals: true });
problemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Problem', problemSchema);