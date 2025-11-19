'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Mic,
  ListOrdered,
  Voicemail,
  FileText,
  CreditCard,
} from 'lucide-react';

const links = [
  { href: '/', label: 'Painel Principal', icon: LayoutDashboard },
  { href: '/gravacao', label: 'Gravação de Voz', icon: Mic },
  { href: '/pedidos', label: 'Meus Pedidos', icon: ListOrdered },
  { href: '/vozes', label: 'Lista de Vozes', icon: Voicemail },
  { href: '/gerador-texto', label: 'Gerador de Texto', icon: FileText },
  { href: '/creditos', label: 'Créditos e Pacotes', icon: CreditCard },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            //Exact match for home, partial for others
            isActive={
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            }
            tooltip={link.label}
          >
            <a href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
