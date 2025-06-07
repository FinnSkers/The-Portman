"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Upload, 
  BarChart3, 
  FileText, 
  Briefcase, 
  User, 
  Sparkles,
  Bot,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { useTheme } from "next-themes";

const navigation = [
  { name: "Upload CV", href: "/", icon: Upload, description: "Start your journey" },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, description: "Analytics & insights" },
  { name: "Analysis", href: "/analysis", icon: Bot, description: "AI-powered insights" },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase, description: "Generate portfolio" },
  { name: "ATS Resume", href: "/ats-resume", icon: FileText, description: "Optimize for ATS" },
];

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ThemeToggle = () => (
    <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
        className="h-8 w-8 p-0"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("system")}
        className="h-8 w-8 p-0"
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="h-8 w-8 p-0"
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PORTMAN
            </span>
            <Badge variant="secondary" className="text-xs">
              AI-Powered
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">PORTMAN</span>
                  </div>
                  
                  <nav className="flex flex-col space-y-2">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.description}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="pt-4 border-t space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Theme</label>
                      <ThemeToggle />
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" className="justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                      <Button className="justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Get Started
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
