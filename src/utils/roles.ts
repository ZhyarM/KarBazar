export type ApiRole = "client" | "freelancer" | "admin";
export type UiRole = "client" | "business" | "admin";

type RoleLike = string | null | undefined;

export const normalizeRoleForUi = (role: RoleLike): UiRole => {
  if (role === "freelancer" || role === "business") {
    return "business";
  }

  if (role === "admin") {
    return "admin";
  }

  return "client";
};

export const toApiRole = (role: RoleLike): ApiRole => {
  const normalized = normalizeRoleForUi(role);
  if (normalized === "business") {
    return "freelancer";
  }

  return normalized;
};

export const isSellerRole = (role: RoleLike): boolean => {
  const normalized = normalizeRoleForUi(role);
  return normalized === "business" || normalized === "admin";
};

export const isBusinessRole = (role: RoleLike): boolean => {
  return normalizeRoleForUi(role) === "business";
};

export const isAdminRole = (role: RoleLike): boolean => {
  return normalizeRoleForUi(role) === "admin";
};

export const roleLabel = (role: RoleLike): string => {
  return normalizeRoleForUi(role);
};
