import { LogIn } from 'lucide-react'
import React from 'react'
import BottomTabBar from '../layout/BottomTabBar'
import Footer from '../layout/Footer'
import Header from '../layout/Header'
import Link from 'next/link'
const LoginTC = () => {
    return (
        <div className="min-h-screen bg-black pb-16 md:pb-0">
            <Header />
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <LogIn className="w-12 h-12 text-gold" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
                    <p className="text-gray-400 mb-8">
                        Please log in to view your trips and manage your bookings.
                    </p>
                    <Link href="/auth/login">
                        <button className="bg-gold hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2">
                            <LogIn className="w-5 h-5" />
                            Login to Continue
                        </button>
                    </Link>
                </div>
            </div>
            <BottomTabBar />
            <Footer />
        </div>
    )
}

export default LoginTC