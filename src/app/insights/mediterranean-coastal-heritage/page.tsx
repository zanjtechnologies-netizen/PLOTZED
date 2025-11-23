'use client';

import { ArrowLeft, Share2, X, MapPin, Clock, Anchor, Droplets, Sailboat, Utensils, Palette, Sun, Mountain, Bird, Leaf } from 'lucide-react';
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
                    style={{ backgroundImage: 'url(/images/blog-1.jpg)' }}
                >
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Navigation Bar */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 text-white">
                    <Link href="/" className="flex items-center gap-2 hover:text-[#D8B893] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Back to Properties</span>
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
                                Cultural Discovery
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4" /> 8 min read
                            </span>
                        </div>

                        <h1 className={`${playfair.className} text-5xl md:text-7xl font-bold mb-4 max-w-4xl leading-tight`}>
                            Mediterranean Coastal Heritage
                        </h1>

                        <div className="flex items-center gap-2 text-[#D8B893] mb-6">
                            <MapPin className="w-5 h-5" />
                            <span className="text-lg">Mediterranean Coast</span>
                        </div>

                        <p className={`${libre.className} text-lg max-w-2xl text-gray-200 mb-12 leading-relaxed`}>
                            Discover the rich cultural tapestry of ancient coastal villages, pristine beaches, and timeless Mediterranean charm.
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

            {/* Nearby Attractions */}
            <section className="py-20 bg-white">
                <div className="container-custom mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#112250] mb-4`}>
                            Nearby Attractions & Sacred Sites
                        </h2>
                        <p className={`${libre.className} text-gray-600 max-w-2xl mx-auto`}>
                            Discover remarkable temples, natural wonders, and cultural landmarks within easy reach
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Card 1 */}
                        <div className="group relative rounded-2xl overflow-hidden shadow-lg">
                            <div className="h-80 bg-gray-200 relative">
                                {/* Placeholder for image */}
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/blog-2.jpg)' }} />
                                <div className="absolute top-4 right-4 bg-[#D8B893] text-[#112250] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> 3.5 km
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                                    Historical Site
                                </div>
                            </div>
                            <div className="p-8 bg-white border border-t-0 rounded-b-2xl">
                                <h3 className={`${playfair.className} text-2xl font-bold text-[#112250] mb-3`}>
                                    Ancient Port of Phoenicia
                                </h3>
                                <p className={`${libre.className} text-gray-600 text-sm leading-relaxed`}>
                                    UNESCO World Heritage site with Roman ruins and ancient harbor structures from 500 BC.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative rounded-2xl overflow-hidden shadow-lg">
                            <div className="h-80 bg-gray-200 relative">
                                {/* Placeholder for image */}
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/blog-3.jpg)' }} />
                                <div className="absolute top-4 right-4 bg-[#D8B893] text-[#112250] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> 5.8 km
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                                    Temple
                                </div>
                            </div>
                            <div className="p-8 bg-white border border-t-0 rounded-b-2xl">
                                <h3 className={`${playfair.className} text-2xl font-bold text-[#112250] mb-3`}>
                                    Temple of Poseidon
                                </h3>
                                <p className={`${libre.className} text-gray-600 text-sm leading-relaxed`}>
                                    Cliff top temple built in 444 BC offering breathtaking sunset views over the Aegean Sea.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Local Experiences */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#112250] mb-4`}>
                            Authentic Local Experiences
                        </h2>
                        <p className={`${libre.className} text-gray-600 max-w-2xl mx-auto`}>
                            Immerse yourself in the culture and traditions of this extraordinary destination
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            { icon: Anchor, title: 'Traditional fishing expeditions at dawn' },
                            { icon: Droplets, title: 'Olive oil tasting in century-old groves' },
                            { icon: Sailboat, title: 'Private sailing to hidden coves' },
                            { icon: Utensils, title: 'Mediterranean cooking classes' },
                            { icon: Palette, title: 'Pottery and weaving workshops' }
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

            {/* Natural Environment */}
            <section className="py-20 bg-[#112250] text-white">
                <div className="container-custom mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#D8B893] mb-4`}>
                            Natural Environment & Ecosystem
                        </h2>
                        <p className={`${libre.className} text-gray-300 max-w-2xl mx-auto`}>
                            Understanding the unique ecosystem and natural beauty that surrounds this remarkable location
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Climate */}
                        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                                    <Sun className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`${playfair.className} text-xl font-bold text-[#D8B893] mb-2`}>Climate & Weather</h3>
                                    <p className={`${libre.className} text-sm text-gray-300 leading-relaxed`}>
                                        Mediterranean climate with warm summers (28-32°C) and mild winters. Over 300 days of sunshine annually.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Landscape */}
                        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                    <Mountain className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`${playfair.className} text-xl font-bold text-[#D8B893] mb-2`}>Landscape & Geography</h3>
                                    <p className={`${libre.className} text-sm text-gray-300 leading-relaxed`}>
                                        Dramatic coastal cliffs, secluded coves with turquoise waters, olive groves, and pine forests.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Wildlife */}
                        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                    <Bird className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`${playfair.className} text-xl font-bold text-[#D8B893] mb-2`}>Wildlife & Biodiversity</h3>
                                    <p className={`${libre.className} text-sm text-gray-300 leading-relaxed`}>
                                        Dolphins, sea turtles, Mediterranean monk seals, migratory birds including flamingos and herons.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sustainability */}
                        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`${playfair.className} text-xl font-bold text-[#D8B893] mb-2`}>Sustainability & Conservation</h3>
                                    <p className={`${libre.className} text-sm text-gray-300 leading-relaxed`}>
                                        Protected marine areas, sustainable fishing, organic agriculture, and solar energy initiatives.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Journey */}
            <section className="py-20 bg-white">
                <div className="container-custom mx-auto">
                    <div className="text-center mb-12">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#112250] mb-4`}>
                            Visual Journey
                        </h2>
                        <p className={`${libre.className} text-gray-500 text-sm`}>
                            Capturing the essence of this remarkable destination
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
                        {/* Main Large Image */}
                        <div className="md:col-span-3 md:row-span-2 relative rounded-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url(/images/blog-1.jpg)' }} />
                        </div>

                        {/* Smaller Images Row */}
                        <div className="relative rounded-2xl overflow-hidden h-48 group">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url(/images/blog-2.jpg)' }} />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden h-48 group">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url(/images/blog-3.jpg)' }} />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden h-48 group">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url(/images/property-1.jpg)' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <div className="bg-[#112250] py-20 text-center text-white border-t border-white/10">
                <div className="container-custom mx-auto">
                    <h2 className={`${playfair.className} text-4xl font-bold text-[#D8B893] mb-6`}>
                        Experience This Destination
                    </h2>
                    <p className="text-gray-300 mb-10 max-w-xl mx-auto">
                        Book your stay at one of our exclusive properties and explore these extraordinary locations
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-4 bg-[#D8B893] text-[#112250] rounded-full font-bold hover:bg-[#c5a075] transition-colors">
                            View Properties in Mediterranean Coast
                        </button>
                        <button className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                            Read More Stories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
