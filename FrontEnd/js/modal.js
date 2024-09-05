const openModal = function (e) {
    e.preventDefaut()

    const target = document.querySelector(e.target.getAttibute('href'));
    target.style.display = null;
    target.removeAttribue('aria-hidden');
    target.setAttribute('aria-modal', true);
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
    
});
