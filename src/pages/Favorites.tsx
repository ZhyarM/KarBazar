import { useEffect, useState } from "react";
import {
  getFavoriteGigs,
  getFavoriteFreelancers,
  toggleGigFavorite,
  toggleFreelancerFavorite,
} from "../API/FavoritesAPI";
import type { FavoriteGig, FavoriteFreelancer } from "../API/FavoritesAPI";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getImageUrl, getAvatarUrl } from "../utils/imageUrl";
import { faHeart, faStar, faUser } from "@fortawesome/free-solid-svg-icons";

function Favorites() {
  const [gigs, setGigs] = useState<FavoriteGig[]>([]);
  const [freelancers, setFreelancers] = useState<FavoriteFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"gigs" | "freelancers">("gigs");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const [gigsData, freelancersData] = await Promise.all([
        getFavoriteGigs(),
        getFavoriteFreelancers(),
      ]);
      setGigs(gigsData);
      setFreelancers(freelancersData);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGig = async (gigId: number) => {
    try {
      await toggleGigFavorite(gigId);
      await loadFavorites();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const handleRemoveFreelancer = async (userId: number) => {
    try {
      await toggleFreelancerFavorite(userId);
      await loadFavorites();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-bg) py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-(--color-text) mb-8 flex items-center gap-2">
          <FontAwesomeIcon icon={faHeart} className="text-(--color-primary)" />
          My Favorites
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("gigs")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              tab === "gigs"
                ? "bg-(--color-primary) text-white"
                : "bg-(--color-surface) text-(--color-text)"
            }`}
          >
            Gigs ({gigs.length})
          </button>
          <button
            onClick={() => setTab("freelancers")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              tab === "freelancers"
                ? "bg-(--color-primary) text-white"
                : "bg-(--color-surface) text-(--color-text)"
            }`}
          >
            Freelancers ({freelancers.length})
          </button>
        </div>

        {/* Gigs Tab */}
        {tab === "gigs" && (
          <div>
            {gigs.length === 0 ? (
              <div className="text-center py-16 bg-(--color-surface) rounded-lg">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-6xl text-(--color-text-muted) mb-4"
                />
                <p className="text-xl text-(--color-text-muted) mb-4">
                  No favorite gigs yet
                </p>
                <Link
                  to="/browse-gigs"
                  className="inline-block px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Browse Gigs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <div
                    key={gig.id}
                    className="bg-(--color-surface) rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(gig.image_url)}
                        alt={gig.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleRemoveGig(gig.id)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50 transition-all"
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                    </div>

                    <div className="p-4">
                      <Link
                        to={`/profile/${gig.seller.profile.username}`}
                        className="flex items-center gap-2 mb-2"
                      >
                        <img
                          src={getAvatarUrl(gig.seller.profile.avatar_url)}
                          alt={gig.seller.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-(--color-text)">
                          @{gig.seller.profile.username}
                        </span>
                      </Link>

                      <h3 className="text-lg font-semibold text-(--color-text) mb-2 line-clamp-2">
                        {gig.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-(--color-text-muted) mb-4">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-yellow-500"
                        />
                        <span>{gig.rating}</span>
                        <span>({gig.total_reviews})</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-500">
                          Free
                        </span>
                        <Link
                          to={`/gigs/${gig.id}`}
                          className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all"
                        >
                          View Gig
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Freelancers Tab */}
        {tab === "freelancers" && (
          <div>
            {freelancers.length === 0 ? (
              <div className="text-center py-16 bg-(--color-surface) rounded-lg">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-6xl text-(--color-text-muted) mb-4"
                />
                <p className="text-xl text-(--color-text-muted) mb-4">
                  No favorite freelancers yet
                </p>
                <Link
                  to="/browse-gigs"
                  className="inline-block px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Browse Freelancers
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className="bg-(--color-surface) rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <img
                          src={getAvatarUrl(freelancer.profile.avatar_url)}
                          alt={freelancer.name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveFreelancer(freelancer.id)}
                          className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50 transition-all"
                        >
                          <FontAwesomeIcon icon={faHeart} size="sm" />
                        </button>
                      </div>

                      <h3 className="text-xl font-bold text-(--color-text) mb-1">
                        {freelancer.name}
                      </h3>
                      <p className="text-sm text-(--color-text-muted) mb-2">
                        @{freelancer.profile.username}
                      </p>

                      {freelancer.profile.title && (
                        <p className="text-sm text-(--color-text) mb-4">
                          {freelancer.profile.title}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-sm text-(--color-text-muted) mb-4">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-yellow-500"
                        />
                        <span>{freelancer.profile.rating}</span>
                        <span>
                          ({freelancer.profile.total_reviews} reviews)
                        </span>
                      </div>

                      {freelancer.profile.skills && (
                        <div className="flex flex-wrap gap-2 mb-4 justify-center">
                          {JSON.parse(freelancer.profile.skills)
                            .slice(0, 3)
                            .map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-(--color-bg) text-(--color-text) rounded-full text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      )}

                      <Link
                        to={`/profile/${freelancer.profile.username}`}
                        className="w-full px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all text-center"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
