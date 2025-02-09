const express = require('express');
const router = express.Router();

// Example data (replace with data from your database)
const employees = [
    {
        id: 1,
        name: 'Ycabsire Abebe',
        dept: 'Design',
        jobTitle: 'UI UX Designer',
        startDate: '28/04/2022',
        category: 'Full time',
        gender: 'Female'
    },
    {
        id: 2,
        name: 'Feven Testeye',
        dept: 'IT',
        jobTitle: 'Backend Engineer',
        startDate: '28/04/2022',
        category: 'Remote',
        gender: 'Female'
    },
    // Add more employees as needed
];

// Route to render the department page
router.get('/', (req, res) => {
    res.render('department', { employees });
});

module.exports = router;