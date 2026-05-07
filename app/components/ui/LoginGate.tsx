"use client";

import Link from 'next/link';
import { Lock } from 'lucide-react';

interface LoginGateProps {
    message?: string;
    subMessage?: string;
}

export default function LoginGate({
    message = "You need to be logged in to view this page.",
    subMessage,
}: LoginGateProps) {
    return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center px-6">
            <div className="bg-white border border-hotel-sand shadow-md p-10 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-hotel-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={28} className="text-hotel-bronze" />
                </div>
                <h2 className="font-serif text-2xl text-hotel-black mb-3">Login Required</h2>
                <p className="text-gray-500 text-sm font-light mb-2">{message}</p>
                {subMessage && (
                    <p className="text-gray-400 text-xs font-light mb-6">{subMessage}</p>
                )}
                {!subMessage && <div className="mb-6" />}
                <Link
                    href="/login"
                    className="inline-block bg-hotel-black text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors"
                >
                    Log In to Continue
                </Link>
                <div className="mt-4">
                    <Link href="/signup" className="text-xs text-gray-400 hover:text-hotel-bronze transition-colors">
                        Don&apos;t have an account? <span className="font-bold underline">Sign up</span>
                    </Link>
                </div>
                <div className="mt-3">
                    <Link href="/" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
