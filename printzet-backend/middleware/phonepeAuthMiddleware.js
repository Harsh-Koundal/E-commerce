import axios from "axios";

 const phonePeAuthMiddleware = async (req, res, next) => {
    try {
      // Check if token already exists in session
      if (req.session.paymentToken) {
        return next(); // proceed to next middleware or route
      }
  
      // Token not in session, so fetch from PhonePe
      const client_id = 'TAJFOOTWEARUAT_2503031838273556894438';
      const client_version = 1;
      const client_secret = 'NTY5NjExODAtZTlkNy00ZWM3LThlZWEtYWQ0NGJkMGMzMjkz';
      const grant_type = 'client_credentials';
  
      const form = new URLSearchParams();
      form.append('client_id', client_id);
      form.append('client_version', client_version);
      form.append('client_secret', client_secret);
      form.append('grant_type', grant_type);
  
      const response = await axios.post(
        'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
        form.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      const token = response.data.access_token; 
  
      // Store in session
      req.session.paymentToken = token;
      next();
    } catch (error) {
      console.error('PhonePe Auth Middleware Error:', error?.response?.data || error.message);
      res.status(500).json({ error: 'Failed to get PhonePe token' });
    }
  };
  export { phonePeAuthMiddleware };