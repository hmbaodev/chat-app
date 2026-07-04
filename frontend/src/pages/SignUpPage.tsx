import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { isValidEmail, isValidPassword } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const { signUp, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Full Name is required';
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    const result = await signUp(name, email, password);
    if (result) {
      navigate('/');
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Join us and start chatting today.">
      <form className="sign-in-form" onSubmit={handleSubmit}>
        {authError && <div className="sign-in-form__error" style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '14px' }}>{authError}</div>}
        
        <Input 
          id="name" 
          type="text" 
          label="Full Name" 
          placeholder="Enter your name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input 
          id="email" 
          type="email" 
          label="Email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input 
          id="password" 
          type="password" 
          label="Password" 
          placeholder="Create a password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Input 
          id="confirm-password" 
          type="password" 
          label="Confirm Password" 
          placeholder="Repeat your password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
        
        <p className="sign-in-form__register">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
