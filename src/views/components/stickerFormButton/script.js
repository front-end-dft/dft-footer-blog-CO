const scriptURL = 'https://script.google.com/macros/s/AKfycbw0slY3-HzeN8bhmT6jqXi2lWMq0KjkqoZcmYnvZZ4oYG_aY-zNdjHJujAbZ4uabPeF1Q/exec';
var name_Campaign = 'Sticker Form';

(function() {
    const initForm = () => {
        const form = document.getElementById('newsletterStickerFormButtonModal');
        const submitBtn = document.getElementById('stickerFormSubmit');
        
        // Se o form não existe ou o listener já foi adicionado, para aqui
        if (!form || form.dataset.listenerActive === "true") return;

        const stickerPromo = document.getElementById('stickerFormButton');
        const modalStickerForm = document.getElementById('stickerFormButtonModal');
        const closeButtons = document.querySelectorAll('.closeBtnStickerFormButtonModal');
        const closeButtonsFeedback = document.querySelectorAll('.closeBtnStickerFormFeedback');
        const inputTelefone = document.getElementById('telefone');
        const loadingElement = document.querySelector('.loadingStickerFormButton');
        const feedbackModal = document.querySelector('.stickerFormFeedback');

        let isSubmitting = false;

        form.dataset.listenerActive = "true";

        // --- INTERAÇÕES DO MODAL ---
        if (stickerPromo) {
            window.addEventListener('mousemove', (e) => {
                const rect = stickerPromo.getBoundingClientRect();
                let x = ((e.clientX - rect.left) / rect.width) * 100;
                let y = ((e.clientY - rect.top) / rect.height) * 100;
                stickerPromo.style.setProperty('--x', `${Math.max(0, Math.min(100, x))}%`);
                stickerPromo.style.setProperty('--y', `${Math.max(0, Math.min(100, y))}%`);
            });
            stickerPromo.onclick = () => modalStickerForm.style.display = 'flex';
        }

        closeButtons.forEach(btn => {
            btn.onclick = () => {
                modalStickerForm.style.display = 'none';
                feedbackModal.style.display = 'none';
            };
        });

        closeButtonsFeedback.forEach(btn => {
            btn.onclick = () => {
                modalStickerForm.style.display = 'none';
                feedbackModal.style.display = 'none';
            };
        });

        // --- MÁSCARA DE TELEFONE ---
        if (inputTelefone) {
            inputTelefone.oninput = function() {
                let v = this.value.replace(/\D/g, '');
                if (v.length > 0) v = v.replace(/^(\d{2})(\d)/, "($1) $2");
                if (v.length > 9) v = v.replace(/(\d)(\d{4})$/, "$1-$2");
                this.value = v;
            };
        }

        // --- LÓGICA DE ENVIO (CLICK EM VEZ DE SUBMIT) ---
        submitBtn.onclick = function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            if (isSubmitting) return;

            // Validações
            const nome = form.nome.value.trim();
            const email = form.email.value.trim();
            const categorias = Array.from(form.querySelectorAll('.flexCategories input:checked')).map(cb => cb.value);
            const opcoes = Array.from(form.querySelectorAll('.flexOptions input:checked')).map(cb => cb.value);

            if (nome.length < 2 || !email.includes('@')) {
                alert("Preencha nome e e-mail corretamente.");
                return;
            }

            if (categorias.length === 0 || opcoes.length === 0) {
                alert("Selecione suas preferências.");
                return;
            }

            // Bloqueio de segurança
            isSubmitting = true;
            submitBtn.disabled = true;
            if (loadingElement) loadingElement.style.display = 'flex';

            const formData = new FormData(form);
            formData.append('categoriesString', categorias.join(', '));
            formData.append('generoString', opcoes.join(', '));
            formData.append('campanha', form.getAttribute('data-campaign') || name_Campaign || 'Desconhecida');
            formData.append('data', new Date().toLocaleDateString('pt-BR'));
            formData.append('origem', window.location.href);

            // O mode 'no-cors' é vital para evitar re-tentativas do browser com Google Scripts
            fetch(scriptURL, { 
                method: 'POST', 
                body: formData,
                mode: 'no-cors' 
            })
            .then(() => {
                if (loadingElement) loadingElement.style.display = 'none';
                if (feedbackModal) feedbackModal.style.display = 'flex';
                form.reset();
                // Opcional: fechar modal após alguns segundos
            })
            .catch(err => {
                console.error("Erro no envio:", err);
                alert("Erro ao enviar.");
            })
            .finally(() => {
                // Destrava após delay para evitar spam
                setTimeout(() => {
                    isSubmitting = false;
                    submitBtn.disabled = false;
                }, 3000);
            });
        };
    };

    // Executa ao carregar garante compatibilidade com carregamentos assíncronos
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initForm();
    } else {
        document.addEventListener('DOMContentLoaded', initForm);
    }
})();