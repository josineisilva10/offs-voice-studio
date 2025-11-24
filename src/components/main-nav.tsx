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
  Users,
} from 'lucide-react';
import { useUser } from '@/firebase/provider';

const links = [
  { href: '/', label: 'Painel Principal', icon: LayoutDashboard },
  { href: '/gravacao', label: 'Gravação de Voz', icon: Mic },
  { href: '/pedidos', label: 'Meus Pedidos', icon: ListOrdered },
  { href: '/vozes', label: 'Lista de Vozes', icon: Voicemail },
  { href: '/gerador-texto', label: 'Gerador de Texto', icon: FileText },
  { href: '/creditos', label: 'Créditos e Pacotes', icon: CreditCard },
];

const adminLink = { href: '/admin/locutores', label: 'Admin Locutores', icon: Users };
const ADMIN_EMAIL = 'josineisilva2@gmail.com';


export function MainNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const isAdmin = user?.email === ADMIN_EMAIL;

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
      {isAdmin && (
         <SidebarMenuItem key={adminLink.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(adminLink.href)}
            tooltip={adminLink.label}
          >
            <a href={adminLink.href}>
              <adminLink.icon />
              <span>{adminLink.label}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
