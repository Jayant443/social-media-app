import { useState } from "react";
import { FiFileText, FiImage, FiLink, FiUpload } from "react-icons/fi";

function CreatePostForm({ onCancel }: {onCancel: () => void}) {
    const [tab, setTab] = useState<string>("text");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    return (
        <div className="create-post-form card">
            <h2>Create a post</h2>
            <div className="form-group">
                <label>Choose a community</label>
                <select>
                    <option>Select a subreddit</option>
                    <option>r/Technology</option>
                    <option>r/Computer Science</option>
                    <option>r/Programming</option>
                    <option>r/Gaming</option>
                </select>
            </div>
            <div className="post-tabs">
                <div className={`tab ${tab === "text" ? "active" : ""}`} onClick={() => setTab("text")}><FiFileText /><span>Text</span>
                </div>
                <div className={`tab ${tab === "image" ? "active" : ""}`} onClick={() => setTab("image")}><FiImage /><span>Image</span></div>
                <div className={`tab ${tab === "link" ? "active" : ""}`} onClick={() => setTab("link")}><FiLink /><span>Link</span></div>
            </div>
            <div className="form-group">
                <label>Title</label>
                <input type="text" placeholder="An interesting title" />
                <span className="char-count">0/300</span>
            </div>
            {tab === "text" && (
                <div className="form-group">
                    <label>Text (optional)</label>
                    <textarea placeholder="Text (optional)" />
                </div>
            )}
            {tab === "image" && (
                <div className="image-upload-box">
                    <FiUpload size={28} />
                    <p>Drag & drop an image here</p>
                    <span>or click to upload</span>
                    <input type="file" onChange={(e) => {const file = e.target.files?.[0]; if (file) setImagePreview(URL.createObjectURL(file)); }}/>
                    {imagePreview && <img src={imagePreview} style={{ width: "50%", borderRadius: "10px" }} />}
                </div>
            )}
            {tab === "link" && (
                <div className="form-group">
                    <label>Link URL</label>
                    <input type="text" placeholder="https://example.com" />
                </div>
            )}
            <div className="form-actions">
                <button className="post-btn">Post</button>
                <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default CreatePostForm;