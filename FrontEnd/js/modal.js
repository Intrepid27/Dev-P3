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

// Fonction pour supprimer une photo
async function deletePhoto(id) {
    const token = window.localStorage.getItem('token');
    if (!token) {
        alert('Vous devez être connecté pour supprimer une photo.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`  // Ajout du token dans les headers
            }
        });

        if (response.ok) {
            alert('Photo supprimée avec succès.');
            document.querySelector(`.figure-${id}`).remove();  // Retirer la photo de la galerie après suppression
        } else {
            const errorData = await response.json();
            console.error('Erreur HTTP:', response.status, response.statusText);
            console.log('Détails de l\'erreur:', errorData);
            alert(`Erreur ${response.status}: ${errorData.message || 'Problème lors de la suppression de la photo'}`);
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
        alert('Erreur de connexion au serveur.');
    }
}

// Affichage des données dans la modal avec bouton en haut à droite
function displayDataInModal() {
    fetchData().then(data => {
        galleryModal.innerHTML = ""; 
        data.forEach(work => {
            const figure = document.createElement("figure");
            figure.classList.add("image-container", `figure-${work.id}`);
            
            const imageWork = document.createElement("img");
            imageWork.src = work.imageUrl;
            imageWork.alt = "";  

            // Création du bouton "cacher" mais qui supprime en réalité
            const hideButton = document.createElement("button");
            hideButton.innerHTML ='<span class="material-symbols-outlined">delete</span>';
            hideButton.classList.add("hide-button");

            // Ajout d'un gestionnaire d'événements pour supprimer l'image au lieu de la masquer
            hideButton.addEventListener("click", () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
                    deletePhoto(work.id);  // Appel de la fonction deletePhoto avec l'ID de la photo
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

    // Récupération du token dans le localStorage
    const token = window.localStorage.getItem('token');
    console.log('Token récupéré:', token);  // Vérification de la récupération du token
    if (!token) {
        alert('Vous devez être connecté pour ajouter une photo.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`  // Ajout du token dans les headers
            },
            body: formData,
        });

        // Gestion de la réponse
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur HTTP:', response.status, response.statusText);
            console.log('Détails de l\'erreur:', errorData);
            alert(`Erreur ${response.status}: ${errorData.message || 'Problème lors de l\'ajout de la photo'}`);
        } else {
            alert('Photo ajoutée avec succès !');
            // Réinitialisation du formulaire après succès
            document.getElementById('photo-title').value = '';
            document.getElementById('photo-category').value = '';
            document.getElementById('photo-upload').value = null;
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

// ajout de la prévisualisation de l'image avant upload

function previewImage() {
    const file = document.getElementById('photo-upload').files[0];
    const preview = document.getElementById('image-preview');
    const label = document.querySelector('.photo-upload-label');
    const icon = document.querySelector('.add-photo-placeholder i');
    const text = document.querySelector('.add-photo-placeholder p');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block"; // Show the preview image
            label.style.display = "none"; // Hide the label
            icon.style.display = "none"; // Hide the icon
            text.style.display = "none"; // Hide the text
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        preview.style.display = "none"; // Hide the preview if no file
        label.style.display = "flex"; // Show the label again
        icon.style.display = "block"; // Show the icon again
        text.style.display = "block"; // Show the text again
    }
}


