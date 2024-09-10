/* --- création du script Logout --- */

document.addEventListener('DOMContentLoaded', (event) => {
    const buttonLogout = document.querySelector('.nav_button');

    if (buttonLogout) {
        buttonLogout.addEventListener('click', (event) => {
            event.preventDefault(); 
           localStorage.setItem('token',"");
            window.location.href = 'login.html';
        });
    } else {
        console.log('Bouton de déconnexion non trouvé');
    }
});
