import React, { useEffect, useState } from "react";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Star,
  Briefcase,
  DollarSign,
  Clock,
  User as UserIcon,
  Mail,
  Camera,
  Edit3,
  Plus,
  Settings,
  Globe,
  Languages,
  ExternalLink,
  Award,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  MoreVertical,
  Check,
  X,
  Upload,
  Trash2,
  Move,
} from "lucide-react";

import type { AuthResponse } from "../../API/me";
import me from "../../API/me";

// --- INTERFACES FOR TYPE SAFETY ---
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  color: "amber" | "blue" | "emerald" | "purple";
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  isLink?: boolean;
  editable?: boolean;
}

interface StrengthItemProps {
  label: string;
  complete?: boolean;
}

const FreelancerProfile = () => {
  // --- KEEPING YOUR ORIGINAL LOGIC ---
  const [response, setResponse] = useState<AuthResponse | null>(null);
  const user = response?.data;
  const profile = user?.profile;

  useEffect(() => {
    const fetchUser = async () => {
      const authResponse = await me();
      if (authResponse.success) {
        setResponse(authResponse);
      }
    };
    fetchUser();
  }, []);

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string | null | undefined): string => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "U";
  };
  // --- END OF YOUR LOGIC ---

  if (!response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl animate-pulse"></div>
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-indigo-400 rounded-full animate-ping"></div>
          </div>
          <div className="mt-6 h-3 w-40 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="mt-3 h-2 w-28 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 pb-24">
      {/* Enhanced Top Admin Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-sm font-black tracking-tight">
                    PROFILE EDITOR
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    OWNER
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Shape your professional identity
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button className="text-gray-600 hover:bg-gray-100 p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95">
              <Eye className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:bg-gray-100 p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95">
              <Share2 className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <button className="text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100">
              Discard
            </button>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Publish Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-4">
        {/* Profile Completion Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">
                Your Profile is 75% Complete
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete your profile to attract more clients and stand out from
                the competition
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full w-3/4 rounded-full transition-all duration-500"></div>
                </div>
                <span className="text-sm font-bold text-amber-600">75%</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-semibold bg-white text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">
                  + Add Portfolio
                </span>
                <span className="text-xs font-semibold bg-white text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">
                  + Add Certifications
                </span>
                <span className="text-xs font-semibold bg-white text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200">
                  + Complete Bio
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Main Profile Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Enhanced Header Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden group">
              {/* Cover Image Section */}
              <div className="relative h-72 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                {profile?.cover_url && (
                  <img
                    src={profile.cover_url}
                    alt="Cover"
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Cover Image Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl backdrop-blur-xl transition-all hover:scale-105 border border-white/20">
                    <Upload className="w-5 h-5" />
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl backdrop-blur-xl transition-all hover:scale-105 border border-white/20">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Floating Stats */}
                <div className="absolute bottom-4 left-4 flex gap-3">
                  <div className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/30">
                    <div className="flex items-center gap-2 text-white">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-bold">1,234 views</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/30">
                    <div className="flex items-center gap-2 text-white">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-bold">89 saves</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="px-8 pb-8">
                <div className="relative flex flex-col sm:flex-row items-start sm:items-end -mt-16 gap-6">
                  {/* Avatar with Enhanced Edit */}
                  <div className="relative group/avatar">
                    <div className="w-36 h-36 rounded-3xl border-4 border-white bg-gradient-to-br from-gray-100 to-gray-50 shadow-2xl overflow-hidden">
                      {user?.image || profile?.avatar_url ? (
                        <img
                          src={user?.image || profile?.avatar_url || null}
                          alt={user?.name || "User Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                          {getInitials(user?.name)}
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center rounded-3xl cursor-pointer">
                      <div className="text-center text-white">
                        <Camera className="w-7 h-7 mx-auto mb-1" />
                        <span className="text-xs font-bold">Change Photo</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Name and Title Section */}
                  <div className="flex-1 mt-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            {user?.name}
                          </h1>
                          <button className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all">
                            <Edit3 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <p className="text-indigo-600 font-bold text-lg">
                            @{user?.profile.username || "handle"}
                          </p>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 font-medium">
                            Senior Developer
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm ${
                              user?.is_active
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            <span
                              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                                user?.is_active
                                  ? "bg-emerald-500"
                                  : "bg-gray-400"
                              }`}
                            ></span>
                            {user?.is_active ? "Available Now" : "Busy"}
                          </span>
                          <span className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Award className="w-3.5 h-3.5" />
                            Top Rated
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <StatCard
                icon={<Star className="text-amber-500" />}
                label="Rating"
                value={profile?.rating || "0.0"}
                sub={`${profile?.total_reviews || 0} reviews`}
                trend="+0.2"
                color="amber"
              />
              <StatCard
                icon={<Briefcase className="text-blue-500" />}
                label="Completed"
                value={profile?.total_jobs || 0}
                sub="projects"
                trend="+12"
                color="blue"
              />
              <StatCard
                icon={<DollarSign className="text-emerald-500" />}
                label="Revenue"
                value={`$${profile?.total_earnings || 0}`}
                sub="total earned"
                trend="+15%"
                color="emerald"
              />
              <StatCard
                icon={<Clock className="text-purple-500" />}
                label="Response"
                value={
                  profile?.response_time ? `${profile.response_time}h` : "N/A"
                }
                sub="avg time"
                color="purple"
              />
            </div>

            {/* Enhanced Bio Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">
                    Professional Bio
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tell clients what makes you unique
                  </p>
                </div>
                <button className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Edit Bio
                </button>
              </div>
              <div className="prose prose-indigo max-w-none">
                {profile?.bio ? (
                  <div className="relative">
                    <p className="leading-relaxed text-gray-700 text-base whitespace-pre-line">
                      {profile.bio}
                    </p>
                    <div className="absolute top-0 right-0 flex gap-2">
                      <button className="text-gray-400 hover:text-indigo-600 p-1">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 border-2 border-dashed border-indigo-200 rounded-2xl p-12 text-center group hover:border-indigo-300 transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Edit3 className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Your story starts here
                    </h4>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                      A compelling bio helps you get 40% more job offers.
                      Highlight your expertise and passion!
                    </p>
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all inline-flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Write Your Bio
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Portfolio Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">
                    Portfolio & Work
                  </h3>
                  <p className="text-sm text-gray-500">
                    Showcase your best projects
                  </p>
                </div>
                <button className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="group relative aspect-video bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-indigo-600 transition-colors" />
                      <span className="text-sm font-semibold text-gray-500 group-hover:text-indigo-600">
                        Add Project {i}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">
                    Work Experience
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your professional journey
                  </p>
                </div>
                <button className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center">
                <Briefcase className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">
                  Add your work experience to build credibility
                </p>
                <button className="text-indigo-600 font-bold hover:underline">
                  Add your first position
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Enhanced Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 shadow-lg text-white">
              <h3 className="font-black mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" /> Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl text-sm font-bold transition-all text-left flex items-center gap-3 border border-white/20">
                  <Eye className="w-4 h-4" />
                  Preview Public Profile
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl text-sm font-bold transition-all text-left flex items-center gap-3 border border-white/20">
                  <Share2 className="w-4 h-4" />
                  Share Profile Link
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl text-sm font-bold transition-all text-left flex items-center gap-3 border border-white/20">
                  <Settings className="w-4 h-4" />
                  Privacy Settings
                </button>
              </div>
            </div>

            {/* Enhanced Personal Details Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-indigo-600" /> Quick Info
              </h3>
              <div className="space-y-5">
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={user?.email || "Add Email"}
                  editable
                />
                <div className="h-px bg-gray-100"></div>
                <InfoRow
                  icon={<MapPin className="w-4 h-4" />}
                  label="Location"
                  value={profile?.location || "Add Location"}
                  editable
                />
                <div className="h-px bg-gray-100"></div>
                <InfoRow
                  icon={<LinkIcon className="w-4 h-4" />}
                  label="Website"
                  value={profile?.website}
                  isLink
                  editable
                />
                <div className="h-px bg-gray-100"></div>
                <InfoRow
                  icon={<Calendar className="w-4 h-4" />}
                  label="Member Since"
                  value={formatDate(user?.created_at)}
                />
              </div>
              <button className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all">
                Update All Info
              </button>
            </div>

            {/* Enhanced Skills Management */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/50">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-gray-900 text-lg">Top Skills</h3>
                <button className="p-2 hover:bg-indigo-50 rounded-xl text-indigo-600 transition-all hover:scale-110">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(profile?.skills) &&
                  profile.skills.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-bold rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all cursor-move"
                    >
                      <Move className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {skill}
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 hover:text-red-500 ml-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
              </div>
              <button className="w-full py-2.5 text-sm font-bold text-gray-600 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all">
                + Add More Skills
              </button>
            </div>

            {/* Enhanced Languages */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/50">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-gray-900 flex items-center gap-2 text-lg">
                  <Languages className="w-5 h-5 text-indigo-600" /> Languages
                </h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                  + Add
                </button>
              </div>
              <div className="space-y-3">
                {profile?.languages?.map((lang: string, idx: number) => (
                  <div
                    key={idx}
                    className="group flex justify-between items-center text-sm bg-gradient-to-r from-gray-50 to-indigo-50/30 hover:from-indigo-50 hover:to-purple-50 px-4 py-3 rounded-xl border border-gray-100 transition-all"
                  >
                    <span className="font-semibold text-gray-900">{lang}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-100 px-2 py-1 rounded-lg">
                        Native
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/50">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-gray-900 flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-indigo-600" /> Certifications
                </h3>
                <button className="text-sm font-bold text-indigo-600">
                  + Add
                </button>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center">
                <Award className="w-10 h-10 text-indigo-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Add certifications to boost credibility
                </p>
                <button className="text-sm text-indigo-600 font-bold hover:underline">
                  Add certification
                </button>
              </div>
            </div>

            {/* Profile Strength */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-gray-900 text-lg">
                  Profile Strength
                </h3>
                <span className="text-2xl font-black text-emerald-600">
                  75%
                </span>
              </div>
              <div className="space-y-3">
                <StrengthItem label="Basic Info" complete />
                <StrengthItem label="Professional Bio" complete />
                <StrengthItem label="Skills" complete />
                <StrengthItem label="Portfolio" />
                <StrengthItem label="Certifications" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ENHANCED UI HELPER COMPONENTS ---

const StatCard = ({ icon, label, value, sub, trend, color }: StatCardProps) => {
  // Tailwind mapping to ensure classes exist (safe listing)
  const bgColors: Record<string, string> = {
    amber: "bg-amber-50",
    blue: "bg-blue-50",
    emerald: "bg-emerald-50",
    purple: "bg-purple-50",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 ${
            bgColors[color] || "bg-gray-50"
          } rounded-xl group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
        {label}
      </div>
      {sub && (
        <div className="text-xs text-gray-400 font-medium mt-2">{sub}</div>
      )}
    </div>
  );
};

const InfoRow = ({ icon, label, value, isLink, editable }: InfoRowProps) => (
  <div className="flex items-start gap-4 group">
    <div className="mt-1 text-indigo-600 bg-indigo-50 p-2 rounded-lg">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline truncate"
        >
          {value.replace("https://", "").replace("http://", "")}
          <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <p className="text-sm font-bold text-gray-900 truncate">
          {value || "Not set"}
        </p>
      )}
    </div>
    {editable && (
      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-indigo-600 p-1">
        <Edit3 className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

const StrengthItem = ({ label, complete }: StrengthItemProps) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-gray-700">{label}</span>
    {complete ? (
      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
        <Check className="w-3 h-3 text-white" />
      </div>
    ) : (
      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
    )}
  </div>
);

export default FreelancerProfile;
