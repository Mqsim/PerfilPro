import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ArrowDown, Eye, Award, Crown,
  Search, Camera, Package, User, Briefcase, Users,
  Palette, Sparkles, Star, Quote, Send, Plus, Minus,
  Instagram, Linkedin, Facebook
} from 'lucide-react';

// =================================================================
// 1. CONFIGURAÇÃO DE ESTILOS E UTILS (SUBSTITUINDO ARQUIVOS EXTERNOS)
// =================================================================

// Cores base (substituindo variáveis CSS)
const colors = {
  navy: '#1E2B36',
  gold: '#BDAE8E',
  lightGray: '#EAEAEA',
  darkBg: '#141D25',
};

// Classes principais (Substituindo index.css e components/ui/button)
const btnPrimaryClasses = `
  bg-[${colors.gold}] text-[${colors.navy}] px-8 py-3 rounded-lg font-semibold uppercase tracking-wider 
  transition-all duration-300 hover:bg-transparent hover:text-[${colors.gold}] border-2 border-[${colors.gold}]
  flex items-center justify-center space-x-2 whitespace-nowrap text-sm sm:text-base
`;

// =================================================================
// 2. SISTEMA DE TOAST (SUBSTITUINDO use-toast e toaster)
// =================================================================

// Variáveis e Store
const TOAST_LIMIT = 1;
let toastCount = 0;
const generateId = () => (toastCount++).toString();

const createToastStore = () => {
    let state = { toasts: [] };
    let listeners = [];

    const setState = (nextState) => {
        state = typeof nextState === 'function' ? nextState(state) : { ...state, ...nextState };
        listeners.forEach(listener => listener(state));
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => { listeners = listeners.filter(l => l !== listener); };
    };

    const toast = ({ ...props }) => {
        const id = generateId();
        const dismiss = () => setState(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
        
        // Limita a 1 toast por vez
        setState(s => ({ toasts: [{ ...props, id, dismiss }, ...s.toasts].slice(0, TOAST_LIMIT) })); 
        
        // Auto-dismiss após 4s
        setTimeout(dismiss, 4000); 
        
        return { id, dismiss };
    };

    return { getState: () => state, subscribe, toast };
};

const toastStore = createToastStore();
const toast = toastStore.toast;

const useToast = () => {
    const [state, setState] = useState(toastStore.getState());
    useEffect(() => toastStore.subscribe(setState), []);
    return { toasts: state.toasts, toast };
};

// Componente Toaster
const Toaster = () => {
    const { toasts } = useToast();
    if (toasts.length === 0) return null;

    const { id, title, description } = toasts[0];
    const { dismiss } = toastStore.getState().toasts.find(t => t.id === id) || {};

    return (
        <div className="fixed bottom-4 right-4 z-[100] w-full max-w-sm">
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.8 }}
                key={id}
                className={`bg-[${colors.navy}] border border-[${colors.gold}]/50 rounded-xl p-4 shadow-2xl flex items-start space-x-4`}
            >
                <div className="flex-grow">
                    <p className="font-bold text-white text-lg">{title}</p>
                    <p className="text-[${colors.lightGray}] text-sm mt-1">{description}</p>
                </div>
                <button onClick={dismiss} className={`text-[${colors.gold}] hover:text-white transition-colors p-1`}>
                    <X size={20} />
                </button>
            </motion.div>
        </div>
    );
};


// =================================================================
// 3. FUNÇÕES DE NAVEGAÇÃO E SCROLL
// =================================================================

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const scrollToContact = () => scrollToSection('contact');

// =================================================================
// 4. COMPONENTE HEADER
// =================================================================

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (id) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Início' },
    { id: 'services', label: 'Serviços' },
    { id: 'process', label: 'Processo' },
    { id: 'testimonials', label: 'Depoimentos' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? `bg-[${colors.navy}] shadow-xl border-b border-[${colors.gold}]/20` : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleScroll('home')}>
          <div className={`w-8 h-8 bg-[${colors.gold}] rounded-full flex items-center justify-center`}>
            <span className={`text-[${colors.navy}] font-bold text-xl`}>P</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wider">PerfilPro</span>
        </div>
        
        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex space-x-8">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => handleScroll(link.id)} className={`text-[${colors.lightGray}] hover:text-[${colors.gold}] transition-colors font-medium`}>
              {link.label}
            </button>
          ))}
        </nav>
        
        {/* CTA - Desktop */}
        <div className="hidden lg:block">
          <button onClick={() => handleScroll('contact')} className={btnPrimaryClasses}>
            Agendar Sessão
          </button>
        </div>

        {/* Menu Toggle - Mobile */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden bg-[${colors.navy}]/95 overflow-hidden`}
          >
            <nav className="flex flex-col items-center space-y-6 py-8">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => handleScroll(link.id)} className="text-xl text-light-gray hover:text-gold transition-colors">
                  {link.label}
                </button>
              ))}
              <button onClick={() => handleScroll('contact')} className={`${btnPrimaryClasses} mt-4`}>
                Agendar Sessão
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// =================================================================
// 5. COMPONENTE HERO
// =================================================================

const Hero = () => {
  const scrollToBenefits = () => scrollToSection('benefits');

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center relative text-white overflow-hidden"
      style={{ 
        backgroundColor: colors.darkBg, 
        fontFamily: 'Poppins, sans-serif' 
      }}>
      
      {/* Background Image and Overlay */}
      <div className="absolute inset-0">
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-30" 
          alt="Retrato executivo profissional em ambiente de escritório moderno" 
          src="https://horizons-cdn.hostinger.com/d7fb8b6c-17d6-4cb8-9099-dc09654005c5/fb6efdffa12190cf0c6c9cf2ac3e216a.png" 
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1920x1080/141D25/BDAE8E?text=FOTO+PROFISSIONAL"; }}
        />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at center, rgba(20, 29, 37, 0.1) 0%, rgba(20, 29, 37, 0.95) 80%)`
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pt-20">
        <motion.h1 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} 
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
        >
          IMAGEM QUE GERA <span className={`text-[${colors.gold}]`}>AUTORIDADE</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} 
          className={`text-xl md:text-2xl mb-10 font-light max-w-3xl mx-auto text-[${colors.lightGray}]/90`}
        >
          Retratos corporativos que comunicam sua expertise e constroem credibilidade instantânea.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <button onClick={scrollToContact} className={btnPrimaryClasses}>
            Agendar Sessão
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer p-4 rounded-full"
          onClick={scrollToBenefits}
        >
          <ArrowDown size={32} className={`text-[${colors.gold}]`} />
        </motion.div>

      </div>
    </section>
  );
};

// =================================================================
// 6. COMPONENTE BENEFITS
// =================================================================

const Benefits = () => {
  const benefits = [
    {
      icon: Eye,
      title: 'Clareza Estratégica',
      description: 'Comunique sua proposta de valor com precisão e impacto visual imediato.'
    },
    {
      icon: Award,
      title: 'Profissionalismo Elevado',
      description: 'Projete uma imagem de excelência que inspira confiança e respeito no mercado.'
    },
    {
      icon: Crown,
      title: 'Autoridade Incontestável',
      description: 'Posicione-se como líder e referência em sua área de atuação.'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="benefits" className={`py-20 sm:py-32 bg-[${colors.navy}]`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sua Imagem, Sua <span className={`text-[${colors.gold}]`}>Vantagem Competitiva</span>
          </h2>
          <p className={`text-lg text-[${colors.lightGray}]/70 max-w-3xl mx-auto`}>
            Nossos retratos são mais que fotos. São ferramentas estratégicas para o seu personal branding.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`text-center p-8 bg-[${colors.darkBg}] rounded-2xl border border-[${colors.gold}]/20 hover:border-[${colors.gold}]/50 transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className={`w-20 h-20 bg-[${colors.gold}]/10 border-2 border-[${colors.gold}]/30 rounded-full flex items-center justify-center mx-auto mb-6`}>
                <benefit.icon className={`text-[${colors.gold}]`} size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className={`text-[${colors.lightGray}]/70`}>{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// =================================================================
// 7. COMPONENTE SERVICES
// =================================================================

const Services = () => {
  const services = [
    { icon: User, title: 'Headshot LinkedIn', description: 'Impacto e profissionalismo para seu perfil digital.' },
    { icon: Briefcase, title: 'Ensaio Executivo', description: 'Um portfólio visual completo para sua marca pessoal.' },
    { icon: Users, title: 'Times & Equipes', description: 'Consistência e força para a imagem da sua empresa.' },
    { icon: Palette, title: 'Direção de Arte', description: 'Consultoria para um conceito visual autêntico e poderoso.' },
    { icon: Sparkles, title: 'Pós-Produção Premium', description: 'Acabamento de alta-costura para cada imagem.' }
  ];

  const handleServiceClick = () => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: "Esta funcionalidade ainda não foi implementada—mas você pode solicitar na próxima mensagem! 🚀",
    });
  };

  return (
    <section id="services" className={`py-20 sm:py-32 bg-[${colors.darkBg}]`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Serviços <span className={`text-[${colors.gold}]`}>Exclusivos</span>
          </h2>
          <p className={`text-lg text-[${colors.lightGray}]/70 max-w-3xl mx-auto`}>
            Oferecemos um leque de serviços para atender cada faceta da sua necessidade de imagem profissional.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
              className={`bg-[${colors.navy}] rounded-2xl p-8 shadow-lg hover:shadow-[${colors.gold}]/10 transition-all duration-300 border border-transparent hover:border-[${colors.gold}]/30 cursor-pointer flex flex-col`}
              onClick={handleServiceClick}
            >
              <div className={`w-16 h-16 bg-[${colors.gold}] rounded-xl flex items-center justify-center mb-6`}>
                <service.icon className={`text-[${colors.navy}]`} size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className={`text-[${colors.lightGray}]/70 mb-6 leading-relaxed flex-grow`}>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =================================================================
// 8. COMPONENTE PROCESS
// =================================================================

const Process = () => {
  const steps = [
    { icon: Search, title: 'Diagnóstico', description: 'Análise profunda dos seus objetivos e público-alvo.' },
    { icon: Camera, title: 'Direção Criativa', description: 'Sessão guiada para capturar sua essência com autenticidade.' },
    { icon: Package, title: 'Entrega de Valor', description: 'Imagens de alta performance prontas para gerar resultados.' }
  ];

  return (
    <section id="process" className={`py-20 sm:py-32 bg-[${colors.navy}]`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            O Caminho Para a <span className={`text-[${colors.gold}]`}>Excelência</span>
          </h2>
          <p className={`text-lg text-[${colors.lightGray}]/70 max-w-3xl mx-auto`}>
            Nosso processo de 3 etapas é desenhado para garantir precisão, qualidade e impacto.
          </p>
        </motion.div>

        <div className="relative">
          {/* Linha horizontal para desktop */}
          <div className={`hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-[${colors.gold}]/20 transform -translate-y-1/2`}></div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-center flex flex-col items-center"
              >
                {/* Ícone e número do passo */}
                <div className={`w-24 h-24 bg-[${colors.darkBg}] border-2 border-[${colors.gold}] rounded-full flex items-center justify-center mx-auto mb-6 z-10`}>
                  <step.icon className={`text-[${colors.gold}]`} size={40} />
                </div>
                {/* Título do passo */}
                <span className={`text-[${colors.gold}] font-bold text-lg mb-2`}>Passo {index + 1}</span>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className={`text-[${colors.lightGray}]/70 max-w-xs`}>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// =================================================================
// 9. COMPONENTE TESTIMONIALS
// =================================================================

const Testimonials = () => {
  const testimonials = [
    { name: 'Ana Carolina Silva', position: 'CEO, TechCorp', content: 'A PerfilPro não entrega apenas fotos, entrega uma nova percepção de mercado. O impacto na minha marca pessoal foi imediato.' },
    { name: 'Roberto Mendes', position: 'Sócio-Diretor, Advocacia Mendes', content: 'O nível de detalhe e profissionalismo é algo raro. Eles entendem a linguagem do mundo corporativo como ninguém.' },
    { name: 'Mariana Costa', position: 'Diretora de Marketing, InnovaCorp', content: 'Contratamos para a diretoria e o resultado foi uma imagem coesa e poderosa. A equipe é fantástica e o processo impecável.' }
  ];

  return (
    <section id="testimonials" className={`py-20 sm:py-32 bg-[${colors.darkBg}]`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Resultados que <span className={`text-[${colors.gold}]`}>Falam por Si</span>
          </h2>
          <p className={`text-lg text-[${colors.lightGray}]/70 max-w-3xl mx-auto`}>
            Confiança de líderes e executivos que viram sua imagem profissional ser transformada.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
              className={`bg-[${colors.navy}] rounded-2xl p-8 shadow-lg flex flex-col`}
            >
              <Quote className={`text-[${colors.gold}]/50 mb-4`} size={40} />
              <p className={`text-[${colors.lightGray}]/90 mb-6 leading-relaxed italic flex-grow`}>
                "{testimonial.content}"
              </p>
              <div className={`flex items-center justify-between border-t border-[${colors.gold}]/20 pt-6`}>
                <div>
                  <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                  <p className={`text-[${colors.gold}] text-sm`}>{testimonial.position}</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`text-[${colors.gold}] fill-current`} size={18} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =================================================================
// 10. COMPONENTE FAQ
// =================================================================

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: 'Qual a diferença entre um headshot e um retrato comum?', answer: 'O headshot é focado no rosto e expressão, com um propósito profissional claro. É uma ferramenta de marketing pessoal, enquanto um retrato comum pode ter diversos fins.' },
    { question: 'Preciso ter experiência com fotografia?', answer: 'Absolutamente não. Nossa direção especializada irá guiá-lo em cada passo para que você se sinta confortável e para capturarmos suas melhores expressões.' },
    { question: 'Como devo me preparar para a sessão?', answer: 'Após o agendamento, você receberá um guia completo de preparação, com dicas de vestuário, grooming e descanso para garantir os melhores resultados.' },
    { question: 'Onde as sessões são realizadas?', answer: 'Oferecemos sessões em nosso estúdio parceiro, na sua empresa (in-company) ou em locações externas que conversem com sua marca pessoal.' },
    { question: 'O tratamento de imagem está incluso?', answer: 'Sim. Todas as imagens entregues passam por nossa pós-produção premium, que inclui tratamento de pele, cores e contraste de forma natural e sofisticada.' }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={`py-20 sm:py-32 bg-[${colors.navy}]`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Perguntas <span className={`text-[${colors.gold}]`}>Frequentes</span>
          </h2>
          <p className={`text-lg text-[${colors.lightGray}]/70 max-w-3xl mx-auto`}>
            Respostas rápidas para as dúvidas mais comuns dos nossos clientes.
          </p>
        </motion.div>

        <div className={`bg-[${colors.darkBg}] rounded-2xl divide-y divide-[${colors.gold}]/20 shadow-xl`}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.1 }}
              className="px-6 sm:px-8"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left py-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? 
                    <Minus className={`text-[${colors.gold}] flex-shrink-0`} size={28} /> : 
                    <Plus className={`text-[${colors.gold}] flex-shrink-0`} size={28} />
                  }
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: '-1rem' }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6">
                      <p className={`text-[${colors.lightGray}]/80 leading-relaxed`}>
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =================================================================
// 11. COMPONENTE CONTACT
// =================================================================

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' }); // Limpa o formulário
      toast({
        title: "✅ Mensagem Recebida!",
        description: "Obrigado pelo seu contato! Responderemos em breve. (Funcionalidade de formulário simulada).",
      });
    }, 1500);
  };

  const handleWhatsApp = () => {
    const message = "Olá, PerfilPro! Gostaria de mais informações sobre uma sessão de retrato corporativo.";
    // Usando um número de exemplo.
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className={`py-20 sm:py-32 bg-[${colors.darkBg}]`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="lg:grid lg:grid-cols-2 lg:gap-16 items-start"
        >
          {/* Conteúdo à esquerda */}
          <div className="mb-12 lg:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Transforme Sua Imagem. <span className={`text-[${colors.gold}]`}>Entre em Contato.</span>
            </h2>
            <p className={`text-lg text-[${colors.lightGray}]/70 mb-8`}>
              Agende sua sessão de retratos corporativos e comece a construir a autoridade visual que você merece.
            </p>
            
            <div className="space-y-6">
              <p className="flex items-start text-white">
                <Send size={24} className={`text-[${colors.gold}] mr-4 mt-1 flex-shrink-0`} />
                <span>E-mail: contato@perfilpro.com.br</span>
              </p>
              <p className="flex items-start text-white cursor-pointer hover:text-[${colors.gold}] transition-colors" onClick={handleWhatsApp}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[${colors.gold}] mr-4 mt-1 flex-shrink-0`}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                <span>WhatsApp: (11) 99999-9999 (Clique para iniciar)</span>
              </p>
              <p className="flex items-start text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[${colors.gold}] mr-4 mt-1 flex-shrink-0`}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
                <span>Localização: São Paulo, SP, Brasil</span>
              </p>
            </div>
          </div>

          {/* Formulário à direita */}
          <div className={`p-8 rounded-2xl bg-[${colors.navy}] shadow-2xl`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className={`w-full p-4 rounded-lg bg-[${colors.darkBg}] border-2 border-[${colors.gold}]/20 text-white placeholder-white/50 focus:border-[${colors.gold}] focus:outline-none transition-colors`}
                  placeholder="Seu nome" required
                />
              </div>
              <div>
                <input
                  type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className={`w-full p-4 rounded-lg bg-[${colors.darkBg}] border-2 border-[${colors.gold}]/20 text-white placeholder-white/50 focus:border-[${colors.gold}] focus:outline-none transition-colors`}
                  placeholder="Seu melhor e-mail" required
                />
              </div>
              <div>
                <textarea
                  name="message" value={formData.message} onChange={handleInputChange} rows={4}
                  className={`w-full p-4 rounded-lg bg-[${colors.darkBg}] border-2 border-[${colors.gold}]/20 text-white placeholder-white/50 focus:border-[${colors.gold}] focus:outline-none resize-none transition-colors`}
                  placeholder="Sua mensagem..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className={btnPrimaryClasses + ' w-full disabled:opacity-50 disabled:cursor-not-allowed'}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                        <svg className={`animate-spin h-5 w-5 text-[${colors.navy}]`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Enviando...</span>
                    </span>
                ) : (
                    <span className="flex items-center space-x-2">
                        <Send size={20} />
                        <span>Enviar Mensagem</span>
                    </span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// =================================================================
// 12. COMPONENTE FOOTER
// =================================================================

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-[${colors.navy}] border-t-2 border-[${colors.gold}]/20`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
          
          {/* Coluna 1: Logo e Descrição */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className={`w-10 h-10 bg-[${colors.gold}] rounded-full flex items-center justify-center`}>
                <span className={`text-[${colors.navy}] font-bold text-xl`}>P</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-wider">PerfilPro</span>
            </div>
            <p className={`text-[${colors.lightGray}]/60 text-sm`}>
              Retratos corporativos que comunicam autoridade e constroem credibilidade.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg tracking-wider">Navegação</h4>
            <ul className={`space-y-3 text-[${colors.lightGray}]/70`}>
              {['home', 'services', 'process', 'testimonials', 'contact'].map(id => (
                <li key={id}>
                  <button onClick={() => scrollToSection(id)} className={`hover:text-[${colors.gold}] transition-colors`}>
                    {id === 'home' ? 'Início' : id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Coluna 3: Contato */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg tracking-wider">Contato</h4>
            <ul className={`space-y-3 text-[${colors.lightGray}]/70`}>
              <li>(11) 99999-9999</li>
              <li>contato@perfilpro.com.br</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>

          {/* Coluna 4: Redes Sociais */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg tracking-wider">Siga-nos</h4>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className={`w-10 h-10 bg-[${colors.darkBg}] rounded-full flex items-center justify-center hover:bg-[${colors.gold}] transition-colors group`}>
                <Instagram className={`text-[${colors.gold}] group-hover:text-[${colors.navy}]`} size={20} />
              </a>
              <a href="#" className={`w-10 h-10 bg-[${colors.darkBg}] rounded-full flex items-center justify-center hover:bg-[${colors.gold}] transition-colors group`}>
                <Linkedin className={`text-[${colors.gold}] group-hover:text-[${colors.navy}]`} size={20} />
              </a>
              <a href="#" className={`w-10 h-10 bg-[${colors.darkBg}] rounded-full flex items-center justify-center hover:bg-[${colors.gold}] transition-colors group`}>
                <Facebook className={`text-[${colors.gold}] group-hover:text-[${colors.navy}]`} size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Direitos Autorais */}
        <div className={`border-t border-[${colors.gold}]/20 mt-12 pt-8 text-center`}>
          <p className={`text-[${colors.lightGray}]/50 text-sm`}>
            © {currentYear} PerfilPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

// =================================================================
// 13. COMPONENTE PRINCIPAL APP
// =================================================================

// O componente principal App.jsx (que inclui a tag Helmet e todos os outros componentes)
const App = () => {
  return (
    <>
      {/* Usando classes do Tailwind para o layout e fontes */}
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
          background-color: ${colors.darkBg};
          color: ${colors.lightGray};
          line-height: 1.7;
        }
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Metadados - Usamos a biblioteca react-helmet para definir títulos e metas */}
      {/* Nota: Como não posso importar 'react-helmet' diretamente em um arquivo único, 
          vou usar um placeholder. Em um projeto real, isso estaria aqui. */}
      <title>Retrato Corporativo Premium | PerfilPro – Personal Branding Estratégico</title>
      
      <div className={`min-h-screen bg-[${colors.darkBg}]`} style={{ backgroundColor: colors.darkBg }}>
        <Header />
        <main>
          <Hero />
          <Benefits />
          <Services />
          <Process />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>
        <Footer />
        <Toaster />
      </div>
    </>
  );
};

export default App;
