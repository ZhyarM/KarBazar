interface UserProfile {
  id: number;
  user_id: number;
  username: string;
  bio: string | null;
  title: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  location: string | null;
  website: string | null;
  hourly_rate: number | null;
  skills: string | null;
  languages: string | null;
  rating: string;
  total_reviews: number;
  total_jobs: number;
  total_earnings: number;
  response_time: number;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: "freelancer" | "client" | "admin";
  is_active: boolean | null;
  email_verified_at: string | null;
  created_at: string;
  profile: UserProfile;
}

interface AuthData {
  user: User;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User | null;
}

interface RequestPayload {
  email: string;
  password: string;
}

const getAuthCookie = (name:String) => {
  const match = document.cookie
    .split('; ')
  .find((row) => row.startsWith(name + '='));
  
  return match ? match.split('=')[1] : null;

}

 const me = async (): Promise<AuthResponse> => { 

  const token = getAuthCookie('Authorization');
  const response = await fetch("http://127.0.0.1:8000/api/auth/me ", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,

    },
    
  });

  const data: AuthResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  

  return data;

  



}

export default me;