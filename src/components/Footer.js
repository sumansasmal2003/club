import React from 'react';

const Footer = () => {
    return (
        <footer className="footer bg-gray-900 text-white h-[4rem] flex justify-center items-center w-full">
            &copy; {new Date().getFullYear()} SUCSS. All rights reserved.
        </footer>
    );
};

export default Footer;
