import { Home as HomeIcon, RefreshCcw, Shirt, UserRound, LogOut, LogIn } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

interface MobileNavProps {
  active: string;
}

export function MobileNav({ active }: MobileNavProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleAuth = async () => {
    if (user) {
      await auth.signOut();
      toast.success("Logged out successfully");
    } else {
      setLocation("/login");
    }
  };

  const items = [
    { label: "Shop", icon: HomeIcon, href: "/", key: "shop" },
    { label: "Closet", icon: Shirt, href: "/wardrobe", key: "wardrobe" },
    { label: "Swaps", icon: RefreshCcw, href: "/swap", key: "swaps" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1d1d1a]/10 bg-[#f7f5f0]/95 px-3 py-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map(({ label, icon: Icon, href, key }) => (
          <Link
            key={label}
            href={href}
            className={`mobile-nav-item ${active === key || (active === "wardrobe" && key === "you") ? "mobile-nav-active" : ""}`}
          >
            <Icon size={19} strokeWidth={active === key ? 2.4 : 1.8} />
            <span>{label}</span>
          </Link>
        ))}
        <button
          onClick={handleAuth}
          className="mobile-nav-item"
        >
          {user ? (
            <>
              <LogOut size={19} strokeWidth={1.8} />
              <span>Logout</span>
            </>
          ) : (
            <>
              <LogIn size={19} strokeWidth={1.8} />
              <span>Login</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
