 const productsData = {};   
    const currentPage = {};   
    const itemsPerPage = 6;   

    function loadCategory(category, jsonPath, gridId) {
      fetch(jsonPath)
        .then(res => res.json())
        .then(products => {
          productsData[category] = products;
          currentPage[category] = 0;
          renderCategory(category, gridId);
        });
    }

    function renderCategory(category, gridId) {
      const grid = document.getElementById(gridId);
      const page = currentPage[category];
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const items = productsData[category].slice(start, end);

      grid.innerHTML = items.map(p => `
        <div class="category-card">
          <a href="/assets/html/product/main-${category}.html?id=${p.id}">
            <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
            <h3>${p.name}</h3>
            <p>R$ ${p.price.toLocaleString("pt-BR")}</p>
          </a>
        </div>
      `).join('');

      updateNavButtons(category);
    }

    function changePage(category, direction) {
      const total = productsData[category].length;
      const maxPage = Math.ceil(total / itemsPerPage) - 1;

      currentPage[category] = Math.min(
        maxPage,
        Math.max(0, currentPage[category] + direction)
      );

      renderCategory(category, `${category}Grid`);
    }

    function updateNavButtons(category) {
      const prevBtn = document.getElementById(`${category}Prev`);
      const nextBtn = document.getElementById(`${category}Next`);
      const total = productsData[category]?.length || 0;
      const maxPage = Math.ceil(total / itemsPerPage) - 1;
      const page = currentPage[category];

      if (prevBtn) prevBtn.style.display = page <= 0 ? "none" : "block";
      if (nextBtn) nextBtn.style.display = page >= maxPage ? "none" : "block";
    }

    // Inicialização
    loadCategory("smartphones", "/assets/json/product/main-smartphones.json", "smartphonesGrid");
    loadCategory("televisions", "/assets/json/product/main-televisions.json", "televisionsGrid");
    loadCategory("notebooks", "/assets/json/product/main-notebooks.json", "notebooksGrid");
    loadCategory("cameras", "/assets/json/product/main-cameras.json", "camerasGrid");
loadCategory("computers", "/assets/json/product/main-computers.json", "computersGrid");
loadCategory("consoles", "/assets/json/product/main-consoles.json", "consolesGrid");
loadCategory("headphones", "/assets/json/product/main-headphones.json", "headphonesGrid");
loadCategory("smartwatch", "/assets/json/product/main-smartwatch.json", "smartwatchGrid");
loadCategory("tablets", "/assets/json/product/main-tablets.json", "tabletsGrid");
loadCategory("accessories", "/assets/json/product/main-accessories.json", "accessoriesGrid");
