import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Github, Linkedin, Mail, ArrowRight, ExternalLink,
    Menu, X, Code2, Palette, Smartphone, Globe, Send,
    MapPin, Phone, ChevronUp, Sparkles, Star, Zap
} from 'lucide-react';

/* ── Animation Helpers ── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };
const scaleIn = { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } };

const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

/* ── Data ── */
const NAV = ['Home', 'About', 'Services', 'Projects', 'Contact'];

const SOCIAL = [
    { Icon: Github, href: 'https://github.com/maxamed09', label: 'GitHub' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/mohamed-hassan-abdikarin', label: 'LinkedIn' },
    { Icon: Mail, href: 'mailto:maxamedaxmed103667@gmail.com', label: 'Email' },
];

const SERVICES = [
    { icon: Code2, title: 'Web Development', desc: 'Building scalable and performant web applications using modern frameworks like React, Next.js, and Node.js.', color: '#818cf8' },
    { icon: Palette, title: 'UI/UX Design', desc: 'Crafting intuitive, accessible, and visually stunning interfaces that users love to interact with.', color: '#a78bfa' },
    { icon: Smartphone, title: 'Mobile Apps', desc: 'Cross-platform mobile development with React Native, delivering native-quality experiences on iOS and Android.', color: '#c084fc' },
    { icon: Globe, title: 'API & Backend', desc: 'Designing robust RESTful APIs and microservices architectures with security and scalability in mind.', color: '#e879f9' },
];

const PROJECTS = [
    { title: 'E-Commerce Platform', category: 'Full Stack', desc: 'A modern e-commerce platform with real-time inventory, payment integration, and admin dashboard.', tech: ['React', 'Node.js', 'MongoDB', 'Stripe'], color: '#818cf8' },
    { title: 'Task Management App', category: 'Web App', desc: 'Collaborative task management tool with drag-and-drop boards, real-time updates, and team features.', tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Socket.io'], color: '#a78bfa' },
    { title: 'AI Chat Interface', category: 'AI/ML', desc: 'An intelligent chat interface powered by LLMs with context awareness and multi-modal capabilities.', tech: ['Python', 'FastAPI', 'React', 'OpenAI'], color: '#c084fc' },
    { title: 'Portfolio Generator', category: 'SaaS', desc: 'A SaaS platform that generates beautiful developer portfolios from GitHub profiles automatically.', tech: ['Vite', 'Tailwind', 'Supabase', 'Vercel'], color: '#e879f9' },
];

const STATS = [
    { value: '50+', label: 'Projects Completed' },
    { value: '30+', label: 'Happy Clients' },
    { value: '3+', label: 'Years Experience' },
    { value: '99%', label: 'Client Satisfaction' },
];

/* ── Section Wrapper with InView ── */
function Section({ children, id, className = '' }) {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
    return (
        <motion.section
            ref={ref}
            id={id}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={stagger}
            className={`relative ${className}`}
        >
            {children}
        </motion.section>
    );
}

/* ── Animated Counter ── */
function Counter({ value, label }) {
    const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true });
    const numericPart = value.replace(/[^0-9]/g, '');
    const suffix = value.replace(/[0-9]/g, '');
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const target = parseInt(numericPart);
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, numericPart]);

    return (
        <div ref={ref} className="text-center">
            <p className="text-3xl sm:text-4xl font-bold gradient-text">{count}{suffix}</p>
            <p className="text-sm text-zinc-400 mt-1">{label}</p>
        </div>
    );
}

/* ══════════════════════════════════════════
   ██  MAIN APP
   ══════════════════════════════════════════ */
function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('Home');

    const { scrollYProgress } = useScroll();
    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    /* scroll listener for navbar bg */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* intersection observer for active nav link */
    useEffect(() => {
        const sections = NAV.map(n => document.getElementById(n));
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
            },
            { threshold: 0.35 }
        );
        sections.forEach(s => s && observer.observe(s));
        return () => sections.forEach(s => s && observer.unobserve(s));
    }, []);

    const scrollTo = (id) => {
        setMenuOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">

            {/* ── Scroll Progress Bar ── */}
            <motion.div className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[200]" style={{ width: progressWidth }} />

            {/* ══════════ NAVBAR ══════════ */}
            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20' : ''}`}
            >
                <div className="max-w-7xl mx-auto section-padding flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <motion.button
                        onClick={() => scrollTo('Home')}
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold tracking-tight"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        M<span className="gradient-text">.</span>
                    </motion.button>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV.map(item => (
                            <motion.button
                                key={item}
                                onClick={() => scrollTo(item)}
                                whileHover={{ y: -2 }}
                                className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${activeSection === item ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
                            >
                                {item}
                            </motion.button>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <motion.button
                        onClick={() => scrollTo('Contact')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                    >
                        Let's Talk <ArrowRight size={14} />
                    </motion.button>

                    {/* Mobile Hamburger */}
                    <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 text-white">
                        <Menu size={24} />
                    </button>
                </div>
            </motion.nav>

            {/* ══════════ MOBILE MENU ══════════ */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[150] bg-[#0a0a0f]/95 backdrop-blur-2xl flex flex-col"
                    >
                        <div className="flex justify-between items-center px-5 h-16">
                            <span className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                M<span className="gradient-text">.</span>
                            </span>
                            <button onClick={() => setMenuOpen(false)} className="p-2 text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center gap-6">
                            {NAV.map((item, i) => (
                                <motion.button
                                    key={item}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    onClick={() => scrollTo(item)}
                                    className={`text-3xl font-semibold tracking-tight transition-colors ${activeSection === item ? 'gradient-text' : 'text-zinc-300 hover:text-white'}`}
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    {item}
                                </motion.button>
                            ))}
                        </div>

                        <div className="flex justify-center gap-6 pb-10">
                            {SOCIAL.map(({ Icon, href, label }) => (
                                <a key={label} href={href} className="text-zinc-400 hover:text-indigo-400 transition-colors">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════ 1. HERO ══════════ */}
            <Section id="Home" className="min-h-screen flex items-center hero-gradient section-padding pt-24 pb-16">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Text */}
                    <div className="order-2 lg:order-1">
                        <motion.div variants={fadeUp} transition={transition} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <span className="text-xs text-zinc-300 font-medium">Available for work</span>
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            transition={{ ...transition, delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Hi, I'm{' '}
                            <span className="gradient-text">Mohamed</span>
                            <br />
                            <span className="text-zinc-300">Full Stack</span>{' '}
                            <span className="gradient-text">Developer</span>
                        </motion.h1>

                        <motion.p variants={fadeUp} transition={{ ...transition, delay: 0.2 }} className="text-base sm:text-lg text-zinc-400 max-w-lg mb-8 leading-relaxed">
                            I transform ideas into exceptional digital experiences. Specializing in modern web technologies and building solutions that make a real impact.
                        </motion.p>

                        <motion.div variants={fadeUp} transition={{ ...transition, delay: 0.3 }} className="flex flex-wrap gap-4">
                            <motion.button
                                onClick={() => scrollTo('Projects')}
                                whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3.5 rounded-full transition-all text-sm"
                            >
                                View My Work <ArrowRight size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => scrollTo('Contact')}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 border border-white/15 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/5 transition-all text-sm"
                            >
                                Get In Touch
                            </motion.button>
                        </motion.div>

                        {/* Social */}
                        <motion.div variants={fadeUp} transition={{ ...transition, delay: 0.4 }} className="flex items-center gap-4 mt-10">
                            <span className="w-10 h-px bg-zinc-700" />
                            {SOCIAL.map(({ Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    whileHover={{ y: -3, color: '#818cf8' }}
                                    className="text-zinc-500 transition-colors"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>

                    {/* Image */}
                    <motion.div
                        variants={scaleIn}
                        transition={{ ...transition, delay: 0.2 }}
                        className="order-1 lg:order-2 flex justify-center lg:justify-end"
                    >
                        <div className="relative">
                            {/* Ambient glow behind image */}
                            <div className="absolute -inset-6 bg-gradient-to-tr from-indigo-600/15 via-purple-500/10 to-pink-500/15 blur-3xl rounded-3xl pulse-glow" />

                            {/* Decorative accent — bottom-left dot pattern */}
                            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 grid grid-cols-3 gap-1.5 z-0">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                                        className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                                    />
                                ))}
                            </div>

                            {/* Image container — rounded rectangle */}
                            <div className="relative w-72 h-80 sm:w-80 sm:h-[380px] lg:w-[400px] lg:h-[480px] rounded-3xl overflow-hidden glow-border z-10">
                                {/* Gradient overlay at bottom for fade effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent z-10 pointer-events-none" />
                                <img
                                    src="/ChatGPT Image Mar 4, 2026, 02_43_43 PM.png"
                                    alt="Mohamed"
                                    className="w-full h-full object-cover object-top"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center"><span class="text-6xl sm:text-8xl font-bold gradient-text" style="font-family: Space Grotesk, sans-serif">M</span></div>';
                                    }}
                                />
                            </div>

                            {/* Floating badges */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -right-3 sm:-right-6 top-16 sm:top-20 glass-card rounded-xl px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 z-20"
                            >
                                <Zap size={16} className="text-yellow-400" />
                                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">3+ Years Exp</span>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                                className="absolute -left-3 sm:-left-8 bottom-16 sm:bottom-20 glass-card rounded-xl px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 z-20"
                            >
                                <Star size={16} className="text-indigo-400" />
                                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">50+ Projects</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* ══════════ 2. ABOUT ══════════ */}
            <Section id="About" className="py-20 sm:py-28 section-padding">
                <div className="max-w-7xl mx-auto">

                    {/* Section header */}
                    <motion.div variants={fadeUp} transition={transition} className="text-center mb-16">
                        <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">About Me</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Know Who <span className="gradient-text">I Am</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: text */}
                        <motion.div variants={fadeLeft} transition={transition}>
                            <h3 className="text-2xl sm:text-3xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                A passionate <span className="gradient-text">CS Student</span> & Developer
                            </h3>
                            <p className="text-zinc-400 leading-relaxed mb-4">
                                I'm Mohamed, a Computer Science student and full-stack developer with a deep love for creating digital solutions that matter. With over 3 years of hands-on experience, I've worked on diverse projects ranging from e-commerce platforms to AI-powered applications.
                            </p>
                            <p className="text-zinc-400 leading-relaxed mb-8">
                                My approach combines clean code principles with creative design thinking, ensuring every project not only works flawlessly but also delivers an exceptional user experience. I'm constantly learning and staying updated with the latest technologies.
                            </p>

                            {/* Tech stack pills */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Git', 'Docker'].map((tech) => (
                                    <motion.span
                                        key={tech}
                                        whileHover={{ scale: 1.08, backgroundColor: 'rgba(99,102,241,0.2)' }}
                                        className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 rounded-full cursor-default transition-all"
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </div>

                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.04 }}
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
                            >
                                Download CV <ArrowRight size={15} />
                            </motion.a>
                        </motion.div>

                        {/* Right: stats */}
                        <motion.div variants={fadeRight} transition={transition}>
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                {STATS.map(({ value, label }) => (
                                    <div key={label} className="glass-card rounded-2xl p-6 sm:p-8 glow-border text-center">
                                        <Counter value={value} label={label} />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* ══════════ 3. SERVICES ══════════ */}
            <Section id="Services" className="py-20 sm:py-28 section-padding bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={fadeUp} transition={transition} className="text-center mb-16">
                        <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">What I Do</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            My <span className="gradient-text">Services</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {SERVICES.map(({ icon: Icon, title, desc, color }, i) => (
                            <motion.div
                                key={title}
                                variants={fadeUp}
                                transition={{ ...transition, delay: i * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="glass-card rounded-2xl p-6 sm:p-8 glow-border group cursor-default"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: `${color}15`, color }}
                                >
                                    <Icon size={22} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ══════════ 4. PROJECTS ══════════ */}
            <Section id="Projects" className="py-20 sm:py-28 section-padding">
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={fadeUp} transition={transition} className="text-center mb-16">
                        <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Portfolio</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Featured <span className="gradient-text">Projects</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PROJECTS.map(({ title, category, desc, tech, color }, i) => (
                            <motion.div
                                key={title}
                                variants={fadeUp}
                                transition={{ ...transition, delay: i * 0.1 }}
                                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                                className="glass-card rounded-2xl overflow-hidden glow-border group"
                            >
                                {/* Color bar */}
                                <div className="h-1" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />

                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full" style={{ color, backgroundColor: `${color}15` }}>
                                            {category}
                                        </span>
                                        <motion.a href="#" whileHover={{ scale: 1.2, rotate: -15 }} className="text-zinc-500 group-hover:text-indigo-400 transition-colors">
                                            <ExternalLink size={18} />
                                        </motion.a>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{title}</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed mb-5">{desc}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {tech.map(t => (
                                            <span key={t} className="text-[11px] font-medium text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ══════════ 5. CONTACT ══════════ */}
            <Section id="Contact" className="py-20 sm:py-28 section-padding bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={fadeUp} transition={transition} className="text-center mb-16">
                        <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Get In Touch</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Let's Work <span className="gradient-text">Together</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">

                        {/* Left: info cards */}
                        <motion.div variants={fadeLeft} transition={transition} className="lg:col-span-2 space-y-5">
                            {[
                                { icon: Mail, label: 'Email', value: 'maxamedaxmed103667@gmail.com', href: 'mailto:maxamedaxmed103667@gmail.com' },
                                { icon: Phone, label: 'Phone', value: '+91 8557812973', href: 'tel:+918557812973' },
                                { icon: MapPin, label: 'Location', value: 'Khajurla, Punjab', href: '#' },
                            ].map(({ icon: Icon, label, value, href }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    whileHover={{ x: 6 }}
                                    className="flex items-center gap-4 glass-card rounded-xl p-5 glow-border group"
                                >
                                    <div className="w-11 h-11 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors flex-shrink-0">
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 font-medium">{label}</p>
                                        <p className="text-sm text-white font-semibold">{value}</p>
                                    </div>
                                </motion.a>
                            ))}

                            {/* Social row */}
                            <div className="flex gap-3 pt-2">
                                {SOCIAL.map(({ Icon, href, label }) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        whileHover={{ y: -4, backgroundColor: 'rgba(99,102,241,0.15)' }}
                                        className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-indigo-400 transition-all"
                                    >
                                        <Icon size={18} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: form */}
                        <motion.form
                            variants={fadeRight}
                            transition={transition}
                            className="lg:col-span-3 glass-card rounded-2xl p-6 sm:p-8 glow-border space-y-5"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="Mohamed"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Your Email</label>
                                    <input
                                        type="email"
                                        placeholder="hello@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Project discussion"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="Tell me about your project..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm"
                            >
                                Send Message <Send size={15} />
                            </motion.button>
                        </motion.form>
                    </div>
                </div>
            </Section>

            {/* ══════════ FOOTER ══════════ */}
            <footer className="border-t border-white/5 py-8 section-padding">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-zinc-500">
                        © 2026 Mohamed. All rights reserved.
                    </p>
                    <div className="flex gap-5">
                        {SOCIAL.map(({ Icon, href, label }) => (
                            <a key={label} href={href} className="text-zinc-500 hover:text-indigo-400 transition-colors">
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>

            {/* ── Back to top ── */}
            <AnimatePresence>
                {scrolled && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-indigo-600/80 backdrop-blur-sm text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors z-50"
                    >
                        <ChevronUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
