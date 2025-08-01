import {
  CreditCard,
  HelpCircleIcon,
  LogOut,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { PurchaseCredits } from "@/modules/subscription/ui/PurchaseCredits";

import { useAuthContext } from "@/auth/hooks/useAuthContext";

import { cn } from "../../lib/utils";
import { Button, IconButton } from "../Button";

import { Navigation } from "./Navigation";
import { HeaderProps } from "./types";

const Header = ({ className }: HeaderProps) => {
  const [purchaseCredsOpen, setPurchaseCredsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthContext();

  const { hash } = useLocation();

  const handleSignOut = () => {
    logout();
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const hashElement = document.getElementById(hash.slice(1));
    if (hashElement) {
      hashElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn("w-full bg-white py-4 shadow-sm", className)}>
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="no-underline" onClick={closeMobileMenu}>
            <img
              className="block h-[39px] w-[100px]"
              width={100}
              height={39}
              src="/clipspin-logo.png"
              alt="ClipSpin"
            />
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <Navigation />
            <div className="flex items-center gap-2">
              {user ? (
                <IconButton onClick={handleSignOut} variant="ghost" size="sm">
                  <LogOut size={18} />
                </IconButton>
              ) : (
                <Button size="sm" asChild>
                  <Link to="/auth/sign-in">Sign In</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <div className="flex items-center gap-2 md:hidden">
                {!user.subscription ? (
                  <Link
                    to="/pricing"
                    className="flex transform items-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-white transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="mr-1.5 h-3 w-3" />
                    <span className="text-xs font-semibold">Credits</span>
                  </Link>
                ) : (
                  <div className="flex items-center rounded-full border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 px-2.5 py-1.5 dark:border-purple-700 dark:from-purple-900/20 dark:to-blue-900/20">
                    <CreditCard className="mr-1.5 h-3 w-3 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold text-purple-800 dark:text-purple-300">
                      {user.subscription?.total_credits}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPurchaseCredsOpen(true)}
                      className="ml-1.5 rounded-full p-0.5 transition-colors hover:bg-purple-200 dark:hover:bg-purple-800"
                    >
                      <Plus className="h-2.5 w-2.5 text-purple-600 dark:text-purple-400" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="md:hidden">
              <IconButton
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="sm"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </IconButton>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 border-t border-gray-200 pt-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Navigation />
              {user ? (
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Button size="sm" asChild className="w-full">
                  <Link to="/auth/sign-in" onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild size="sm" className="w-full">
                <Link to="mailto:support@clipspin.ai">
                  <HelpCircleIcon className="mr-2 h-4 w-4" />
                  Support
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <PurchaseCredits
        open={purchaseCredsOpen}
        onOpenChange={setPurchaseCredsOpen}
      />
    </header>
  );
};

export default Header;
