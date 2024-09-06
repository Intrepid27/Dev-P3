
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
            
            figure.appendChild(imageWork);
            galleryModal.appendChild(figure);
        });
    }).catch(error => {
        console.error("Error fetching data:", error);
    });
}

displayDataInModal(); 

/* création des bouton pour rendre invisible les photos */

function displayDataInModal() {
    fetchData().then(data => {
        galleryModal.innerHTML = ""; 
        data.forEach(work => {
            const figure = document.createElement("figure");
            const imageWork = document.createElement("img");
            imageWork.src = work.imageUrl;
            imageWork.alt = work.title;
            
            // Création du bouton de suppression
            const hideButton = document.createElement("button");
            hideButton.innerText = "Cacher";
            hideButton.classList.add("hide-button");

            // Ajout d'un gestionnaire d'événements pour masquer l'image dans la modal et la galerie
            hideButton.addEventListener("click", () => {
                // Masquer l'image dans la modal
                figure.style.display = "none"; 

                // Masquer l'image dans la galerie principale
                const figureInGallery = document.querySelector(`.figure-${work.id}`);
                if (figureInGallery) {
                    figureInGallery.style.display = "none";
                }
            });

            figure.appendChild(imageWork);
            figure.appendChild(hideButton); 
            galleryModal.appendChild(figure);
        });
    }).catch(error => {
        console.error("Error fetching data:", error);
    });
}
