const supabase = require('../config/supabase');

const dashboardController = {
    getDashboard: async (req, res) => {
        try {
            // Get user profile data
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', req.session.user)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
                return res.redirect('/login');
            }

            // Get announcements
            const { data: announcements, error: announcementsError } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            if (announcementsError) {
                console.error('Error fetching announcements:', announcementsError);
            }

            // Get tasks
            // const { data: tasks, error: tasksError } = await supabase
            //     .from('tasks')
            //     .select('*')
            //     .eq('assigned_to', req.session.user.id)
            //     .eq('completed', false)
            //     .order('due_date', { ascending: true })
            //     .limit(4);

            // if (tasksError) {
            //     console.error('Error fetching tasks:', tasksError);
            // }

            // Get leave balance
            // const { data: leaveBalance, error: leaveError } = await supabase
            //     .from('leave_balance')
            //     .select('*')
            //     .eq('user_id', req.session.user.id)
            //     .single();

            // if (leaveError) {
            //     console.error('Error fetching leave balance:', leaveError);
            // }

            res.render('dashboard', {
                user: {
                    ...req.session.user,
                    profile
                },
                announcements: announcements || [],
                // tasks: tasks || [],
                // leaveBalance: leaveBalance || {
                //     annual_leave: 0,
                //     sick_leave: 0,
                //     casual_leave: 0
                // }
            });

        } catch (error) {
            console.error('Dashboard error:', error);
            res.redirect('/login');
        }
    },
    clockIn: async (req, res) => {
        try {
            const userId = req.session.user; // Assuming you have middleware to attach the user to the request
    
            // Insert a new clock-in record
            const { data, error } = await supabase
                .from('attendance')
                .insert([{ user_id: userId, clock_in: new Date().toISOString() }]);
    
            if (error) {
                throw error;
            }
    
            res.status(200).json({ message: 'Clocked in successfully' });
        } catch (error) {
            console.error('Error clocking in:', error);
            res.status(500).json({ error: 'An error occurred while clocking in' });
        }
    },
    clockOut: async (req, res) => {
        try {
            const userId = req.session.user; // Assuming you have middleware to attach the user to the request
    
            // Get the most recent clock-in record
            const { data: clockInRecord, error: fetchError } = await supabase
                .from('attendance')
                .select('clock_in')
                .eq('user_id', userId)
                .is('clock_out', null) // Check if clock_out is NULL
                .order('clock_in', { ascending: false }) // Get the most recent record
                .limit(1);
    
            if (fetchError) {
                throw fetchError;
            }
    
            if (clockInRecord.length === 0) {
                return res.status(400).json({ error: 'No active clock-in record found' });
            }
    
            const clockInTime = new Date(clockInRecord[0].clock_in);
            const clockOutTime = new Date();
    
            // Calculate total duration in hours
            const totalDuration = ((clockOutTime - clockInTime) / (1000 * 60 * 60)).toFixed(2);
    
            // Update the clock-out time and total duration
            const { error: updateError } = await supabase
                .from('attendance')
                .update({ clock_out: clockOutTime.toISOString(), total_hours: totalDuration })
                .eq('user_id', userId)
                .is('clock_out', null);
    
            if (updateError) {
                throw updateError;
            }
    
            res.status(200).json({ message: 'Clocked out successfully', hoursWorked: totalDuration });
        } catch (error) {
            console.error('Error clocking out:', error);
            res.status(500).json({ error: 'An error occurred while clocking out' });
        }
    },
    getAttendanceStatus: async (req, res) => {
        try {
            const userId = req.session.user; // Assuming you have middleware to attach the user to the request
    
            // Query the database to check if the user is currently clocked in
            const { data, error } = await supabase
                .from('attendance')
                .select('clock_in')
                .eq('user_id', userId)
                .is('clock_out', null) // Check if clock_out is NULL
                .order('clock_in', { ascending: false }) // Get the most recent record
                .limit(1);
    
            if (error) {
                throw error;
            }
    
            if (data.length > 0) {
                // User is clocked in
                res.status(200).json({
                    isClockedIn: true,
                    session: {
                        clock_in: data[0].clock_in, // The time the user clocked in
                    },
                });
            } else {
                // User is not clocked in
                res.status(200).json({
                    isClockedIn: false,
                });
            }
        } catch (error) {
            console.error('Error fetching attendance status:', error);
            res.status(500).json({ error: 'An error occurred while fetching attendance status' });
        }
    }
    

    };

module.exports = dashboardController;