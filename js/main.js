document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Analytics Wrapper ---
    const trackEvent = (eventName, params = {}) => {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
            console.log(`GA4 Event: ${eventName}`, params);
        }
    };

    trackEvent('page_view', { section_name: 'home' });

    // --- 2. Redirecionamento de CTAs ---
    const setupCTAs = () => {
        document.querySelectorAll('.cta-whatsapp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const ctaPosition = btn.getAttribute('data-cta') || 'unknown';
                const context = btn.getAttribute('data-context') || 'default';
                
                trackEvent('whatsapp_click', { cta_position: ctaPosition });
                
                const message = CONFIG.WHATSAPP_MESSAGES[context] || CONFIG.WHATSAPP_MESSAGES.default;
                const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
            });
        });

        document.querySelectorAll('.cta-agendar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const ctaPosition = btn.getAttribute('data-cta') || 'unknown';
                trackEvent('schedule_click', { cta_position: ctaPosition });
                window.open(CONFIG.SCHEDULING_URL, '_blank');
            });
        });
    };
    setupCTAs();

    // --- 3. Segmentação de Público Dinâmica ---
    const audienceCards = document.querySelectorAll('.audience-card');
    const specificContainer = document.getElementById('specific-services-container');
    const audienceMessage = document.getElementById('audience-message');
    const servicesList = document.getElementById('services-list');

    // Dados dos serviços específicos por perfil
    const audienceData = {
        advogado: {
            title: "Perfeito! A OtimizaJus cuida da burocracia para você focar no que realmente importa: seus clientes e sua Advocacia.",
            services: [
                { title: "Gestão de Prazos Pessoais", desc: "Acompanhamento rigoroso de datas, evitando perdas de prazos." },
                { title: "Controladoria Jurídica", desc: "Organização estrutural dos seus processos e andamentos." },
                { title: "Atendimento de Clientes", desc: "Suporte no retorno aos clientes pelo WhatsApp enquanto você trabalha." }
            ]
        },
        escritorio_advocacia: {
            title: "Excelente. Assumimos parte da operação do seu escritório para que sua equipe tenha mais tempo para os processos e estratégia.",
            services: [
                { title: "Gestão de Fluxos da Equipe", desc: "Padronização e distribuição organizada de tarefas operacionais." },
                { title: "Suporte Financeiro", desc: "Controle de recebimentos e cobrança de inadimplentes." },
                { title: "Organização de CRM", desc: "Cadastros, triagem de leads e manutenção do histórico dos clientes." }
            ]
        }
    };

    audienceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove ativação de todos e adiciona no clicado
            audienceCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const type = card.getAttribute('data-audience');
            trackEvent('audience_card_click', { audience_type: type });

            // Puxa os dados correspondentes
            const data = audienceData[type];
            if (data) {
                audienceMessage.innerText = data.title;
                
                // Monta os cards de serviços específicos
                servicesList.innerHTML = '';
                data.services.forEach(srv => {
                    const el = document.createElement('div');
                    el.className = 'specific-service-item';
                    el.innerHTML = `<h4>${srv.title}</h4><p>${srv.desc}</p>`;
                    servicesList.appendChild(el);
                });

                specificContainer.classList.remove('hidden');
                
                // Scroll suave para a seção revelada
                setTimeout(() => {
                    specificContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
    });

    // --- 4. Cards de Serviço Interativos (Flip) ---
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const isFlipped = card.classList.contains('is-flipped');
            const serviceName = card.getAttribute('data-service');

            if (!isFlipped) {
                serviceCards.forEach(c => c.classList.remove('is-flipped'));
                card.classList.add('is-flipped');
                trackEvent('service_card_open', { service_name: serviceName });
            } else {
                card.classList.remove('is-flipped');
            }
        });
    });

    // --- 5. Timeline Interativa (Sanfona/Accordion) ---
    const timelineItems = document.querySelectorAll('.timeline-item.interactive .step-header');
    timelineItems.forEach(header => {
        header.addEventListener('click', () => {
            const parent = header.parentElement.parentElement; // .timeline-item
            const isActive = parent.classList.contains('active');
            
            // Fecha todos
            document.querySelectorAll('.timeline-item.interactive').forEach(item => {
                item.classList.remove('active');
            });

            // Abre se estava fechado
            if (!isActive) {
                parent.classList.add('active');
                const stepText = header.querySelector('h3').innerText;
                trackEvent('timeline_step_open', { step_name: stepText });
            }
        });
    });

    // Abrir o primeiro passo da timeline por padrão para dar o "dica" de clique
    const firstTimelineItem = document.querySelector('.timeline-item.interactive');
    if (firstTimelineItem) firstTimelineItem.classList.add('active');

    // --- 6. Formulário de Email (Submissão Simbólica) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.8';
            trackEvent('form_submit', { form_name: 'contact_email' });

            // Simula envio (já que é estático)
            setTimeout(() => {
                btn.innerText = 'Mensagem Enviada!';
                btn.style.background = 'var(--color-dourado)';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1000);
        });
    }

    // --- 7. Observer (Analytics) ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.getAttribute('data-section');
                trackEvent('section_view', { section_name: sectionName });
                sectionObserver.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-section]').forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 8. Redes Sociais ---
    const socialContainer = document.getElementById('social-container');
    const socialContainerLarge = document.getElementById('social-container-large');
    
    if (socialContainer && socialContainerLarge) {
        Object.keys(CONFIG.SOCIAL_LINKS).forEach(network => {
            const link = CONFIG.SOCIAL_LINKS[network];
            if (link) {
                // Footer (Text Links)
                const a = document.createElement('a');
                a.href = link;
                a.target = '_blank';
                a.innerText = network.charAt(0).toUpperCase() + network.slice(1);
                socialContainer.appendChild(a);

                // Section Contato (Large Icons)
                const iconLink = document.createElement('a');
                iconLink.href = link;
                iconLink.target = '_blank';
                iconLink.className = 'social-icon';
                iconLink.innerHTML = `<img src="./assets/icons/${network}.svg" alt="${network}" style="width: 24px;">`;
                // Se o icone svg nao existir ele fica quebrado por enquanto
                socialContainerLarge.appendChild(iconLink);
            }
        });
    }
});
