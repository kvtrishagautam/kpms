const supabase = require('../config/supabase');

const leaveController = {
    getLeaveForm: async (req, res) => {
        try {
            // Fetch relief officers from Supabase
            const { data: reliefOfficers, error: officersError } = await supabase
                .from('profiles')
                .select('id, first_name')
                .neq('id', req.session.user); // Use req.session.user.id
    
            if (officersError) {
                console.error('Error fetching relief officers:', officersError);
                throw officersError;
            }
    
            // Render the leave application form
            res.render('leave/apply', {
                user: req.session.user,
                reliefOfficers,
                error: null
            });
        } catch (error) {
            console.error('Error in getLeaveForm:', error);
            res.render('leave/apply', {
                user: req.session.user,
                leaveTypes: [],
                reliefOfficers: [],
                error: 'Failed to load form data'
            });
        }
    },

    submitLeave: async (req, res) => {
        try {
            const {leave_type,start_date,end_date,duration,resumption_date,reason } = req.body;
    
            console.log(req.body.start_date)
            console.log(start_date)
            // Validate required fields
            if (!leave_type || !start_date || !end_date || !duration || !resumption_date || !reason) {
                throw new Error('All fields are required');
            }
    
            let handoverDocPath = null;
            if (req.files && req.files.handover_document) {
                const file = req.files.handover_document;
                const timestamp = Date.now();
                const fileExt = file.name.split('.').pop();
                const fileName = `${req.session.user.id}-${timestamp}.${fileExt}`;
    
                // Upload file to Supabase storage
                const { data, error: uploadError } = await supabase.storage
                    .from('handover-documents')
                    .upload(fileName, file.data, {
                        contentType: file.mimetype,
                    });
    
                if (uploadError) {
                    console.error('Error uploading file:', uploadError);
                    throw uploadError;
                }
    
                handoverDocPath = data.path; // Store the file path
            }
    
            // Insert leave application into the database
            const { data: leaveData, error } = await supabase
                .from('leave_applications')
                .insert([
                    {
                        user_id: req.session.user,
                        leave_type,
                        start_date,
                        end_date,
                        duration: parseInt(duration),
                        resumption_date,
                        reason,
                        handover_document: handoverDocPath,
                        status: 'pending',
                    },
                ]);
    
            if (error) {
                console.error('Error submitting leave application:', error);
                throw error;
            }
    
            // Set a flash message for success
            req.session.flashMessage = {
                type: 'success',
                text: 'Leave application submitted successfully',
            };
    
            // Redirect to leave history page
            res.redirect('/');
        } catch (error) {
            console.error('Error in submitLeave:', error);
    
            // Render the leave application form with an error message
            res.render('leave/apply', {
                user: req.session.user,
                leaveTypes: [],
                reliefOfficers: [],
                error: error.message || 'Failed to submit leave application',
            });
        }
    },

    getLeaveHistory: async (req, res) => {
        try {
            const { data: leaveHistory, error } = await supabase
                .from('leave_applications')
                .select(`
                    *,
                    leave_types (name),
                    relief_officer:profiles!relief_officer_id (full_name)
                `)
                .eq('user_id', req.session.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching leave history:', error);
                throw error;
            }

            res.render('/', {
                user: req.session.user,
                leaveHistory,
                flashMessage: req.session.flashMessage
            });

            // Clear flash message after displaying
            req.session.flashMessage = null;

        } catch (error) {
            console.error('Error in getLeaveHistory:', error);
            res.render('leave/history', {
                user: req.session.user,
                leaveHistory: [],
                error: 'Failed to load leave history'
            });
        }
    }
};

module.exports = leaveController;