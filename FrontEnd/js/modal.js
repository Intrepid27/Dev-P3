
/* ouverture et fermeture de la modal */

let modal = null;

const openModal = function (e) {
    e.preventDefault();

    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
}

const closeModal = function (e) {
    if (modal === null) return ;
    e.preventDefault()
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal = null ;
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
    
});

/* intégration des elements gallery dans la modal */

const galleryModal = document.querySelector(".gallery-modal");

async function fetchData() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}

function displayDataInModal() {
    fetchData().then(data => {
        galleryModal.innerHTML = ""; // Réinitialiser le contenu du modal
        data.forEach(work => {
            const figure = document.createElement("figure");
            const imageWork = document.createElement("img");
            imageWork.src = work.imageUrl;
            imageWork.alt = work.title;

            // Suppression du figcaption pour ne pas afficher le titre
            // const figcaption = document.createElement('figcaption');
            // figcaption.innerText = work.title;
            // figure.appendChild(figcaption);

            figure.appendChild(imageWork);
            galleryModal.appendChild(figure);
        });
    }).catch(error => {
        console.error("Error fetching data:", error);
    });
}

displayDataInModal(); // Appelle la fonction pour afficher les données dans le modal


