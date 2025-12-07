"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface ProfileData {
    name: string;
    bio?: string;
    photo?: string;
    phoneNumbers: string[];
    email: string;
    address?: string;
    whatsapp?: string;
    experience?: string;
    workingHours?: string;
    description?: string;
}

export default function ContactPage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/profile");
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-black flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center text-white">
                    <p>Contact information not available.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header />

            <main className="flex-grow relative">
                {/* Hero Section */}
                <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20" />
                    <div className="relative max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-gold mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            We're here to help you plan your next adventure. Reach out to us for any inquiries or assistance.
                        </p>
                    </div>
                </div>

                {/* Contact Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Phone */}
                        {profile.phoneNumbers && profile.phoneNumbers.length > 0 && (
                            <a
                                href={`tel:${profile.phoneNumbers[0]}`}
                                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                                    <Phone className="w-6 h-6 text-gold" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                                <p className="text-gray-400 mb-4">Available during working hours</p>
                                <p className="text-lg font-semibold text-gold group-hover:text-white transition-colors">
                                    {profile.phoneNumbers[0]}
                                </p>
                            </a>
                        )}

                        {/* WhatsApp */}
                        {profile.whatsapp && (
                            <a
                                href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                                    <MessageCircle className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                                <p className="text-gray-400 mb-4">Chat with us directly</p>
                                <p className="text-lg font-semibold text-green-500 group-hover:text-white transition-colors">
                                    Chat Now
                                </p>
                            </a>
                        )}

                        {/* Email */}
                        <a
                            href={`mailto:${profile.email}`}
                            className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                                <Mail className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                            <p className="text-gray-400 mb-4">We'll respond as soon as possible</p>
                            <p className="text-lg font-semibold text-blue-500 group-hover:text-white transition-colors break-words">
                                {profile.email}
                            </p>
                        </a>
                        {/* Working Hours */}
                        {profile.workingHours && (
                            <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 lg:col-span-1">
                                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                                    <Clock className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Working Hours</h3>
                                <p className="text-gray-400 mb-4">When we are available</p>
                                <p className="text-lg font-semibold text-orange-500 group-hover:text-white transition-colors">
                                    {profile.workingHours}
                                </p>
                            </div>
                        )}
                        {profile.phoneNumbers && profile.phoneNumbers.length > 0 && (
                            <a
                                href={`tel:${profile.phoneNumbers[0]}`}
                                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                                    <Phone className="w-6 h-6 text-gold" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                                <p className="text-gray-400 mb-4">Available during working hours</p>
                                <p className="text-lg font-semibold text-gold group-hover:text-white transition-colors">
                                    {profile.phoneNumbers[1]}
                                </p>
                            </a>
                        )}
                    </div>

                    {/* Additional Info */}
                    {(profile.bio || profile.description) && (
                        <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {profile.photo && (
                                    <img
                                        src={profile.photo}
                                        alt={profile.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gold/20"
                                    />
                                )}
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-white mb-4">About {profile.name}</h2>
                                    <p className="text-gray-300 leading-relaxed">
                                        {profile.bio || profile.description}
                                    </p>
                                    {profile.experience && (
                                        <div className="mt-4 inline-block px-4 py-2 bg-gold/10 rounded-full border border-gold/20 text-gold text-sm font-semibold">
                                            {profile.experience} Experience
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
