import './Auth.css';
import WelcomeHeader from '../components/WelcomeHeader';

function Login() {
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
                    <form className='login-form'>
                        <label htmlFor="email">Email</label>
                        <input name="email" placeholder="your@email.com" required />
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="•••••••••••••" required />
                        <button type="submit">Sign in</button>
                        <p>Don't have an account? <a href="./signup">Sign up</a></p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;