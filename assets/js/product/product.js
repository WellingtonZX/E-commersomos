const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const page = window.location.pathname.split("/").pop();
const category = page.replace("main-", "").replace(".html", "");

const generateStars = (rating) => {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    starsHtml += i <= rating ? '<i class="fa-solid fa-star gold"></i>' : '<i class="fa-regular fa-star"></i>';
  }
  return `<div class="star-rating">${starsHtml}</div>`;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const setupImageZoom = () => {
  const mainImageContainer = document.querySelector('.main-img-container');
  const mainImage = document.getElementById('mainImage');
  const zoomFlyout = document.getElementById('zoom-flyout');
  const zoomLevel = 2;

  if (mainImageContainer && mainImage && zoomFlyout) {
    mainImageContainer.addEventListener('mouseenter', () => {
      zoomFlyout.style.display = 'block';
      zoomFlyout.style.backgroundImage = `url(${mainImage.src})`;
      zoomFlyout.style.backgroundSize = `${mainImage.offsetWidth * zoomLevel}px ${mainImage.offsetHeight * zoomLevel}px`;
    });

    mainImageContainer.addEventListener('mousemove', (e) => {
      const imageRect = mainImage.getBoundingClientRect();
      const x = e.clientX - imageRect.left;
      const y = e.clientY - imageRect.top;
      const bgPosX = -x * zoomLevel;
      const bgPosY = -y * zoomLevel;
      zoomFlyout.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
    });

    mainImageContainer.addEventListener('mouseleave', () => {
      zoomFlyout.style.display = 'none';
    });

    const thumbsVertical = document.getElementById("thumbs-vertical");
    if (thumbsVertical) {
      thumbsVertical.addEventListener("click", () => {
        setTimeout(() => {
          zoomFlyout.style.backgroundImage = `url(${mainImage.src})`;
        }, 50);
      });
    }
  }
};

const initializeProductPage = async () => {
  try {
    const response = await fetch(`/assets/json/product/main-${category}.json`);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados do produto.");
    }
    const products = await response.json();
    const product = products.find(p => p.id === productId);

    if (!product) {
      document.querySelector(".product-detail").innerHTML = "<p>Produto não encontrado</p>";
      return;
    }

    document.getElementById("breadcrumb-product").textContent = product.name;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-price").textContent = `R$ ${product.price.toLocaleString("pt-BR")}`;
    document.getElementById("product-installments").textContent = product.installments;

    const storageDiv = document.getElementById("product-storage");
    if (product.storage && product.storage.length > 0) {
      storageDiv.innerHTML = "Armazenamento: " + product.storage.map(s => `<span>${s}</span>`).join(" ");
      const storageOptions = storageDiv.querySelectorAll("span");
      storageOptions.forEach((option, index) => {
        option.addEventListener("click", () => {
          storageOptions.forEach(o => o.classList.remove("selected"));
          option.classList.add("selected");
        });
        if (index === 0) {
          option.classList.add("selected");
        }
      });
    } else {
      storageDiv.innerHTML = "";
    }

    const swatchesDiv = document.getElementById("color-swatches");
    const selectedColorSpan = document.getElementById("selected-color");
    let currentColorName = product.colors[0]?.name || "";
    selectedColorSpan.textContent = currentColorName;

    swatchesDiv.innerHTML = product.colors.map((c, index) => {
      const selectedClass = index === 0 ? "selected" : "";
      return `<span class="color-swatch ${selectedClass}" data-name="${c.name}" style="background-color: ${c.bg}; color: ${c.color};"></span>`;
    }).join("");

    const allSwatches = document.querySelectorAll(".color-swatch");
    allSwatches.forEach(swatch => {
      swatch.addEventListener("mouseenter", () => {
        selectedColorSpan.textContent = swatch.dataset.name;
      });
      swatch.addEventListener("mouseleave", () => {
        const selectedSwatch = document.querySelector(".color-swatch.selected");
        selectedColorSpan.textContent = selectedSwatch ? selectedSwatch.dataset.name : "";
      });
      swatch.addEventListener("click", () => {
        allSwatches.forEach(s => s.classList.remove("selected"));
        swatch.classList.add("selected");
        currentColorName = swatch.dataset.name;
        selectedColorSpan.textContent = currentColorName;
      });
    });

    const mainImg = document.getElementById("mainImage");
    if (product.images && product.images.length > 0) {
      mainImg.src = product.images[0];
      const thumbsVertical = document.getElementById("thumbs-vertical");
      thumbsVertical.innerHTML = "";
      product.images.forEach(img => {
        const thumb = document.createElement("img");
        thumb.src = img;
        thumb.addEventListener("click", () => mainImg.src = img);
        thumbsVertical.appendChild(thumb);
      });
    }
    
    setupImageZoom();

    const tabs = document.querySelectorAll(".tabs div");
    const tabContent = document.querySelector(".tab-content");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        let contentHtml = '';
        if (tab.textContent === "Descrição") {
          contentHtml = `<p>${product.description}</p>`;
        } else if (tab.textContent === "Especificações") {
          contentHtml = `<p>${product.specs}</p>`;
        } else if (tab.textContent === "Avaliações") {
          contentHtml = product.reviews && product.reviews.length > 0 ?
            product.reviews.map(review => `
              <div class="review-item">
                ${generateStars(review.rating)}
                <p class="review-text">"${review.text}"</p>
                <p class="review-meta">- ${review.author}, ${review.date}</p>
              </div>
            `).join('') :
            "<p>Ainda não há avaliações para este produto.</p>";
        }
        tabContent.innerHTML = contentHtml;
      });
    });

    if (tabContent) {
      tabContent.innerHTML = `<p>${product.description}</p>`;
    }

    const relatedDiv = document.getElementById("related-products");
    const relatedProducts = products.filter(p => p.id !== productId);
    if (relatedDiv && relatedProducts.length > 0) {
      const shuffledProducts = shuffleArray(relatedProducts);
      const selectedProducts = shuffledProducts.slice(0, 4);
      relatedDiv.innerHTML = selectedProducts.map(p => `
        <a href="/assets/html/product/main-${category}.html?id=${p.id}" class="related-product-card">
          <div class="card">
            <img src="${p.images[0]}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>R$ ${p.price.toLocaleString("pt-BR")}</p>
          </div>
        </a>
      `).join("");
    }

    const quantityInput = document.getElementById('quantity-input');
    quantityInput.addEventListener('change', (e) => {
      let value = parseInt(e.target.value, 10);
      if (value < 1 || isNaN(value)) {
        e.target.value = 1;
      }
    });

  } catch (error) {
    console.error("Erro:", error);
    document.querySelector(".product-detail").innerHTML = "<p>Ocorreu um erro ao carregar o produto.</p>";
  }
};

document.addEventListener('DOMContentLoaded', initializeProductPage);
