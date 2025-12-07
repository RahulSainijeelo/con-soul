export function HeroSection() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Image with Premium Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80"
                    alt="Travel Background"
                    className="h-full w-full object-cover opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
            </div>

            {/* Premium Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-15%] w-[700px] h-[700px] bg-gold/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-15%] w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 md:!pt-16 flex h-screen items-center justify-center text-center px-4">
                {/* Main Heading Only */}
                <h1
                    style={{ fontFamily: 'var(--heading-bold)' }}
                    className="text-5xl sm:text-5xl md:text-8xl lg:text-9xl xl:text-[9.2rem] xl:padding-top-[85px] font-bold tracking-[0.05em] leading-[1.1] animate-slide-up"
                >
                    <span className="block text-white mb-6 " style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                        Discover Your
                    </span>
                    <span
                        className="block text-gold"
                        style={{
                            textShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 2px 20px rgba(0,0,0,0.5)',
                            filter: 'brightness(1.2)'
                        }}
                    >
                        Next Adventure
                    </span>
                </h1>
            </div>
        </section>
    );
}
