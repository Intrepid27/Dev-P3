// Sélection des éléments du DOM
const form = document.querySelector('#formLogin');
const errorMessage = document.querySelector('.errorMessage');
const buttonLogin = document.querySelector('.login_button');

// Ajout de l'événement de clic pour le bouton de connexion
buttonLogin.addEventListener('click', (event) => {

    event.preventDefault();  

    // Récupération des valeurs du formulaire
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    // Création de l'objet de données pour la charge utile
    let dataForm = {
        email: emailInput,
        password: passwordInput
    };

    // Conversion de l'objet en JSON pour l'envoyer dans la requête
    const chargeUtile = JSON.stringify(dataForm);

    // Appel à l'API de connexion
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: chargeUtile
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();  
    })
    .then(data => {
        console.log('Réponse API:', data);  

        // Vérification si le token est présent dans la réponse
        if (data.token) {
            window.localStorage.setItem('token', data.token); 
            console.log('Token stocké:', window.localStorage.getItem('token'));  
            window.location.href = 'edit.html';  
        } else {
            // Affichage d'un message d'erreur si le token est absent
            errorMessage.innerHTML = "Erreur dans l'identifiant ou le mot de passe";
        }
    })
    .catch(error => {
        // Gestion des erreurs, y compris les erreurs réseau
        console.error('Erreur réseau ou serveur:', error);
        errorMessage.innerHTML = "Une erreur est survenue. Veuillez réessayer.";
    });
});
