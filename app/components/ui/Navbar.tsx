"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check auth
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setIsLoggedIn(true);
                setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User");
            } else {
                setIsLoggedIn(false);
            }
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setIsLoggedIn(true);
                setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User");
            } else {
                setIsLoggedIn(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname]); // Re-check on nav in case of login/logout

    const links = [
        { label: 'Explore', href: '/explore' },
        { label: 'Community', href: '/community' },
        { label: 'Training', href: '/training' },
        { label: 'Innovation', href: '/innovation' },
        { label: 'News', href: '/news' },
    ];

    const isHome = pathname === '/';

    // Decide navbar styling based on page and scroll
    const navBg = (isHome && !isScrolled) ? 'bg-transparent' : 'bg-hotel-black/95 backdrop-blur-md shadow-lg';
    const textColor = (isHome && !isScrolled) ? 'text-white' : 'text-white';
    const logoColor = (isHome && !isScrolled) ? 'text-white' : 'text-white';

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${navBg} ${textColor}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-20 md:h-24">

                        {/* Logo */}
                        <Link href="/" className="group flex flex-col pt-2">
                            <span className={`font-serif text-2xl tracking-tight leading-none ${logoColor}`}>
                                ExplorAble <span className="text-hotel-bronze">.</span>
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-hotel-bronze mt-1 group-hover:text-white transition-colors">Byo Collection</span>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-xs uppercase tracking-widest font-bold transition-colors ${pathname === link.href ? 'text-hotel-bronze' : 'hover:text-hotel-bronze'} ${isHome && !isScrolled && pathname !== link.href ? 'text-white/80 hover:text-white' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Auth/Action */}
                        <div className="hidden md:flex items-center">
                            {isLoggedIn ? (
                                <Link href="/dashboard" className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-2 hover:bg-hotel-bronze hover:border-hotel-bronze transition-colors rounded-full">
                                    <div className="w-6 h-6 bg-hotel-bronze rounded-full text-white flex items-center justify-center font-bold text-xs uppercase">
                                        {userName.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-white">{userName}</span>
                                </Link>
                            ) : (
                                <Link href="/login" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold hover:text-hotel-bronze transition-colors px-4 py-2 border border-transparent hover:border-white/20">
                                    <User size={16} /> Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-white hover:text-hotel-bronze transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 bg-hotel-black z-50 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col justify-center items-center`}>
                <div className="flex flex-col space-y-8 text-center w-full px-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-2xl font-serif tracking-wide transition-colors ${pathname === link.href ? 'text-hotel-bronze' : 'text-white hover:text-hotel-bronze'}`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="w-16 h-[1px] bg-white/20 mx-auto my-4"></div>

                    {isLoggedIn ? (
                        <Link href="/dashboard" className="text-sm uppercase tracking-widest font-bold text-hotel-bronze hover:text-white">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link href="/login" className="text-sm uppercase tracking-widest font-bold text-white hover:text-hotel-bronze">
                                Login
                            </Link>
                            <Link href="/signup" className="text-sm uppercase tracking-widest font-bold text-hotel-bronze hover:text-white">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
