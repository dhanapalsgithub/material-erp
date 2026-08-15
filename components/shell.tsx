import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Shell({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  const role = user?.role;

  // 1. Role-based Navigation Filter
  const links = [
    { name: 'Dashboard', href: '/dashboard', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'All transactions', href: '/all', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Billing / Sales', href: '/billing', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Purchases', href: '/purchases', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Inventory', href: '/inventory', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
    { name: 'Customers', href: '/masters/customers', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Suppliers', href: '/masters/suppliers', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Reports', href: '/reports', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Settings', href: '/settings', roles: ['ADMIN'] },
  ];

  // பயனர் Role-க்கு ஏற்ற மெனுக்களை மட்டும் பிரித்தெடுத்தல்
  const visibleLinks = links.filter(
    (link) => role && link.roles.includes(role)
  );

  return (
    <div className="min-h-screen md:grid md:grid-cols-[230px_1fr]">
      {/* Sidebar Navigation */}
      <aside className="bg-slate-900 p-5 text-slate-200">
        <Link className="mb-8 block text-xl font-bold text-white" href="/dashboard">
          BuildMart ERP
        </Link>
        <nav className="space-y-1">
          {visibleLinks.map(({ name, href }) => (
            <Link
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-800"
              href={href}
              key={href}
            >
              {name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <section>
        <header className="flex items-center justify-between border-b bg-white px-5 py-3">
          <span className="text-sm text-slate-500">
            {user?.role} · {user?.name}
          </span>
          <form action="/api/auth/logout" method="post">
            <button className="btn-light">Sign out</button>
          </form>
        </header>

        <main className="mx-auto max-w-7xl p-5">{children}</main>
      </section>
    </div>
  );
}