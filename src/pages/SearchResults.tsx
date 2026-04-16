import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCategories } from "../API/CategoriesAPI";
import { fetchGigs, type Gig } from "../API/gigs/getGigs";
import { getAccounts, type Profile } from "../API/ProfileAPI";
import { getPosts, type Post } from "../API/PostsAPI";
import { getAvatarUrl, getImageUrl } from "../utils/imageUrl";

type CategoryResult = {
  id: number;
  name: string;
  description: string;
  gig_count: number;
  icon: string;
};

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const requestRef = useRef(0);

  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryResult[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [accounts, setAccounts] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 140);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetchCategories();
      if (!response.success) {
        setAllCategories([]);
        return;
      }

      const normalized = (response.data ?? []).map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        gig_count: category.gig_count,
        icon: category.icon,
      }));

      setAllCategories(normalized);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!debouncedQuery) {
      setAccounts([]);
      setPosts([]);
      setGigs([]);
      setError(null);
      setLoading(false);
      return;
    }

    const runSearch = async () => {
      const requestId = ++requestRef.current;
      setLoading(true);
      setError(null);

      try {
        const [accountResponse, postsResponse, gigsResponse] =
          await Promise.all([
            getAccounts({ search: debouncedQuery, per_page: 8 }),
            getPosts({ search: debouncedQuery, per_page: 8 }),
            fetchGigs({ search: debouncedQuery, page: 1 }),
          ]);

        if (requestRef.current !== requestId) {
          return;
        }

        setAccounts(accountResponse.data ?? []);
        setPosts(postsResponse.data ?? []);
        setGigs((gigsResponse.data ?? []).slice(0, 8));
      } catch (searchError) {
        if (requestRef.current !== requestId) {
          return;
        }
        console.error("Combined search failed:", searchError);
        setError("Search failed. Please try again.");
      } finally {
        if (requestRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    runSearch();
  }, [debouncedQuery]);

  const categories = useMemo(
    () =>
      (allCategories ?? [])
        .filter((category) =>
          category.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
        .sort((a, b) => (b.gig_count ?? 0) - (a.gig_count ?? 0))
        .slice(0, 8),
    [allCategories, debouncedQuery],
  );

  const hasAnyResults = useMemo(
    () =>
      categories.length > 0 ||
      accounts.length > 0 ||
      posts.length > 0 ||
      gigs.length > 0,
    [categories.length, accounts.length, posts.length, gigs.length],
  );

  return (
    <section className="bg-(--color-bg) min-h-screen px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <header className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
          <h1 className="text-2xl font-bold text-(--color-text)">
            Search Results
          </h1>
          <p className="text-sm text-(--color-text-muted) mt-1">
            Showing combined results for
            <span className="font-semibold text-(--color-text)">
              {" "}
              {query || "..."}
            </span>
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-sm text-(--color-text-muted)">
            Searching categories, accounts, and gigs...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && !query && (
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-sm text-(--color-text-muted)">
            Enter a search term in the navbar to see combined results.
          </div>
        )}

        {!loading && !error && query && !hasAnyResults && (
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-sm text-(--color-text-muted)">
            No matches found for this query.
          </div>
        )}

        {categories.length > 0 && (
          <article className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <h2 className="text-lg font-semibold text-(--color-text) mb-3">
              Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/browse-gigs?category_id=${category.id}&category=${encodeURIComponent(category.name)}`}
                  className="rounded-xl border border-(--color-border) p-4 hover:border-(--color-primary) transition-colors"
                >
                  <p className="text-base font-semibold text-(--color-text)">
                    {category.name}
                  </p>
                  <p className="text-xs text-(--color-text-muted) mt-1 line-clamp-2">
                    {category.description || "Browse gigs in this category"}
                  </p>
                  <p className="text-xs text-(--color-primary) mt-2 font-medium">
                    {category.gig_count} gigs
                  </p>
                </Link>
              ))}
            </div>
          </article>
        )}

        {accounts.length > 0 && (
          <article className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <h2 className="text-lg font-semibold text-(--color-text) mb-3">
              Accounts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accounts.map((account) => (
                <Link
                  key={account.id}
                  to={
                    account.username
                      ? `/profile/${account.username}`
                      : `/user/${account.user_id}`
                  }
                  className="rounded-xl border border-(--color-border) p-4 hover:border-(--color-primary) transition-colors flex items-center gap-3"
                >
                  <img
                    src={getAvatarUrl(
                      account.avatar_url || account.user?.image,
                    )}
                    alt={account.user?.name || account.username}
                    className="w-11 h-11 rounded-full object-cover bg-(--color-bg)"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-(--color-text) truncate">
                      {account.user?.name || account.username}
                    </p>
                    <p className="text-xs text-(--color-text-muted) truncate">
                      @{account.username} • {account.user?.role || "user"}
                    </p>
                    {account.title && (
                      <p className="text-xs text-(--color-text-muted) truncate mt-0.5">
                        {account.title}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </article>
        )}

        {posts.length > 0 && (
          <article className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <h2 className="text-lg font-semibold text-(--color-text) mb-3">
              Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="rounded-xl border border-(--color-border) p-4 hover:border-(--color-primary) transition-colors"
                >
                  <p className="text-sm font-semibold text-(--color-text) line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-xs text-(--color-text-muted) mt-1 line-clamp-2">
                    {post.description}
                  </p>
                  <p className="text-xs text-(--color-text-muted) mt-2">
                    {post.user?.name || "Unknown author"}
                  </p>
                </Link>
              ))}
            </div>
          </article>
        )}

        {gigs.length > 0 && (
          <article className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <h2 className="text-lg font-semibold text-(--color-text) mb-3">
              Gigs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gigs.map((gig) => (
                <Link
                  key={gig.id}
                  to={`/gig/${gig.id}`}
                  className="rounded-xl border border-(--color-border) p-3 hover:border-(--color-primary) transition-colors flex gap-3"
                >
                  <img
                    src={getImageUrl(gig.image_url)}
                    alt={gig.title}
                    className="w-20 h-20 rounded-lg object-cover bg-(--color-bg)"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-(--color-text) line-clamp-2">
                      {gig.title}
                    </p>
                    <p className="text-xs text-(--color-text-muted) mt-1 truncate">
                      {gig.category?.name || "Category"}
                    </p>
                    <p className="text-xs text-(--color-text-muted)">
                      by {gig.seller?.name}
                    </p>
                    <p className="text-sm font-semibold text-(--color-primary) mt-1">
                      ${gig.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export default SearchResults;
