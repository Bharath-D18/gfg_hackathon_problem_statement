// Teams Routes

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Team = require('../models/Team');

// @route   GET /api/teams/details/:teamId
// @desc    Get team details
// @access  Protected
router.get('/details/:teamId', protect, async (req, res) => {
    try {
        const team = await Team.findOne({ teamId: req.params.teamId })
            .select('-password')
            .populate('selectedProblem');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Ensure the authenticated team can only access their own data
        if (req.team._id.toString() !== team._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            team: {
                teamId: team.teamId,
                teamName: team.teamName,
                leader: team.leader,
                contact: team.contact,
                members: team.members,
                selectedProblem: team.selectedProblem,
                selectionTime: team.selectionTime
            }
        });

    } catch (error) {
        console.error('Get team details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/teams/all
// @desc    Get all teams (admin only - for future use)
// @access  Protected
router.get('/all', protect, async (req, res) => {
    try {
        const teams = await Team.find()
            .select('-password')
            .populate('selectedProblem');

        res.json({
            success: true,
            count: teams.length,
            teams
        });

    } catch (error) {
        console.error('Get all teams error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;