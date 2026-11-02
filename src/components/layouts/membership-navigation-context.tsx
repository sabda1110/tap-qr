import { createContext, useContext } from "react";

export const MembershipNavigationContext = createContext(false);
export const useMembershipNavigation = () => useContext(MembershipNavigationContext);
