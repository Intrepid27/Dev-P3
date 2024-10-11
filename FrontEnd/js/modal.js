const token = window.localStorage.getItem('token'); // Récupération du token depuis le localStorage

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

const closeModalOutside = function (e) {
    if (e.target === modal) {
        closeModal(e);
    }
};

document.getElementById('open-modal2').addEventListener('click', function () {
    document.getElementById('modal1').style.display = "none"; 
    document.getElementById('modal2').style.display = null;  
    document.getElementById('modal2').setAttribute('aria-modal', 'true');
    modal = document.getElementById('modal2');  
    modal.addEventListener('click', closeModalOutside);

    // Appel de la fonction pour peupler les catégories
    populateCategorySelect(); 
});

document.getElementById('back-to-modal1').addEventListener('click', function () {
    document.getElementById('modal2').style.display = "none"; 
    document.getElementById('modal1').style.display = null;   
    document.getElementById('modal1').setAttribute('aria-modal', 'true');
    modal = document.getElementById('modal1');  
    modal.addEventListener('click', closeModalOutside);
});

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

const galleryModal = document.querySelector(".gallery-modal");

async function fetchData() {
    console.log('Fetching data...');
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    console.log('Data fetched:', data); // Ajout de log pour voir les données récupérées
    return data;
}

function displayDataInModal() {
    fetchData().then(data => {
        galleryModal.innerHTML = ""; 
        data.forEach(work => {
            const figure = document.createElement("figure");
            figure.classList.add("image-container", `figure-${work.id}`);
            
            const imageWork = document.createElement("img");
            imageWork.src = work.imageUrl;
            imageWork.alt = work.title;

            const hideButton = document.createElement("button");
            hideButton.innerHTML ='<span class="material-symbols-outlined">delete</span>';
            hideButton.classList.add("hide-button");

            hideButton.addEventListener("click", () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
                    deletePhoto(work.id);
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

displayDataInModal();

// Ajout de logs lors de l'ajout de photo
document.getElementById('validate-photo').addEventListener('click', async function () {
    const photoFile = document.getElementById('photo-upload').files[0]; // Le fichier image
    const title = document.getElementById('photo-title').value; // Titre de la photo
    const categoryId = document.getElementById('photo-category').value; // Catégorie sélectionnée

    // Vérification des champs avant l'envoi
    if (!photoFile) {
        alert('Veuillez ajouter une photo.');
        return;
    }
    if (!title) {
        alert('Veuillez ajouter un titre.');
        return;
    }
    if (!categoryId) {
        alert('Veuillez sélectionner une catégorie.');
        return;
    }

    // Création de l'objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('image', photoFile); // Image envoyée sous forme binaire
    formData.append('title', title); // Titre de la photo
    formData.append('categoryId', categoryId); // ID de la catégorie sous forme d'entier

    // Log des données envoyées pour déboguer
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    }

    const token = window.localStorage.getItem('token'); 
    if (!token) {
        alert('Vous devez être connecté pour ajouter une photo.');
        return;
    }

    // Envoi des données au serveur via fetch
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` // En-tête avec le token
            },
            body: formData // Envoi du FormData avec l'image et les autres champs
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur HTTP:', response.status, response.statusText);
            console.log('Détails de l\'erreur:', errorData);
            alert(`Erreur ${response.status}: ${errorData.message || 'Problème lors de l\'ajout de la photo'}`);
        } else {
            alert('Photo ajoutée avec succès !');
            displayDataInModal(); // Actualisation de la galerie après l'ajout
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
        alert('Erreur de connexion au serveur.');
    }
});

// Fonction pour récupérer et afficher les catégories dans le formulaire d'ajout de photo
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
        console.error('Erreur lors de la récupération des catégories:', error);
    }
}

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
            preview.style.display = "block"; 
            label.style.display = "none"; 
            icon.style.display = "none"; 
            text.style.display = "none"; 
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        preview.style.display = "none"; 
        label.style.display = "flex"; 
        icon.style.display = "block"; 
        text.style.display = "block"; 
    }
}
