const supabase = require('../config/supabase');

const authController = {
    // GET handlers
    getRegisterPage: (req, res) => {
        res.render('auth/register', { error: null });
    },

    getLoginPage: (req, res) => {
        res.render('auth/login', { error: null });
    },

    // POST handlers

register: async (req, res) => {
    const { confirmPassword, password, firstName, lastName, phone,email } = req.body;
    
    try {
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

      
        // Insert data into Supabase
        const { data, error } = await supabase
            .from('profiles')
            .insert([
                {   email: email,
                    password:password,
                    first_name: firstName, 
                    last_name: lastName, 
                    phone, 
                    // Include the hashed password
                }
            ]);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).send('Error inserting data into Supabase');
        }

        // Redirect to login page after successful registration
        res.redirect('/auth/login');

    } catch (error) {
        console.error('Server error:', error);
        res.render('/auth/register', { 
            error: 'An unexpected error occurred' 
        });
    }
},


login: async (req, res) => {
  const { email, password } = req.body;

  try {
      // Fetch user from the custom profiles table
      const { data: user, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

      // If user not found or error, re-render login page with error message
      if (error || !user) {
          console.error('Login error:', error);
          return res.render('auth/login', { 
              error: 'Invalid email or password' 
          });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = (password==user.password)?true:false;

      if (!isPasswordValid) {
          return res.render('auth/login', { 
              error: 'Invalid email or password' 
          });
      }
      if(user.role=='superior'){
        req.session.user = user.id;
        res.redirect('admin/dashboard');
      }
      else if(user.role=='officer'){
        req.session.user = user.id;
        res.redirect('/');
      }
     
      

  } catch (err) {
      // Handle unexpected errors
      console.error('Unexpected error:', err);
      res.render('auth/login', { 
          error: 'An unexpected error occurred. Please try again.' 
      });
  }
},


    logout: async (req, res) => {
        try {
            await supabase.auth.signOut();
            req.session.destroy();
            res.redirect('/login');
        } catch (error) {
            res.redirect('/dashboard');
        }
    },
    adminDashboard: async (req, res) => {
      const { data, error } = await supabase
          .from('leave_applications')
          .select('user_id, start_date, end_date, reason') // Fetch additional fields
          .eq('status', 'pending');
  
      if (error) {
          console.error(error);
          return res.status(500).send('An error occurred while fetching leave applications.');
      }
  
      console.log(data);
      res.render('admin/dashboard', { leaves: data });
  
},adminDashboard: async (req, res) => {
  const { data, error } = await supabase
      .from('leave_applications')
      .select(`
          user_id,
          start_date,
          end_date,
          reason,
          profiles ( first_name )
      `)
      .eq('status', 'pending');

  if (error) {
      console.error(error);
      return res.status(500).send('An error occurred while fetching leave applications.');
  }

  console.log(data);
  res.render('admin/dashboard', { leaves: data });
}, setPendingLeaves: async (req, res) => {
  const { data, error } = await supabase
      .from('leave_applications')
      .select(`
          user_id,
          start_date,
          end_date,
          reason,
          profiles ( first_name )
      `)
      .eq('status', 'pending');

  if (error) {
      console.error(error);
      return res.status(500).send('An error occurred while fetching leave applications.');
  }

  res.render('admin/dashboard', { leaves: data });
},
updatePendingLeaves: async (req, res) => {

  const { user_id, status } = req.body;
  try {

      console.log(user_id);

      const { error } = await supabase
          .from('leave_applications')
          .update({ status })
          .eq('user_id', user_id);

      if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Failed to update leave status.' });
      }

      res.json({ message: `Leave status updated to ${status}.` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the leave status.' });
  }
}
,
   
  }

module.exports = authController;