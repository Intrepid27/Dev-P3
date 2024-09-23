/* ouverture et fermeture de la modal */

let modal = null;

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    
    modal.addEventListener('click', closeModalOutside);

    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
};

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    
    modal.removeEventListener('click', closeModalOutside);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal = null;
};

// Fonction fermeture modal en cliquant à l'extérieur
const closeModalOutside = function (e) {
    if (e.target === modal) {
        closeModal(e);
    }
};

// Ouvrir la modal 2 depuis la modal 1
document.getElementById('open-modal2').addEventListener('click', function () {
    document.getElementById('modal1').style.display = "none"; 
    document.getElementById('modal2').style.display = null;  
    document.getElementById('modal2').setAttribute('aria-modal', 'true');
    modal = document.getElementById('modal2');  
    modal.addEventListener('click', closeModalOutside);
});

// Retour à la modal 1 depuis la modal 2
document.getElementById('back-to-modal1').addEventListener('click', function () {
    document.getElementById('modal2').style.display = "none"; 
    document.getElementById('modal1').style.display = null;   
    document.getElementById('modal1').setAttribute('aria-modal', 'true');
    modal = document.getElementById('modal1');  
    modal.addEventListener('click', closeModalOutside);
});

// Add event listener to close modal 2
document.getElementById('modal2').querySelector('.js-modal-close').addEventListener('click', function () {
    document.getElementById('modal2').style.display = "none";
    document.getElementById('modal2').setAttribute('aria-hidden', 'true');
    document.getElementById('modal2').removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModalOutside);
    modal = null;
});

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

// intégration des éléments gallery dans la modal

const galleryModal = document.querySelector(".gallery-modal");

async function fetchData() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}

// Affichage des données dans la modal avec bouton en haut à droite
function displayDataInModal() {
    fetchData().then(data => {
        galleryModal.innerHTML = ""; 
        data.forEach(work => {
            const figure = document.createElement("figure");
            figure.classList.add("image-container");
            
            const imageWork = document.createElement("img");
            imageWork.src = work.imageUrl;
            imageWork.alt = "";  

            // Création du bouton de suppression
            const hideButton = document.createElement("button");
            hideButton.innerHTML ='<span class="material-symbols-outlined">delete</span>';
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

            // Ajout des éléments dans la figure
            figure.appendChild(imageWork);
            figure.appendChild(hideButton);
            galleryModal.appendChild(figure);
        });
    }).catch(error => {
        console.error("Error fetching data:", error);
    });
}

displayDataInModal(); 

//* ajout photo avec fetch et gestion des erreurs détaillée *//

document.getElementById('validate-photo').addEventListener('click', async function () {
    const photoFile = document.getElementById('photo-upload').files[0];
    const title = document.getElementById('photo-title').value;
    const category = document.getElementById('photo-category').value;

    // Vérification du fichier et des champs
    if (!photoFile) {
        alert('Veuillez ajouter une photo.');
        return;
    }
    if (!title) {
        alert('Veuillez ajouter un titre.');
        return;
    }
    if (!category) {
        alert('Veuillez sélectionner une catégorie.');
        return;
    }

    // Vérification des types de fichier autorisés
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedFileTypes.includes(photoFile.type)) {
        alert('Veuillez sélectionner un fichier image valide (JPEG, PNG ou GIF).');
        return;
    }

    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('title', title);
    formData.append('category', category);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
        });

        // Gestion de la réponse
        if (response.ok) {
            const result = await response.json();
            alert('Photo ajoutée avec succès !');
            console.log('Response:', result);

            // Réinitialisation du formulaire après succès
            document.getElementById('photo-title').value = '';
            document.getElementById('photo-category').value = '';
            document.getElementById('photo-upload').value = null;
        } else {
            // Affichage du statut HTTP pour diagnostiquer l'erreur
            console.error('Erreur HTTP:', response.status, response.statusText);
            alert(`Une erreur est survenue lors de l'ajout de la photo. Statut: ${response.status}`);
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
        alert('Erreur de connexion au serveur.');
    }
});

// récupération des catégories pour modal 2

async function fetchCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
    }
    return await response.json();
}

async function populateCategorySelect() {
    const categorySelect = document.getElementById('photo-category');
    categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';

    try {
        const categories = await fetchCategories(); 

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

document.getElementById('open-modal2').addEventListener('click', function () {
    populateCategorySelect(); 
});
