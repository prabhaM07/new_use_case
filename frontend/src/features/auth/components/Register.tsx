import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authApi';

const COUNTRY_CODES = [
  { label: '+91 India', value: '+91' },
  { label: '+1 USA', value: '+1' },
  { label: '+44 UK', value: '+44' },
  { label: '+61 Australia', value: '+61' },
  { label: '+971 UAE', value: '+971' },
];

interface FormState {
  first_name: string;
  last_name: string;
  country_code: string;
  phone_no: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialForm: FormState = {
  first_name: '',
  last_name: '',
  country_code: '+91',
  phone_no: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validatePassword(password: string): string | null {
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>/?~]/.test(password))
    return 'Password must contain at least one special character.';
  return null;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!/^\d{7,15}$/.test(form.phone_no)) {
      setError('Phone number must be 7–15 digits.');
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        first_name: form.first_name,
        last_name: form.last_name,
        country_code: form.country_code,
        phone_no: form.phone_no,
        email: form.email,
        password: form.password,
      });
      navigate('/login');
    } catch (err: any) {
      const message = err?.response?.data?.detail ?? 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      {/* First Name */}
      <label htmlFor="first_name">First Name</label>
      <input
        id="first_name"
        name="first_name"
        type="text"
        required
        value={form.first_name}
        onChange={handleChange}
        placeholder="John"
      />

      {/* Last Name */}
      <label htmlFor="last_name">Last Name</label>
      <input
        id="last_name"
        name="last_name"
        type="text"
        required
        value={form.last_name}
        onChange={handleChange}
        placeholder="Doe"
      />

      {/* Email */}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={handleChange}
        placeholder="you@example.com"
      />

      {/* Phone */}
      <label htmlFor="phone_no">Phone Number</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          name="country_code"
          value={form.country_code}
          onChange={handleChange}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          id="phone_no"
          name="phone_no"
          type="tel"
          required
          value={form.phone_no}
          onChange={handleChange}
          placeholder="9876543210"
        />
      </div>

      {/* Password */}
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        value={form.password}
        onChange={handleChange}
        placeholder="Min 6 chars, 1 uppercase, 1 number, 1 symbol"
      />

      {/* Confirm Password */}
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Repeat password"
      />

      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}