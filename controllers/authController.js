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
        // Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.redirect('/dashboard'); // If error, stay on dashboard
            }

            // Clear cookies (if used for authentication)
            res.clearCookie('connect.sid'); // Default session cookie name in Express

            // Redirect to login page
            res.redirect('/login');
        });
    } catch (error) {
        console.error("Error in logout:", error);
        res.redirect('/dashboard'); // Fallback in case of error
    }
},

    adminDashboard:async (req, res) => {
      const { data, error } = await supabase
    .from('leave_applications')
    .select('user_id')
    .eq('status', 'pending');
    console.log(data)
    
  res.render('admin/dashboard', { leaves: data});
}

  }

module.exports = authController;