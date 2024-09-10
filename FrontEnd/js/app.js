const gallery= document.querySelector(".gallery")

// recuperation de catégories pour les boutons dynamique

async function fetchCategories () {
    const response = await fetch("http://localhost:5678/api/categories")
    return await response.json()
}


// création fonction pour récuperer les data (réutilisable mot clé export!!)

async function fetchData () {
    const response = await fetch("http://localhost:5678/api/works")
    return await response.json()
} 


// création du menu filtre

function resetGallery () {
    gallery.innerHTML = ""

}



// création fonction pour filtrage du projet en fonction des catégories

function updateGallery (categories) { 
fetchData().then(data => { 
    //vidage de l'affichage des projets
    resetGallery() 
    data.forEach(work => { 
        console.log(work) 
       const workId = work.id 
       if (categories === "all" || work.categoryId === categories) { 
        const figure = document.createElement("figure"); 
        figure.classList.add('figure-${worksId}') 
        // création de balise image et figcaption
        const imageWork = document.createElement("img")   
        imageWork.src = work.imageUrl         
        imageWork.alt = work.title

        const figcaption = document.createElement('figcaption');   
        figcaption.innerText = work.title; 
        figure.appendChild(imageWork); 
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
       }


    });
}).catch(error => {console.log("Error fetching data" + error)}) 
}

updateGallery("all") 

// bouton filtre menu
function boutonCreateFiltreMenu () { 
    const filtreContainer = document.querySelector(".filter_container"); 
    const boutonAll = document.createElement("button"); 
    boutonAll.classList.add("filtre-button"); 
    boutonAll.innerHTML = "Tous"; 
    boutonAll.value = "all"; 
    filtreContainer.appendChild(boutonAll); 

    boutonAll.addEventListener("click", function(){  /* ajout de l'evenement click au bouton*/
        updateGallery("all"); /*appekl de la fonction pour tous afficher lorsque All est cliqué*/
    })

    fetchCategories().then( /*recuperation des catégorie via fetch */
        categories => {
            categories.forEach(category =>{ /*parcours de toutes les catégorie recuperées */
                console.log(category) /*affichage de chaque catégorie dans la console */
                const filtreButton = document.createElement("button"); /* création d'un bouton pour chaque catégorie */
                filtreButton.classList.add("filtre-button"); /*ajout de la classe au bouton */
                filtreButton.innerHTML = category.name;/*ajout du texte pour les boutons */
                filtreButton.value = category.id; /*definition de la valeur des boutons */
                filtreContainer.appendChild(filtreButton); /*ajout des bouton au container filtre */
                // appel fonction pour filtrage au click
                filtreButton.addEventListener("click", function(){ /*ajout de l'événement click à chaque bouton */
                    const categoryId = category.id; /* récuperation de l'identifiant de la catégorie*/
                    if (categoryId === "all") { /*vérification si la catégorie selectionnée est all */
                        updateGallery("all"); /*MAJ sur tous si all selectionné */
                    } 
                    else {
                        updateGallery(categoryId); /*sinon afficher la catégotie selectionnée */
                    }
                })
            })
        }
    ).catch(error => console.log(error)) /*gestion des erreurs qui pourrais cubvenir lors de la récuperation */
}

boutonCreateFiltreMenu() /*appel de la fonction  */
