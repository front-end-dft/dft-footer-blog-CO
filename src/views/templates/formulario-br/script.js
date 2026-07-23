(function() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxdjJKGrlw6JQpHmrXGBacBQUSwKZ_9Rmvw9i32UKscuKBXbww7tR59KEg-uPPsPM3oKg/exec'; 

    const initForms = () => {
        console.log("Iniciando script do formulario...");
        
        const scope = document.querySelector('.form-br');
        if (!scope) {
            console.error("Erro: Elemento .form-br nao encontrado.");
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
            console.error("Erro: Botao ou Formulario nao encontrados pelas classes js-.");
            return;
        }

        scope.dataset.initialized = "true";
        console.log("Formulario mapeado com sucesso.");

        // Mascara de Telefone
        if (staticInputTel) {
            staticInputTel.oninput = function() {
                let v = this.value.replace(/\D/g, '');
                if (v.length > 0) v = v.replace(/^(\d{2})(\d)/, "($1) $2");
                if (v.length > 9) v = v.replace(/(\d)(\d{4})$/, "$1-$2");
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
                alert("Erro interno: Campos de entrada nao encontrados. Verifique os atributos name.");
                return;
            }

            const nome = nomeField.value.trim();
            const email = emailField.value.trim();
            const telefone = staticInputTel ? staticInputTel.value.trim() : "";

            if (nome.length < 2) {
                alert("Por favor, preencha seu nome.");
                return;
            }

            if (!email.includes('@')) {
                alert("Por favor, insira um e-mail valido.");
                return;
            }

            if (telefone.length < 14) { 
                alert("Por favor, insira um telefone valido.");
                return;
            }

            console.log("Validacao aprovada. Enviando dados...");
            staticSubmitBtn.disabled = true;
            if (staticLoading) staticLoading.style.display = 'flex';

            const params = new URLSearchParams();
            params.append('nome', nome);
            params.append('email', email);
            params.append('telefone', telefone);
            params.append('data', new Date().toLocaleDateString('pt-BR'));
            params.append('origem', window.location.href);

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
                alert("Erro ao enviar dados. Tente novamente.");
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