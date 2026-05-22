import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiImage, FiLink, FiUpload } from "react-icons/fi";
import type { Community } from "../types/community";
import { createPost, getUserJoinedCommunities } from "../api/apiClient";
import FormActions from "./UI/FormActions";
import './CreateForm.css';
import './UI/FormGroup.css';

function CreatePostForm() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<string>("text");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [userComunities, setUserComunities] = useState<Community[]>([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [url, setUrl] = useState("");
    const [selectedCommunity, setSelectedCommunity] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        async function fetchUserJoinedCommunities(): Promise<void> {
            const res = await getUserJoinedCommunities();
            setUserComunities(res);
        }
        fetchUserJoinedCommunities();
    }, []);

    async function handleSubmit() {
        if (!selectedCommunity || !title) {
            alert("Community and title are required");
            return;
        }
        const formData = new FormData();
        formData.append("title", title);
        if (body) formData.append("body", body);
        if (url) formData.append("url", url);

        if ( imageFile) formData.append("image", imageFile);
        try {
            await createPost(selectedCommunity, formData);
            navigate('/');
        } catch (err) { console.error("Failed to create post", err); }
    }

    return (
        <>
            <div className="create-post-form card">
                <h2>Create a post</h2>
                <div className="form-group">
                    <label>Choose a community</label>
                    <select value={selectedCommunity} onChange={(e) => setSelectedCommunity(e.target.value)}>
                        <option value="">Select a subreddit</option>
                        {userComunities.map((community) => (<option key={community.id} value={community.id}>r/{community.name}</option>))}
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
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="An interesting title" />
                    <span className="char-count">0/300</span>
                </div>
                {tab === "text" && (
                    <div className="form-group">
                        <label>Text (optional)</label>
                        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Text (optional)" />
                    </div>
                )}
                {tab === "image" && (
                    <div className="image-upload-box">
                        <FiUpload size={28} />
                        <p>Drag & drop an image here</p>
                        <span>or click to upload</span>
                        <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); } }} />
                        {imagePreview && <img src={imagePreview} style={{ width: "50%", borderRadius: "10px" }} />}
                    </div>
                )}
                {tab === "link" && (
                    <div className="form-group">
                        <label>Link URL</label>
                        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
                    </div>
                )}
                <FormActions handleSubmit={handleSubmit} formType="create-post"/>
            </div>
        </>
    );
}

export default CreatePostForm;
