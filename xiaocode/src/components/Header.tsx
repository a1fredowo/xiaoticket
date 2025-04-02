import Link from 'next/link'; 

export default function Header() {
    return (
      <header className="bg-gray-900 p-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center space-x-8">
          <h1 className="text-3xl font-extrabold">XiaoTicket</h1>
          <nav className="flex space-x-6">
            <Link href="/" className="text-slate-300 rounded-lg hover:bg-blue-400 hover:text-black px-3 py-2 transition">
              Inicio
            </Link>
            <Link href="/eventos" className="text-slate-300 rounded-lg hover:bg-blue-400 hover:text-black px-3 py-2 transition">
              Eventos
            </Link>
            <Link href="#" className="text-slate-300 rounded-lg hover:bg-blue-400 hover:text-black px-3 py-2 transition">
              Explorar
            </Link>
            <Link href="#" className="text-slate-300 rounded-lg hover:bg-blue-400 hover:text-black px-3 py-2 transition">
              Blog
            </Link>
          </nav>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="px-5 py-2 border border-blue-400 rounded-lg text-slate-300 hover:bg-blue-400 hover:text-black transition cursor-pointer">
            Iniciar Sesión
          </Link>
        </div>
      </header>
    );
  }