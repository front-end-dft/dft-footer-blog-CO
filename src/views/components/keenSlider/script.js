/* KeenSlider - Versão Inicialização Imediata (ES5) */

function fixAndDecode(str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    var decoded = div.textContent || div.innerText;
    return decoded.replace(/([{,]\s*)([a-zA-Z0-9\-_().:\s]+?)(\s*):/g, '$1"$2":');
}

document.querySelectorAll(".keen-slider").forEach(function (sliderElem) {
    var animationType = sliderElem.getAttribute("data-animation-type");
    var autoplay = sliderElem.getAttribute("data-autoplay") === "true";
    var isPaused = false;

    var bpAttr = sliderElem.getAttribute("data-breakpoints");
    var bpParsed = undefined;
    if (bpAttr) {
        try { bpParsed = JSON.parse(fixAndDecode(bpAttr)); } catch (e) {}
    }

    var options = {
        loop: sliderElem.getAttribute("data-loop") === "true",
        drag: animationType ? false : true,
        slides: {
            perView: Number(sliderElem.getAttribute("data-per-view")) || 1,
            spacing: Number(sliderElem.getAttribute("data-spacing")) || 0
        },
        breakpoints: bpParsed,
        renderMode: sliderElem.getAttribute("data-render-mode") || "performance"
    };

    // Inicializa o slider
    var slider = new KeenSlider(sliderElem, options, [navigationPlugin]);

    // --- ANIMAÇÃO MARQUEE (IMEDIATA) ---
    if (animationType) {
        var animCfg = { duration: 5000, easing: function(t) { return t; } };
        
        var run = function() {
            if (isPaused || !slider.track) return;
            slider.moveToIdx(slider.track.details.abs + 1, true, animCfg);
        };

        // Hooks de continuidade
        slider.on("animationEnded", run);
        slider.on("updated", run);

        // Hover: para e retoma na hora
        sliderElem.addEventListener("mouseenter", function() {
            isPaused = true;
            if (slider.animator) slider.animator.stop();
        });

        sliderElem.addEventListener("mouseleave", function() {
            isPaused = false;
            run(); 
        });

        // DISPARO IMEDIATO: Não espera o evento 'created' se o slider já existir
        setTimeout(run, 50); 
    } 
    
    // --- AUTOPLAY PADRÃO ---
    else if (autoplay) {
        var interval = setInterval(function() {
            if (!isPaused) slider.next();
        }, 5000);
        
        sliderElem.addEventListener("mouseenter", function() { isPaused = true; });
        sliderElem.addEventListener("mouseleave", function() { isPaused = false; });
        slider.on("destroyed", function() { clearInterval(interval); });
    }

    // --- LOGICA DE IMAGENS ---
    var box = sliderElem.querySelector('.boxLoading');
    if (box) {
        var imgs = Array.from(sliderElem.querySelectorAll('img')).filter(function(i){ return !i.closest('.ks-arrow'); });
        var count = 0;
        var done = function() {
            count++;
            if (count >= imgs.length) {
                box.classList.add('zoomOut');
                setTimeout(function() { if(box.parentNode) box.parentNode.removeChild(box); }, 500);
            }
        };
        if (imgs.length === 0) done();
        else imgs.forEach(function(img) { if (img.complete) done(); else { img.addEventListener('load', done); img.addEventListener('error', done); } });
    }
});

function navigationPlugin(slider) {
    var arrowLeft = slider.container.querySelector(".ks-arrow--prev");
    var arrowRight = slider.container.querySelector(".ks-arrow--next");
    var dots = slider.container.querySelector(".ks-dots");

    function update() {
        var idx = slider.track.details.rel;
        if (dots) {
            Array.from(dots.children).forEach(function(d, i) {
                d.classList.toggle("ks-dot--active", i === idx);
            });
        }
    }

    slider.on("created", function() {
        if (arrowLeft) arrowLeft.onclick = function() { slider.prev(); };
        if (arrowRight) arrowRight.onclick = function() { slider.next(); };
        if (dots) {
            dots.innerHTML = "";
            slider.track.details.slides.forEach(function(_, i) {
                var b = document.createElement("button");
                b.className = "ks-dot";
                b.onclick = function() { slider.moveToIdx(i); };
                dots.appendChild(b);
            });
        }
        update();
    });
    slider.on("slideChanged", update);
}