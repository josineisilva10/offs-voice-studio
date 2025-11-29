"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mic,
  List,
  Clapperboard,
  Heart,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  CreditCard,
} from "lucide-react";
import { useFirebase } from "@/firebase";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.email === "josineisilva2@gmail.com";

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Painel principal" },
    { href: "/gravacao", icon: Mic, label: "Gravação de voz" },
    { href: "/pedidos", icon: List, label: "Meus pedidos" },
    { href: "/vozes", icon: Clapperboard, label: "Lista de vozes" },
    { href: "/creditos", icon: CreditCard, label: "Crédito e pacote" },
    { href: "/gerador-ia", icon: Heart, label: "Gerador de texto com IA" },
  ];

  if (isAdmin) {
    navItems.push({
      href: "/admin/locutores",
      icon: Shield,
      label: "Gerenciamento de locutores",
    });
  }
  
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
  };

  const renderNavLinks = () =>
    navItems.map((item) => (
      <Link key={item.label} href={item.href}>
        <span
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium rounded-md",
            pathname === item.href
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          )}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.label}
        </span>
      </Link>
    ));

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white p-4 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <Link href="/dashboard">
              <span className="flex items-center">
                <Mic className="h-8 w-8 text-indigo-400" />
                <h1 className="ml-2 text-2xl font-bold">VozGenius</h1>
              </span>
            </Link>
          </div>
          <nav className="flex-grow space-y-2">{renderNavLinks()}</nav>
          <div className="mt-auto">
            <div className="flex items-center p-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.displayName || "Usuário"}</p>
                <p className="text-xs text-gray-400">
                  {isAdmin ? "Administrador" : "Cliente"}
                </p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
