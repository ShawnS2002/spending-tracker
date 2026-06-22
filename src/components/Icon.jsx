import {
  Plus, X, ShoppingCart, UtensilsCrossed, Car, Zap, MoreHorizontal, Home,
  History, PieChart, Settings, Trash2, Check, Tag, AlertCircle, ChevronDown,
  ChevronRight, Plane, Briefcase, Sparkles, Sun, Moon, Pencil, Users,
  LayoutGrid, FolderPlus, ArrowLeft, Wallet, HeartPulse, Shield, Repeat,
  Wrench, GraduationCap, PawPrint, Sparkle, Gift, ShoppingBag, PiggyBank,
  Hotel, Map, Globe, FileText, Laptop, Megaphone, Scale, Package, Receipt,
  MapPin,
} from "lucide-react";

const ICONS = {
  Home, Plane, Briefcase, Sparkles, ShoppingCart, UtensilsCrossed, Car, Zap,
  MoreHorizontal, Wallet, HeartPulse, Shield, Repeat, Wrench, GraduationCap,
  PawPrint, Sparkle, Gift, ShoppingBag, PiggyBank, Hotel, Map, Globe,
  FileText, Laptop, Megaphone, Scale, Package, Receipt, Tag, MapPin,
  Plus, X, History, PieChart, Settings, Trash2, Check, AlertCircle,
  ChevronDown, ChevronRight, Sun, Moon, Pencil, Users, LayoutGrid, FolderPlus,
  ArrowLeft,
};

export default function Icon({ name, ...props }) {
  const Cmp = ICONS[name] || Tag;
  return <Cmp {...props} />;
}
