import { useEffect, useState } from "react";
import type { Community, CommunityResponse } from "../types/community";
import { formatDate } from "../utils/formatDate";
import { getCommunityMemberCount, getCommunityPostCount } from "../api/apiClient";

function CommunityPage({ community }: {community: CommunityResponse | null}) {
    const [communityDetails, setCommunityDetails] = useState<Community | null>(null);
    useEffect(() => {
        async function getFullCommunityData(id: string | null) {
            const [memberCount, postCount] = await Promise.all([
                getCommunityMemberCount(id),
                getCommunityPostCount(id)
            ]);
            const fullCommunity: Community = {
                ...community,
                member_count: memberCount,
                post_count: postCount,
            } as Community;
            setCommunityDetails(fullCommunity);
        }
        getFullCommunityData(community?.id ? community.id : "");
    }, [community]);
    return (
        <div className="community-page">
            <div className="community-header card">
                <div className="community-banner" style={{backgroundImage: `url(${community?.banner_url})`,}}></div>
                <div className="community-info">
                    <div className="community-avatar" style={{backgroundImage: `url(${community?.icon_url})`}}>{!community?.icon_url && `r/`}</div>
                    <div><h2>r/{community?.name}</h2></div>
                </div>
                <button className="join-btn">Join</button>
            </div>
            <div className="community-stats card">
                <div><strong>{communityDetails?.member_count ? communityDetails?.member_count : 0}</strong><span>Members</span></div>
                <div><strong>{communityDetails?.post_count ? communityDetails?.post_count : 0}</strong><span>Posts</span></div>
                <div><strong>{community?.created_at ? formatDate(community?.created_at) : "Uknown"}</strong><span>Created</span></div>
            </div>
            <div className="community-about card">
                <h3>About Community</h3>
                <p>{community?.description}</p>
            </div>
        </div>
    );
}

export default CommunityPage;