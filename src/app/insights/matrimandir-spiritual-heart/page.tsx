'use client';

import { ArrowLeft, Share2, X, MapPin, Clock, Sparkles, Users, Eye, Heart } from 'lucide-react';
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

export default function MatrimandirArticle() {
    return (
        <div className={`min-h-screen bg-white ${inter.className}`}>
            {/* Hero Section */}
            <div className="relative h-[80vh] w-full">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/images/matrimandir-3.jpg)' }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Navigation Bar */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 text-white">
                    <Link href="/insights" className="flex items-center gap-2 hover:text-[#D8B893] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Back to Blogs</span>
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
                                Market Spotlight
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4" /> 5 min read
                            </span>
                        </div>

                        <h1 className={`${playfair.className} text-5xl md:text-7xl font-bold mb-4 max-w-4xl leading-tight text-white`}>
                            Matrimandir — The Spiritual Heart of Auroville
                        </h1>

                        <div className="flex items-center gap-2 text-[#D8B893] mb-6">
                            <MapPin className="w-5 h-5" />
                            <span className="text-lg">Centre of Auroville, Pondicherry</span>
                        </div>

                        <p className={`${libre.className} text-lg max-w-2xl text-gray-200 mb-12 leading-relaxed`}>
                            An iconic meditation and spiritual space known worldwide for its distinctive golden dome and serene environment, symbolizing peace, inner reflection, and human unity.
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

            {/* Overview Section */}
            <section className="py-20 bg-white">
                <div className="container-custom mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#112250] mb-8`}>
                            Overview
                        </h2>
                        <div className={`${libre.className} prose prose-lg text-gray-700 leading-relaxed space-y-6`}>
                            <p>
                                Matrimandir, located at the centre of Auroville, is an iconic meditation and spiritual space known worldwide for its distinctive golden dome and serene environment. Often referred to as the "Soul of Auroville," it symbolizes peace, inner reflection, and human unity. The surrounding gardens and viewing point attract visitors, seekers, and cultural travellers from across the world.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-12 bg-gray-50">
                <div className="container-custom mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative h-96 rounded-2xl overflow-hidden group">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: 'url(/images/matrimandir-1.jpg)' }}
                            />
                        </div>
                        <div className="relative h-96 rounded-2xl overflow-hidden group">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: 'url(/images/matrimandir-2.jpg)' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why It's Special Section */}
            <section className="py-20 bg-white">
                <div className="container-custom mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#112250] mb-8`}>
                            Why It's Special
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {[
                                {
                                    icon: Sparkles,
                                    title: 'Architectural Marvel',
                                    description: 'Golden sphere with unique geodesic design'
                                },
                                {
                                    icon: Heart,
                                    title: 'Meditation Chambers',
                                    description: 'Designed for silence and inner focus'
                                },
                                {
                                    icon: Eye,
                                    title: 'Tranquil Greenery',
                                    description: 'Surrounded by landscaped gardens'
                                },
                                {
                                    icon: Users,
                                    title: 'Cultural Tourism Magnet',
                                    description: 'Drawing global visitors worldwide'
                                }
                            ].map((item, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-[#D8B893] transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-[#112250] flex items-center justify-center text-[#D8B893] mb-4">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className={`${playfair.className} text-xl font-bold text-[#112250] mb-2`}>
                                        {item.title}
                                    </h3>
                                    <p className={`${libre.className} text-gray-600 text-sm`}>
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience & Lifestyle Value Section */}
            <section className="py-20 bg-[#112250] text-white">
                <div className="container-custom mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#D8B893] mb-8`}>
                            Experience & Lifestyle Value
                        </h2>
                        <div className="space-y-4">
                            {[
                                'Calm and peaceful environment ideal for reflection and wellbeing',
                                'Strong appeal for wellness tourism & retreat experiences',
                                'Enhances the cultural and heritage value of Auroville and surrounding localities'
                            ].map((value, index) => (
                                <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className={`${libre.className} text-white`}>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Visitor Appeal Section */}
            <section className="py-20 bg-white">
                <div className="container-custom mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#112250] mb-8`}>
                            Visitor Appeal
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                'Global spiritual travellers',
                                'Architecture & design enthusiasts',
                                'Wellness retreat visitors',
                                'Cultural tourists and nature lovers'
                            ].map((visitor, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-[#D8B893] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-6 h-6 text-[#D8B893]" />
                                        <span className={`${libre.className} text-[#112250] font-medium`}>
                                            {visitor}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Insight Section */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <h2 className={`${playfair.className} text-4xl font-bold text-[#112250] mb-8`}>
                            Key Insight
                        </h2>
                        <div className="bg-[#D8B893]/10 border-l-4 border-[#D8B893] p-8 rounded-r-lg">
                            <p className={`${libre.className} text-[#112250] text-lg font-semibold italic`}>
                                Matrimandir is more than an architectural landmark — it is a symbol of peace, unity, and conscious living, making it one of the most meaningful attractions in South India.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <div className="bg-[#112250] py-20 text-center text-white border-t border-white/10">
                <div className="container-custom mx-auto">
                    <h2 className={`${playfair.className} text-4xl font-bold text-[#D8B893] mb-6`}>
                        Discover Auroville & Surrounding Areas
                    </h2>
                    <p className="text-gray-300 mb-10 max-w-xl mx-auto">
                        Explore properties near this iconic spiritual destination
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/properties" className="px-8 py-4 bg-[#D8B893] text-[#112250] rounded-full font-bold hover:bg-[#c5a075] transition-colors">
                            View Properties
                        </Link>
                        <Link href="/insights" className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                            Read More Blogs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
