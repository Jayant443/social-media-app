import { useState } from "react";
import { FiUpload } from "react-icons/fi";

function CreateCommunityForm({ onCancel }: { onCancel: () => void }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);

    return (
        <div className="create-post-form card">
            <h2>Create a community</h2>
            <div className="form-group">
                <label>Community Name</label>
                <input type="text" placeholder="r/mycommunity" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Tell people what this community is about" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Community Icon</label>
                <div className="image-upload-box">
                    <FiUpload size={24} />
                    <p>Upload community icon</p>
                    <input type="file" onChange={(e) => {const file = e.target.files?.[0]; if (file) setBannerPreview(URL.createObjectURL(file)); }}/>
                    {bannerPreview && <img src={bannerPreview} style={{ width: "50%", borderRadius: "10px" }} />}
                </div>
            </div>
            <div className="form-group">
                <label>Banner Image</label>
                <div className="image-upload-box">
                    <FiUpload size={24} />
                    <p>Upload banner image</p>
                    <input type="file" onChange={(e) => {const file = e.target.files?.[0]; if (file) setIconPreview(URL.createObjectURL(file)); }}/>
                    {iconPreview && <img src={iconPreview} style={{ width: "50%", borderRadius: "10px" }} />}
                </div>
            </div>
            <div className="form-actions">
                <button className="post-btn">Create</button>
                <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default CreateCommunityForm;