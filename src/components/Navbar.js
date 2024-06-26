import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
                {/* Club Name */}
                <Link to="/" className="text-3xl font-bold tracking-wider">
                    SUCSS
                </Link>

                {/* Hamburger Menu Button (visible on mobile) */}
                <button
                    className="lg:hidden focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <svg
                        className={`w-8 h-8 ${isOpen ? 'text-white' : 'text-gray-300'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>

                {/* Navigation Links */}
                <ul className={`lg:flex ${isOpen ? 'flex-col absolute top-full left-0 bg-gray-900 w-full mt-2 lg:static lg:w-auto lg:mt-0' : 'hidden lg:flex'}`}>
                    <li>
                        <Link
                            to="/"
                            className="text-lg block py-2 px-4 lg:py-0 lg:px-3 rounded-lg lg:inline-block lg:hover:bg-gray-800 hover:text-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/events"
                            className="text-lg block py-2 px-4 lg:py-0 lg:px-3 rounded-lg lg:inline-block lg:hover:bg-gray-800 hover:text-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Events
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/members"
                            className="text-lg block py-2 px-4 lg:py-0 lg:px-3 rounded-lg lg:inline-block lg:hover:bg-gray-800 hover:text-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Members
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/user-login"
                            className="text-lg block py-2 px-4 lg:py-0 lg:px-3 rounded-lg lg:inline-block lg:hover:bg-gray-800 hover:text-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            User Login
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/member-login"
                            className="text-lg block py-2 px-4 lg:py-0 lg:px-3 rounded-lg lg:inline-block lg:hover:bg-gray-800 hover:text-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Member Login
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/developer-login"
                            className="text-lg block py-2 px-4 lg:py-0 lg:px-3 rounded-lg lg:inline-block lg:hover:bg-gray-800 hover:text-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Developer Section
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
