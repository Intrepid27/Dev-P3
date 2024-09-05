/* --- création du script Logout --- */

document.addEventListener('DOMContentLoaded', (event) => {
    const buttonLogout = document.querySelector('.nav_button');

    if (buttonLogout) {
        buttonLogout.addEventListener('click', (event) => {
            event.preventDefault(); // Stop l'action par défaut

            // Rediriger l'utilisateur vers la page de connexion ou d'accueil
            window.location.href = 'index.html';
        });
    } else {
        console.log('Bouton de déconnexion non trouvé');
    }
});
