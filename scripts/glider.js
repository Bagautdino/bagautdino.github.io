// window.addEventListener("load", () => {
function loadGlider() {
  let gliders = document.querySelectorAll(".glider");
  gliders.forEach((glider) => {
    new Glider(glider, {
      slidesToShow: 1,
      slidesToScroll: 1,
      scrollLock: true,
      draggable: false,
      rewind: true,
      duration: 2,
      dots: glider.parentNode.querySelector(".dots"),
      arrows: {
        prev: glider.parentNode.querySelector(".glider-prev"),
        next: glider.parentNode.querySelector(".glider-next"),
      },
      responsive: [
        {
          // screens greater than > 400px
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
        {
          // screens greater than > 1000px
          breakpoint: 1000,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            duration: 1,
          },
        },
        {
          // screens greater than > 1300px
          breakpoint: 1300,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            duration: 1,
          },
        },
      ],
    });
  });
}
// });
window.onload = loadGlider();
