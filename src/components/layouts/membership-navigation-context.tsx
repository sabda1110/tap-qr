import { createContext, useContext } from "react";

export const MembershipNavigationContext = createContext(false);
export const useMembershipNavigation = () => useContext(MembershipNavigationContext);
export const QueueNavigationContext = createContext(false);
export const useQueueNavigation = () => useContext(QueueNavigationContext);
