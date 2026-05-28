import {
  type LucideIcon,
  LayoutDashboard,
  Wallet,
  CandlestickChart,
  CreditCard,
  ArrowRightLeft,
  Tags,
  MessageCircle,
  Plug,
  Settings,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  count?: string;
};

export type NavGroup = {
  group: string;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  {
    group: "Principal",
    items: [
      { name: "Visão geral", href: "/dashboard", icon: LayoutDashboard },
      { name: "Contas", href: "/contas", icon: Wallet },
      { name: "Investimentos", href: "/investimentos", icon: CandlestickChart },
      { name: "Crédito", href: "/credito", icon: CreditCard },
    ],
  },
  {
    group: "Registros",
    items: [
      { name: "Movimentos", href: "/movimentos", icon: ArrowRightLeft },
      { name: "Categorias", href: "/categorias", icon: Tags },
      { name: "WhatsApp", href: "/whatsapp", icon: MessageCircle },
    ],
  },
  {
    group: "Configuração",
    items: [
      { name: "Conexões", href: "/conexoes", icon: Plug },
      { name: "Preferências", href: "/preferencias", icon: Settings },
    ],
  },
];
