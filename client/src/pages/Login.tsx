import './Auth.css';
import WelcomeHeader from '../components/WelcomeHeader';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { LoginRequest, AuthResponse } from '../types/user';
import { login } from '../api/apiClient';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormdata] = useState<LoginRequest>({
        username: "",
        password: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormdata(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        const user: AuthResponse = await login(formData);
        localStorage.setItem("token", user.accessToken);
        navigate('/feed');
    }
    
    return (
        <>
            <div className="auth-container">
                <div className="welcome">
                    <WelcomeHeader />
                    <div className="description">
                        <p>Join thousands of communities, share your passions, and connect with people who share your interests.</p>
                        <ul>
                            <li>100K+ active communities</li>
                            <li>Millions of posts and discussions</li>
                            <li>Find your people</li>
                        </ul>
                    </div>
                </div>
                <div className="auth">
                    <h3>Welcome back</h3>
                    <p>Sign in to your account to continue</p>
                    <form className='login-form' onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" onChange={handleChange} placeholder="Username123" required />
                        <label htmlFor="password">Password</label>
                        <input type="password" name='password' onChange={handleChange} placeholder="•••••••••••••" required />
                        <button type="submit">Sign in</button>
                        <p>Don't have an account? <a href="./signup">Sign up</a></p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;