import './WelcomeHeader.css';

function WelcomeHeader() {
    return (
        <>
            <div className="welcome-header">
                <span className="auth-logo">D</span>
                <div className="app-title">
                    <span id="app-name">Discuzz</span>
                    <span id="tagline">Dive into anything</span>
                </div>
            </div>
        </>
    );
}

export default WelcomeHeader;