(() => {
  const showTab = (tabId, event) => {
    document.querySelectorAll(".tab-buttons button").forEach(btn => {
      btn.classList.remove("active");
    });
    document.querySelectorAll(".tab-content").forEach(tab => {
      tab.classList.remove("active");
    });
    event.target.classList.add("active");
    document.getElementById(tabId).classList.add("active");
  };

  const changeImage = (img) => {
    document.getElementById("mainImage").src = img.src;
  };

  const toggleMenu = () => {
    document.getElementById("navLinks").classList.toggle("show");
  };

  const getSlider = () => document.getElementById('categorySlider');
  const getLeftButton = () => document.querySelector('.slider-btn.left');
  const getRightButton = () => document.querySelector('.slider-btn.right');

  const updateSliderButtons = () => {
    const slider = getSlider();
    const leftButton = getLeftButton();
    const rightButton = getRightButton();

    if (slider) {
      if (slider.scrollLeft === 0) {
        leftButton.style.display = "none";
      } else {
        leftButton.style.display = "block";
      }

      if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth) {
        rightButton.style.display = "none";
      } else {
        rightButton.style.display = "block";
      }
    }
  };

  const scrollSliderLeft = () => {
    const slider = getSlider();
    if (slider) {
      slider.scrollLeft -= slider.offsetWidth / 1.5;
    }
  };

  const scrollSliderRight = () => {
    const slider = getSlider();
    if (slider) {
      slider.scrollLeft += slider.offsetWidth / 1.5;
    }
  };

  const openModal = () => {
    const modal = document.getElementById("modalProdutos");
    if (modal) {
      modal.style.display = "block";
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("modalProdutos");
    if (modal) {
      modal.style.display = "none";
    }
  };

  const handleWindowClick = (event) => {
    const modal = document.getElementById("modalProdutos");
    if (modal && event.target === modal) {
      modal.style.display = "none";
    }
  };

  const addScrollEvent = () => {
    const slider = getSlider();
    if (slider) {
      slider.addEventListener('scroll', updateSliderButtons);
    }
  };

  window.addEventListener('load', () => {
    updateSliderButtons();  
    addScrollEvent(); 
  });

  window.showTab = showTab;
  window.changeImage = changeImage;
  window.toggleMenu = toggleMenu;
  window.scrollSliderLeft = scrollSliderLeft;
  window.scrollSliderRight = scrollSliderRight;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.addEventListener('click', handleWindowClick);

})();
