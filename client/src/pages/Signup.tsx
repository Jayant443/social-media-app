import './Auth.css';
import WelcomeHeader from '../components/WelcomeHeader';

function Signup() {
    return (
        <>
            <div className="auth-container">
                <div className="welcome">
                    <WelcomeHeader />
                    <div className="description">
                        <p>Create an account and join millions of people sharing their stories, ideas, and passions.</p>
                        <ul>
                            <li>Free to join and easy to use</li>
                            <li>Connect with like-minded people</li>
                            <li>Share and discover content</li>
                        </ul>
                    </div>
                </div>
                <div className="auth">
                    <h3>Create your account</h3>
                    <p>Join the community today</p>
                    <form className="signup-form">
                        <label htmlFor="username">Username</label>
                        <input name="username" placeholder="Create a username" required />
                        <label htmlFor="email">Email</label>
                        <input name="email" placeholder="your@email.com" required />
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="•••••••••••••" required />
                        <button type="submit">Sign up</button>
                        <p>Already have an account? <a href="./login">Sign in</a></p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Signup;