import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export function DropdownMenuDemo() {
  const { user } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none">
          {user?.name || "Guest"}
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            const subject = encodeURIComponent("Support Request – Mmoa");
            const body = encodeURIComponent(
              `Hi Mmoa Support,\n\nI need help with the following:\n\n[Describe your issue here]\n\n---\nSent from Mmoa App\nUser: ${user.name} (${user.email})`,
            );
            window.open(
              `https://mail.google.com/mail/?view=cm&to=juniorpappoe@gmail.com&su=${subject}&body=${body}`,
              "_blank",
            );
          }}
        >
          Support
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
