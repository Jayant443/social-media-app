import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { createCommunity } from "../api/apiClient";

function CreateCommunityForm() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);

    const handleCreate = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (bannerFile) formData.append("banner", bannerFile);
        if (iconFile) formData.append("icon", iconFile);
        try {
            await createCommunity(formData);
            navigate(`/r/${name}`);
        } catch (err) { console.error(err); }
    };

    return (
        <>
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
                        <input type="file" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setIconFile(file);
                                setIconPreview(URL.createObjectURL(file));
                            }
                        }} />
                        {iconPreview && <img src={iconPreview} style={{ width: "50%", borderRadius: "10px" }} />}
                    </div>
                </div>
                <div className="form-group">
                    <label>Banner Image</label>
                    <div className="image-upload-box">
                        <FiUpload size={24} />
                        <p>Upload banner image</p>
                        <input type="file" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setBannerFile(file);
                                setBannerPreview(URL.createObjectURL(file));
                            }
                        }} />
                        {bannerPreview && <img src={bannerPreview} style={{ width: "50%", borderRadius: "10px" }} />}
                    </div>
                </div>
                <div className="form-actions">
                    <button className="post-btn" onClick={handleCreate}>Create</button>
                    <button className="cancel-btn" onClick={() => navigate('/')}>Cancel</button>
                </div>
            </div>
        </>
    );
}

export default CreateCommunityForm;