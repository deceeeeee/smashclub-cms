import {
    LayoutDashboard,
    MapPin,
    Users,
    Package,
    ShoppingBag,
    TrendingUp,
    Calendar,
    ShoppingCart,
    Shield,
    User,
    UserCheck,
    Settings,
    type LucideIcon
} from 'lucide-react';

export const menuIconMap: Record<string, LucideIcon> = {
    'home': LayoutDashboard,
    'court': MapPin,
    'coach': UserCheck,
    'equipment': Package,
    'product': ShoppingBag,
    'player': Users,
    'sales': TrendingUp,
    'court-booking': Calendar,
    'product-sales': ShoppingCart,
    'role': Shield,
    'user': User,
    'settings': Settings
};

export const getMenuIcon = (menuCode: string): LucideIcon => {
    return menuIconMap[menuCode] || Shield; // Default icon
};

