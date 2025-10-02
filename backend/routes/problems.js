// Problems Routes

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Problem = require('../models/Problem');
const Team = require('../models/Team');
const Selection = require('../models/Selection');
const mongoose = require('mongoose');

// @route   GET /api/problems
// @desc    Get all problems
// @access  Protected
router.get('/', protect, async (req, res) => {
    try {
        const problems = await Problem.find({ isActive: true })
            .populate('selectedBy', 'teamId teamName');

        res.json({
            success: true,
            count: problems.length,
            problems
        });

    } catch (error) {
        console.error('Get problems error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/problems/:id
// @desc    Get single problem
// @access  Protected
router.get('/:id', protect, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id)
            .populate('selectedBy', 'teamId teamName');

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        res.json({
            success: true,
            problem
        });

    } catch (error) {
        console.error('Get problem error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/problems/select
// @desc    Select a problem statement
// @access  Protected
router.post('/select', [
    protect,
    body('problemId').notEmpty().withMessage('Problem ID is required'),
    body('teamId').notEmpty().withMessage('Team ID is required')
], async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { problemId, teamId } = req.body;

        // Verify team matches authenticated user
        if (req.team.teamId !== teamId) {
            await session.abortTransaction();
            return res.status(403).json({
                success: false,
                message: 'Unauthorized action'
            });
        }

        // Check if team already selected a problem
        const team = await Team.findOne({ teamId }).session(session);
        if (team.selectedProblem) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Team has already selected a problem statement'
            });
        }

        // Get problem
        const problem = await Problem.findById(problemId).session(session);
        if (!problem) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        // Check if problem is available
        if (!problem.isAvailable()) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'This problem statement is no longer available'
            });
        }

        // Add team to problem's selectedBy array
        problem.selectedBy.push(team._id);
        await problem.save({ session });

        // Update team's selectedProblem
        team.selectedProblem = problem._id;
        team.selectionTime = new Date();
        await team.save({ session });

        // Create selection record
        const selection = new Selection({
            team: team._id,
            problem: problem._id,
            selectionTime: new Date()
        });
        await selection.save({ session });

        // Commit transaction
        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Problem statement selected successfully',
            selection: {
                problemId: problem.problemId,
                problemTitle: problem.title,
                selectionTime: team.selectionTime
            }
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Select problem error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Selection already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during selection'
        });
    } finally {
        session.endSession();
    }
});

// @route   GET /api/problems/availability/:id
// @desc    Check problem availability
// @access  Protected
router.get('/availability/:id', protect, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        const slotsAvailable = problem.maxTeams - problem.selectedBy.length;
        const isAvailable = problem.isAvailable();

        res.json({
            success: true,
            availability: {
                isAvailable,
                slotsAvailable,
                maxTeams: problem.maxTeams,
                selectedCount: problem.selectedBy.length
            }
        });

    } catch (error) {
        console.error('Check availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;