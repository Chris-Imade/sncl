// gallery.js
export class GalleryManager {
  constructor(
    containerId,
    modalId,
    firestoreDb,
    firestoreCollection,
    getDocsFunc
  ) {
    // Add getDocsFunc parameter
    // Firebase dependencies
    this.db = firestoreDb;
    this.collection = firestoreCollection;
    this.getDocs = getDocsFunc; // Store getDocs function

    // Rest of the constructor remains the same
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
      const querySnapshot = await this.getDocs(this.collection); // Use this.getDocs
      this.articles = [];

      querySnapshot.forEach((doc) => {
        this.articles.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log("Loaded articles:", this.articles);
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
        <div class="col-12 text-center">
          <p>No images available at the moment.</p>
        </div>
      `;
      return;
    }

    this.articles.forEach((article, index) => {
      const articleHtml = `
        <div class="col-md-4 pbmit-gallery-item">
          <div class="pbmit-portfolio-box">
            <div class="pbmit-portfolio-image">
              <img src="${article.imageUrl}" alt="${article.title}">
            </div>
            <div class="pbmit-portfolio-content">
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
    this.modalDescription.textContent = article.description;
    this.modal.style.display = "block";
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.articles.length;
    this.openModal(this.currentIndex);
  }
}
