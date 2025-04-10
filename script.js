const jobList = document.getElementById("job-list");
const jobTypeSelect = document.getElementById("job-type");
const clearFiltersButton = document.getElementById("clear-filters");
const showMoreButton = document.getElementById("show-more");

let jobs = [];
let currentJobCount = 0;

async function loadJobs() {
    const response = await fetch("https://api.example.com/jobs"); // тут API
    jobs = await response.json();
    displayJobs(); //загрузка вакансий
}

function displayJobs() {
    const jobType = jobTypeSelect.value;
    const filteredJobs = jobType ? jobs.filter(job => job.type === jobType) : jobs;

    const jobsToShow = filteredJobs.slice(0, currentJobCount + 5);
    jobList.innerHTML = ''; // Очищаем список, чтобы избежать дублирования
    jobsToShow.forEach(job => {
        const jobItem = document.createElement("article");
        jobItem.className = "job-item";

        jobItem.innerHTML = `
            <h2 class="job-title">${job.title}</h2>
            <p class="job-description">${job.description.substring(0, 100)}... <button class="more-details">Больше деталей</button></p>
            <p class="job-location">${job.location}</p>
            <p class="job-salary">Зарплата: ${job.salary}</p>
        `;
        
        const descriptionElement = jobItem.querySelector(".job-description");
        const moreDetailsButton = jobItem.querySelector(".more-details");
        
        moreDetailsButton.addEventListener("click", () => {
            descriptionElement.classList.toggle("expanded");
            moreDetailsButton.innerText = descriptionElement.classList.contains("expanded") ? "Скрыть" : "Больше деталей";
        });

        jobList.appendChild(jobItem);
    });

    if (jobsToShow.length >= filteredJobs.length) {
        showMoreButton.style.display = 'none'; // скрыть кнопку, если вакансий больше нет
    } else {
        showMoreButton.style.display = 'block'; // показать кнопку
    }
}

jobTypeSelect.addEventListener("change", () => {
    currentJobCount = 0; // сбрасываем счётчик при новом фильтре
    displayJobs();
});

clearFiltersButton.addEventListener("click", () => {
    jobTypeSelect.value = ''; // очистка поля фильтра
    currentJobCount = 0;
    displayJobs();
});

showMoreButton.addEventListener("click", () => {
    currentJobCount += 5; // увеличиваем количество отображаемых вакансий на 5
    displayJobs();
});

window.onload = loadJobs; // загрузка вакансий при загрузке страницы
function updateURL() {    //обновление URL
    const params = new URLSearchParams(window.location.search);
    params.set('jobType', jobTypeSelect.value);
    params.set('currentJobCount', currentJobCount);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}

jobTypeSelect.addEventListener("change", () => {  //обновление типа вакансий
    currentJobCount = 0;
    displayJobs();
    updateURL();
});

clearFiltersButton.addEventListener("click", () => {  //чистка фильтров
    jobTypeSelect.value = ''; 
    currentJobCount = 0;
    displayJobs();
    updateURL();
});

showMoreButton.addEventListener("click", () => {  //показать больше
    currentJobCount += 5;
    displayJobs();
    updateURL();
});
// при загрузки страницы
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('jobType')) {
        jobTypeSelect.value = params.get('jobType');
    }
    if (params.has('currentJobCount')) {
        currentJobCount = parseInt(params.get('currentJobCount'), 10);
    }
    loadJobs();
}
