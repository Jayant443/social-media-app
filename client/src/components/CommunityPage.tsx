import { useEffect, useState } from "react";
import type { Community, CommunityResponse } from "../types/community";
import { formatDate } from "../utils/formatDate";
import { getCommunityMemberCount, getCommunityPostCount, getUserJoinedCommunities } from "../api/apiClient";

function CommunityPage({ community }: {community: CommunityResponse | null}) {
    const [communityDetails, setCommunityDetails] = useState<Community | null>(null);

    useEffect(() => {
        async function getFullCommunityData(id: string | null) {
            const [communities, memberCount, postCount] = await Promise.all([
                getUserJoinedCommunities(),
                getCommunityMemberCount(id),
                getCommunityPostCount(id)
            ]);

            const community = communities.find(c => c.id === id);
            if (!community) {
                throw new Error("Community not found");
            }

            const fullCommunity: Community = {
                ...community,
                member_count: memberCount,
                post_count: postCount,
            };

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
                    <div>
                        <h2>r/{community?.name}</h2>
                    </div>
                </div>
                <button className="join-btn">Join</button>
            </div>
            <div className="community-stats card">
                <div><strong>{communityDetails?.member_count}</strong><span>Members</span></div>
                <div><strong>{communityDetails?.post_count}</strong><span>Posts</span></div>
                <div><strong>Created</strong><span>{community?.created_at ? formatDate(community?.created_at) : "Uknown"}</span></div>
            </div>
            <div className="community-about card">
                <h3>About Community</h3>
                <p>{community?.description}</p>
            </div>
        </div>
    );
}

export default CommunityPage;