const supabase = require('../config/supabase');

const dashboardController = {
    getDashboard: async (req, res) => {
        try {
            // Get user profile data
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', req.session.user.id)
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
            const { data: tasks, error: tasksError } = await supabase
                .from('tasks')
                .select('*')
                .eq('assigned_to', req.session.user.id)
                .eq('completed', false)
                .order('due_date', { ascending: true })
                .limit(4);

            if (tasksError) {
                console.error('Error fetching tasks:', tasksError);
            }

            // Get leave balance
            const { data: leaveBalance, error: leaveError } = await supabase
                .from('leave_balance')
                .select('*')
                .eq('user_id', req.session.user.id)
                .single();

            if (leaveError) {
                console.error('Error fetching leave balance:', leaveError);
            }

            res.render('dashboard', {
                user: {
                    ...req.session.user,
                    profile
                },
                announcements: announcements || [],
                tasks: tasks || [],
                leaveBalance: leaveBalance || {
                    annual_leave: 0,
                    sick_leave: 0,
                    casual_leave: 0
                }
            });

        } catch (error) {
            console.error('Dashboard error:', error);
            res.redirect('/login');
        }
    },

    clockIn: async (req, res) => {
        try {
            const { error } = await supabase
                .from('attendance')
                .insert({
                    user_id: req.session.user.id,
                    clock_in: new Date().toISOString(),
                    status: 'present'
                });

            if (error) throw error;

            res.json({ success: true });
        } catch (error) {
            console.error('Clock-in error:', error);
            res.status(500).json({ error: 'Failed to clock in' });
        }
    },

    updateTaskStatus: async (req, res) => {
        const { taskId, completed } = req.body;

        try {
            const { error } = await supabase
                .from('tasks')
                .update({ completed })
                .eq('id', taskId)
                .eq('assigned_to', req.session.user.id);

            if (error) throw error;

            res.json({ success: true });
        } catch (error) {
            console.error('Task update error:', error);
            res.status(500).json({ error: 'Failed to update task' });
        }
    }
};

module.exports = dashboardController;