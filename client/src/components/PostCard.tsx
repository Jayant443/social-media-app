import {
    FiArrowUp, FiArrowDown, FiMessageSquare, FiShare,
    FiMoreHorizontal, FiBookmark, FiEyeOff, FiFlag
} from "react-icons/fi";
import { useState } from "react";

function PostCard() {
    const [open, setOpen] = useState(false);

    return (
        <div className="post-card">
            <div className="post-content">
                <div className="post-options">
                    <button className="options-btn" onClick={() => setOpen(!open)}><FiMoreHorizontal /></button>
                    {open && (
                        <div className="options-menu">
                            <div className="option-item"><FiBookmark /><span>Save</span></div>
                            <div className="option-item"><FiEyeOff /><span>Hide</span></div>
                            <div className="option-item danger"><FiFlag /><span>Report</span></div>
                        </div>
                    )}
                </div>
                <div className="post-meta">
                    <span className="subreddit">r/TodayILearned</span>
                    <span> Posted by u/curiousMind • 6 days ago</span>
                </div>
                <h3 className="post-title">TIL that octopuses have three hearts and blue blood</h3>
                <p className="post-body">We have Chat GPT Enterprise edition for our org. We have created and deployed client interactions summaries in various workflows and also a chatbot which responds to our questions.My problem, LLM does not remember chat beyond last 3 instances and that too it has to be same session. Once session is over, no memory!Second problem, we have provided Thumbs up and down to users to provide us feedback but how we make LLM learn from this feedback?</p>
                <div className="post-actions">
                    <div className="vote-box">
                        <FiArrowUp />
                        <span>44.3k</span>
                        <FiArrowDown />
                    </div>
                    <div className="action"><FiMessageSquare /><span>3.4k Comments</span></div>
                    <div className="action"><FiShare /><span>Share</span></div>
                </div>
            </div>
        </div>
    );
}

export default PostCard;