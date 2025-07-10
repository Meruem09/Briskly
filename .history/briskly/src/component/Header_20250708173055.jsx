const Header = () => {
    return ( 
        <header className="w-full bg-[#121212] shadow-md py-3 px-6 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 text-xl font-bold text-blue-400">
                <img src="/vite.svg" alt="briskly logo" className="h-8 w-8" />
                <span>briskly</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8 text-gray-300 font-medium">
                <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Features</a>
                <a href="#" className="hover:text-blue-400 transition-colors">How it works</a>
                <a href="#" className="hover:text-blue-400 transition-colors">About</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex space-x-3">
                <button className="px-4 py-1 rounded-lg bg-gray-800 text-white hover:bg-blue-600 transition-colors font-semibold">Login</button>
                <button className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold shadow">Get started</button>
            </div>
        </header>
     );
}
 
export default Header;