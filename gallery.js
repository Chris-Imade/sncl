// gallery.js
export class GalleryManager {
  constructor(containerId, modalId, sanityClient) {
    // Sanity client
    this.sanityClient = sanityClient;

    // DOM elements
    this.container = document.getElementById(containerId);
    this.modal = document.getElementById(modalId);
    this.modalImage = document.getElementById("modalImage");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalDescription = document.getElementById("modalDescription");
    this.closeBtn = document.getElementById("closeModal");
    this.nextBtn = document.getElementById("nextBtn");

    this.articles = [];
    this.currentIndex = 0;

    this.bindEvents();
  }

  bindEvents() {
    this.closeBtn.onclick = () => this.closeModal();
    this.nextBtn.onclick = () => this.showNext();
    window.onclick = (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    };
  }

  showSkeletonLoader() {
    // Clear existing content
    this.container.innerHTML = "";

    // Create 3 skeleton items
    for (let i = 0; i < 3; i++) {
      const skeletonHtml = `
        <div class="col-md-4 skeleton-item">
          <div class="card">
            <div class="skeleton-image"></div>
            <div class="card-body">
              <div class="skeleton-title"></div>
              <div class="skeleton-text"></div>
            </div>
          </div>
        </div>
      `;
      this.container.insertAdjacentHTML("beforeend", skeletonHtml);
    }
  }

  async loadGalleryData() {
    try {
      this.showSkeletonLoader();

      // Query Sanity for gallery items
      const query = '*[_type == "galleryItem"] | order(_createdAt desc)';
      const results = await this.sanityClient.fetch(query);

      // Transform Sanity data to match expected format
      this.articles = results.map((item) => ({
        id: item._id,
        title: item.title,
        description: item.description || "",
        category: item.category || "",
        featured: item.featured || false,
        imageUrl: item.image
          ? this.sanityClient.imageUrl(item.image).width(800).url()
          : "",
      }));

      console.log("Loaded articles from Sanity:", this.articles);
      this.renderGallery();
    } catch (error) {
      console.error("Error loading gallery data:", error);
      this.container.innerHTML = `
        <div class="alert alert-danger">
          Failed to load gallery items. Please try again later.
        </div>
      `;
    }
  }

  renderGallery() {
    this.container.innerHTML = "";

    if (this.articles.length === 0) {
      this.container.innerHTML = `
        <div class="col-12 empty-state">
          <h3>No Gallery Items Yet</h3>
          <p>Gallery items will appear here once they are published in Sanity Studio.</p>
        </div>
      `;
      return;
    }

    this.articles.forEach((article, index) => {
      const categoryBadge = article.category
        ? `<span class="category-badge ${article.category}">${article.category}</span>`
        : "";

      const featuredBadge = article.featured
        ? '<span class="featured-badge">Featured</span>'
        : "";

      const articleHtml = `
        <div class="col-md-4 pbmit-gallery-item">
          <div class="pbmit-portfolio-box">
            ${featuredBadge}
            <div class="pbmit-portfolio-image">
              <img src="${article.imageUrl}" alt="${article.title}" loading="lazy">
            </div>
            <div class="pbmit-portfolio-content">
              ${categoryBadge}
              <h3>${article.title}</h3>
            </div>
          </div>
        </div>
      `;
      this.container.insertAdjacentHTML("beforeend", articleHtml);
    });

    // Add click handlers to the portfolio boxes
    this.container
      .querySelectorAll(".pbmit-portfolio-box")
      .forEach((item, index) => {
        item.onclick = () => this.openModal(index);
      });

    // Add navigation button handlers
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn) {
      prevBtn.onclick = () => this.showPrevious();
    }

    if (nextBtn) {
      nextBtn.onclick = () => this.showNext();
    }
  }

  showPrevious() {
    this.currentIndex =
      (this.currentIndex - 1 + this.articles.length) % this.articles.length;
    this.openModal(this.currentIndex);
  }

  openModal(index) {
    this.currentIndex = index;
    const article = this.articles[index];

    this.modalImage.src = article.imageUrl;
    this.modalTitle.textContent = article.title;
    this.modalDescription.textContent =
      article.description || "No description available.";

    // Add category badge to modal if exists
    const existingBadge =
      this.modalTitle.parentElement.querySelector(".category-badge");
    if (existingBadge) existingBadge.remove();

    if (article.category) {
      const categoryBadge = document.createElement("span");
      categoryBadge.className = `category-badge ${article.category}`;
      categoryBadge.textContent = article.category;
      this.modalTitle.parentElement.insertBefore(
        categoryBadge,
        this.modalTitle
      );
    }

    this.modal.style.display = "block";
    this.modal.classList.add("show");
  }

  closeModal() {
    this.modal.classList.remove("show");
    setTimeout(() => {
      this.modal.style.display = "none";
    }, 300);
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.articles.length;
    this.openModal(this.currentIndex);
  }
}
