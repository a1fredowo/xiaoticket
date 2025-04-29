import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function FooterSocial() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12"> {/* Agregado mt-12 */}
      <div className="container mx-auto text-center">
        <h3 className="text-lg font-bold">Síguenos en nuestras redes sociales</h3>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
            <FaInstagram size={24} />
          </a>
        </div>
        <p className="text-sm mt-4">&copy; 2025 XiaoTicket. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}