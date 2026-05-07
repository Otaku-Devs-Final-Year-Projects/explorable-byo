"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Download, Award, Check } from 'lucide-react';

const TOTAL_MODULES = 3;

export default function CertificatePage() {
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [eligible, setEligible] = useState(false);
    const [userName, setUserName] = useState('');
    const [issueDate, setIssueDate] = useState('');

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) { router.push('/login'); return; }

            const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Participant';
            setUserName(name);

            const { data } = await supabase
                .from('user_training_progress')
                .select('module_id, status')
                .eq('user_id', session.user.id)
                .eq('status', 'completed');

            const completedCount = data?.length || 0;
            if (completedCount < TOTAL_MODULES) {
                // Not eligible yet
                setEligible(false);
            } else {
                setEligible(true);
                setIssueDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
            }
            setLoading(false);
        };
        init();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center text-hotel-bronze font-serif text-xl">
            Verifying Completion...
        </div>
    );

    if (!eligible) return (
        <div className="min-h-screen bg-hotel-cream flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <Award size={64} className="text-gray-200 mx-auto mb-6" />
                <h2 className="font-serif text-3xl text-hotel-black mb-3">Certificate Not Yet Available</h2>
                <p className="text-gray-500 mb-8">You need to complete all {TOTAL_MODULES} training modules before you can collect your certificate.</p>
                <Link href="/training" className="inline-block bg-hotel-black text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-hotel-bronze transition-colors rounded-sm">
                    Continue Training
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-hotel-cream font-sans pb-24 print:bg-white print:pb-0">
            {/* Nav — hidden when printing */}
            <div className="print:hidden bg-hotel-black text-white h-20 flex items-center px-6 justify-between sticky top-0 z-30 shadow-md">
                <Link href="/training" className="flex items-center gap-2 text-white/60 hover:text-white text-xs uppercase tracking-widest font-bold">
                    <ArrowLeft size={16} /> Training
                </Link>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-hotel-bronze text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-hotel-black transition-colors rounded-sm"
                >
                    <Download size={14} /> Download / Print
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 print:py-0 print:px-0">
                {/* Certificate */}
                <div
                    ref={printRef}
                    className="bg-white border-[12px] border-double border-hotel-bronze p-12 md:p-16 text-center shadow-2xl print:shadow-none print:border-[16px]"
                >
                    {/* Header ornament */}
                    <div className="flex justify-center gap-3 mb-8 text-hotel-bronze">
                        <div className="h-[1px] w-16 bg-hotel-bronze self-center" />
                        <Award size={40} strokeWidth={1.5} />
                        <div className="h-[1px] w-16 bg-hotel-bronze self-center" />
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-4">ExplorAble BYO Hub — Official Recognition</p>

                    <h1 className="font-serif text-5xl md:text-6xl text-hotel-black mb-6 leading-tight">
                        Certificate of <span className="italic text-hotel-bronze font-light">Completion</span>
                    </h1>

                    <p className="text-gray-500 text-sm mb-8">This is to certify that</p>

                    <p className="font-serif text-4xl text-hotel-black border-b-2 border-hotel-bronze inline-block pb-2 mb-8 px-8">
                        {userName}
                    </p>

                    <p className="text-gray-600 text-base max-w-xl mx-auto mb-10 leading-relaxed">
                        has successfully completed all required modules of the
                        <strong className="text-hotel-black"> Inclusive Hospitality Training Programme</strong>,
                        demonstrating a comprehensive understanding of accessible tourism, disability awareness,
                        and inclusive service delivery.
                    </p>

                    {/* Modules completed */}
                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {['Foundations of Awareness', 'Communicating with Care', 'Assisting with Mobility'].map((m, i) => (
                            <div key={i} className="flex items-center gap-2 bg-hotel-cream px-4 py-2 rounded-sm text-xs font-bold text-hotel-black border border-hotel-sand">
                                <Check size={12} className="text-hotel-bronze" strokeWidth={3} /> {m}
                            </div>
                        ))}
                    </div>

                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-12">Issued: {issueDate}</p>

                    {/* Signatures */}
                    <div className="flex flex-col md:flex-row justify-around items-end gap-8 pt-8 border-t border-hotel-sand">
                        <div className="text-center">
                            <div className="font-serif text-2xl italic text-hotel-bronze mb-1">ExplorAble BYO</div>
                            <div className="h-[1px] w-40 bg-hotel-sand mx-auto mb-2" />
                            <p className="text-[10px] uppercase tracking-widest text-gray-400">Platform Director</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-1">★★★★★</div>
                            <div className="h-[1px] w-40 bg-hotel-sand mx-auto mb-2" />
                            <p className="text-[10px] uppercase tracking-widest text-gray-400">Verified Training Record</p>
                        </div>
                    </div>
                </div>

                <div className="print:hidden mt-6 text-center text-sm text-gray-400">
                    Use your browser's <strong>Print → Save as PDF</strong> to download a copy of this certificate.
                </div>
            </div>
        </div>
    );
}
