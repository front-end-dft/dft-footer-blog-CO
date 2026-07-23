document.querySelectorAll('.accordion-title').forEach(title => {
    title.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isOpen = this.getAttribute('aria-expanded') === 'true';

        document.querySelectorAll('.accordion-title').forEach(otherTitle => {
            if (otherTitle !== this) {
                otherTitle.setAttribute('aria-expanded', 'false');
                const otherContent = otherTitle.nextElementSibling;
                otherContent.style.maxHeight = '0';
                otherContent.classList.remove('is-open');
            }
        });

        if (!isOpen) {
            this.setAttribute('aria-expanded', 'true');
            content.classList.add('is-open');
            
            const totalHeight = content.scrollHeight + 50;
            content.style.maxHeight = totalHeight + "px";
        } else {
            this.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0';
            content.classList.remove('is-open');
        }
    });
});