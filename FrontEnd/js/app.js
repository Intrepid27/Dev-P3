const gallery= document.querySelector(".gallery")

fetch("http://localhost:5678/api/works").then(reponse=> reponse.json()).then(data=> {
    let donnee= data
    gallery.innerHTML= ""

    for(let i= 0; i< data.length; i++){
    
        let figure = document.createElement ("figure")
        let image = document.createElement ("img")
        let figcaption = document.createElement ("figcaption")

        let figcaption_texte = document.createTextNode(data[i].title)
        figcaption.appendChild(figcaption_texte)
        figure.appendChild(figcaption)

        // attribution des elements pour nos ellements images
        image.src = data[i].imageUrl
        figure.appendChild(image)


        gallery.appendChild(figure)
    }


})
