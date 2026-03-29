import { 
  LayoutDashboard, 
  User, 
  Users, 
  Flag, 
  Users2, 
  CreditCard, 
  Rss, 
  HelpCircle 
} from "lucide-react";
import { ADMIN_ROUTES } from "./routes";

export const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    href: ADMIN_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: ADMIN_ROUTES.PROFILE,
    icon: User,
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
];
