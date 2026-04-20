import './Auth.css';
import WelcomeHeader from '../components/WelcomeHeader';
import React, { useState } from 'react';
import type { AuthResponse, RegisterRequest } from '../types/user';
import { register } from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormdata] = useState<RegisterRequest>({
        username: "",
        email: "",
        password: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;
        setFormdata(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        const user: AuthResponse = await register(formData);
        localStorage.setItem("token", user.access_token);
        navigate('/');
    }
    
    return (
        <>
            <div className="auth-container">
                <div className="welcome">
                    <WelcomeHeader />
                    <div className="description">
                        <p id='desc-line'>Create an account and join millions of people sharing their stories, ideas, and passions.</p>
                        <ul id='desc-list'>
                            <li>Free to join and easy to use</li>
                            <li>Connect with like-minded people</li>
                            <li>Share and discover content</li>
                        </ul>
                    </div>
                </div>
                <div className="auth">
                    <h3>Create your account</h3>
                    <p>Join the community today</p>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input name="username" value={formData.username} onChange={handleChange} placeholder="Create a username" required />
                        <label htmlFor="email">Email</label>
                        <input name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                        <label htmlFor="password">Password</label>
                        <input name='password' type="password" value={formData.password} onChange={handleChange} placeholder="•••••••••••••" required />
                        <button type="submit">Sign up</button>
                        <p>Already have an account? <a href="./login">Sign in</a></p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Signup;