const gallery= document.querySelector(".gallery")

fetch("http://localhost:5678/api/works").then(reponse=> reponse.json()).then(data=> {
    let donnee= data
    gallery.innerHTML= ""

    for(let i= 0; i< data.length; i++){
        console.log (data[i].title)
    }
})