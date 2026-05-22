import { useNavigate } from "react-router-dom";
import './FormActions.css';

type BtnProps = {
    formType: string,
    handleSubmit: () => void
}

function FormActions({ handleSubmit, formType }: BtnProps) {
    const navigate = useNavigate();
    return (
        <>
            <div className="form-actions">
                <button className="post-btn" onClick={handleSubmit}>{formType==="create-post" ? "Post" : "Create"}</button>
                <button className="cancel-btn" onClick={() => navigate('/')}>Cancel</button>
            </div>
        </>
    );
}

export default FormActions;