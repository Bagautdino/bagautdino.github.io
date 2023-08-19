function loadScript() {
  const burgerMenu = document.querySelector(".burger-menu");
  const upArrow = document.querySelector(".up-arrow");
  const navigationLinks = document.querySelectorAll(".navigation-link");
  const containerHeadings = document.querySelectorAll(".container-heading");
  const containerHeadingUnderlines = document.querySelectorAll(
    ".container-heading-underline"
  );
  const fadingText = document.querySelectorAll(".fading-text");
  const fadingSkills = document.querySelectorAll(".fading-skills");
  const topHeadingContainer = document.querySelector("#me");
  const headerTitleContainer = document.querySelector(".header-title-container");

  // show and hide up arrow
  function activateUpArrow() {
    if (document.documentElement.scrollTop > 0) {
      if (window.innerWidth <= 700) {
        upArrow.style.right = "5px";
      } else {
        upArrow.style.right = "10px";
      }
    } else {
      upArrow.style.right = "-60px";
    }
  }

  // highlights nav menu link
  function navigationActions() {
    containerHeadings.forEach((heading) => {
      const windowHeight = window.innerHeight;
      const headingDistanceFromTop = heading.getBoundingClientRect().top;
      if (headingDistanceFromTop < windowHeight * 0.7) {
        navigationLinks.forEach((link) => {
          if (link.getAttribute("value") === heading.innerText) {
            link.classList.replace("purple-text", "green-text");
            link.children[0].classList.add("active");
          } else {
            link.classList.replace("green-text", "purple-text");
            link.children[0].classList.remove("active");
          }
        });
      }
      // was 115
      if (topHeadingContainer.getBoundingClientRect().top > 200) {
        navigationLinks.forEach((link) => {
          link.classList.replace("green-text", "purple-text");
          link.children[0].classList.remove("active");
        });
      }
    });
  }

  // shows and hides the heading underline
  function showHideUnderline() {
    containerHeadingUnderlines.forEach((headingUnderline) => {
      const windowHeight = window.innerHeight;
      const underlineDistanceFromTop =
        headingUnderline.getBoundingClientRect().top;
      if (window.innerWidth <= 400) {
        headingUnderline.style.width = "100%";
      } else {
        if (underlineDistanceFromTop < windowHeight * 0.75) {
          headingUnderline.style.width = "100%";
        } else {
          headingUnderline.style.width = "0";
        }
        // was 200, smaller the number, closer to the top
        if (topHeadingContainer.getBoundingClientRect().top > 225) {
          headingUnderline.style.width = "0";
        }
      }
    });
  }

  // does the fade in and out of text
  function showHideText() {
    fadingText.forEach((text) => {
      const windowHeight = window.innerHeight;
      const textDistanceFromTop = text.getBoundingClientRect().top;
      if (textDistanceFromTop < windowHeight * 0.75) {
        text.style.opacity = "1";
        text.style.marginLeft = "0";
      } else {
        text.style.opacity = "0";
        text.style.marginLeft = "75px";
      }
    });
  }

  // does the fade in and out of skills list
  function showHideSkills() {
    fadingSkills.forEach((skill) => {
      const windowHeight = window.innerHeight;
      const skillDistanceFromTop = skill.getBoundingClientRect().top;
      if (skillDistanceFromTop < windowHeight * 0.75) {
        skill.style.opacity = "1";
      } else {
        skill.style.opacity = "0";
      }
    });
  }

  // fades header title in on page load
  function showHeaderText() {
    headerTitleContainer.style.top = "10px";
    headerTitleContainer.style.opacity = "1";
  }

  // mobile burger menu actions
  burgerMenu.addEventListener("click", () => {
    document
      .querySelector("#burger-overlay")
      .classList.toggle("burger-overlay-dim");
    document
      .querySelector(".navigation-links-container")
      .classList.toggle("navigation-links-toggle");
    document
      .querySelector("#burger-bars-1")
      .classList.toggle("burger-bars-remove");
    document
      .querySelector("#burger-bars-2")
      .classList.toggle("burger-bars-rotate-clockwise");
    document
      .querySelector("#burger-bars-3")
      .classList.toggle("burger-bars-rotate-counter-clockwise");
  });

  // scroll
  window.addEventListener("scroll", () => {
    activateUpArrow();
    navigationActions();
    showHideUnderline();
    showHideSkills();
    showHideText();
  });
  // resize
  window.addEventListener("resize", () => {
    activateUpArrow();
    navigationActions();
    showHideUnderline();
    showHideSkills();
    showHideText();
  });
  // load
  activateUpArrow();
  navigationActions();
  showHideUnderline();
  showHideSkills();
  showHideText();
  // waits 1.5 seconds after page load to fire 
  setTimeout(() => {
    showHeaderText();
  }, 750);
}

window.onload = loadScript;
