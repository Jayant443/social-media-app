import { useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import type { User } from "../types/user";
import { updateUser } from "../api/apiClient";
import './EditProfile.css';
import './UI/FormGroup.css';
import './UI/FormActions.css';

type Props = {
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
};

function EditProfile({ user, onClose, onSave }: Props) {
    const [bio, setBio] = useState(user.bio || "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url || null);
    const [saving, setSaving] = useState(false);
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            if (bio !== (user.bio || "")) formData.append("bio", bio);
            if (avatarFile) formData.append("avatar", avatarFile);
            const updatedUser = await updateUser(formData);
            onSave(updatedUser);
            onClose();
        } catch (err) {
            console.error("Failed to update profile", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Profile</h2>
                    <button className="modal-close-btn" onClick={onClose}><FiX size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Avatar</label>
                        <div className="avatar-edit-area">
                            <div className="profile-avatar">
                                {avatarPreview ? (<img src={avatarPreview} alt="avatar" />) : (<span>{user.username[0].toUpperCase()}</span>)}
                            </div>
                            <label className="avatar-upload-btn">
                                <FiUpload size={14} /> Change Avatar
                                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people about yourself..." rows={4}/>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="post-btn" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
