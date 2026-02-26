import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { BookOpen, Home, Hammer, FlaskConical, Scroll, Star, Eye, Sparkles } from "lucide-react";
import { CREATURES } from "@/lib/gameData";

const navItems = [
  { title: "Town Square", url: "/", icon: Home, desc: "Explore locations" },
  { title: "Mystery Journal", url: "/journal", icon: BookOpen, desc: "Creature catalog" },
  { title: "Base", url: "/base", icon: Hammer, desc: "Craft gadgets" },
  { title: "Cipher Lab", url: "/cipher", icon: FlaskConical, desc: "Decode secrets" },
];

interface AppSidebarProps {
  journalCount: number;
  solvedCount: number;
  symbolCount: number;
  loreCount: number;
}

export function AppSidebar({ journalCount, solvedCount, symbolCount, loreCount }: AppSidebarProps) {
  const [location] = useLocation();

  const totalCreatures = CREATURES.length;
  const progressPercent = Math.round((journalCount / totalCreatures) * 100);

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Scroll className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-sm text-sidebar-foreground leading-tight">Mystery Creature</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Explorer
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-active={location === item.url}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="text-sm">{item.title}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Investigation Progress</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-3 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Creatures Found
                  </span>
                  <span className="text-xs font-bold text-sidebar-foreground">{journalCount}/{totalCreatures}</span>
                </div>
                <div className="h-2 bg-sidebar-accent rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {progressPercent > 0 && progressPercent < 100 && (
                  <div className="text-xs text-muted-foreground mt-1">{progressPercent}% complete</div>
                )}
                {progressPercent === 100 && (
                  <div className="text-xs text-primary font-semibold mt-1 flex items-center gap-0.5">
                    <Star className="w-3 h-3" /> All creatures found!
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Secrets Decoded
                </span>
                <span className="text-xs font-bold text-sidebar-foreground">{solvedCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Symbols Found
                </span>
                <span className="text-xs font-bold text-sidebar-foreground">{symbolCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Field Notes
                </span>
                <span className="text-xs font-bold text-sidebar-foreground">{loreCount}</span>
              </div>

              <div className="grid grid-cols-9 gap-1">
                {Array.from({ length: totalCreatures }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-sm transition-all duration-500 ${
                      i < journalCount
                        ? "bg-primary"
                        : "bg-sidebar-accent"
                    }`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center italic leading-relaxed">
          "The truth is out there.{"\n"}Take notes."
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
