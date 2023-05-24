document.addEventListener("DOMContentLoaded", function() {

  const apiKey = '1fd65e6713c363478e61f304b4572c63';
  const weatherInputForm = document.getElementById('weather-input-form');
  const cityInput = document.getElementById('city-input');
  const timeDiv = document.getElementById("time");
  const greetingDiv = document.getElementById("greeting");
  const greetingSpan = document.getElementById("greeting-message");
  const weatherDiv = document.getElementById('weather');
  const cityDiv = document.getElementById('city');
  const iconDiv = document.getElementById('icon');
  const body = document.querySelector('body');
  const nameForm = document.getElementById("name-form");
  const nameInput = document.getElementById('name-input');
  const searchDiv = document.getElementById("search-container");
  const welcomeDiv = document.getElementById("welcome-container");
  const gridDiv = document.getElementById("grid-container");
  const nameInputLabel = document.getElementById("name-input-label");
  const weatherContainer = document.getElementById("weather-info-container");
  const weatherInputContainer = document.getElementById("weather-input-container");
  const todoInput = document.querySelector('.todo-input')
  const todoButton = document.querySelector('.todo-button')
  const todoList = document.querySelector('.todo-list')
  const todoLabel = document.getElementById("todo-label");
  const todoPopup = document.getElementById("todo-popup");

  todoPopup.style.opacity = '0';
  init();
  
  /* Initialize by checking if user name is already stored in local storage. If so, display the greeting message 
     if not, display the name form to get the user's name */
  async function init() {

    // Set interval to update time every 1000ms (1 second)
    setInterval(updateTime, 1000, timeDiv);

    // Uncomment these below to clear local storage for testing 
    // localStorage.removeItem('city');
    // localStorage.removeItem('userName');
    // localStorage.removeItem('backgroundImage');

    var selectedUnit = localStorage.getItem("unit");

    // If 'city' exists in local storage, get weather data and display it - if not, display form for user to enter city
    if (localStorage.getItem('city')) {
      getWeather(localStorage.getItem('city'), selectedUnit); 
      weatherContainer.style.opacity = '1';

      // Set interval to update weather every 3 minutes
      setInterval(function() {
        getWeather(localStorage.getItem('city'), selectedUnit); 
      }, 180000);
    } else{
      resetWeather();
    }

    // Check if 'userName' exists and update welcome message, if not, display name input form
    if (localStorage.getItem('userName')) {
      welcomeDiv.style.display = 'none';
      let hours = getTime();
      greetingSpan.textContent = getGreeting(hours) +', ' + localStorage.getItem('userName') + '.';
    } else {
      greetingDiv.style.display = 'none';
      timeDiv.style.display = 'none';
      searchDiv.style.display = 'none';
    }

    // Check for stored background image and update if found
    if (localStorage.getItem('backgroundImage')) {
      body.style.backgroundImage = `url('${localStorage.getItem('backgroundImage')}')`;
    }else{

    // Set default background image
    body.style.backgroundImage = "url('imgs/clear3.jpg')";
    }

    var selectedColor = localStorage.getItem("selectedColor");
    var selectedFont = localStorage.getItem("selectedFont");
    var selectedUnit = localStorage.getItem("unit");

    // Set default values for color, font, and unit if not present in local storage
    // Defaults are white, Poppins, and Fahrenheit
    if (selectedColor) {
      changeFontColor(selectedColor);
    } else{
      localStorage.setItem("selectedColor", "white");
    }

    if (selectedFont) {
      changeFont(selectedFont);
    } else {
      localStorage.setItem("selectedFont", "Poppins");
    }

    if (selectedUnit) {
      changeUnit(selectedUnit);
    } else {
      localStorage.setItem("unit", "F");
      changeUnit("F"); 
    }
    
    getTodos();
  }

  // Handle settings options for color, font, and unit
  const colorSelector = document.getElementById("colorSelect");
  colorSelector.addEventListener("change", () => {
    changeFontColor(colorSelector.value);
  });

  colorSelector.addEventListener('blur', () => {
    colorSelector.value = colorSelector.value;
  });

  const fontSelector = document.getElementById("fontSelect");
  fontSelector.addEventListener("change", () => {
    changeFont(fontSelector.value);
  });

  const unitSelector = document.getElementById("unitSelect");
  unitSelector.addEventListener("change", () => {
    changeUnit(unitSelector.value);
  });

function changeFontColor(selectedColor){
  document.getElementById("colorSelect").value = selectedColor;
  var color = selectedColor;

  timeDiv.style.color = color;
  greetingSpan.style.color = color;
  nameInput.style.color = color;
  nameInputLabel.style.color = color;

  localStorage.setItem("selectedColor", color);
  console.log("Color changed to: " + color);
}

function changeFont(selectedFont) {
  document.getElementById("fontSelect").value = selectedFont;
  var font = selectedFont;

  greetingSpan.style.fontFamily = font;
  nameInput.style.fontFamily = font;
  nameInputLabel.style.fontFamily = font;
  timeDiv.style.fontFamily = font;

  localStorage.setItem("selectedFont", font);
  console.log("Font changed to: " + font);
}

function changeUnit(selectedUnit) {
  document.getElementById("unitSelect").value = selectedUnit;
  var unit = selectedUnit;

  if(localStorage.getItem('city')) {
    getWeather(localStorage.getItem('city'), unit);
  }

  localStorage.setItem("unit", unit);
  console.log("Unit changed to: " + unit);
}

// Hide weather container and show form to enter city
function resetWeather() {
  weatherContainer.style.opacity = '0';
  weatherInputForm.style.opacity = '1';
  weatherInputContainer.style.opacity = '1';
}

weatherDiv.addEventListener('click', resetWeather);

// Opening and closing popup/gear settings functionality 
const gear = document.getElementById('gear-container');
const popup = document.getElementById('popup');

gear.addEventListener('click', () => {
  if (popup.style.opacity === '1') {
    // If popup is already visible, hide it
    popup.style.opacity = '0';
    popup.style.pointerEvents = 'none';
  } else {
    // If popup is hidden, show it and trigger fade-in animation
    popup.style.opacity = '1';
    popup.style.pointerEvents = 'auto';
    popup.style.animation = 'fadeIn 0.3s';
  }
});

// Display/hide todo popup
// A simpler alternative would be using toggle class
todoLabel.addEventListener('click', () => {
  if(todoPopup.style.opacity === '0'){
    todoPopup.style.opacity = '1';
    todoPopup.style.pointerEvents = 'auto';
    
  } else {
    todoPopup.style.opacity = '0';
    todoPopup.style.pointerEvents = 'none';
  }
});


nameForm.addEventListener('submit', function(e) {
  e.preventDefault(); // prevent the form from submitting and reloading the page

  localStorage.setItem('userName', nameInput.value);

  // Clear the input field
  nameForm.reset();

  // Update greeting message
  let hours = getTime();
  greetingSpan.textContent = getGreeting(hours) +', ' + localStorage.getItem('userName') + '.';

  // Hide name form and show greeting message, time, and search bar
  welcomeDiv.style.display = 'none';
  greetingDiv.style.display = 'block';
  timeDiv.style.display = 'block';
  searchDiv.style.display = 'block';

  console.log('Username: '+ localStorage.getItem('userName'));
});

weatherInputForm.addEventListener('submit', async function(e) {
  e.preventDefault(); // prevent the form from submitting and reloading the page

  
  // Get city from input field and fetch weather API data
  const city = cityInput.value;
  const unit = localStorage.getItem('unit') || 'F';
  const unitSystem = unit === 'F' ? 'imperial' : 'metric'; // Get currently selected unit

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unitSystem}`);

    if (!response.ok) {
      alert('Please enter a valid city name.');
      weatherInputForm.reset();
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }

    getWeather(city, unit); // Pass city and selected unit to getWeather()
    localStorage.setItem('city', city);

    // Show weather container and hide form after submission
    weatherContainer.style.opacity = '1';
    weatherInputForm.style.opacity = '0';
    weatherInputContainer.style.opacity = '0';
  } catch (error) {
    console.error(error);
  }

  weatherInputForm.reset();
});

// Get current hour from system time
function getTime(){
  let date = new Date();
  let hours = date.getHours();
  return hours;
}

// Update time in timeDiv element
function updateTime(timeDiv){
  let date = new Date();
  timeDiv.innerHTML = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).replace("AM","").replace("PM","");
}

// Get greeting based on current hour
function getGreeting(hours) {
  if (hours >= 5 && hours < 12) {
    return 'Good morning';
  } else if (hours >= 12 && hours < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

async function getWeather(city, unit = 'F') {
  const unitSystem = unit === 'F' ? 'imperial' : 'metric';

  // Use the unit parameter value in the API URL to fetch weather data in the specified unit
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unitSystem}`);
  
  if (!response.ok) {
    alert('Please enter a valid city name.');
    throw new Error(`Failed to fetch weather data: ${response.status}`);
  }

  const data = await response.json();
  const temperature = data.main.temp.toFixed(1);

  changeBackgroundImage(temperature, unit);

  let temperatureDisplay;
  if (unitSystem === 'imperial') {
    temperatureDisplay = `${temperature.substring(0, temperature.indexOf('.'))}&deg;F`;
  } else {
    temperatureDisplay = `${temperature.substring(0, temperature.indexOf('.'))}&deg;C`;
  }

  weatherDiv.style.opacity = 0;
  cityDiv.style.opacity = 0;

  setTimeout(function() {
    weatherDiv.innerHTML = temperatureDisplay;
    weatherDiv.style.opacity = 1;

    cityDiv.style.opacity = 1;
    cityDiv.innerHTML = city;
  }, 200);
  

  const weatherCondition = data.weather[0].main;
  console.log("Current weather condition: " + weatherCondition);
  insertConditionIcon(weatherCondition);
}

function insertConditionIcon(condition) {
      switch(condition) {
        case 'Clear':
          iconDiv.innerHTML = "<i class=\"fa-regular fa-sun\"></i>";
          break;
        case 'Rain':
          iconDiv.innerHTML = "<i class=\"fa-solid fa-cloud-rain\"></i>";
          break;
        case 'Snow':
          iconDiv.innerHTML = "<i class=\"fa-regular fa-snowflake\"></i>";
          break;
        case 'Drizzle':
          iconDiv.innerHTML = "<i class=\"fa-regular fa-cloud-drizzle\"></i>";
          break;
        case 'Thunderstorm':
          iconDiv.innerHTML = "<i class=\"fa-solid fa-cloud-bolt\"></i>";
          break;
        case 'Clouds':
          iconDiv.innerHTML = "<i class=\"fa-solid fa-cloud\"></i>";
          break;
        default:
          console.error('Invalid condition:', condition);
          break;
      }
}

function changeBackgroundImage(temperature, unit) {
  let imageUrl;
  
  // Update imageUrl based on temperature and unit
  if (unit === 'F') {
    if (temperature >= 75) {
      imageUrl = "imgs/sunny2.jpg";
    } else if (temperature >= 50 && temperature < 75) {
      imageUrl = "imgs/clear2.jpg";
    } else if (temperature >= 33 && temperature < 50) {
      imageUrl = "imgs/clear1.jpg";
    } else if (temperature >= 10 && temperature < 33) {
      imageUrl = "imgs/snow1.jpg";
    } else {
      imageUrl = "imgs/snow2.jpg";
    }
  } else if (unit === 'C') {
    if (temperature >= 24) {
      imageUrl = "imgs/sunny2.jpg";
    } else if (temperature >= 10 && temperature < 24) {
      imageUrl = "imgs/clear2.jpg";
    } else if (temperature >= 1 && temperature < 10) {
      imageUrl = "imgs/clear1.jpg";
    } else if (temperature >= -12 && temperature < 1) {
      imageUrl = "imgs/snow1.jpg";
    } else {
      imageUrl = "imgs/snow2.jpg";
    }
  }
  
  // Update background image and store in local storage
  body.style.backgroundImage = `url('${imageUrl}')`;
  localStorage.setItem('backgroundImage', imageUrl);
}

todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);

function addTodo (e) {
  e.preventDefault();

  if(todoInput.value === ''){
    alert("Please enter a task");
    return;
  }

  const todoDiv = document.createElement('div');
  todoDiv.classList.add('todo');
  const newTodo = document.createElement('li');
  newTodo.innerText = todoInput.value;
  newTodo.classList.add('todo-item');
  todoDiv.appendChild(newTodo);

  saveLocalTodos(newTodo.innerText); // pass in the innerText of newTodo to save in local storage

  const completedButton = document.createElement('button');
  completedButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completedButton.classList.add('complete-btn');
  todoDiv.appendChild(completedButton);

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.classList.add('delete-btn');
  todoDiv.appendChild(deleteButton);

  //APPEND TO LIST
  todoList.appendChild(todoDiv);
  todoInput.value = '';
}

function deleteCheck(e) {
  const item = e.target;
  if (item.classList[0] === 'delete-btn') {
    const todo = item.parentElement;
    todo.remove();
    removeLocalTodos(todo);
  } else if (item.classList[0] === 'complete-btn') {
    const todo = item.parentElement;
    todo.classList.toggle('completed');

    // update local storage with completed status
    const todoText = todo.children[0].innerText;
    const todos = JSON.parse(localStorage.getItem('todos'));

    todos.forEach(function(todoItem, index) {
      if (todoItem.text === todoText) {
        todoItem.completed = !todoItem.completed;
      }
    });

    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

function saveLocalTodos(todoText) {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }

  todos.push({
    text: todoText,
    completed: false
  });

  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos(){
  let todos;
  if(localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  todos.forEach(function(todo){
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    const newTodo = document.createElement('li');
    newTodo.innerText = todo.text;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add('delete-btn');
    todoDiv.appendChild(deleteButton);

    if (todo.completed) {
      todoDiv.classList.add('completed');
    }

    //APPEND TO LIST
    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(todo){
  let todos;
  if(localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }

  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem('todos', JSON.stringify(todos));
}

});