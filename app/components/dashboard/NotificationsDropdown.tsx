"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, Check } from 'lucide-react';

export default function NotificationsDropdown({ user }: { user: any }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();

        let channel: any;
        if (user?.id) {
            channel = supabase
                .channel('realtime_notifications')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    setNotifications(prev => [payload.new, ...prev]);
                })
                .subscribe();
        }

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [user]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        if (!user?.id) return;
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (!error && data) {
            setNotifications(data);
        }
    };

    const handleToggle = async () => {
        const currentlyOpen = isOpen;
        setIsOpen(!currentlyOpen);

        // If we are opening it, mark all unread as read
        if (!currentlyOpen && unreadCount > 0) {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false);
                
            if (!error) {
                // Optimistically update local state
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button 
                onClick={handleToggle}
                className="relative p-2 text-gray-500 hover:text-hotel-black transition-colors rounded-full hover:bg-gray-100"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 shadow-xl rounded-sm overflow-hidden animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-hotel-black">Notifications</h3>
                        {unreadCount > 0 && <span className="text-[10px] text-gray-400 bg-gray-200 px-2 rounded-full">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(notification => (
                            <div key={notification.id} className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-hotel-sand/5' : ''}`}>
                                <h4 className="text-sm font-bold text-hotel-black flex items-center gap-2">
                                    {notification.title}
                                    {!notification.read && <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notification.message}</p>
                                <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-wider">
                                    {new Date(notification.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400">
                                <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                <p className="text-xs">No notifications yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
