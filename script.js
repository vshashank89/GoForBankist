'use strict';

// Marketing Bankist Website:

// Selectors or Variables for the selected elements in the DOM:
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');

//////////////////////////////////////////////////////////////////////////////
// Modal window

// When we click on the link i.e <a> tag with href = '#' , its default behavior is takes to the top the page . So have to prevent this default behavior.
const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Instead of using regular for loop with some counter , we use forEach() method , it can be called on a NodeList even though many array methods dont work on it.
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

//for (let i = 0; i < btnsOpenModal.length; i++)
// btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////////////////////////
// Bankist - 1. Implementing Smooth scrolling:

// Old way with a couple of methods:
// getBoundingClientRect() this method return DOMRect object which contains coordinates of the element in the DOM.
// - This DOMRect properties like x,y,top,left are live and related to the viewport.
// - window.pageXOffset and window.pageYOffset - give the current scroll amount/position.
// - window.scrollTo(optionsObj) method accepts options object.

// - element.scrollIntoView({behavior:"smooth"}) - This is the modern method used.

btnScrollTo.addEventListener('click', function (e) {
  //Coordinates of the element that we want to scroll to
  const s1coords = section1.getBoundingClientRect();
  //console.log(s1coords);

  //e.target returns the DOM object on which it is called.
  //console.log(e.target.getBoundingClientRect()); // relative to the viewport.

  // Can also get the current scroll position:
  //console.log(
  //`Current scroll position X,Y: `,
  //window.pageXOffset, // amount of horizontal scroll
  //window.pageYOffset // amount of vertical scroll i.e distance b/w top of the page and position of the current viewport.
  //);

  // Dimensions of the current viewport:
  // clientHeight and clientwidth doesnot count the scroll bars , just the dimensions avalable for the content to display.
  //console.log(
  //'Current viewport height and width : ',
  //document.documentElement.clientHeight,
  // document.documentElement.clientWidth
  //);

  // Scrolling to Section-1:
  //window.scrollTo(s1coords.left, s1coords.top); // Since y co-ord is w.r.t the viewport this doenot work

  // This works correctly because we added currentScroll as well, but its not smooth
  //window.scrollTo(
  //s1coords.left + window.pageXOffset,
  //s1coords.top + window.pageYOffset
  //);

  //window.scrollTo({
  //  left: s1coords.x + window.pageXOffset,
  //  top: s1coords.y + window.pageYOffset, //this sum gives position of section1 from the top of the page.
  //  behavior: 'smooth',
  //});

  // Modern method : scrollIntoView()
  // Without all calculations,positions and scrolls.
  section1.scrollIntoView({ behavior: 'smooth' });

  //
});

//////////////////////////////////////////////////////////////////////////////
// 2. Event Delegation : Implementing Page navigation

// Better and efficient Solution will be Event Delegation:
// - Adding only one Event Listener to the parent element
// - Determine at which element the event originated using e.target

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); // first we need to prevent default behavior of links.
  //console.log(e.target);

  //We need to ignore the click that doesnot happen on one of the child links
  // Matching Strategy :
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// This method is not Efficient because we are creating 3 copies of the same evnet handler and callback function,
// - This would be fine for 3 elements , but if we have 1000s of elements then it would create 1000s of event handlers and callback functions,
// - This would affect the performance.
/*document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault(); // This is because each element is a link (<a> element) and the anchors of each element move the page to the element having same id as the href.

    // getting href attribute from each element
    const id = el.getAttribute('href'); // el.href we dont use becasue we dont need absolute URL.
    console.log(id);

    //With this id we can select the element where we want to scroll to.
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

//////////////////////////////////////////////////////////////////////////////
// 3. Building a Tabbed Component - using Event Delegation
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  // No matter if we click on the button or span child element,we need to get the button element. So we use closest() method to get the closest element with the specified class.
  const clicked = e.target.closest('.operations__tab');
  //console.log(clicked);

  // If the click is outside of any buttons but inside the tabsContainer,
  // Guard Clause - modern way
  if (!clicked) return;
  // This returns the function immediately if clicked is null.

  //Active Tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Active Content:
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////////////////////////////////////////////////////////////
// 4. Menu Fade in-out Animation : Passing Arguments to Event Handlers
// - 'mouseover' event same like 'mouseenter' but the big difference is that the 'mouseenter' doesnot bubble up in event propagation.
// - 'mouseout' event opposite to 'mouseover'
// - 'mouseleave' oppposite to 'mouseenter' and it also doesnot bubble up.

// Separate function to handleHover instead of repeating same code : DRY principle

const handleHover = function (e) {
  // So there are no child elements inside the link,so we dont need closest() method.
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // To make this selection robust , its best to select parent 'nav' element
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');

    siblings.forEach(sib => {
      if (sib !== e.target) sib.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Another version of the same functionality:
//nav.addEventListener('mouseover', function (e) {
//handleHover(e, 0.5); // handleHover(e,opacity)
//});

//Animation fade-in - Better solution
// - Event Delegation
nav.addEventListener('mouseover', handleHover.bind(0.5));

// Undo the hover effect - i.e. Animation Fade Out
nav.addEventListener('mouseout', handleHover.bind(1));

//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/*  Sticky Navigation - 'scroll' event on window object
// - 'scroll' event is available on window object, not on document.
// - Inefficient and bad performance because scroll event generates a large number of event handlers for a even small amount of scroll,so this affects the performance of the webpage.
const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function (e) {
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

//////////////////////////////////////////////////////////////////////////////
// 5. Intersection Observer API : Sticky Navigation
// - This API allows us to basically observer our code to find the way the target element intersects with the other elements or the way it intersects with the viewport.
// - obsOptions is an object , in which we define root and threshold properties.
// - root : the element that we want the target element to intersect with.
// - threshold : min. percentage of intersection of the target element with the root, at which the obsCallback function is called/fired.
// - obsCallback will be called when ever the target el intersects the root el,at the threshold that we specified.

//const obsCallback = function (entries, observer) {
//  entries.forEach(entry => {
//    console.log(entry);
//  });
//};

//const obsOptions = {
//root: null,
//threshold: [0, 0.2],
//};

//const observer = new IntersectionObserver(obsCallback, obsOptions);
//observer.observe(section1); // observe() method we pass in the target element.

// STICKY NAVIGATION WITH INTERSECTION OBSERVER API:
// - "entry.isIntersecting" property - it gives boolean i.e true/false if the target el is intersecting the root element or not.

// - When the Sticky Nav actually appears in ?
// - i.e when the distance b/w start of section1 and top of the viewport is exactly the same as the navigation height , so that the Sticky Nav doesnot overlap the section.
// - "rootMargin" property : its a box of margin applied outside to the target element.(can  be +/- margin), unit should be specified and only px.

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);

  // We want the Sticky nav only when the header is not intersecting the viewport.
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerOptions = {
  root: null,
  threshold: [0],
  // Its as if the header stops before the specified value , we calculate that value/dimension dynamically using getBoudingClientRect() method.
  rootMargin: `-${navHeight}px`, // negative rootMargin because we want the target element to stop before itself.
};

const headerObserver = new IntersectionObserver(stickyNav, headerOptions);
headerObserver.observe(header);

//////////////////////////////////////////////////////////////////////////////
// 6. Revealing Elements on scroll : Using Intersection Observer API
// - Sections fade-in animation:
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;

  // We actually need to know which is the section, that intersected with the viewport. so "entry.target" gives that section.
  entry.target.classList.remove('section--hidden');

  //Unobserve these sections
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////////////////////////////////////////////////////////////////////
// 7. Lazy Loading Images : Important for a better performance
// - Another application of Intersection obserever API

// Selecting elements based on attribute:
const imgTargets = document.querySelectorAll('img[data-src]');
//console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries; // Destructing from entries array of thresholds.
  //console.log(entry);

  // guard clause - we want this functionality only when when it is intersecting.
  if (!entry.isIntersecting) return;

  // Replace src with data-src attribute:
  entry.target.src = entry.target.dataset.src;

  // Removing the 'lazy-img' class:
  // - Javascript replaces the img behind the scenes , first it finds the image it should load and display here , this all happens behind the scenes.
  // - Once it finishes loading , JavaScript will emit a "load" event.
  // - We need to remove that class only when "load" event is triggered.
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // We need to load this image BEFORE we actually reach it, so we don't create a visible lag. To acieve this, we add a 200px margin to the bottom, virtually "extending the viewport 200px down", so that it is intersected earlier.
  rootMargin: '0px 0px -200px 0px',
  //rootMargin: '200px', // We basically want the user shouldnot notice that the images are loading , so we want to trigger this even before image is reached,so its like a box of margin around the target element.
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////////////////////////////////////
// 8. Slider Component : Most Important feature
// - Selectors:
const slides = document.querySelectorAll('.slide');

const slider = document.querySelector('.slider');

const btnLeftSlider = document.querySelector('.slider__btn--left');
const btnRightSlider = document.querySelector('.slider__btn--right');

const dotContainer = document.querySelector('.dots'); // Dot Container

let curSlide = 0;
const maxSlide = slides.length; // Can get length property from Nodelist , just like an array.

// Functions:
// Refactoring Our Code into Functions - DRY Principle
const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

const nextSlide = function () {
  curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  //Selecting that particular dot based on the data-slide attribute:
  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
};

// Initial slide Conditions i.e when the page is loaded.
const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

// Event handlers:
// Buttons :
btnRightSlider.addEventListener('click', nextSlide);
btnLeftSlider.addEventListener('click', prevSlide);

// Arrow Keys: e.key === "ArrowLeft" or "ArrowRight"
// - We handle the keyboard events right at the document.

const sliderNav = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // Short-Circuiting
  });

  observer.unobserve(slider);
};

const sliderObserver = new IntersectionObserver(sliderNav, {
  root: null,
  threshold: 0.25,
});

sliderObserver.observe(slider);

// Dots : Event Delegation , We are not going to add eventlisteners for each of the dots , instead on the dotContainer.
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset; // Destructuring dataset object
    goToSlide(slide);
    activateDot(slide);
  }
});

//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// 9. Adding a Cookie message.
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use Cookies to improve functionality and analytics <button class="btn btn--close-cookie">Got It!</button>';

header.append(message);

//Deleting Element from DOM :
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//////////////////////////////////////////////////////////////////////////////
// 10. Lifecycle DOM events :
// - Lifecycle of the webpage is from the time the page is accessed till the user leaves that page.

// "DOMContentLoaded" event on document:
// - This event is generated when HTML is parsed and the scripts are loaded and executed.
// - This event doesnot wait for loading images and other external resources like CSS file.
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML is parsed and DOM tree is built!', e);
});

// "load" event on window object
// - This event is generated when HTML parsed,scripts loaded,images and other external resourceslike CSS are also loaded, i.e when the page completely finished loading.
window.addEventListener('load', function (e) {
  console.log('Page finished loading completely', e);
});

// "beforeunload" on window object.
// - This event is triggered immediately,when the user is about to leave the page.
//window.addEventListener('beforeunload', function (e) {
//  e.preventDefault(); // We need to prevent default for this to work in some other browsers.
//  console.log(e);
//  e.returnValue = ''; // To display that leaving confirmation message we need to set "e.returnValue" to an empty string.
//});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
