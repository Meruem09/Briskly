import { Library } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';


const Header = () => {
    const {isSignedIn} = useAuth();
    const navigate = useNavigate();


    return ( 
        <header className="w-full bg-transparent shadow-md py-3  flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 text-xl px-6 font-bold text-blue-400">
                <div><Library
                className='h-8 w-8 text-white'
                
                /></div>
                <span>briskly</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8 text-gray-300 font-medium">
                <a onClick={() => navigate('/')} className="hover:text-blue-400 transition-colors">Home</a>
                <a onClick={() => navigate('/features')} className="hover:text-blue-400 transition-colors">Features</a>
                <a href="#" className="hover:text-blue-400 transition-colors">How it works</a>
                <a href="#" className="hover:text-blue-400 transition-colors">About</a>
            </nav>

            {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
            {isSignedIn ? (
                <div className="flex space-x-3 mr-2">
                <UserButton/>
                </div>
                    ) : (
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => navigate('/signUp')}
                                    className="px-4 py-1 rounded-lg bg-gray-800 text-white hover:bg-blue-600 transition-colors font-semibold"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/main')}
                                    className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold shadow"
                                >
                                    Get started
                                </button>
                            </div>
            )}
        </div>        
    </header>
     );
}
 
export default Header;