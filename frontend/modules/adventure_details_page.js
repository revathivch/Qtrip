import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const params = new URLSearchParams(search);
  const adventureId = params.get('adventure');
  return adventureId;

  // Place holder for functionality to work in the Stubs
  return null;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  try{
    const result = await fetch(config.backendEndpoint + `/adventures/detail?adventure=${adventureId}`);
    const adventureDetails = await result.json();
    return  adventureDetails;
  }catch(e){
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
  const nameEle = document.getElementById("adventure-name");
  nameEle.textContent = `${adventure.name}`;

  const subtitleEle = document.getElementById("adventure-subtitle");
  subtitleEle.textContent = `${adventure.subtitle}`;

  const contentEle = document.getElementById("adventure-content");
  contentEle.textContent = `${adventure.content}`;

  const imageEle = document.getElementById("photo-gallery");
  adventure.images.forEach((item) => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = item;
    img.alt = 'Adventure Image';
    img.className = 'activity-card-image';
    div.appendChild(img);
    imageEle.appendChild(div);
  });


}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images
  const imageEle = document.getElementById("photo-gallery");

  imageEle.innerHTML = '';

  const carousel = document.createElement('div');
  carousel.id = 'adventureCarousel';
  carousel.className = 'carousel slide';
  carousel.setAttribute('data-bs-ride', 'carousel');

  // Create carousel-inner element
  const carouselInner = document.createElement('div');
  carouselInner.className = 'carousel-inner';

  // Loop through images and create carousel items
  images.forEach((item, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.className = index === 0 ? 'carousel-item active' : 'carousel-item'; // Set first item as active

    const img = document.createElement('img');
    img.src = item;
    img.alt = 'Adventure Image';
    img.className = 'd-block w-100'; // Bootstrap class for responsive image

    carouselItem.appendChild(img);
    carouselInner.appendChild(carouselItem);
  });

  // Add carousel controls (optional)
  const prevControl = `
    <button class="carousel-control-prev" type="button" data-bs-target="#adventureCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>`;
  
  const nextControl = `
    <button class="carousel-control-next" type="button" data-bs-target="#adventureCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>`;

  // Append carousel-inner and controls to the carousel div
  carousel.appendChild(carouselInner);
  carousel.innerHTML += prevControl + nextControl;

  // Append the carousel to the photo-gallery element
  imageEle.appendChild(carousel);

}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.

  //Visibilty hidden doesn't remove the space theat the item takes from DOM, that is why we are using display:none
  if(adventure.available){
    document.getElementById("reservation-panel-available").style.display = "block";
    document.getElementById("reservation-panel-sold-out").style.display = "none";
    document.getElementById("reservation-person-cost").innerHTML = adventure.costPerHead;
  }
  else{
    document.getElementById("reservation-panel-available").style.display = "none";
    document.getElementById("reservation-panel-sold-out").style.display = "block";
  }
  
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  document.getElementById("reservation-cost").innerHTML = persons * adventure.costPerHead;

}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
  const form = document.getElementById("myForm");
  form.addEventListener("submit", async(event)=>{
    event.preventDefault();
    let url = config.backendEndpoint + "/reservations/new";

    let formElements = form.elements;
    let bodyString = JSON.stringify({
      name: formElements["name"].value,
      date: formElements["date"].value,
      person: formElements["person"].value,
      adventure: adventure.id,
    })

    try{
      let res = await fetch(url, {
        method: "POST",
        body: bodyString,
        headers:{
          "Content-type": "application/json",
        },
      });

      if(res.ok){
        alert("Success!");
        window.location.reload();
      }else{
        let data = await res.json();
        alert(`Failed - ${data.message}`);
      }
    }catch(err){
      console.log(err);
      alert("Failed - fetch call resulted in error");
    }

  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  if(adventure.reserved){
    document.getElementById("reserved-banner").style.display = "block";
  }else{
    document.getElementById("reserved-banner").style.display = "none";
  }

}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
