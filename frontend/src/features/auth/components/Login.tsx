import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { setCredentials } from "../slices/authSlice";
import { loginUser } from "../services/authApi";

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [form , setForm] = useState({ identifier: '', password: ''});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');
        setIsLoading(true);

        try {
            const response = await loginUser(form);
            dispatch(setCredentials(response.access_token));
            navigate('/');
        }
        catch(err: any){
            const message =
            err?.response?.data?.detail?.detail ||
            err?.response?.data?.detail ||
            "Login failed";

            setError(String(message));
        } 
        finally {
            setIsLoading(false);
        }
    };
    return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label htmlFor="identifier">Email or PhoneNo</label>
      <input
        id="identifier"
        name="identifier"
        type="email"
        autoComplete="email"
        required
        value={form.identifier}
        onChange={handleChange}
        placeholder="you@example.com"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={form.password}
        onChange={handleChange}
        placeholder="Enter password"
      />

      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </form>
  );
}   
