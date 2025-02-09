import { Twitter, Facebook, Instagram, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="flex items-center">
              <span className="ml-2 text-xl font-bold">CaFooT</span>
            </div>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Together for a greener planet. Track, reduce, and understand your carbon footprint with our innovative platform.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-400">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="/features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-400">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-400">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/community" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              <li><a href="/resources" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400">
            © 2025 CaFooT | Together for a greener planet. 🌍💚
          </p>
        </div>
      </div>
    </footer>
  );
};