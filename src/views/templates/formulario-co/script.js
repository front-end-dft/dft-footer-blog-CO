(function() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzb1iW-FELxofTtFn-s4FpHTh7P2Nyc7DyTdm446Be-u7gva_CKGI9bxWvmQSurtCIB9g/exec'; 

    const initForms = () => {
        console.log("Iniciando script do formulario...");
        
        const scope = document.querySelector('.form-co');
        if (!scope) {
            console.error("Erro: Elemento .form-co nao encontrado.");
            return;
        }

        if (scope.dataset.initialized === "true") return;

        const staticForm = scope.querySelector('.js-form-static');
        const staticSubmitBtn = scope.querySelector('.js-submit-btn');
        const staticInputTel = scope.querySelector('.js-input-tel');
        const staticLoading = scope.querySelector('.js-loading');
        const staticModalSucesso = scope.querySelector('.js-modal-success');
        const staticCloseBtn = scope.querySelector('.js-close-modal');

        if (!staticSubmitBtn || !staticForm) {
            console.error("Error: Botón o formulario no encontrados por las clases js-.");
            return;
        }

        scope.dataset.initialized = "true";

        // ==========================================
        // MÁSCARA (XXX XXX XXXX)
        // ==========================================
        if (staticInputTel) {
            staticInputTel.setAttribute('maxlength', '12'); 

            staticInputTel.oninput = function() {
                let v = this.value.replace(/\D/g, ''); 
                
                // Limita a string pura a no máximo 10 dígitos
                if (v.length > 10) v = v.slice(0, 10);

                // Aplica os espaços nos lugares certos à medida que o usuário digita
                if (v.length > 6) {
                    v = v.replace(/^(\d{3})(\d{3})(\d{1,4})/, "$1 $2 $3");
                } else if (v.length > 3) {
                    v = v.replace(/^(\d{3})(\d{1,3})/, "$1 $2");
                }
                
                this.value = v;
            };
        }

        if (staticCloseBtn && staticModalSucesso) {
            staticCloseBtn.onclick = () => { staticModalSucesso.style.display = 'none'; };
        }

        staticSubmitBtn.onclick = (e) => {
            e.preventDefault();
            console.log("Botao enviar clicado.");
            
            const nomeField = staticForm.querySelector('input[name="nome"]');
            const emailField = staticForm.querySelector('input[name="email"]');

            if (!nomeField || !emailField) {
                alert("Error interno: Campos de entrada no encontrados. Verifique los atributos name.");
                return;
            }

            const nome = nomeField.value.trim();
            const email = emailField.value.trim();
            const telefone = staticInputTel ? staticInputTel.value.trim() : "";

            if (nome.length < 2) {
                alert("Por favor, ingrese seu nombre.");
                return;
            }

            if (!email.includes('@')) {
                alert("Por favor, ingrese un correo electrónico válido.");
                return;
            }

            // ==========================================
            // VALIDAÇÃO DO TAMANHO DO TELEFONE COLOMBIANO
            // ==========================================
            // "300 123 4567" tem exatamente 12 caracteres (incluindo os espaços)
            if (telefone.length < 12) { 
                alert("Por favor, ingrese un número de teléfono válido de 10 dígitos.");
                return;
            }

            console.log("Validación aprobada. Enviando datos...");
            staticSubmitBtn.disabled = true;
            if (staticLoading) staticLoading.style.display = 'flex';

            const params = new URLSearchParams();
            params.append('nome', nome);
            params.append('email', email);
            params.append('telefone', telefone);
            params.append('origem', window.location.href);
            
            const dataColombia = new Intl.DateTimeFormat('fr-CA', { 
                timeZone: 'America/Bogota', 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            }).format(new Date());

            params.append('data', dataColombia);

            fetch(scriptURL, { 
                method: 'POST', 
                body: params, 
                mode: 'no-cors' 
            })
            .then(() => {
                console.log("Resposta recebida do Google.");
                if (staticLoading) staticLoading.style.display = 'none';
                if (staticModalSucesso) staticModalSucesso.style.display = 'flex';
                staticForm.reset();
            })
            .catch(err => {
                console.error("Erro no fetch:", err);
                alert("Error al enviar los datos. Inténtelo de nuevo.");
            })
            .finally(() => {
                setTimeout(() => { staticSubmitBtn.disabled = false; }, 3000);
            });
        };
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initForms();
    } else {
        document.addEventListener('DOMContentLoaded', initForms);
    }
})();