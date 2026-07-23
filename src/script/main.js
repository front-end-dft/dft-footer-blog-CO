window.dataLayer = window.dataLayer || [];

// Captura segura de dados da página (ES5)
var currentPath = window.location.pathname || "";
var currentHref = window.location.href || "";
var currentTitle = document.title || "Sem Título";

// GA4 Push
window.dataLayer.push({
    event: 'page_view_ga4',
    page_path: String(currentPath),
    page_location: String(currentHref),
    page_title: "ecommerce - content - " + String(currentTitle)
});

(function registrarAcessoInterno() {
    try {
        var SCRIPT_URL_VISU = 'https://script.google.com/macros/s/AKfycbxRXM4NT3ocM2hNpGy5RJH30Rstk3Qmt863m-hAEhXB4GXPQ8a-5IXls8ZQ5tt_STyfxQ/exec';
        var urlAtual = window.location.href || "";
        var urlParaRegistrar = urlAtual.replace('//m.dafiti.', '//www.dafiti.').split('?')[0].replace(/\/$/, "");

        console.log("%c>>> TENTANDO REGISTRAR VISUALIZAÇÃO...", "color: blue; font-weight: bold;", urlParaRegistrar);

        fetch(SCRIPT_URL_VISU + "?link=" + encodeURIComponent(urlParaRegistrar), {
            mode: 'no-cors',
            method: 'GET'
        })
        .then(function() {
            console.log("%c>>> SUCESSO NO REGISTRO!", "color: green; font-weight: bold;");
        })
        .catch(function(err) {
            console.error("%c>>> FALHA DO REGISTRO:", err);
        });
    } catch (error) {
        console.error("%c>>> ERRO NO SCRIPT:", error);
    }
})();

// --- FUNÇÃO ISOLADA PARA INICIALIZAR O FORMULÁRIO ---
function initForms() {
    console.log("Iniciando script do formulario...");
    
    var scriptURL = 'https://script.google.com/macros/s/AKfycbzb1iW-FELxofTtFn-s4FpHTh7P2Nyc7DyTdm446Be-u7gva_CKGI9bxWvmQSurtCIB9g/exec'; 
    var scope = document.querySelector('.form-co');
    
    if (!scope) {
        console.error("Erro: Elemento .form-co nao encontrado ao inicializar.");
        return;
    }

    if (scope.getAttribute('data-initialized') === "true") return;

    var staticForm = scope.querySelector('.js-form-static');
    var staticSubmitBtn = scope.querySelector('.js-submit-btn');
    var staticInputTel = scope.querySelector('.js-input-tel');
    var staticLoading = scope.querySelector('.js-loading');
    var staticModalSucesso = scope.querySelector('.js-modal-success');
    var staticCloseBtn = scope.querySelector('.js-close-modal');

    if (!staticSubmitBtn || !staticForm) {
        console.error("Error: Botón o formulario no encontrados.");
        return;
    }

    scope.setAttribute('data-initialized', 'true');

    // MÁSCARA (XXX XXX XXXX)
    if (staticInputTel) {
        // Corrigido para bater com os 12 caracteres máximos da máscara com espaço
        staticInputTel.setAttribute('maxlength', '12'); 

        staticInputTel.oninput = function() {
            let v = this.value.replace(/\D/g, ''); 
            if (v.length > 10) v = v.slice(0, 10);

            if (v.length > 6) {
                v = v.replace(/^(\d{3})(\d{3})(\d{1,4})/, "$1 $2 $3");
            } else if (v.length > 3) {
                v = v.replace(/^(\d{3})(\d{1,3})/, "$1 $2");
            }
            this.value = v;
        };
    }

    if (staticCloseBtn && staticModalSucesso) {
        staticCloseBtn.onclick = function() { staticModalSucesso.style.display = 'none'; };
    }

    staticSubmitBtn.onclick = function(e) {
        e.preventDefault();
        console.log("Botao enviar clicado.");
        
        var nomeField = staticForm.querySelector('input[name="nome"]');
        var emailField = staticForm.querySelector('input[name="email"]');

        if (!nomeField || !emailField) {
            alert("Error interno: Campos de entrada no encontrados.");
            return;
        }

        var nome = nomeField.value.trim();
        var email = emailField.value.trim();
        var telefone = staticInputTel ? staticInputTel.value.trim() : "";

        if (nome.length < 2) {
            alert("Por favor, ingrese seu nombre.");
            return;
        }

        if (!email.includes('@')) {
            alert("Por favor, ingrese un correo electrónico válido.");
            return;
        }

        if (telefone.length < 12) { 
            alert("Por favor, ingrese un número de teléfono válido de 10 dígitos.");
            return;
        }

        console.log("Validación aprobada. Enviando datos...");
        staticSubmitBtn.disabled = true;
        if (staticLoading) staticLoading.style.display = 'flex';

        var params = new URLSearchParams();
        params.append('nome', nome);
        params.append('email', email);
        params.append('telefone', telefone);
        params.append('origem', window.location.href);
        
        var dataColombia = new Intl.DateTimeFormat('fr-CA', { 
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
        .then(function() {
            console.log("Resposta recebida do Google.");
            if (staticLoading) staticLoading.style.display = 'none';
            if (staticModalSucesso) staticModalSucesso.style.display = 'flex';
            staticForm.reset();
        })
        .catch(function(err) {
            console.error("Erro no fetch:", err);
            alert("Error al enviar los datos. Inténtelo de nuevo.");
        })
        .finally(function() {
            setTimeout(function() { staticSubmitBtn.disabled = false; }, 3000);
        });
    };
}

// --- ESTRUTURA DE ESPERA DO CMS ---
var aguardarDivCmsFooter = setInterval(function() {
    if (document.querySelector('.dafitiStructureBlog')) {
        montarFooterDafiti();
        clearInterval(aguardarDivCmsFooter);
    }
}, 50);

setTimeout(function() {
    clearInterval(aguardarDivCmsFooter);
    montarFooterDafiti();
}, 4000);

// Função principal de montagem do Footer
function montarFooterDafiti() {
    if (document.querySelector('.footerMateria')) return;

    var dafitiFooterContainer = document.createElement('div');
    dafitiFooterContainer.className = 'footerMateria';

    // Nota: Mudei o name="numero" do input de telefone para name="telefone" para alinhar com o JS antigo se necessário, mas mantive a classe js-input-tel que é o principal.
    dafitiFooterContainer.innerHTML = 
        '<div class="boxWhite">' +
          '<div class="newsletter">' +
            '<div class="boxNewsLetter">' +
              '<h2 class="newsletter-title">¡Mantente al tanto!</h2>' +
              '<p class="newsletter-text">Regístrate para receber nuestras novedades y promociones:</p>' +
              '<div class="template-formulario-crm form-co">' +
                '<form class="custom-crm-form js-form-static" name="contact-form-static" data-campaign="footer-blog-co">' +
                  '<div class="flexInputs">' +
                    '<input type="text" name="nome" placeholder="Nombre" required="required"/> ' +
                    '<input type="email" name="email" placeholder="Correo electrónico" required="required"/> ' +
                    '<input class="js-input-tel" type="text" name="telefone" placeholder="Teléfono" required="required"/> ' +
                  '</div>' +
                  '<button class="submit js-submit-btn textCategoria" type="button">' +
                    '<p>registrarse</p>' +
                  '</button>' +
                '</form>' +
                '<div class="loadingCrm js-loading" style="display:none">' +
                  '<img class="imgLoading" src="https://static.dafiti.com.br/cms/black-dafiti/2024_10_16_09_38_20_kOnzy.gif"/>' +
                '</div>' +
                '<div class="modal-dados-crm js-modal-success" style="display:none">' +
                  '<div class="boxModal">' +
                    '<p class="textModal">Datos enviados con éxito</p>' +
                    '<button class="modal-fechar-crm js-close-modal">Cerrar</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="boxBlack">' +
          '<div class="box">' +
            '<img class="logotipoDafiti" src="https://static.dafiti.com.br/cms/2026_05_08_14_43_52_Group_26655415.png" alt="logotipo dafiti">' +
            '<div class="flexRedes">' +
              '<a href="https://www.instagram.com/dafiti_colombia/" target="_blank" rel="noopener"><img src="https://static.dafiti.com.br/cms/2026_05_08_14_43_54_ARTE.png" alt="Instagram"></a>' +
              '<a href="https://www.tiktok.com/@dafiti_colombia" target="_blank" rel="noopener"><img src="https://static.dafiti.com.br/cms/2026_05_08_14_43_54_ARTE_-1-.png" alt="TikTok"></a>' +
              '<a href="https://co.pinterest.com/dafiti_colombia/" target="_blank" rel="noopener"><img src="https://static.dafiti.com.br/cms/2026_05_08_14_43_51_Group_26655556.png" alt="Pinterest"></a>' +
            '</div>' +
            '<div class="flexInfos">' +
              '<a href="https://dafiticolombia.freshdesk.com/support/home" target="_blank" rel="noopener"><p>Sobre Dafiti</p></a>' +
              '<a href="https://dafiticolombia.freshdesk.com/support/solutions/151000107047" target="_blank" rel="noopener"><p>Contacto</p></a>' +
              '<a href="https://www.dafiti.com.co/" target="_blank" rel="noopener"><p>Ir a la tienda </p></a>' +
            '</div>' +
          '</div>' +
        '</div>';

    var targetContainer = document.querySelector('.dafitiStructureBlog');
    if (targetContainer) {
        targetContainer.appendChild(dafitiFooterContainer);
    } else {
        document.body.appendChild(dafitiFooterContainer);
    }

    initForms();
}