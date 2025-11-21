'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function LeadsLandingPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        budget: '',
        purpose: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', budget: '', purpose: '', message: '' });
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to submit form');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white font-sans selection:bg-gold-400 selection:text-navy-950">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-transparent z-10" />
                    <Image
                        src="/images/leads-bg.png"
                        alt="Luxury Green Plot"
                        fill
                        className="object-cover object-center opacity-60"
                        priority
                    />
                </div>

                <div className="container mx-auto px-4 z-20 relative grid lg:grid-cols-2 gap-12 items-center pt-10">
                    {/* Hero Content */}
                    <div className="space-y-8 text-center lg:text-left animate-fade-in">
                        <div className="inline-block px-4 py-1 border border-green-400/30 rounded-full bg-green-900/20 backdrop-blur-sm">
                            <span className="text-green-400 text-sm font-medium tracking-wider uppercase">Eco-Luxury Living</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight text-white drop-shadow-lg">
                            Own a Piece of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Nature&apos;s Finest</span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-md">
                            Premium plots surrounded by lush greenery. Build your dream sanctuary in a curated community designed for peace and prosperity.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <div className="flex items-center gap-2 text-emerald-400 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>Clear Titles</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>Gated Community</span>
                            </div>
                        </div>
                    </div>

                    {/* Lead Form */}
                    <div className="w-full max-w-md mx-auto lg:ml-auto bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl animate-slide-up">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-display font-bold text-white mb-2">Enquire Now</h3>
                            <p className="text-gray-300 text-sm">Get exclusive details on pricing and availability.</p>
                        </div>

                        {status === 'success' ? (
                            <div className="text-center py-8 space-y-4 animate-fade-in">
                                <div className="w-16 h-16 mx-auto bg-green-500/20 text-green-400 rounded-full flex items-center justify-center border border-green-500/30">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h4 className="text-xl font-bold text-white">Inquiry Sent!</h4>
                                <p className="text-gray-200">Our property expert will connect with you shortly to discuss your requirements.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-emerald-400 hover:text-emerald-300 text-sm underline mt-4"
                                >
                                    Submit another inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {status === 'error' && (
                                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                        {errorMessage}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wide">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wide">Phone</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none"
                                            placeholder="+91 98765..."
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wide">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none"
                                            placeholder="john@..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="budget" className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wide">Budget</label>
                                        <select
                                            id="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none appearance-none"
                                        >
                                            <option value="" disabled>Select Range</option>
                                            <option value="20L-40L">₹20L - ₹40L</option>
                                            <option value="40L-60L">₹40L - ₹60L</option>
                                            <option value="60L-1Cr">₹60L - ₹1Cr</option>
                                            <option value="1Cr+">₹1Cr+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="purpose" className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wide">Purpose</label>
                                        <select
                                            id="purpose"
                                            value={formData.purpose}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none appearance-none"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="Investment">Investment</option>
                                            <option value="Construction">Construction</option>
                                            <option value="Both">Both</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wide">Specific Plot ID / Message</label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none resize-none"
                                        placeholder="e.g. Interested in Plot #45 or corner plots..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                                >
                                    {status === 'submitting' ? 'Sending...' : 'Get Details Now'}
                                </button>

                                <p className="text-[10px] text-center text-gray-400 mt-2">
                                    By submitting, you agree to our privacy policy.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-8 rounded-2xl bg-[#1E293B]/50 border border-white/5 hover:border-emerald-500/30 transition duration-300 group">
                            <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-display font-bold text-white mb-3">High Appreciation</h3>
                            <p className="text-gray-400 leading-relaxed">Located in high-growth corridors, our plots have consistently delivered 15-20% annual appreciation.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-[#1E293B]/50 border border-white/5 hover:border-emerald-500/30 transition duration-300 group">
                            <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-display font-bold text-white mb-3">Hassle-Free Ownership</h3>
                            <p className="text-gray-400 leading-relaxed">100% clear titles, DTCP approved layouts, and complete legal assistance for a smooth registration.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-[#1E293B]/50 border border-white/5 hover:border-emerald-500/30 transition duration-300 group">
                            <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <h3 className="text-xl font-display font-bold text-white mb-3">Ready Infrastructure</h3>
                            <p className="text-gray-400 leading-relaxed">Blacktop roads, underground electricity, water connection, and 24/7 security already in place.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-8 bg-[#0F172A] border-t border-white/5 text-center">
                <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Plotzed. All rights reserved.</p>
            </footer>
        </div>
    );
}
