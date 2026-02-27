import { useEffect, useState } from "react";
import Hero from "../page_components/home_page/Hero.tsx";
import Features from "./../page_components/home_page/Features.tsx";
import TrendingServices from "../page_components/home_page/TrendingServices.tsx";
import PlatformStats from "../page_components/home_page/PlatformStats.tsx";
import CallToActionSection from "./../page_components/home_page/CallToActionSection.tsx";
import PostFeed from "../page_components/home_page/PostFeed.tsx";
import { isAuthenticated } from "../API/apiClient.ts";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBookmark,
  faNewspaper,
  faImage,
  faHashtag,
  faUser,
  faTachometerAlt,
  faFire,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setLoggedIn(authenticated);
    if (authenticated) {
      try {
        const u = localStorage.getItem("user");
        setCurrentUser(u ? JSON.parse(u) : null);
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  const isFreelancer =
    currentUser?.role === "freelancer" ||
    currentUser?.role === "business" ||
    currentUser?.role === "admin";

  if (loggedIn) {
    return (
      <div className="bg-(--color-bg) min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-5">
            {/* ── Left Sidebar ────────────────────── */}
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="sticky top-20 flex flex-col gap-4">
                {/* User card */}
                <div className="bg-(--color-surface) rounded-2xl overflow-hidden border border-(--color-border)">
                  {/* Gradient banner */}
                  <div className="h-16 bg-linear-to-r from-[#315bb5] via-[#4338CA] to-[#6D28D9] relative">
                    <div className="absolute -bottom-5 left-4">
                      <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#315bb5] to-[#6D28D9] flex items-center justify-center text-white font-bold text-lg ring-3 ring-(--color-surface)">
                        {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    </div>
                  </div>
                  <div className="pt-7 pb-4 px-4">
                    <p className="font-semibold text-(--color-text) text-sm">
                      {currentUser?.name}
                    </p>
                    <p className="text-xs text-(--color-text-muted) capitalize mt-0.5">
                      {currentUser?.role}
                    </p>
                  </div>
                  <div className="flex border-t border-(--color-border)">
                    <Link
                      to="/my-profile"
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-(--color-text-muted) hover:text-(--color-primary) hover:bg-(--color-bg) transition-colors"
                    >
                      <FontAwesomeIcon icon={faUser} className="text-[10px]" />
                      Profile
                    </Link>
                    <div className="w-px bg-(--color-border)" />
                    <Link
                      to="/dashboard"
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-(--color-text-muted) hover:text-(--color-primary) hover:bg-(--color-bg) transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faTachometerAlt}
                        className="text-[10px]"
                      />
                      Dashboard
                    </Link>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="bg-(--color-surface) rounded-2xl border border-(--color-border) py-2">
                  {isFreelancer && (
                    <Link
                      to="/create-post"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-primary)/5 hover:text-(--color-primary) transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-(--color-primary)/10 flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-xs text-(--color-primary)"
                        />
                      </div>
                      <span className="font-medium">Create Post</span>
                    </Link>
                  )}
                  <Link
                    to="/favorites"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-primary)/5 hover:text-(--color-primary) transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faBookmark}
                        className="text-xs text-amber-500"
                      />
                    </div>
                    <span className="font-medium">Saved</span>
                  </Link>
                  <Link
                    to="/browse-gigs"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-primary)/5 hover:text-(--color-primary) transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faNewspaper}
                        className="text-xs text-emerald-500"
                      />
                    </div>
                    <span className="font-medium">Browse Gigs</span>
                  </Link>
                </nav>

                {/* Footer links */}
                <div className="px-4">
                  <p className="text-[10px] text-(--color-text-muted)/50 leading-relaxed">
                    About · Help · Terms · Privacy
                    <br />
                    &copy; 2026 KarBazar
                  </p>
                </div>
              </div>
            </aside>

            {/* ── Main Feed ───────────────────────── */}
            <main className="flex-1 min-w-0">
              {/* Create post prompt */}
              {isFreelancer && (
                <Link to="/create-post" className="block mb-5">
                  <div className="bg-(--color-surface) rounded-2xl p-4 border border-(--color-border) flex items-center gap-3 hover:border-(--color-primary)/30 hover:shadow-[0_4px_20px_rgba(49,91,181,0.06)] transition-all">
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#315bb5] to-[#6D28D9] flex items-center justify-center text-white font-bold text-base shrink-0">
                      {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 px-4 py-2.5 bg-(--color-bg) rounded-xl text-(--color-text-muted) text-sm cursor-text">
                      Share your latest work or insights...
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-(--color-bg) flex items-center justify-center text-(--color-text-muted) hover:text-(--color-primary) hover:bg-(--color-primary)/5 transition-colors">
                        <FontAwesomeIcon icon={faImage} className="text-sm" />
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-(--color-bg) flex items-center justify-center text-(--color-text-muted) hover:text-(--color-primary) hover:bg-(--color-primary)/5 transition-colors">
                        <FontAwesomeIcon icon={faHashtag} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Feed header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-(--color-text)">
                    Your Feed
                  </h2>
                  <div className="h-1.5 w-1.5 rounded-full bg-(--color-primary) animate-pulse" />
                </div>
              </div>

              <PostFeed currentUserId={currentUser?.id} />
            </main>

            {/* ── Right Sidebar ───────────────────── */}
            <aside className="hidden xl:block w-64 shrink-0">
              <div className="sticky top-20 flex flex-col gap-4">
                {/* Trending Tags */}
                <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FontAwesomeIcon
                      icon={faFire}
                      className="text-sm text-orange-500"
                    />
                    <h3 className="font-semibold text-(--color-text) text-sm">
                      Trending
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    {[
                      {
                        tag: "design",
                        posts: "2.4k",
                        desc: "UI/UX & Branding",
                      },
                      {
                        tag: "development",
                        posts: "1.9k",
                        desc: "Full-stack & APIs",
                      },
                      {
                        tag: "marketing",
                        posts: "1.2k",
                        desc: "SEO & Social",
                      },
                      {
                        tag: "writing",
                        posts: "890",
                        desc: "Copy & Content",
                      },
                      {
                        tag: "video",
                        posts: "670",
                        desc: "Editing & Motion",
                      },
                    ].map(({ tag, posts, desc }) => (
                      <div
                        key={tag}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-(--color-bg) transition-colors cursor-pointer group"
                      >
                        <div>
                          <p className="text-sm font-medium text-(--color-text) group-hover:text-(--color-primary) transition-colors">
                            #{tag}
                          </p>
                          <p className="text-[11px] text-(--color-text-muted)">
                            {desc}
                          </p>
                        </div>
                        <span className="text-xs text-(--color-text-muted) font-medium">
                          {posts}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explore CTA */}
                <div className="bg-linear-to-br from-[#315bb5] to-[#6D28D9] rounded-2xl p-5 text-white">
                  <h3 className="font-semibold text-sm mb-1">
                    Discover Talent
                  </h3>
                  <p className="text-xs text-white/70 mb-4 leading-relaxed">
                    Find skilled freelancers for your next project
                  </p>
                  <Link
                    to="/browse-gigs"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl text-xs font-semibold transition-colors"
                  >
                    Explore
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-[10px]"
                    />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in: show landing page
  return (
    <div className="home-background">
      <Hero />
      <Features />
      <TrendingServices />
      <PlatformStats />
      <CallToActionSection />
    </div>
  );
}

export default Home;
