# OtimizaJus - Landing Page Institucional

Este projeto implementa a landing page para a **OtimizaJus**, seguindo os princípios de mobile-first, alta performance (HTML/CSS/JS puros), SEO e foco total em conversão (WhatsApp e Agendamento).

## Estrutura do Projeto

```text
/
├── index.html       # Arquivo principal, estruturado semanticamente para SEO.
├── css/
│   └── styles.css   # Variáveis, design system premium e media queries.
├── js/
│   ├── config.js    # ⚙️ CONFIGURAÇÕES (WhatsApp, Agendamento, Redes Sociais, GA4).
│   └── main.js      # Lógica de interface e disparos de eventos GA4.
├── .gitignore
└── README.md
```

## Como Configurar (Importante!)

Antes de publicar o site, você deve editar o arquivo **`js/config.js`** e preencher:

1. **`WHATSAPP_NUMBER`**: O número oficial para recebimento de leads (formato: `5511999999999`).
2. **`SCHEDULING_URL`**: O link do seu software de agendamento (ex: Calendly).
3. **`GA4_MEASUREMENT_ID`**: O seu código "G-XXXXXXXXXX" do Google Analytics 4.
4. **`SOCIAL_LINKS`**: (Opcional) URLs do Instagram, LinkedIn, etc. Se deixar vazio, não aparecerá.

## Decisões Técnicas

*   **HTML/CSS/Vanilla JS:** Escolhidos para garantir máxima performance de carregamento, hospedagem simples e gratuita em qualquer serviço de arquivos estáticos (Netlify, GitHub Pages, Vercel), sem build complexos.
*   **Cards sem hover obrigatório:** A especificação determinou foco em mobile e interação consciente. Os cards exigem o **toque/clique** para virar e mostrar a solução (evento `service_card_open` disparado no GA4).
*   **Integração GA4:** Todos os botões, seções e cards possuem tags `data-` no HTML. O `main.js` lê essas tags e dispara eventos padronizados no Analytics automaticamente.

## Como Executar Localmente

1. Abra a pasta `OtimizajusSite` no seu editor (ex: VS Code).
2. Utilize a extensão **Live Server** para rodar o `index.html`.
3. Verifique o console do navegador: os disparos do GA4 estão logando no console para você conseguir debugar e validar as interações.

## Como Publicar (Deploy)

Recomendamos **Netlify** ou **Vercel**:
1. Crie um repositório no GitHub.
2. Faça o push dos arquivos.
3. Conecte o repositório na Vercel/Netlify. 
4. O deploy será instantâneo (não requer build).
