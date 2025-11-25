'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, X, MapPin, Mouse, ArrowRight, Check } from 'lucide-react';
import { Playfair_Display, Libre_Baskerville, Inter } from 'next/font/google';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const libre = Libre_Baskerville({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-libre',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export default function HousePropertyPage() {
    return (
        <main className={`${playfair.variable} ${libre.variable} ${inter.variable} bg-[#F8F9FA] min-h-screen`}>
            {/* Hero Section */}
            <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-10000 ease-linear hover:scale-110"
                    style={{
                        backgroundImage: 'url(/images/house-property.png)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>

                {/* Navigation Bar */}
                <div className="absolute top-0 left-0 right-0 z-50 p-6 md:p-8 mt-24">
                    <div className="container-custom flex justify-between items-center">
                        <Link
                            href="/properties"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 border border-white/20 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium tracking-wide text-sm">Back to Properties</span>
                        </Link>

                        <div className="flex gap-3">
                            <button className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <Link href="/" className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20">
                                <X className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 z-40 pb-16 md:pb-24">
                    <div className="container-custom">
                        <div className="max-w-4xl">
                            <h1
                                className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
                                style={{ fontFamily: 'var(--font-playfair)' }}
                            >
                                House Property
                            </h1>
                            <div className="flex items-center gap-2 text-white/90 mb-8 text-lg">
                                <MapPin className="w-5 h-5 text-[#D8B893]" />
                                <span style={{ fontFamily: 'var(--font-libre)' }}>Koonimedu, ECR, Pondicherry</span>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="px-8 py-3 bg-[#112250] text-[#D8B893] rounded-full font-semibold text-xl border border-[#D8B893]/30 shadow-lg backdrop-blur-sm">
                                    From ₹1.92 Crores
                                </div>
                                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 text-sm font-medium tracking-wide">
                                    10,000 sq.ft | 1,000 sq.ft built-up area (2 BHK home) | 100m from ECR Main Road
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 animate-bounce hidden md:block">
                    <div className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center p-2">
                        <div className="w-1 h-2 bg-white rounded-full" />
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left Column - Content */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* Description */}
                            <div>
                                <h2
                                    className="text-4xl font-bold text-[#112250] mb-6"
                                    style={{ fontFamily: 'var(--font-playfair)' }}
                                >
                                    Experience peace full land
                                </h2>
                                <div
                                    className="prose prose-lg text-gray-600 space-y-6"
                                    style={{ fontFamily: 'var(--font-libre)' }}
                                >
                                    <p>
                                        This premium plot is located in Koonimedu, just off the Pondy-Chennai ECR main road, offering a rare blend of beachside calm and excellent connectivity.
                                    </p>
                                    <p>
                                        With a 10,000 sq.ft land parcel and an existing 2 BHK home, this property is ideal for a holiday villa, retirement home, homestay, or long-term coastal investment. A scenic environment with beaches, resorts, and natural attractions makes this a highly desirable spot for serene modern living.
                                    </p>
                                </div>
                            </div>

                            {/* Property Features */}
                            <div>
                                <h3
                                    className="text-3xl font-bold text-[#112250] mb-8"
                                    style={{ fontFamily: 'var(--font-playfair)' }}
                                >
                                    Property Features
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "2 BHK home",
                                        "ECR Main Road in 100 meters",
                                        "Green Belt Zone",
                                        "Sand Beach Access within 500 meters",
                                        "Custom Villa Construction",
                                        "Bird Sanctuary Nearby"
                                    ].map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-center p-4 bg-[#E5E7EB] rounded-sm text-[#112250] font-medium text-center hover:bg-[#D8B893]/20 transition-colors"
                                        >
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Gallery */}
                            <div>
                                <h3
                                    className="text-3xl font-bold text-[#112250] mb-8"
                                    style={{ fontFamily: 'var(--font-playfair)' }}
                                >
                                    Gallery
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 h-[400px] bg-gray-200 rounded-lg overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                        {/* Placeholder for Main Gallery Image */}
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                                            Main Image
                                        </div>
                                    </div>
                                    <div className="h-[250px] bg-gray-200 rounded-lg overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                        {/* Placeholder for Gallery Image 2 */}
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                                            Image 2
                                        </div>
                                    </div>
                                    <div className="h-[250px] bg-gray-200 rounded-lg overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                        {/* Placeholder for Gallery Image 3 */}
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                                            Image 3
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24">
                                <div className="bg-[#112250] rounded-2xl p-8 text-white shadow-xl">
                                    <h3
                                        className="text-2xl font-bold mb-8 text-[#D8B893]"
                                        style={{ fontFamily: 'var(--font-playfair)' }}
                                    >
                                        Property Details
                                    </h3>

                                    <div className="space-y-6 mb-8">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                            <span className="text-gray-300">Total Area</span>
                                            <span className="font-semibold text-right">10,000 sq.ft</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                            <span className="text-gray-300">Existing Structure</span>
                                            <span className="font-semibold text-right text-sm">1,000 sq.ft built-up area (2 BHK home)</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                            <span className="text-gray-300">Facing</span>
                                            <span className="font-semibold">South</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                            <span className="text-gray-300">Road Width</span>
                                            <span className="font-semibold">25 ft</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#1A2C5E] rounded-lg p-4 mb-8 border border-white/10">
                                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Location</div>
                                        <div className="font-medium">Koonimedu, ECR</div>
                                    </div>

                                    <div className="mb-8 text-center">
                                        <div className="text-[#D8B893] text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            From ₹ 1.92 Cr
                                        </div>
                                        <div className="text-sm text-gray-400">Exclusive pre-launch value</div>
                                    </div>

                                    <div className="space-y-4">
                                        <button className="w-full py-4 bg-[#D8B893] text-[#112250] rounded-full font-bold hover:bg-[#C5A580] transition-colors uppercase tracking-wide">
                                            Book a Site Visit
                                        </button>
                                        <button className="w-full py-4 bg-[#3B4B7A] text-white rounded-full font-bold hover:bg-[#4B5B8A] transition-colors uppercase tracking-wide">
                                            Call Us
                                        </button>
                                        <button className="w-full py-4 bg-[#3B4B7A] text-white rounded-full font-bold hover:bg-[#4B5B8A] transition-colors uppercase tracking-wide">
                                            Download Brochure
                                        </button>
                                    </div>

                                    <div className="mt-6 text-center text-xs text-gray-400">
                                        Flexible payment plans available<br />Loan assistance available
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-[#112250] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')]"></div>
                <div className="container-custom relative z-10 text-center">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                        Ready to Own Your Ideal Land ?
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
                        Connect with our property experts for a personalized guided visit, investment insights, and exclusive pre-launch offers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="px-10 py-4 bg-[#D8B893] text-[#112250] rounded-full font-bold hover:bg-[#C5A580] transition-all transform hover:-translate-y-1 shadow-lg">
                            Book a site visit
                        </button>
                        <Link
                            href="/properties"
                            className="px-10 py-4 bg-transparent border border-white text-white rounded-full font-bold hover:bg-white hover:text-[#112250] transition-all transform hover:-translate-y-1"
                        >
                            View More Properties
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
