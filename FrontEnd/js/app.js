const gallery= document.querySelector(".gallery")

// recuperation de catégories pour les boutons dynamique

async function fetchCategories () {
    const response = await fetch("http://localhost:5678/api/categories")
    return await response.json()
}
/* la fonction fetchCategorie permet d'appeler l'API pour recuperer dans ce cas les categories.
return nous permet d'avoir le retour de la fonction et await, l'attente de la resolution de la demande.
repsonseµ.json permet de recuperer cette reponse puis de la transformer en objet.  */



// création fonction pour récuperer les data (réutilisable mot clé export!!)

async function fetchData () {
    const response = await fetch("http://localhost:5678/api/works")
    return await response.json()
} /* Même cas que celui d'avant mais nous recuperon les data dans les works de l'api*/


// création du menu filtre

function resetGallery () {
    gallery.innerHTML = ""

}
/*création de la fonction resetGallery puis resetGallery sert à réinitialiser le contenu d'un élément HTML avec l'id gallery */



// création fonction pour filtrage du projet en fonction des catégories

function updateGallery (categories) { /* création fonction pour mettre a jour la gallery en fonction du parametre demandé soit categories*/
fetchData().then(data => { /* appel dela fonction fetchData, puis exection ed la fonction fléchée lors de la recuperation de la requette */
    //vidage de l'affichage des projets
    resetGallery() /* vide l'affichage de la gallery */
    data.forEach(work => { /* !!! */
        console.log(work) /* affichage de work dans la console */
       const workId = work.id /* assignement de work.id à la variable workId */
       if (categories === "all" || work.categoryId === categories) { /* verification que la catégorie en cours est bien celle selectionnée */
        const figure = document.createElement("figure"); /* création d'un element figure pour chaque travail */
        figure.classList.add('figure-${worksId}') /* cette ligne ajoute une classe css dynamique */
        // création de balise image et figcaption
        const imageWork = document.createElement("img")   /* création d'une balise img */
        imageWork.src = work.imageUrl      /* assignement des image et des titre*/    
        imageWork.alt = work.title

        const figcaption = document.createElement('figcaption');   /* création d'une balise figcaption */
        figcaption.innerText = work.title; 
        figure.appendChild(imageWork); /* ajout de image à figure */
        figure.appendChild(figcaption);/* ajout de figcaption à figure*/
        gallery.appendChild(figure);/* ajout de figure à gallery */
       }


    });
}).catch(error => {console.log("Error fetching data" + error)}) /* gestion des erreur lors de la recuperation des données */
}

updateGallery("all") /*appel de la fonction updateGallery avec le paramètre All */

// bouton filtre menu
function boutonCreateFiltreMenu () { /*fonction pour créer les bouton filtre */
    const filtreContainer = document.querySelector(".filter_container"); /* selection de la div pour  ajouter les boutons */
    const boutonAll = document.createElement("button"); /*création du bouton */
    boutonAll.classList.add("filtre-button"); /*ajout de la classe au bouton */
    boutonAll.innerHTML = "Tous"; /*création du texte pour le bouton */
    boutonAll.value = "all"; /*définition de la valeur du bouton */
    filtreContainer.appendChild(boutonAll); /*ajout du bouton a la div*/

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
