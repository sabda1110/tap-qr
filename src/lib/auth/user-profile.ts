export type UserRole = "owner" | "admin";

export type UserProfile = {
  uid: string;
  email: string;
  name: string;
  provider: "google" | "password";
  role: UserRole;
};
