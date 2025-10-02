// Authentication Routes

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Team = require('../models/Team');
const Problem = require('../models/Problem');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

// @route   POST /api/auth/login
// @desc    Login team
// @access  Public
router.post('/login', [
    body('teamId').notEmpty().withMessage('Team ID is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { teamId, password } = req.body;

        // Find team
        const team = await Team.findOne({ teamId }).populate('selectedProblem');

        if (!team) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Team ID or Password'
            });
        }

        // Check password
        const isMatch = await team.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Team ID or Password'
            });
        }

        // Check if team is active
        if (!team.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Team account is inactive'
            });
        }

        // Generate token
        const token = generateToken(team._id);

        // Prepare team data (exclude password)
        const teamData = {
            teamId: team.teamId,
            teamName: team.teamName,
            leader: team.leader,
            contact: team.contact,
            members: team.members,
            selectedProblem: team.selectedProblem
        };

        res.json({
            success: true,
            message: 'Login successful',
            token,
            team: teamData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

module.exports = router;