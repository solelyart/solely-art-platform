import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "dropdown" | "buttons";
  className?: string;
}

/**
 * ThemeToggle - Component for switching between light/dark/system themes
 * 
 * Variants:
 * - icon: Simple icon button that toggles between light/dark
 * - dropdown: Dropdown menu with all three options
 * - buttons: Three buttons for explicit selection (used in settings)
 */
export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme, switchable } = useTheme();

  if (!switchable) return null;

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn("relative", className)}
        aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    );
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Buttons variant - for settings pages
  return (
    <div className={cn("flex gap-2", className)}>
      <ThemeButton
        theme="light"
        currentTheme={theme}
        onClick={() => setTheme("light")}
        icon={<Sun className="h-4 w-4" />}
        label="Light"
      />
      <ThemeButton
        theme="dark"
        currentTheme={theme}
        onClick={() => setTheme("dark")}
        icon={<Moon className="h-4 w-4" />}
        label="Dark"
      />
      <ThemeButton
        theme="system"
        currentTheme={theme}
        onClick={() => setTheme("system")}
        icon={<Monitor className="h-4 w-4" />}
        label="System"
      />
    </div>
  );
}

interface ThemeButtonProps {
  theme: Theme;
  currentTheme: Theme;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ThemeButton({ theme, currentTheme, onClick, icon, label }: ThemeButtonProps) {
  const isActive = theme === currentTheme;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card hover:bg-accent/50 text-foreground"
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

/**
 * ThemeSelector - Full theme selector with preview cards
 * Used in user setup/onboarding flow
 */
export function ThemeSelector({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {/* Light Mode Card */}
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
          theme === "light"
            ? "border-primary ring-2 ring-primary/20"
            : "border-border hover:border-primary/50"
        )}
      >
        {/* Preview */}
        <div className="mb-4 rounded-lg overflow-hidden border border-[#E0DDD8]">
          <div className="bg-[#F5F2ED] p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-[#4A7C85]" />
              <div className="h-2 w-16 rounded bg-[#333333]/20" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full rounded bg-[#333333]/10" />
              <div className="h-2 w-3/4 rounded bg-[#333333]/10" />
            </div>
          </div>
          <div className="bg-white p-3 border-t border-[#E0DDD8]">
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded bg-[#4A7C85]" />
              <div className="h-6 w-16 rounded border border-[#4A7C85]" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Sun className="h-5 w-5 text-[#4A7C85]" />
          <div>
            <h3 className="font-medium text-foreground">Light Mode</h3>
            <p className="text-sm text-muted-foreground">Cream background with charcoal text</p>
          </div>
        </div>
        
        {theme === "light" && (
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>

      {/* Dark Mode Card */}
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
          theme === "dark"
            ? "border-primary ring-2 ring-primary/20"
            : "border-border hover:border-primary/50"
        )}
      >
        {/* Preview */}
        <div className="mb-4 rounded-lg overflow-hidden border border-[#4A4744]">
          <div className="bg-[#333333] p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-[#6A9CA5]" />
              <div className="h-2 w-16 rounded bg-[#F5F2ED]/20" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full rounded bg-[#F5F2ED]/10" />
              <div className="h-2 w-3/4 rounded bg-[#F5F2ED]/10" />
            </div>
          </div>
          <div className="bg-[#3D3D3D] p-3 border-t border-[#4A4744]">
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded bg-[#6A9CA5]" />
              <div className="h-6 w-16 rounded border border-[#6A9CA5]" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Moon className="h-5 w-5 text-[#6A9CA5]" />
          <div>
            <h3 className="font-medium text-foreground">Dark Mode</h3>
            <p className="text-sm text-muted-foreground">Charcoal background with cream text</p>
          </div>
        </div>
        
        {theme === "dark" && (
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
}

export default ThemeToggle;
