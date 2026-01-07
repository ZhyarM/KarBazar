import type { User } from "../utils/UserData";

export function filterUser(users: User[], filters: Record<string, any>) {
  const CONFIG_MAX = 1000;

  return users.filter((u) => {
    if (filters.category && u.category !== filters.category) return false;
    if (filters.sellerLevel && u.seller_level !== filters.sellerLevel)
      return false;

    if (filters.budget) {
      const [min, max] = filters.budget;

      const charge = Number(u.charge.replace(/[^0-9.-]+/g, ""));

      if (charge < min) return false;

      if (max < CONFIG_MAX && charge > max) {
        return false;
      }
    }

    return true;
  });
}
