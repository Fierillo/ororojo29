import Link from "next/link";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { getAdminData } from "@/lib/data";

export default async function Footer() {
  const adminData: any = await getAdminData();
  const whatsappNumber = adminData?.whatsappNumber || "5491112345678";
  const contactEmail = adminData?.contactEmail || "contacto@ororojo29.com";
  const location = adminData?.location || "Buenos Aires, Argentina";

  return (
    <footer className="bg-black border-t border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="Oro Rojo 29"
                width={50}
                height={50}
                className="rounded"
              />
              <span className="font-display text-2xl cobre-text-gradient">Oro Rojo 29</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Productos de cobre artesanales. Calidad, elegancia y energía en cada pieza.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg text-cobre-light mb-6">Navegación</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-500 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-500 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-500 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-cobre-light mb-6">Contacto</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li className="flex items-center gap-3">
                <MessageCircle size={16} className="text-cobre" />
                WhatsApp: +{whatsappNumber}
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-cobre" />
                {contactEmail}
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-cobre" />
                {location}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border mt-12 pt-8 text-center">
          <p className="text-gray-700 text-sm">
            © {new Date().getFullYear()} Oro Rojo 29. Todos los derechos reservados.
          </p>
          <p className="text-gray-800 text-xs mt-2">
            Artesanía en cobre con energía
          </p>
          <div className="mt-6 flex justify-center gap-1 text-[10px] text-gray-800 tracking-widest">
            <a 
              href="https://github.com/Fierillo/ororojo29" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cobre transition-colors"
            >
              Este sitio
            </a>
            <span> fue creado por </span>
            <a 
              href="https://github.com/Fierillo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cobre transition-colors"
            >
              Fierillo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}