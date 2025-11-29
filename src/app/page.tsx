'use client';

import React, { useState } from "react";

// Site de locução - adaptado para Next.js
// Estilização: classes Tailwind são usadas.

export default function Home() {
  const [user, setUser] = useState<{nome: string, email: string} | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nome: "", sobrenome: "", whatsapp: "", email: "", senha: "" });
  const [locutores, setLocutores] = useState([
    { id: 1, nome: "João Silva", online: true, ativo: true, precoPor40s: 1 },
    { id: 2, nome: "Maria Lopes", online: false, ativo: true, precoPor40s: 1 },
    { id: 3, nome: "DJzão Elielson", online: true, ativo: true, precoPor40s: 2 },
  ]);
  const [selectedMenu, setSelectedMenu] = useState("lista");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isRegister) {
      // aqui você normalmente enviaria para sua API e criaria o usuário
      setUser({ nome: form.nome, email: form.email });
      setShowAuth(false);
    } else {
      // login simulado
      setUser({ nome: form.nome || 'Cliente', email: form.email });
      setShowAuth(false);
    }
  }

  function toggleOnline(id: number) {
    setLocutores(locutores.map(l => l.id === id ? { ...l, online: !l.online } : l));
  }

  function toggleAtivo(id: number) {
    setLocutores(locutores.map(l => l.id === id ? { ...l, ativo: !l.ativo } : l));
  }

  function removeLocutor(id: number) {
    setLocutores(locutores.map(l => l.id === id ? { ...l, ativo: false } : l));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <div className="mb-6">
            <h1 className="text-xl font-bold">Locuções Pro</h1>
            <p className="text-sm text-gray-500">Venda e gerencie locutores</p>
          </div>

          <nav className="space-y-2">
            <button className={`w-full text-left p-2 rounded ${selectedMenu==='lista'? 'bg-blue-50':''}`} onClick={() => setSelectedMenu('lista')}>Lista de locutores</button>
            <button className={`w-full text-left p-2 rounded ${selectedMenu==='gerenciamento'? 'bg-blue-50':''}`} onClick={() => setSelectedMenu('gerenciamento')}>Gerenciamento</button>
            <button className={`w-full text-left p-2 rounded ${selectedMenu==='pedidos'? 'bg-blue-50':''}`} onClick={() => setSelectedMenu('pedidos')}>Pedidos</button>
            <button className={`w-full text-left p-2 rounded ${selectedMenu==='configuracoes'? 'bg-blue-50':''}`} onClick={() => setSelectedMenu('configuracoes')}>Configurações</button>
            <button className={`w-full text-left p-2 rounded ${selectedMenu==='perfil'? 'bg-blue-50':''}`} onClick={() => setSelectedMenu('perfil')}>Perfil</button>
            <button className="w-full text-left p-2 rounded text-red-600" onClick={() => { setUser(null); }}>Sair</button>
          </nav>

          <div className="mt-6">
            {user ? (
              <div className="text-sm">Olá, <strong>{user.nome}</strong></div>
            ) : (
              <button onClick={() => { setShowAuth(true); setIsRegister(false); }} className="mt-2 w-full bg-blue-600 text-white p-2 rounded">Entrar / Cadastrar</button>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{selectedMenu === 'lista' ? 'Lista de locutores' : selectedMenu === 'gerenciamento' ? 'Gerenciamento de locutores' : selectedMenu === 'pedidos' ? 'Pedidos' : selectedMenu === 'configuracoes' ? 'Configurações' : 'Perfil'}</h2>
            <div>
              <button onClick={() => { setShowAuth(true); setIsRegister(false); }} className="px-4 py-2 border rounded mr-2">Entrar</button>
              <button onClick={() => { setShowAuth(true); setIsRegister(true); }} className="px-4 py-2 bg-blue-600 text-white rounded">Cadastrar</button>
            </div>
          </header>

          {/* Content por menu */}
          {selectedMenu === 'lista' && (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locutores.filter(l => l.ativo).map(l => (
                  <div key={l.id} className="p-4 bg-white border rounded flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{l.nome}</div>
                      <div className="text-sm text-gray-500">Preço: {l.precoPor40s} crédito(s) / 40s</div>
                      <div className="text-sm text-gray-400">{l.online ? 'Online' : 'Offline'}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border rounded" onClick={() => alert('Aqui abriria a página de pedido para ' + l.nome)}>Pedir</button>
                      <button className={`px-3 py-1 rounded ${l.online ? 'bg-green-50' : 'bg-gray-100'}`} onClick={() => toggleOnline(l.id)}>{l.online ? 'Desconectar' : 'Conectar'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedMenu === 'gerenciamento' && (
            <section>
              <h3 className="text-lg font-medium mb-4">Gerenciar locutores</h3>
              <div className="space-y-3">
                {locutores.map(l => (
                  <div key={l.id} className="p-3 bg-white border rounded flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{l.nome}</div>
                      <div className="text-sm text-gray-500">{l.online ? 'Online' : 'Offline'} • {l.ativo ? 'Ativo' : 'Inativo'}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleOnline(l.id)} className="px-3 py-1 border rounded">Toggle Online</button>
                      <button onClick={() => toggleAtivo(l.id)} className="px-3 py-1 border rounded">Ativar/Desativar</button>
                      <button onClick={() => removeLocutor(l.id)} className="px-3 py-1 text-red-600">Remover</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedMenu === 'pedidos' && (
            <section>
              <p>Lista de pedidos (simulada). Aqui você vai conectar sua API para mostrar pedidos, status e downloads.</p>
            </section>
          )}

          {selectedMenu === 'configuracoes' && (
            <section>
              <p>Configurações do sistema: métodos de pagamento, preços por crédito, regras de duração (40s = 1 crédito), integrações com WhatsApp, etc.</p>
              <ul className="list-disc pl-6 mt-3 text-sm text-gray-600">
                <li>Configurar preço por crédito (ex.: 1 crédito = R$7)</li>
                <li>Regras de duração: 0-40s = 1 crédito; 41-80s = 2 créditos; e assim por diante.</li>
                <li>Webhook para notificar locutores de novos pedidos.</li>
              </ul>
            </section>
          )}

          {selectedMenu === 'perfil' && (
            <section>
              <p>Área do cliente: nome, telefone, histórico de pedidos e créditos.</p>
            </section>
          )}
        </main>
      </div>

      {/* Modal de autenticação */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleAuth} className="bg-white p-6 rounded max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">{isRegister ? 'Cadastrar' : 'Entrar'}</h3>

            {isRegister && (
              <>
                <label className="block text-sm">Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} className="w-full p-2 border rounded mb-2" />

                <label className="block text-sm">Sobrenome</label>
                <input name="sobrenome" value={form.sobrenome} onChange={handleChange} className="w-full p-2 border rounded mb-2" />

                <label className="block text-sm">WhatsApp</label>
                <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
              </>
            )}

            <label className="block text-sm">E-mail</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded mb-2" />

            <label className="block text-sm">Senha</label>
            <input name="senha" type="password" value={form.senha} onChange={handleChange} className="w-full p-2 border rounded mb-4" />

            <div className="flex justify-between items-center">
              <div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded mr-2">{isRegister ? 'Cadastrar' : 'Entrar'}</button>
                <button type="button" onClick={() => { setIsRegister(!isRegister); }} className="px-3 py-2 border rounded">{isRegister ? 'Já tenho conta' : 'Quero me cadastrar'}</button>
              </div>
              <button type="button" onClick={() => setShowAuth(false)} className="text-sm text-gray-500">Fechar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
