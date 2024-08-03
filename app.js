// Global variables
const jobs = document.getElementById("jobs"); // Container element to display job cards
const filters = document.querySelectorAll(".tags btn"); // All filter buttons in the job cards
const clearFiltersBtn = document.getElementById("clear-filter"); // Button to clear all applied filters
let jobData = []; // Array to store all job data fetched from the server
var filter = []; // Array to store currently applied filters

// Event listener for clearing all filters
clearFiltersBtn.addEventListener("click", removeAllFilter);

// Function to load jobs from a JSON file initially
function loadJobs() {
    fetch('./data.json') // Fetch data from JSON file
    .then((response) => response.json()) // Convert response to JSON
    .then((json) => { 
        jobData = json; // Store the job data in jobData array
        renderJobs(); // Render the job cards
    });
}

// Function to render job cards based on applied filters
function renderJobs() {
    jobs.innerHTML = ""; // Clear existing job cards
    jobData.forEach(job => {
        // If no filters are applied or job matches all filters, create and append the card
        if (filter.length === 0 || filter.every(f => job.languages.includes(f))) {
            jobs.appendChild(createCardElement(job));
        }
    });
}

// Function to create a job card element
function createCardElement(cardData){
    const card = document.createElement("div"); // Create card container
    card.classList.add("job", "flex-wrap"); // Add necessary classes

    // Create inner HTML structure for the card
    const cardContent = `
      <div class="job__info">
        <div class="job__img">
          <img src=${cardData.logo} alt="" srcset="">
        </div>
        <div class="job__content">
          <div class="job__company | d-flex align-items-center gap-400">
            <a class="job__title" href="#">${cardData.company}</a>
          </div>
          <a class="job__pos" href="#">${cardData.position}</a>
          <hr class="hr d-block-sm">
          <div class="d-flex">
            <p class="job_det">1d ago</p>
            <p class="job_det">Full Time</p>
            <p class="job_det">USA only</p>
          </div>
        </div>
      </div>
      <div class="tags | d-flex gap-400">
      </div>
    `;
    
    card.innerHTML = cardContent; // Set the inner HTML of the card
    const tags = card.querySelector(".tags"); // Get the tags container
    const company = card.querySelector(".job__company"); // Get the company element
    
    // Add "New!" label if the job is new
    if(cardData.new === true){
        company.insertAdjacentHTML("beforeend",
            `<p class="job__status job__status--featured">New!</p>`
        );
    }
    
    // Add "Featured" label and additional styling if the job is featured
    if(cardData.featured === true){
        company.insertAdjacentHTML("beforeend",
            `<p class="job__status job__status--new">Featured</p>`
        );
        card.classList.add("job--featured"); // Add featured class to card
    }
    
    // Add language tags and event listeners for each language
    for (const key in cardData.languages) {
        tags.insertAdjacentHTML("beforeend",
            `<button class="btn job-lang">${cardData.languages[key]}</button>`
        );
    } 
    tags.querySelectorAll(".btn").forEach(element => {
        element.addEventListener("click", event => {
            addFilter(element.textContent); // Add filter on button click
        });
    });
    
    return card; // Return the created card element
}

// Function to create a filter element in the filter bar
function createFilterElement(filterData){
    const filterHolder = document.createElement("li"); // Create list item for filter
    filterHolder.classList.add("filter-op"); // Add necessary classes

    // Create inner HTML for filter element
    const filterContent = `
                    <span class="filter__tag">${filterData}</span>
                    <button class="filter__remove" data-lang=${filterData}>
                        <img src="./images/icon-remove.svg" alt="" srcset="">
                    </button>
                    `;
    filterHolder.innerHTML = filterContent; // Set inner HTML of filter element
    const remove  = filterHolder.querySelector(".filter__remove"); // Get the remove button
    remove.addEventListener("click", event => {
        removeFilter(event.currentTarget.getAttribute("data-lang")); // Remove filter on button click
    });
    
    return filterHolder; // Return the created filter element
}

// Function to add a filter to the filter bar
function addFilter(newFilter){
    if (!filter.includes(newFilter)){
        const filterSection = document.getElementById("filter-tags"); // Get filter tags container
        filterSection.parentElement.classList.remove("opacity-0"); // Show filter bar if hidden
        filterSection.appendChild(createFilterElement(newFilter)); // Add new filter element
        filter.push(newFilter); // Add filter to the filter array
        renderJobs(); // Render job cards based on new filters
    }
}

// Function to remove a specific filter from the filter bar
function removeFilter(newFilter){
    const filterSection = document.getElementById("filter-tags"); // Get filter tags container
    const filterElemnt = filterSection.querySelector('[data-lang="'+newFilter+'"]'); // Find the filter element to remove
    filterSection.removeChild(filterElemnt.parentElement); // Remove the filter element
    const index = filter.indexOf(newFilter); // Find index of filter in array
    if (index !== -1) {
        filter.splice(index, 1); // Remove filter from array
        if(filter.length === 0){
            filterSection.parentElement.classList.add("opacity-0"); // Hide filter bar if no filters
        }
        renderJobs(); // Render job cards based on updated filters
    }
}

// Function to remove all filters from the filter bar
function removeAllFilter(){
    const filterSection = document.getElementById("filter-tags"); // Get filter tags container
    filterSection.innerHTML = ""; // Clear all filter elements
    filter = [] // Reset filter array
    filterSection.parentElement.classList.add("opacity-0"); // Hide filter bar
    renderJobs(); // Render all job cards
}

// Initialize by loading jobs
loadJobs(); // Fetch job data and render job cards
