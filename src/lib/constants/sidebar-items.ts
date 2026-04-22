import { 
  LayoutDashboard, 
  Users, 
  Flag, 
  Users2, 
  CreditCard, 
  Rss, 
  HelpCircle, 
  Settings,
  LogOut
} from "lucide-react";
import { ADMIN_ROUTES } from "./routes";

export const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    href: ADMIN_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: ADMIN_ROUTES.USERS,
    icon: Users,
  },
  {
    label: "Reports",
    href: ADMIN_ROUTES.REPORTS,
    icon: Flag,
  },
  {
    label: "Communities",
    href: ADMIN_ROUTES.COMMUNITIES,
    icon: Users2,
  },
  {
    label: "Transactions",
    href: ADMIN_ROUTES.TRANSACTIONS,
    icon: CreditCard,
  },
  {
    label: "Broadcasts",
    href: ADMIN_ROUTES.BROADCASTS,
    icon: Rss,
  },
  {
    label: "Helpdesk",
    href: ADMIN_ROUTES.HELPDESK,
    icon: HelpCircle,
  },
  {
    label: "Settings",
    href: ADMIN_ROUTES.PROFILE,
    icon: Settings,
  },
  {
    label: "Logout",
    href: "#",
    icon: LogOut,
    isLogout: true,
  },
];
