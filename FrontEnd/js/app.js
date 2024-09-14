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

    boutonAll.addEventListener("click", function(){  
        updateGallery("all"); 
    })

    fetchCategories().then( 
        categories => {
            categories.forEach(category =>{ 
                console.log(category) 
                const filtreButton = document.createElement("button"); 
                filtreButton.classList.add("filtre-button"); 
                filtreButton.innerHTML = category.name;
                filtreButton.value = category.id; 
                filtreContainer.appendChild(filtreButton); 
                // appel fonction pour filtrage au click
                filtreButton.addEventListener("click", function(){ 
                    const categoryId = category.id; 
                    if (categoryId === "all") { 
                        updateGallery("all"); 
                    } 
                    else {
                        updateGallery(categoryId); 
                    }
                })
            })
        }
    ).catch(error => console.log(error)) 
}

boutonCreateFiltreMenu() 
