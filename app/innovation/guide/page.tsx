"use client";

import { Printer, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function AudioQRGuidePage() {
    return (
        <div className="min-h-screen bg-white text-stone-800 font-sans">

            {/* Print-hidden nav bar */}
            <div className="print:hidden bg-stone-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <Link href="/innovation" className="flex items-center gap-2 text-white/60 hover:text-white text-xs uppercase tracking-widest font-bold transition">
                    <ArrowLeft size={14} /> Back to Innovation
                </Link>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-[#C6A87C] text-white px-5 py-2 text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-stone-900 transition-colors"
                >
                    <Printer size={14} /> Save as PDF
                </button>
            </div>

            {/* Printable content */}
            <main className="max-w-4xl mx-auto px-8 py-12 print:py-6 print:px-4">

                {/* Cover */}
                <div className="text-center mb-14 pb-10 border-b-2 border-stone-200">
                    <p className="text-[#C6A87C] text-xs font-bold uppercase tracking-[0.2em] mb-4">ExplorAble BYO — Innovation Hub</p>
                    <h1 className="font-serif text-5xl text-stone-900 mb-4 leading-tight">Audio QR Code<br />Setup Guide</h1>
                    <p className="text-stone-500 font-light text-lg mb-2">A complete implementation manual for hospitality venues</p>
                    <p className="text-stone-400 text-sm">Version 1.0 &nbsp;·&nbsp; May 2026 &nbsp;·&nbsp; Bulawayo, Zimbabwe</p>
                </div>

                {/* Section 1 */}
                <section className="mb-12">
                    <h2 className="font-serif text-2xl text-stone-900 mb-5 pb-2 border-b border-stone-200">1. Overview</h2>
                    <p className="text-stone-600 font-light leading-relaxed mb-4">
                        Audio QR codes allow visually impaired guests to access spoken descriptions of your venue&apos;s facilities, menus, rooms, and signage — simply by scanning a printed QR code with any modern smartphone. No specialist hardware is required by the guest.
                    </p>
                    <p className="text-stone-600 font-light leading-relaxed mb-4">
                        This guide walks your team through generating, printing, placing, and maintaining audio QR codes across your establishment. The entire system can be set up in under two hours at zero recurring cost, using free tools already available on any computer.
                    </p>
                    <div className="bg-[#C6A87C]/10 border-l-4 border-[#C6A87C] p-5">
                        <p className="text-stone-700 text-sm font-light leading-relaxed">
                            <strong>Who benefits:</strong> Guests with visual impairments, guests who are first-time visitors navigating an unfamiliar space, and guests reading in a second language all benefit from audio-described environments.
                        </p>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="mb-12">
                    <h2 className="font-serif text-2xl text-stone-900 mb-5 pb-2 border-b border-stone-200">2. What You Will Need</h2>
                    <ul className="space-y-3">
                        {[
                            'A free account at qr-code-generator.com (or equivalent service)',
                            'A smartphone or tablet with a voice recorder app',
                            'A free Google Drive or Dropbox account to host audio files',
                            'A colour printer (minimum 300 DPI recommended)',
                            'Laminator or protective pouches for outdoor or high-traffic placements',
                            'A design tool such as Canva (free tier) for label design',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-stone-600 font-light">
                                <span className="mt-1 shrink-0"><Check size={14} className="text-[#C6A87C]" /></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-12">
                    <h2 className="font-serif text-2xl text-stone-900 mb-5 pb-2 border-b border-stone-200">3. Step-by-Step Setup</h2>
                    {[
                        {
                            step: "Step 1 — Record Your Audio Descriptions",
                            content: "Using a smartphone, record clear and friendly audio descriptions for each area you want to label. For example, for a restaurant menu: \"Welcome to The Nesbitt Castle restaurant. Today's starters include mushroom soup, chicken wings, and bruschetta. Our main courses include...\" Keep each recording under 3 minutes. Export or save as an MP3 file. Ensure recordings are made in a quiet room for clarity.",
                        },
                        {
                            step: "Step 2 — Upload Audio to Cloud Storage",
                            content: "Upload each MP3 file to Google Drive or Dropbox. In Google Drive: right-click the file → Share → 'Anyone with the link can view' → Copy link. To ensure direct audio playback (not a download prompt), modify the Google Drive share link from the format 'drive.google.com/file/d/FILE_ID/view' to 'drive.google.com/uc?export=download&id=FILE_ID'. Test the link in an incognito window before proceeding.",
                        },
                        {
                            step: "Step 3 — Generate Your QR Code",
                            content: "Visit qr-code-generator.com. Select 'URL' as the QR code type. Paste your audio file shareable link into the URL field. Customise the colour if desired — use a dark foreground on a white background for maximum scanning contrast. Download the QR code as a PNG image at a minimum size of 1000 × 1000 pixels.",
                        },
                        {
                            step: "Step 4 — Design and Print Labels",
                            content: "In Canva, create a simple label template. Include: the QR code image (minimum 3 cm × 3 cm when printed), a short text line such as 'Scan for audio description', and an ear or audio speaker icon to visually signal that audio content is available. Print on card stock or glossy paper. Laminate any labels that will be placed outdoors, in bathrooms, or in areas with heavy contact.",
                        },
                        {
                            step: "Step 5 — Strategic Placement",
                            content: "Place labels at the following locations: main entrance door (at wheelchair height — 90 to 110 cm from the floor), reception desk front-facing surface, restaurant tables (one label per table or per menu), accessible bathroom entrance, lift call button panel, room door for each accessible guest room, and fire exit signage near accessible routes. Ensure each label is readable under the ambient lighting of its location.",
                        },
                        {
                            step: "Step 6 — Test Before Launch",
                            content: "Scan every QR code with both an iOS device (Camera app) and an Android device (Google Lens or Camera). Verify that the audio plays correctly and at an appropriate volume. Walk through the venue with a staff member who has not seen the system before — identify any gaps in coverage. Document the full list of placements and store a copy of the audio files and QR codes in a shared folder.",
                        },
                    ].map((item, i) => (
                        <div key={i} className="mb-8 pl-5 border-l-2 border-[#C6A87C]">
                            <h3 className="font-bold text-stone-900 mb-2 text-base">{item.step}</h3>
                            <p className="text-stone-600 font-light leading-relaxed text-sm">{item.content}</p>
                        </div>
                    ))}
                </section>

                {/* Section 4 */}
                <section className="mb-12">
                    <h2 className="font-serif text-2xl text-stone-900 mb-5 pb-2 border-b border-stone-200">4. Placement Checklist</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            'Main entrance door (at wheelchair height)',
                            'Reception desk',
                            'Restaurant tables / menus',
                            'Accessible bathroom entrances',
                            'Lift call buttons',
                            'Accessible room doors',
                            'Conference / function room entrances',
                            'Pool or leisure facility entrance',
                            'Fire exit signage near accessible routes',
                            'Parking area accessible bay signage',
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-stone-50 border border-stone-200 px-4 py-3">
                                <div className="w-4 h-4 border border-stone-400 shrink-0 print:border-stone-600" />
                                <span className="text-stone-600 text-sm font-light">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 5 */}
                <section className="mb-12">
                    <h2 className="font-serif text-2xl text-stone-900 mb-5 pb-2 border-b border-stone-200">5. Maintenance Schedule</h2>
                    <div className="space-y-3">
                        {[
                            { freq: 'Weekly', task: 'Scan 3 random QR codes to verify all links are still active and audio plays correctly.' },
                            { freq: 'Monthly', task: 'Re-record and re-upload any audio that references outdated information (menu changes, room renaming).' },
                            { freq: 'Quarterly', task: 'Replace visibly worn, faded, or damaged QR code labels. Reprint from your stored PNG files.' },
                            { freq: 'Annually', task: 'Full audit: review all audio descriptions for accuracy, cultural sensitivity, and tone. Update QR codes as needed.' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 border border-stone-200 p-4">
                                <span className="text-[#C6A87C] text-xs font-bold uppercase tracking-widest w-24 shrink-0 mt-0.5">{item.freq}</span>
                                <p className="text-stone-600 text-sm font-light">{item.task}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 6 */}
                <section className="mb-12">
                    <h2 className="font-serif text-2xl text-stone-900 mb-5 pb-2 border-b border-stone-200">6. Troubleshooting</h2>
                    <div className="space-y-4">
                        {[
                            {
                                problem: 'QR code will not scan',
                                solution: 'Ensure printed size is at least 3 cm × 3 cm. Remove any glare by repositioning away from direct light. Clean the surface if smudged. Increase the quiet zone (white border) around the QR code when reprinting.',
                            },
                            {
                                problem: 'Share link shows "access denied"',
                                solution: 'Update sharing settings in Google Drive or Dropbox to "Anyone with the link can view". If using Google Drive, ensure you have modified the URL to the direct download format described in Step 2.',
                            },
                            {
                                problem: 'Audio is too quiet or unclear',
                                solution: 'Re-record in a quieter room, holding the phone 20–30 cm from the speaker\'s mouth. Use a free audio editing app (Audacity on PC, or GarageBand on iOS) to increase the volume and reduce background noise before re-uploading.',
                            },
                            {
                                problem: 'QR code label degrades outdoors',
                                solution: 'Use UV-laminated pouches rated for outdoor use. Reprint and re-laminate outdoor labels every 6 months. For permanent outdoor installations, consider engraved acrylic signs with the QR code etched in.',
                            },
                            {
                                problem: 'Some smartphone cameras do not scan',
                                solution: 'Ensure the QR code has sufficient contrast (dark on white) and adequate quiet zone. Direct users to download a dedicated QR scanner app (e.g. QR & Barcode Scanner by Gamma Play, which is free and works on older Android devices).',
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 border border-stone-100 bg-stone-50 p-4">
                                <span className="text-red-400 font-bold text-base shrink-0 mt-0.5">✗</span>
                                <div>
                                    <p className="font-bold text-stone-800 text-sm mb-1">{item.problem}</p>
                                    <p className="text-stone-500 text-sm font-light leading-relaxed">{item.solution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <div className="mt-14 pt-6 border-t-2 border-stone-200 text-center text-stone-400 text-xs">
                    <p className="font-bold text-stone-600 mb-1">ExplorAble BYO &nbsp;·&nbsp; Accessible Tourism Technology Initiative</p>
                    <p>Bulawayo, Zimbabwe &nbsp;·&nbsp; May 2026</p>
                    <p className="mt-2">For support and implementation assistance, visit the platform at <span className="text-[#C6A87C]">/contact</span></p>
                </div>
            </main>

            {/* Print styles */}
            <style>{`
                @media print {
                    body { font-size: 11pt; }
                    h1 { font-size: 28pt; }
                    h2 { font-size: 16pt; }
                    h3 { font-size: 12pt; }
                }
            `}</style>
        </div>
    );
}
