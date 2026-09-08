document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Analytics Wrapper ---
    const trackEvent = (eventName, params = {}) => {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
            console.log(`GA4 Event: ${eventName}`, params); // Para debug
        }
    };

    trackEvent('page_view', { section_name: 'home' });

    // --- 2. Redirecionamento de CTAs (WhatsApp e Agendamento) ---
    const setupCTAs = () => {
        // WhatsApp
        document.querySelectorAll('.cta-whatsapp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ctaPosition = btn.getAttribute('data-cta') || 'unknown';
                const context = btn.getAttribute('data-context') || 'default';
                
                trackEvent('whatsapp_click', { cta_position: ctaPosition });
                
                const message = CONFIG.WHATSAPP_MESSAGES[context] || CONFIG.WHATSAPP_MESSAGES.default;
                const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
            });
        });

        // Agendamento
        document.querySelectorAll('.cta-agendar').forEach(btn => {
            btn.addEventListener('click', () => {
                const ctaPosition = btn.getAttribute('data-cta') || 'unknown';
                trackEvent('schedule_click', { cta_position: ctaPosition });
                window.open(CONFIG.SCHEDULING_URL, '_blank');
            });
        });
    };
    setupCTAs();

    // --- 3. Segmentação de Público ---
    const audienceCards = document.querySelectorAll('.audience-card');
    const audienceMsgBox = document.getElementById('audience-message');

    const audienceMessages = {
        advogado: "Perfeito! A OtimizaJus cuida da burocracia para você focar no que realmente importa: seus clientes e sua Advocacia.",
        escritorio_advocacia: "Excelente. Assumimos parte da operação do seu escritório para que sua equipe tenha mais tempo para os processos.",
        empresa_imobiliaria: "Ótimo. Oferecemos suporte jurídico, administrativo e operacional integrado para sua empresa."
    };

    audienceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove classe ativa de todos
            audienceCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const type = card.getAttribute('data-audience');
            trackEvent('audience_card_click', { audience_type: type });

            // Exibir mensagem customizada
            audienceMsgBox.innerText = audienceMessages[type];
            audienceMsgBox.classList.remove('hidden');
        });
    });

    // --- 4. Cards de Serviço Interativos (Toque/Clique) ---
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const isFlipped = card.classList.contains('is-flipped');
            const serviceName = card.getAttribute('data-service');

            if (!isFlipped) {
                // Fechar outros
                serviceCards.forEach(c => c.classList.remove('is-flipped'));
                // Abrir atual
                card.classList.add('is-flipped');
                trackEvent('service_card_open', { service_name: serviceName });
            } else {
                card.classList.remove('is-flipped');
            }
        });
    });

    // --- 5. Observer para visualização de seções (Analytics) ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.getAttribute('data-section');
                trackEvent('section_view', { section_name: sectionName });
                sectionObserver.unobserve(entry.target); // Só dispara 1 vez
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-section]').forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 6. Injeção de Redes Sociais ---
    const socialContainer = document.getElementById('social-container');
    if (socialContainer) {
        Object.keys(CONFIG.SOCIAL_LINKS).forEach(network => {
            const link = CONFIG.SOCIAL_LINKS[network];
            if (link) {
                const a = document.createElement('a');
                a.href = link;
                a.target = '_blank';
                a.innerText = network.charAt(0).toUpperCase() + network.slice(1);
                socialContainer.appendChild(a);
            }
        });
    }
});
