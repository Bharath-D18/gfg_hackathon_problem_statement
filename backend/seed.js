// Database Seeder - Populate initial data

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Team = require('./models/Team');
const Problem = require('./models/Problem');

dotenv.config();

// Sample Teams Data
const teamsData = [
    {
        teamId: 'TEAM001',
        teamName: 'Code Warriors',
        password: 'password123',
        leader: 'Rajesh Kumar',
        contact: 'rajesh@example.com',
        members: ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy']
    },
    {
        teamId: 'TEAM002',
        teamName: 'Tech Innovators',
        password: 'password123',
        leader: 'Meera Singh',
        contact: 'meera@example.com',
        members: ['Meera Singh', 'Arjun Nair', 'Divya Krishnan', 'Karthik Menon']
    },
    {
        teamId: 'TEAM003',
        teamName: 'Digital Dynamos',
        password: 'password123',
        leader: 'Vikram Reddy',
        contact: 'vikram@example.com',
        members: ['Vikram Reddy', 'Anjali Verma', 'Suresh Iyer', 'Pooja Desai']
    },
    {
        teamId: 'TEAM004',
        teamName: 'Binary Builders',
        password: 'password123',
        leader: 'Rahul Sharma',
        contact: 'rahul@example.com',
        members: ['Rahul Sharma', 'Kavya Menon', 'Aditya Gupta', 'Nisha Pillai']
    },
    {
        teamId: 'TEAM005',
        teamName: 'Cyber Squad',
        password: 'password123',
        leader: 'Lakshmi Nair',
        contact: 'lakshmi@example.com',
        members: ['Lakshmi Nair', 'Krishna Kumar', 'Deepa Raj', 'Sanjay Menon']
    }
];

// Sample Problems Data
const problemsData = [
    {
        problemId: 'PS001',
        title: 'Smart Campus Navigation System',
        description: 'Develop an AI-powered indoor navigation system for college campuses using AR/VR technology to help students find classrooms, labs, and facilities efficiently.',
        detailedDescription: 'Create a comprehensive navigation solution that includes real-time location tracking, route optimization, crowd management, and accessibility features for differently-abled students.',
        category: 'Web Development',
        difficulty: 'Medium',
        tags: ['AI', 'AR/VR', 'Navigation', 'Mobile']
    },
    {
        problemId: 'PS002',
        title: 'Automated Attendance System with Face Recognition',
        description: 'Build an intelligent attendance management system using facial recognition and machine learning to automate attendance marking while ensuring accuracy and preventing proxy attendance.',
        detailedDescription: 'The system should handle multiple classes simultaneously, generate reports, integrate with existing management systems, and provide analytics on attendance patterns.',
        category: 'AI/ML',
        difficulty: 'Hard',
        tags: ['Machine Learning', 'Computer Vision', 'Biometrics']
    },
    {
        problemId: 'PS003',
        title: 'Student Mental Health Support Chatbot',
        description: 'Create an empathetic AI chatbot to provide 24/7 mental health support, stress management tips, and crisis intervention for students.',
        detailedDescription: 'The chatbot should use NLP to understand student emotions, provide personalized recommendations, connect to professional counselors when needed, and maintain strict confidentiality.',
        category: 'AI/ML',
        difficulty: 'Medium',
        tags: ['NLP', 'Chatbot', 'Mental Health', 'AI']
    },
    {
        problemId: 'PS004',
        title: 'Blockchain-based Certificate Verification System',
        description: 'Develop a decentralized certificate verification platform using blockchain technology to prevent certificate fraud and enable instant verification by employers.',
        detailedDescription: 'System should support multiple certificate types, provide QR code verification, integrate with educational institutions, and ensure data immutability and security.',
        category: 'Blockchain',
        difficulty: 'Hard',
        tags: ['Blockchain', 'Smart Contracts', 'Verification']
    },
    {
        problemId: 'PS005',
        title: 'Campus Energy Management IoT System',
        description: 'Design an IoT-based energy monitoring and optimization system to reduce campus energy consumption and promote sustainability.',
        detailedDescription: 'The system should monitor electricity usage across buildings, identify wastage, automate lighting/AC controls, generate sustainability reports, and provide real-time dashboards.',
        category: 'IoT',
        difficulty: 'Medium',
        tags: ['IoT', 'Sensors', 'Energy', 'Sustainability']
    },
    {
        problemId: 'PS006',
        title: 'Virtual Lab Simulation Platform',
        description: 'Create an interactive web-based virtual laboratory for conducting science experiments remotely with realistic simulations and data analysis tools.',
        detailedDescription: 'Platform should support physics, chemistry, and biology experiments, provide 3D visualizations, record experimental data, and generate lab reports automatically.',
        category: 'Web Development',
        difficulty: 'Hard',
        tags: ['3D Graphics', 'WebGL', 'Education', 'Simulation']
    },
    {
        problemId: 'PS007',
        title: 'Smart Library Management Mobile App',
        description: 'Build a comprehensive mobile application for library management with book search, reservation, digital reading, and personalized recommendations.',
        detailedDescription: 'App should include barcode/QR scanning, fine tracking, reading history analytics, social features for book clubs, and offline reading capabilities.',
        category: 'Mobile App',
        difficulty: 'Easy',
        tags: ['Mobile', 'Database', 'UI/UX']
    },
    {
        problemId: 'PS008',
        title: 'Collaborative Coding Platform for Students',
        description: 'Develop a real-time collaborative coding environment where students can code together, get instant feedback, and learn from peers.',
        detailedDescription: 'Platform should support multiple programming languages, live code execution, video chat, code review features, and integration with version control systems.',
        category: 'Web Development',
        difficulty: 'Medium',
        tags: ['Real-time', 'WebRTC', 'Collaboration', 'IDE']
    },
    {
        problemId: 'PS009',
        title: 'AI-Powered Exam Proctoring System',
        description: 'Create an intelligent exam proctoring solution using computer vision and AI to monitor online exams and detect malpractices.',
        detailedDescription: 'System should detect suspicious activities, verify student identity, record sessions, generate integrity reports, and ensure privacy compliance.',
        category: 'AI/ML',
        difficulty: 'Hard',
        tags: ['Computer Vision', 'AI', 'Security', 'Proctoring']
    },
    {
        problemId: 'PS010',
        title: 'Campus Food Waste Management System',
        description: 'Design a platform to connect campus mess/canteen surplus food with students in need and NGOs to reduce food waste.',
        detailedDescription: 'System should predict food demand, manage inventory, coordinate pickup/delivery, track waste reduction metrics, and gamify sustainable practices.',
        category: 'Web Development',
        difficulty: 'Easy',
        tags: ['Sustainability', 'Social Impact', 'Management']
    }
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ MongoDB Connected');

        // Clear existing data
        await Team.deleteMany({});
        await Problem.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert teams
        const teams = await Team.insertMany(teamsData);
        console.log(`✅ Inserted ${teams.length} teams`);

        // Insert problems
        const problems = await Problem.insertMany(problemsData);
        console.log(`✅ Inserted ${problems.length} problems`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Sample Credentials:');
        console.log('Team ID: TEAM001');
        console.log('Password: password123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();