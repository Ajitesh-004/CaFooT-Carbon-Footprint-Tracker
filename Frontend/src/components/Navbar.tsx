import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NavItem } from '../types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import { useNavigate } from 'react-router-dom';
import { 
  airTravelState, 
  applianceState, 
  energyState, 
  totalEmissionsState, 
  transportationState, 
  wasteState, 
  waterState 
} from '../atoms/atoms';
import logo from "../assets/CaFooT Logo.jpg"

const publicNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
];

const privateNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'CFP Tracker', href: '/tracker' },
  { label: 'AI Analysis', href: '/analysis' },
  { label: 'Community', href: '/community' },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom); // To update the user state
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = user ? privateNavItems : publicNavItems;

  // Use useSetRecoilState for updating these atoms
  const setTransport = useSetRecoilState(transportationState);
  const setEnergy = useSetRecoilState(energyState);
  const setWaste = useSetRecoilState(wasteState);
  const setWater = useSetRecoilState(waterState);
  const setAppliance = useSetRecoilState(applianceState);
  const setAirTravel = useSetRecoilState(airTravelState);
  const setTotalEmissions = useSetRecoilState(totalEmissionsState);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear user data from Recoil state
    setUser(null);
    // Instead of setting null, clear the arrays by setting them to []
    setTransport([]);
    setEnergy([]);
    setWaste([]);
    setWater([]);
    setAppliance([]);
    setAirTravel([]);
    setTotalEmissions([]);

    // Clear token and user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to the home page or login page
    navigate("/");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
            <img className="h-12 w-18" src={logo} alt="Pawn2King" />
            <span className="text-black text-2xl font-semibold tracking-wide">
              CaFooT
            </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-green-600'
                    : 'text-gray-700 hover:text-green-500'
                }`}
              >
                {item.label}
              </a>
            ))}
            {user ? (
              // Logout button for logged-in users
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            ) : (
              // Login and Register buttons for non-logged-in users
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="text-green-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                >
                  Register
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${
                isScrolled
                  ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                  : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-green-50/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-green-600 hover:bg-green-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
            {user ? (
              // Logout button for mobile
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Logout
              </button>
            ) : (
              // Login and Register buttons for mobile
              <div className="space-y-1 pt-2">
                <a
                  href="/login"
                  className="text-green-600 hover:text-green-700 hover:bg-green-100 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-green-600 text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
