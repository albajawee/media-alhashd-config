import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Head from 'next/head';
import { i18nData } from '../data/i18n';

// --- DATA (Normally in separate files) ---

// Updated feature data with new structure and prices in USD
const featuresData = {
  "sections": [
    {
      "id": "core",
      "icon": "CoreIcon",
      "features": [
        { "id": "account_management", "price": 550, "icon": "UserIcon", "isEssential": true },
        { "id": "events", "price": 250, "icon": "CalendarIcon", "isEssential": true  },
        { "id": "push_notifications", "price": 400, "icon": "BellIcon", "isEssential": true  },
        { "id": "cms", "price": 200, "icon": "FileTextIcon" },
        { "id": "bilingual_support", "price": 750, "icon": "GlobeIcon" },
        { "id": "live_match_center", "price": 650, "icon": "WatchIcon" }
      ]
    },
    {
      "id": "ecommerce",
      "icon": "EcommerceIcon",
      "features": [
        { "id": "product_management", "price": 200, "icon": "PackageIcon", "isEssential": true  },
        { "id": "order_management", "price": 450, "icon": "ClipboardListIcon", "isEssential": true  },
        { "id": "inventory_management", "price": 200, "icon": "ArchiveIcon", "isEssential": true  },
        { "id": "discounts_coupons", "price": 150, "icon": "TicketIcon" },
        { "id": "online_payment", "price": 600, "icon": "CreditCardIcon" },
        { "id": "reviews_ratings", "price": 150, "icon": "MessageSquareIcon" }
      ]
    },
    {
      "id": "forum",
      "icon": "ForumIcon",
      "features": [
        { "id": "moderation_tools", "price": 300, "icon": "ShieldIcon", "isEssential": true  },
        { "id": "forum_profiles", "price": 350, "icon": "AwardIcon", "isEssential": true  },
        { "id": "forum_topics", "price": 150, "icon": "MessageCircleIcon", "isEssential": true  },
        { "id": "nested_replies", "price": 200, "icon": "GitMergeIcon", "isEssential": true  },
        { "id": "polls", "price": 150, "icon": "BarChart2Icon" },
        { "id": "social_interaction", "price": 200, "icon": "Share2Icon" },
        { "id": "forum_notifications", "price": 300, "icon": "BellIcon" },
        
      ]
    },
    {
      "id": "addons",
      "icon": "PlusIcon",
       "features": [
        { "id": "addons_analytics", "price": 350, "icon": "BarChart2Icon" },
        { "id": "addons_api", "price": 250, "icon": "GitMergeIcon" },
        { "id": "addons_maintenance", "price": 250, "icon": "ShieldIcon" }
      ]
    }
  ]
};

const allFeatures = featuresData.sections.flatMap(section => 
    section.features.map(feature => ({ 
        ...feature, 
        fullId: `${section.id}-${feature.id}`, 
        sectionId: section.id 
    }))
);


// --- SVG ICONS (as React Components) ---
const ICONS = {
    CoreIcon: (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M2 12h3m14 0h3M12 2v3m0 14v3" /></svg> ),
    EcommerceIcon: (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg> ),
    ForumIcon: (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> ),
    ChevronRightIcon: (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg> ),
    CheckIcon: (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> ),
    PlusIcon: (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14"/></svg> ),
    TrashIcon: (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg> ),
    UserIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    CalendarIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    BellIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    FileTextIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    WatchIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path></svg>,
    GlobeIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
    PackageIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
    ClipboardListIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><line x1="12" y1="11" x2="12" y2="16"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>,
    ArchiveIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>,
    TicketIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M3 15v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M9 5v14M15 5v14"></path></svg>,
    CreditCardIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
    MessageSquareIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
    MessageCircleIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
    GitMergeIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg>,
    BarChart2Icon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    Share2Icon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
    AwardIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
    ShieldIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    XIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    DownloadIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    EyeIcon: props => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
};
const DynamicIcon = ({ name, ...props }) => {
    const IconComponent = ICONS[name];
    return IconComponent ? <IconComponent {...props} /> : null;
};

// --- HELPER FUNCTIONS & HOOKS ---
const useLocalization = () => {
    const [lang, setLang] = useState('ar');
    
    useEffect(() => {
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
    }, []);

    const t = useCallback((key) => {
        const translation = i18nData.ar[key];
        if (!translation) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
        return translation;
    }, []);

    return { t };
};

const useCart = () => {
    const getInitialState = useCallback(() => {
        const essentialItems = allFeatures
            .filter(f => f.isEssential)
            .map(f => f.fullId);
        
        try {
            const saved = localStorage.getItem('appConfigCart');
            if (saved) {
                const savedItems = JSON.parse(saved);
                // Only keep saved items that are not essential (user's choices)
                const userChoices = savedItems.filter(itemId => {
                    const feature = allFeatures.find(f => f.fullId === itemId);
                    return feature && !feature.isEssential;
                });
                return [...essentialItems, ...userChoices];
            }
            return essentialItems;
        } catch (error) {
            return essentialItems;
        }
    }, []);

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        setCartItems(getInitialState());
    }, [getInitialState]);

    useEffect(() => {
        if (cartItems.length > 0) {
            // Only save non-essential items (user's choices)
            const userChoices = cartItems.filter(itemId => {
                const feature = allFeatures.find(f => f.fullId === itemId);
                return feature && !feature.isEssential;
            });
            localStorage.setItem('appConfigCart', JSON.stringify(userChoices));
        }
    }, [cartItems]);

    const addToCart = (itemId) => {
        if (!cartItems.includes(itemId)) {
            setCartItems(prev => [...prev, itemId]);
        }
    };

    const removeFromCart = (itemId) => {
        const feature = allFeatures.find(f => f.fullId === itemId);
        if (feature && feature.isEssential) {
            return; // Guard against removing essential items
        }
        setCartItems(prev => prev.filter(id => id !== itemId));
    };
    
    const isInCart = (itemId) => cartItems.includes(itemId);

    return { cartItems, addToCart, removeFromCart, isInCart };
};


// --- UI COMPONENTS ---

const LandingPage = ({ onStart, t }) => (
    <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/football.png')"}}></div>
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-yellow-400/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-4000"></div>

        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
            <h1 className="text-2xl font-bold tracking-tighter">FanApp<span className="text-yellow-400">.Config</span></h1>
        </header>

        <main className="text-center z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                {t('landing.title')}
            </h2>
            <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-8">
                {t('landing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={onStart} 
                    className="bg-yellow-400 text-slate-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                >
                    {t('landing.cta')}
                </button>
            </div>
        </main>
    </div>
);

const ConfiguratorPage = ({ onBack, t }) => {
    const { cartItems, addToCart, removeFromCart, isInCart } = useCart();
    const cartIconRef = useRef(null);
    const { ChevronRightIcon } = ICONS;

    const handleToggleFeature = (feature, buttonRef) => {
        const featureId = `${feature.sectionId}-${feature.id}`;
        if (isInCart(featureId)) {
            removeFromCart(featureId);
        } else {
            animateToCart(buttonRef, feature);
            addToCart(featureId);
        }
    };

    const animateToCart = (buttonRef, feature) => {
        if (!buttonRef.current || !cartIconRef.current) return;
        
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const cartRect = cartIconRef.current.getBoundingClientRect();

        const chip = document.createElement('div');
        chip.textContent = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(feature.price);

        chip.className = 'fixed z-50 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full pointer-events-none';
        document.body.appendChild(chip);

        const startX = buttonRect.left + buttonRect.width / 2;
        const startY = buttonRect.top + buttonRect.height / 2;
        const endX = cartRect.left + cartRect.width / 2;
        const endY = cartRect.top + cartRect.height / 2;
        
        chip.style.left = `${startX}px`;
        chip.style.top = `${startY}px`;
        chip.style.transform = `translate(-50%, -50%)`;
        chip.style.transition = 'all 0.6s cubic-bezier(0.5, -0.5, 0.2, 1.3)';

        requestAnimationFrame(() => {
            chip.style.left = `${endX}px`;
            chip.style.top = `${endY}px`;
            chip.style.transform = 'translate(-50%, -50%) scale(0.5)';
            chip.style.opacity = '0';
        });

        setTimeout(() => {
            chip.remove();
            if (cartIconRef.current) {
                cartIconRef.current.classList.add('animate-pulse');
                setTimeout(() => cartIconRef.current?.classList.remove('animate-pulse'), 500);
            }
        }, 600);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <header className="sticky top-0 z-30 bg-slate-900/70 backdrop-blur-xl border-b border-slate-700">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 onClick={onBack} className="cursor-pointer text-2xl font-bold tracking-tighter">FanApp<span className="text-yellow-400">.Config</span></h1>
                </div>
            </header>
            <main className="container mx-auto p-4 lg:p-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('configurator.title')}</h2>
                    <div className="mt-4 flex justify-center items-center gap-2 md:gap-4 text-sm text-slate-400">
                        <span>{t('configurator.steps.1')}</span>
                        <ChevronRightIcon className="w-5 h-5 rtl:rotate-180" />
                        <span className="text-yellow-400 font-bold">{t('configurator.steps.2')}</span>
                        <ChevronRightIcon className="w-5 h-5 rtl:rotate-180" />
                        <span>{t('configurator.steps.3')}</span>
                    </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 space-y-8">
                        {featuresData.sections.map((section) => (
                            <SectionCard key={section.id} section={section} t={t} handleToggleFeature={handleToggleFeature} isInCart={isInCart} />
                        ))}
                    </div>
                    <div className="lg:w-1/3">
                        <Cart 
                           cartItems={cartItems}
                           t={t}
                           cartIconRef={cartIconRef}
                           onRemove={removeFromCart}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

const SectionCard = ({ section, t, handleToggleFeature, isInCart }) => {
    const SectionIcon = ICONS[section.icon];
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:border-slate-600 hover:shadow-yellow-500/5 animate-fade-in-up">
            <div className="p-6 bg-slate-800 flex items-center gap-4 border-b border-slate-700">
                {SectionIcon && <SectionIcon className="w-10 h-10 text-yellow-400" />}
                <div>
                    <h3 className="text-2xl font-bold">{t(`section.${section.id}.title`)}</h3>
                    <p className="text-slate-400">{t(`section.${section.id}.desc`)}</p>
                </div>
            </div>
            <div className="divide-y divide-slate-700/50">
                {section.features.map((feature, index) => (
                    <FeatureRow 
                        key={feature.id}
                        feature={{...feature, sectionId: section.id}}
                        t={t}
                        onToggle={handleToggleFeature}
                        isInCart={isInCart}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

const FeatureRow = ({ feature, t, onToggle, isInCart, index }) => {
    const { CheckIcon, PlusIcon } = ICONS;
    const buttonRef = useRef(null);
    const featureId = `${feature.sectionId}-${feature.id}`;
    const inCart = isInCart(featureId);

    const formattedPrice = useMemo(() => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(feature.price), [feature.price]);

    return (
        <div 
           className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors duration-200 animate-fade-in-up" 
           style={{animationDelay: `${index * 50}ms`}}
        >
            <div className="flex items-center gap-4">
                <DynamicIcon name={feature.icon} className="w-6 h-6 text-slate-400 hidden sm:block" />
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">{t(`feature.${feature.id}.title`)}</h4>
                        {feature.isEssential && (
                            <span className="text-xs font-bold text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full shadow-sm shadow-green-500/50">
                                {t('feature.essential_tag')}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-400">{t(`feature.${feature.id}.desc`)}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <div className="text-yellow-400 font-bold text-sm sm:text-base">{formattedPrice}</div>
                {feature.isEssential ? (
                    <button
                        disabled
                        className="w-28 h-10 rounded-full font-bold text-sm flex items-center justify-center gap-1 bg-green-500/20 text-green-400 cursor-not-allowed"
                    >
                        <CheckIcon className="w-4 h-4" />
                        <span>{t('feature.added_tag')}</span>
                    </button>
                ) : (
                    <button 
                        ref={buttonRef}
                        onClick={() => onToggle(feature, buttonRef)} 
                        className={`w-28 h-10 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-1 ${
                            inCart 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30'
                        }`}
                    >
                        {inCart ? ( <> <CheckIcon className="w-4 h-4" /> <span>{t('feature.remove')}</span> </> ) 
                               : ( <> <PlusIcon className="w-4 h-4" /> <span>{t('feature.add')}</span> </> )}
                    </button>
                )}
            </div>
        </div>
    );
};

const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const ref = useRef(null);
  
    useEffect(() => {
      const startValue = displayValue;
      const endValue = value;
      let startTime = null;
  
      const animation = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / 500, 1);
        const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
        setDisplayValue(currentValue);
        if (progress < 1) requestAnimationFrame(animation);
      };
      requestAnimationFrame(animation);
  
      if (ref.current) {
        ref.current.classList.add('animate-pulse-fast');
        setTimeout(() => ref.current?.classList.remove('animate-pulse-fast'), 300);
      }
    }, [value, displayValue]);
  
    return <span ref={ref}>{new Intl.NumberFormat('en-US').format(displayValue)}</span>;
};

const ReviewModal = ({ isOpen, onClose, selectedItems, total, t, onConfirm, isGenerating }) => {
    const { XIcon, EyeIcon, DownloadIcon } = ICONS;
    
    const formatCurrency = useCallback((value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <EyeIcon className="w-6 h-6 text-yellow-400" />
                        <div>
                            <h2 className="text-xl font-bold text-white">{t('review.title')}</h2>
                            <p className="text-slate-400 text-sm">{t('review.subtitle')}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        disabled={isGenerating}
                    >
                        <XIcon className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-white mb-4">{t('review.selected_features')}</h3>
                    
                    {/* Features by section */}
                    {featuresData.sections.map(section => {
                        const sectionFeatures = selectedItems.filter(item => item.sectionId === section.id);
                        if (sectionFeatures.length === 0) return null;
                        
                        return (
                            <div key={section.id} className="mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <DynamicIcon name={section.icon} className="w-5 h-5 text-yellow-400" />
                                    <h4 className="text-md font-semibold text-slate-300">{t(`section.${section.id}.title`)}</h4>
                                </div>
                                <div className="space-y-2">
                                    {sectionFeatures.map(item => (
                                        <div key={item.fullId} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <DynamicIcon name={item.icon} className="w-4 h-4 text-slate-400" />
                                                <div>
                                                    <span className="text-white text-sm font-medium">{t(`feature.${item.id}.title`)}</span>
                                                    {item.isEssential && (
                                                        <span className="text-xs font-bold text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full mr-2">
                                                            {t('feature.essential_tag')}
                                                        </span>
                                                    )}
                                                    <p className="text-slate-400 text-xs">{t(`feature.${item.id}.desc`)}</p>
                                                </div>
                                            </div>
                                            <span className="text-yellow-400 font-semibold">{formatCurrency(item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 bg-slate-800/50">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-white">{t('review.total_cost')}</span>
                        <span className="text-2xl font-extrabold text-yellow-400">{formatCurrency(total)}</span>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600 transition-colors"
                            disabled={isGenerating}
                        >
                            {t('review.cancel')}
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={isGenerating}
                            className="flex-1 bg-yellow-400 text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                                    {t('review.generating')}
                                </>
                            ) : (
                                <>
                                    <DownloadIcon className="w-4 h-4" />
                                    {t('review.confirm_download')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Cart = ({ cartItems, t, cartIconRef, onRemove }) => {
    const { EcommerceIcon, TrashIcon } = ICONS;
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const selectedItems = useMemo(() => 
        cartItems.map(itemId => allFeatures.find(f => f.fullId === itemId)).filter(Boolean), 
    [cartItems]);
    
    const subtotal = useMemo(() => 
        selectedItems.reduce((sum, item) => sum + item.price, 0), 
    [selectedItems]);

    const total = subtotal;

    const formatCurrency = useCallback((value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }, []);

    const handleGeneratePdf = async () => {
        if (typeof window === 'undefined') return;
        
        setIsGenerating(true);
        
        try {
            // Load jsPDF dynamically in browser with Arabic font support
            const loadJsPDF = async () => {
                if (window.jspdf) return window.jspdf.jsPDF;
                
                const script1 = document.createElement('script');
                script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                document.head.appendChild(script1);
                
                await new Promise(resolve => script1.onload = resolve);
                
                const script2 = document.createElement('script');
                script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
                document.head.appendChild(script2);
                
                await new Promise(resolve => script2.onload = resolve);
                
                return window.jspdf.jsPDF;
            };

            const jsPDF = await loadJsPDF();
            const doc = new jsPDF();
            
            // Configure for better Arabic support
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Header with English text to avoid Arabic issues
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(20);
            doc.text('Fan App Configuration Summary', pageWidth / 2, 25, { align: 'center' });
            
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(12);
            doc.text('Detailed Report of Selected Features', pageWidth / 2, 35, { align: 'center' });
            
            // Date
            doc.setFontSize(10);
            const currentDate = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            doc.text(`Created: ${currentDate}`, pageWidth / 2, 45, { align: 'center' });

            // Create table data grouped by sections
            let tableData = [];
            
            featuresData.sections.forEach(section => {
                const sectionFeatures = selectedItems.filter(item => item.sectionId === section.id);
                if (sectionFeatures.length === 0) return;
                
                // Section header
                tableData.push([
                    'Section', // Type
                    getSectionNameInEnglish(section.id), // Feature name in English
                    '', // Price column
                    '' // Notes
                ]);
                
                // Section features
                sectionFeatures.forEach(item => {
                    tableData.push([
                        item.isEssential ? 'Essential' : 'Optional',
                        getFeatureNameInEnglish(item.id),
                        formatCurrency(item.price),
                        item.isEssential ? 'Required' : 'Selected'
                    ]);
                });
                
                // Add spacing row
                tableData.push(['', '', '', '']);
            });

            // Remove last empty row
            if (tableData.length > 0) tableData.pop();

            const tableHeaders = [[
                'Type',
                'Feature',
                'Price',
                'Notes'
            ]];
            
            doc.autoTable({
                head: tableHeaders,
                body: tableData,
                startY: 55,
                theme: 'grid',
                styles: {
                    font: 'Helvetica',
                    fontSize: 9,
                    cellPadding: 4,
                    halign: 'left',
                    lineColor: [200, 200, 200],
                    lineWidth: 0.5
                },
                headStyles: {
                    fillColor: [37, 99, 235], // Blue header
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 10
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 25 }, // Type
                    1: { halign: 'left', cellWidth: 90 },   // Feature
                    2: { halign: 'center', cellWidth: 30 }, // Price
                    3: { halign: 'center', cellWidth: 30 }  // Notes
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                margin: { left: 15, right: 15 }
            });

            const finalY = doc.lastAutoTable.finalY + 20;

            // Total section
            doc.setFillColor(37, 99, 235);
            doc.rect(15, finalY, pageWidth - 30, 25, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(`Total Cost: ${formatCurrency(total)}`, pageWidth / 2, finalY + 15, { align: 'center' });

            // Footer with Raqeem.team
            doc.setTextColor(100, 100, 100);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            doc.text('Created by Raqeem.team', pageWidth / 2, pageHeight - 15, { align: 'center' });

            // Save the PDF
            doc.save(`FanApp_Configuration_${new Date().getTime()}.pdf`);
            
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Error creating PDF. Please try again.');
        } finally {
            setIsGenerating(false);
            setIsReviewModalOpen(false);
        }
    };

    // Helper functions to get English names for PDF
    const getSectionNameInEnglish = (sectionId) => {
        const sectionNames = {
            'core': 'Core Application',
            'ecommerce': 'E-Commerce Store',
            'forum': 'Interactive Forum',
            'addons': 'Add-ons & Extras'
        };
        return sectionNames[sectionId] || sectionId;
    };

    const getFeatureNameInEnglish = (featureId) => {
        const featureNames = {
            'account_management': 'Account & Membership Management',
            'events': 'Events & Activities Organization',
            'push_notifications': 'Push Notifications',
            'cms': 'Content Management',
            'bilingual_support': 'Bilingual Interface',
            'live_match_center': 'Live Match Center',
            'product_management': 'Product Management',
            'order_management': 'Order Management',
            'inventory_management': 'Inventory Management',
            'discounts_coupons': 'Discounts & Coupons',
            'online_payment': 'Online Payment & Shopping Experience',
            'reviews_ratings': 'Reviews & Ratings',
            'forum_topics': 'Discussions & Topics',
            'nested_replies': 'Comments & Replies',
            'polls': 'Polls & Surveys',
            'social_interaction': 'Social Interaction',
            'forum_profiles': 'User Profiles',
            'forum_notifications': 'Forum Notifications',
            'moderation_tools': 'Forum Moderation Tools',
            'addons_analytics': 'Analytics & AI Reports',
            'addons_api': 'External API Integration',
            'addons_maintenance': 'Maintenance & Hosting'
        };
        return featureNames[featureId] || featureId;
    };

    const handleReviewClick = () => {
        setIsReviewModalOpen(true);
    };

    return (
        <>
            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                selectedItems={selectedItems}
                total={total}
                t={t}
                onConfirm={handleGeneratePdf}
                isGenerating={isGenerating}
            />
            
            <div className="sticky top-28 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 ref={cartIconRef} className="text-xl font-bold">{t('cart.title')}</h3>
                </div>
                {selectedItems.length === 0 ? (
                    <div className="text-center text-slate-400 py-12">
                        <EcommerceIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                        <p>{t('cart.empty')}</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-2 -mr-2">
                        {selectedItems.map(item => (
                            <div key={item.fullId} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg animate-fade-in-up">
                                <div className="flex items-center gap-3">
                                    <DynamicIcon name={item.icon} className="w-5 h-5 text-slate-400" />
                                    <span className="text-sm">{t(`feature.${item.id}.title`)}</span>
                                    {item.isEssential && <span className="text-xs font-bold text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full">{t('feature.essential_tag')}</span>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold">{formatCurrency(item.price)}</span>
                                    <button
                                        onClick={() => onRemove(item.fullId)}
                                        disabled={item.isEssential}
                                        className={`text-slate-500 transition-colors ${item.isEssential ? 'cursor-not-allowed opacity-50' : 'hover:text-red-400'}`}
                                    >
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {selectedItems.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-700 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">{t('cart.subtotal')}</span>
                            <span className="font-semibold">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-lg">
                            <span className="font-bold">{t('cart.total')}</span>
                            <span className="text-yellow-400 font-extrabold text-2xl" aria-live="polite">
                                {t('currency.usd')}<AnimatedNumber value={total} />
                            </span>
                        </div>
                        <button 
                            onClick={handleReviewClick}
                            className="w-full mt-6 bg-yellow-400 text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors transform hover:scale-[1.02]"
                        >
                            {t('cart.submit')}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
    const { t } = useLocalization();
    const [page, setPage] = useState('landing'); // 'landing', 'configurator'

    const renderPage = () => {
        switch (page) {
            case 'configurator':
                return <ConfiguratorPage onBack={() => setPage('landing')} t={t} />;
            case 'landing':
            default:
                return <LandingPage onStart={() => setPage('configurator')} t={t} />;
        }
    };

    return (
        <>
            <Head>
                <title>FanApp.Config - صمم تطبيق المشجعين الأمثل</title>
                <meta name="description" content="اختر الميزات، قم بتكوين باقتك، وأنشئ تجربة هاتف عالمية المستوى لمشجعي ناديك" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.svg" />
            </Head>
            <style jsx global>{`
                :root { font-family: 'Cairo', sans-serif; }
                .high-contrast { background-color: #000 !important; color: #fff !important; }
                .high-contrast .bg-slate-900, .high-contrast .bg-slate-800\/50, .high-contrast .bg-slate-800 { background: #000 !important; border: 1px solid #fff !important; }
                .high-contrast .text-slate-300, .high-contrast .text-slate-400 { color: #fff !important; }
                .high-contrast .text-yellow-400 { color: #FFFF00 !important; }
                .high-contrast .bg-yellow-400 { background-color: #FFFF00 !important; color: #000 !important; }
                .animation-delay-4000 { animation-delay: 4s; }
                .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0.6, 1) infinite; }
                .animate-pulse-fast { animation: pulse 0.3s cubic-bezier(0.4, 0, 0.6, 1) once; }
                @keyframes pulse-fast { 50% { transform: scale(1.1); } }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; opacity: 0; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; opacity: 0; }
            `}</style>
            {renderPage()}
        </>
    );
}