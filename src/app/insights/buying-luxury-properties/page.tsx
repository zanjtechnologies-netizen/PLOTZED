'use client';

import { ArrowLeft, Share2, X, MapPin, Clock, CheckCircle, FileText, Search, Key, Shield, DollarSign, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Playfair_Display, Libre_Baskerville, Inter } from 'next/font/google';

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    display: 'swap',
});

const libre = Libre_Baskerville({
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
});

export default function ArticlePage() {
    return (
        <div className={`min-h-screen bg-white ${inter.className}`}>
            {/* Hero Section */}
            <div className="relative h-[80vh] w-full">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/images/blog-3.jpg)' }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Navigation Bar */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 text-white">
                    <Link href="/" className="flex items-center gap-2 hover:text-[#D8B893] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <Link href="/" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                            <X className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white z-10">
                    <div className="container-custom mx-auto">
                        <div className="flex gap-4 mb-6">
                            <span className="bg-[#D8B893] text-[#112250] px-4 py-1 rounded-full text-sm font-bold">
                                BUYER'S GUIDE
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4" /> 10 min read
                            </span>
                        </div>

                        <h1 className={`${playfair.className} text-5xl md:text-7xl font-bold mb-4 max-w-4xl leading-tight`}>
                            A Complete Guide to Purchasing Luxury Properties
                        </h1>

                        <div className="flex items-center gap-2 text-[#D8B893] mb-6">
                            <Briefcase className="w-5 h-5" />
                            <span className="text-lg">Expert Advice</span>
                        </div>

                        <p className={`${libre.className} text-lg max-w-2xl text-gray-200 mb-12 leading-relaxed`}>
                            Everything you need to know about buying high-end real estate with confidence.
                        </p>

                        <div className="flex flex-col items-center animate-bounce opacity-70">
                            <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center pt-2">
                                <div className="w-1 h-2 bg-white rounded-full" />
                            </div>
                            <span className="text-xs mt-2 uppercase tracking-widest">Scroll to discover</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide Steps */}
            <section className="py-20 bg-white">
                <div className="container-custom mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#112250] mb-4`}>
                            The Buying Process
                        </h2>
                        <p className={`${libre.className} text-gray-600 max-w-2xl mx-auto`}>
                            A step-by-step approach to securing your dream property
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Card 1 */}
                        <div className="group relative rounded-2xl overflow-hidden shadow-lg">
                            <div className="h-80 bg-gray-200 relative">
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/luxury-3.svg)' }} />
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                                    Step 1
                                </div>
                            </div>
                            <div className="p-8 bg-white border border-t-0 rounded-b-2xl">
                                <h3 className={`${playfair.className} text-2xl font-bold text-[#112250] mb-3`}>
                                    Due Diligence
                                </h3>
                                <p className={`${libre.className} text-gray-600 text-sm leading-relaxed`}>
                                    Understanding legal requirements, title verification, and property history is crucial before making any commitment.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative rounded-2xl overflow-hidden shadow-lg">
                            <div className="h-80 bg-gray-200 relative">
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/luxury-4.svg)' }} />
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                                    Step 2
                                </div>
                            </div>
                            <div className="p-8 bg-white border border-t-0 rounded-b-2xl">
                                <h3 className={`${playfair.className} text-2xl font-bold text-[#112250] mb-3`}>
                                    Valuation & Negotiation
                                </h3>
                                <p className={`${libre.className} text-gray-600 text-sm leading-relaxed`}>
                                    Expert valuation ensures you pay a fair price. Strategic negotiation can secure favorable terms beyond just the purchase price.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Checklist */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#112250] mb-4`}>
                            Essential Checklist
                        </h2>
                        <p className={`${libre.className} text-gray-600 max-w-2xl mx-auto`}>
                            Must-have items for a secure transaction
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            { icon: Search, title: 'Comprehensive Property Inspection' },
                            { icon: FileText, title: 'Legal Title Verification' },
                            { icon: DollarSign, title: 'Financial Planning & Pre-approval' },
                            { icon: Shield, title: 'Insurance & Security Assessment' },
                            { icon: Key, title: 'Post-Purchase Transition Plan' }
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-[#112250] flex items-center justify-center text-[#D8B893]">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className={`${libre.className} text-gray-700 font-medium`}>{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <div className="bg-[#112250] py-20 text-center text-white border-t border-white/10">
                <div className="container-custom mx-auto">
                    <h2 className={`${playfair.className} text-4xl font-bold text-[#D8B893] mb-6`}>
                        Ready to Find Your Dream Home?
                    </h2>
                    <p className="text-gray-300 mb-10 max-w-xl mx-auto">
                        Let our experts guide you through every step of the process
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-4 bg-[#D8B893] text-[#112250] rounded-full font-bold hover:bg-[#c5a075] transition-colors">
                            Contact Our Advisors
                        </button>
                        <Link href="/insights" className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                            Back to Insights
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
