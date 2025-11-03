"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/user-menu";

const navigation = [
  { name: "ダッシュボード", href: "/" },
  { name: "事業計画", href: "/business-plans" },
  { name: "コーポレート計画", href: "/corporate-plan" },
  { name: "CRM", href: "/crm" },
  { name: "設定", href: "/settings" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="font-bold text-lg">NP Business Management</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}


