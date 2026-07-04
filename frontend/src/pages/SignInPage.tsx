import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { isValidEmail, isValidPassword } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const { signIn, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    const result = await signIn(email, password);
    if (result) {
      navigate('/');
    }
  };

  return (
    <AuthLayout
      title='Welcome back'
      subtitle='Please enter your details to sign in.'
    >
      <form className='sign-in-form' onSubmit={handleSubmit}>
        {authError && <div className="sign-in-form__error" style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '14px' }}>{authError}</div>}
        
        <Input
          id='email'
          type='email'
          label='Email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          id='password'
          type='password'
          label='Password'
          placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className='sign-in-form__options'>
          <label className='sign-in-form__remember'>
            <input type='checkbox' /> Remember me
          </label>
          <Link to='/forgot-password' className='sign-in-form__forgot'>
            Forgot password?
          </Link>
        </div>

        <Button type='submit' fullWidth disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <p className='sign-in-form__register'>
          Don't have an account? <Link to='/sign-up'>Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
