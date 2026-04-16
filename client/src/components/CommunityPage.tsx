import type { Community } from "../types/community";
import { formatDate } from "../utils/formatDate";

function CommunityPage({ community }: {community: Community | null}) {
    return (
        <div className="community-page">
            <div className="community-header card">
                <div className="community-banner" style={{backgroundImage: `url(${community?.banner_url})`,}}></div>
                <div className="community-info">
                    <div className="community-avatar" style={{backgroundImage: `url(${community?.icon_url})`}}>{!community?.icon_url && `r/`}</div>
                    <div>
                        <h2>r/{community?.name}</h2>
                    </div>
                </div>
                <button className="join-btn">Join</button>
            </div>
            <div className="community-stats card">
                <div><strong>1.2M</strong><span>Members</span></div>
                <div><strong>Created</strong><span>{formatDate(community?.created_at)}</span></div>
            </div>
            <div className="community-about card">
                <h3>About Community</h3>
                <p>{community?.description}</p>
            </div>
        </div>
    );
}

export default CommunityPage;