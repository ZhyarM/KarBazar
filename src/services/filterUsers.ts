import type { Gig } from "../API/gigs/getGigs";


export function filterUser(users: Gig[], filters: Record<string, any>) {
  const CONFIG_MAX = 1000;

  return users.filter((u) => {
    if (filters.category && u.category !== filters.category) return false;
    if (filters.sellerLevel && u.seller.profile.rating !== filters.sellerLevel)
      return false;

    if (filters.budget) {
      const [min, max] = filters.budget;

      const charge = Number(u.rating.replace(/[^0-9.-]+/g, ""));

      if (charge < min) return false;

      if (max < CONFIG_MAX && charge > max) {
        return false;
      }
    }

    return true;
  });
}
