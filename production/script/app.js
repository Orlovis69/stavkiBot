////////////////
const settings = {
  fill: "#1abc9c",
  background: "#ffffff",
  text: "Минимальный риск"
};

// all sliders
const sliders = document.querySelectorAll(".range-slider"),
  radioContainer = document.querySelector(".radio-container"),
  radioBtns = document.querySelectorAll(".radio-input"),
  radioContainerSingle = document.querySelectorAll(".values-container__single"),
  values = document.querySelectorAll(".value");

// Iterate through that list of sliders
// ... this call goes through our array of sliders [slider1,slider2,slider3] and inserts them one-by-one into the code block below with the variable name (slider)
sliders.forEach(slider => {
  // Look inside our slider for our input add an event listener
  //   ... the input inside addEventListener() is looking for the input action, we could change it to something like change
  slider.querySelector("input").addEventListener("input", event => {
    // apply value to the span
    const rangeValue = event.target.value;
    // Get corresponding properties for current values
    const rangeStyle = getStyle(rangeValue);
    console.log(rangeValue);
    // change tag text
    // slider.querySelector("span").innerHTML = rangeStyle.text;
    // change value number color
    hightlightValue(rangeValue);
    // change css variable color-range
    slider.style.setProperty("--color-slider", rangeStyle.fill);

    // apply fill to the input
    applyFill(event.target);
  });
  // Don't wait for the listener, apply it now!
  applyFill(slider.querySelector("input"));
});

// Listen for change in input
radioBtns.forEach(btn => btn.addEventListener("change", changeRadio));

// Change style radio buttons
function changeRadio() {
  const value = this.value;
  const rangeStyle = getStyle(value);
  hightlightValue(value);
  radioContainerSingle.forEach(elem => elem.classList.remove("__active"));
  this.parentElement.classList.add("__active");
  radioContainer.style.setProperty("--color-slider", rangeStyle.fill);
}
// function applies the fill to our sliders by using a linear gradient background
function applyFill(slider) {
  // figure out how far it is in between the min and max of our input
  const percentage =
    (100 * (slider.value - slider.min)) / (slider.max - slider.min);
  // create a linear gradient that separates at the above point
  const bg = `linear-gradient(90deg, var(--color-slider) ${percentage}%, var(--color-range) ${percentage +
    0.1}%)`;
  slider.style.background = bg;

  // Get tag element
  // const valueBlock = slider.parentElement.querySelector("span");
  // console.log(percentage);
  // moveValue(valueBlock, percentage);
}

// function applies movement of range-slider__value block
function moveValue(element, percent) {
  // element.style.marginLeft = `calc(${percent - 3}% - 0.9em)`;
}

// function to highlight current value
function hightlightValue(value) {
  values.forEach(element => {
    element.parentElement.classList.remove("__active");
    if (element.textContent == value) {
      element.parentElement.classList.add("__active");
    }
  });
  // console.log(values);
}

// find corresponding text and color
function getStyle(value) {
  switch (value) {
    case "1.001":
      return { text: "Минимальный риск", fill: "#05a274" };
      break;
    case "1.002":
      return { text: "Низкий риск", fill: "#20b589" };
      break;
    case "1.003":
      return { text: "Средние риски", fill: "#ffec21" };
      break;
    case "1.004":
      return { text: "Высокие риски", fill: "#ff6c4d" };
      break;
    case "1.005":
      return { text: "Очень высокие риски", fill: "#e03363" };
      break;
    default:
      return { text: "Минимальный риск", fill: "#05a274" };
  }
}

////////////////
// FAQ
const faqItems = document.querySelectorAll(".faq-list li");

function toggleClose(e) {
  const item = this;
  this.classList.toggle("__active");
  console.log(this);
  setTimeout(function() {
    item.classList.toggle("__visible");
  }, 10);
}

faqItems.forEach(item => item.addEventListener("click", toggleClose));

////////////////
// MIMIC AJAX
const button = document.querySelector('button[type="submit"]'),
  modalWaiting = document.querySelector(".modal-waiting"),
  modalSuccess = document.querySelector(".modal-success"),
  modalSections = document.querySelectorAll(".__modal-window"),
  links = document.querySelectorAll("a"),
  buttons = document.querySelectorAll("button");
console.log(modalSections, buttons, links);

buttons.forEach(button => button.addEventListener("click", toggleModal));
links.forEach(link => link.addEventListener("click", activateLink));

function toggleModal(e) {
  modalSections.forEach(section => {
    section.classList.remove("__active");
    section.classList.remove("__visible");
    if (this.dataset.action == section.id) {
      console.log(section.id);
      section.classList.add("__active");
      setTimeout(section.classList.add("__visible"), 10);
    }
  });
  e.preventDefault();
}

function activateLink() {
  console.log(this.hash);
  modalSections.forEach(section => {
    section.classList.remove("__active");
    section.classList.remove("__visible");
    if (this.hash.substring(1, this.hash.length) == section.id) {
      console.log(section.id);
      section.classList.add("__active");
      setTimeout(section.classList.add("__visible"), 10);
    }
  });
}
//////////////////////////
// MENU
const menuIcon = document.querySelector(".menu-icon"),
  menu = document.querySelector(".nav-account"),
  menuLinks = document.querySelectorAll(".nav-item");

function toggleMenu(e) {
  menu.classList.toggle("__active");
  menuIcon.classList.toggle("__active");
  menuLinks.forEach(link => link.classList.remove("__active"));
  if (!this.classList.contains("menu-icon")) {
    this.classList.add("__active");
  }
}

if (menuIcon) {
  menuIcon.addEventListener("click", toggleMenu);
  menuLinks.forEach(link => link.addEventListener("click", toggleMenu));
}

///////////////////
// IOS range issue
var diagramSlider = document.querySelector(".range-slider__range");
console.log(diagramSlider);

function iosPolyfill(e) {
  console.log("hi");
  var val =
      (e.pageX - diagramSlider.getBoundingClientRect().left) /
      (diagramSlider.getBoundingClientRect().right -
        diagramSlider.getBoundingClientRect().left),
    max = diagramSlider.getAttribute("max"),
    segment = 1 / (max - 1),
    segmentArr = [];

  max++;

  for (var i = 0; i < max; i++) {
    segmentArr.push(segment * i);
  }

  var segCopy = JSON.parse(JSON.stringify(segmentArr)),
    ind = segmentArr.sort((a, b) => Math.abs(val - a) - Math.abs(val - b))[0];

  diagramSlider.value = segCopy.indexOf(ind) + 1;
  console.log(diagramSlider);
}

if (!!navigator.platform.match(/iPhone|iPod|iPad/)) {
  diagramSlider.addEventListener("touchstart", iosPolyfill, { passive: true });
}
