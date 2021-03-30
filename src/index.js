let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      document.querySelector('div form').addEventListener('submit',addNewToy)
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys()
  document.querySelector('#toy-collection').addEventListener('click', editToy)
});


//fetch to GET
function getToys() {
  fetch('http://localhost:3000/toys')
  .then( response => response.json())
  .then( data => {
    const toyCollection = document.getElementById('toy-collection')
    toyCollection.innerHTML = renderAllToys(data)
  })
}

function renderAllToys(toyArry) {
  return toyArry.map(toy => renderIndividualInfo(toy)).join('')
}

function renderIndividualInfo(toy) {
  return `
  <div class="card" id=${toy.id}> 
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar">
    <p>${toy.likes}</p>
    <button class="like-btn" > like </button>
  </div>
  `
}

//fetch to POST
function addNewToy(event) {
  event.preventDefault()
  console.log('adding')
  
  const toyInfo = {
    name: document.querySelector('form input').value,
    "image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
    "likes": 0
  } 

  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body:JSON.stringify(toyInfo)
  })
  .then(resp => resp.json())
  .then(data => {
    const toyCollection = document.getElementById('toy-collection')
    toyCollection.innerHTML += renderIndividualInfo(data)

  })
}


//Increase Toy's Likes
function editToy(event) {
  console.log(event.target)
  let currentLikes = parseInt(event.target.parentElement.querySelector('p').innerText)
  fetch(`http://localhost:3000/toys/${event.target.parentElement.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body:JSON.stringify({
      "likes": ++currentLikes
    })
  })
  .then(resp => resp.json())
  .then(data => {
    console.log(data)
    event.target.parentElement.querySelector('p').innerText = currentLikes
  })
}