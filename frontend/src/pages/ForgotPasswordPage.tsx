import { useState } from 'react';
import { Link } from 'react-router';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { isValidEmail } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const { resetPassword, isLoading, error: authError } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    const result = await resetPassword(email);
    if (result !== null) {
      setSubmitted(true);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email to receive a reset link.">
      {submitted ? (
        <div className="sign-in-form__success">
          <p className="sign-in-form__success-msg">
            Reset link sent! Please check your email.
          </p>
          <Link to="/sign-in" className="sign-in-form__success-link">
            Return to sign in
          </Link>
        </div>
      ) : (
        <form className="sign-in-form" onSubmit={handleSubmit}>
          {authError && <div className="sign-in-form__error" style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '14px' }}>{authError}</div>}
          
          <Input 
            id="email" 
            type="email" 
            label="Email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
          </Button>
          
          <p className="sign-in-form__register">
            Remembered your password? <Link to="/sign-in">Back to sign in</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
