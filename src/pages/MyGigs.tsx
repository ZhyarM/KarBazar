import { useEffect, useState } from "react";
import { getMyGigs, deleteGig } from "../API/GigsAPI";
import type { Gig } from "../API/GigsAPI";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getImageUrl } from "../utils/imageUrl";
import {
  faPlus,
  faEdit,
  faTrash,
  faStar,
  faEye,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

function MyGigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      const data = await getMyGigs();
      setGigs(data);
    } catch (error) {
      console.error("Failed to load gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gigId: number) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;

    setDeleting(gigId);
    try {
      await deleteGig(gigId);
      await loadGigs();
    } catch (error) {
      console.error("Failed to delete gig:", error);
      alert("Failed to delete gig. Please try again.");
    } finally {
      setDeleting(null);
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-(--color-text)">My Gigs</h1>
          <Link
            to="/create-gig"
            className="px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Create New Gig
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
            <div className="text-(--color-text-muted) mb-2">Total Gigs</div>
            <div className="text-3xl font-bold text-(--color-text)">
              {gigs.length}
            </div>
          </div>
          <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
            <div className="text-(--color-text-muted) mb-2">Active Gigs</div>
            <div className="text-3xl font-bold text-green-600">
              {gigs.filter((g) => g.is_active).length}
            </div>
          </div>
          <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
            <div className="text-(--color-text-muted) mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-(--color-primary)">
              {gigs.reduce((sum, g) => sum + g.total_orders, 0)}
            </div>
          </div>
        </div>

        {/* Gigs List */}
        {gigs.length === 0 ? (
          <div className="text-center py-16 bg-(--color-surface) rounded-lg">
            <p className="text-xl text-(--color-text-muted) mb-4">
              You haven't created any gigs yet
            </p>
            <Link
              to="/create-gig"
              className="inline-block px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create Your First Gig
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-(--color-surface) rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Gig Image */}
                <div className="relative">
                  <img
                    src={getImageUrl(gig.image_url)}
                    alt={gig.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        gig.is_active
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {gig.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Gig Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-(--color-text) mb-2 line-clamp-2">
                    {gig.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-(--color-text-muted) mb-4">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-500"
                      />
                      <span>{gig.rating}</span>
                      <span>({gig.total_reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faShoppingCart} />
                      <span>{gig.total_orders} orders</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-lg font-bold text-green-500">
                      Free
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/gigs/${gig.id}`}
                      className="flex-1 text-center px-4 py-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg hover:bg-opacity-80 transition-all"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-2" />
                      View
                    </Link>
                    <Link
                      to={`/edit-gig/${gig.id}`}
                      className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(gig.id)}
                      disabled={deleting === gig.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyGigs;
