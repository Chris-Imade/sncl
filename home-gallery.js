// home-gallery.js - Load gallery items from Sanity for home page
import { createClient } from "https://esm.sh/@sanity/client@6.10.0";
import imageUrlBuilder from "https://esm.sh/@sanity/image-url@1.0.2";

// Initialize Sanity client
const sanityClient = createClient({
  projectId: "kzngr9hh",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

// Add image URL builder helper
const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

// Load gallery items for home page
async function loadHomeGallery() {
  const container = document.getElementById("homeGalleryContainer");

  if (!container) return;

  try {
    // Show loading state
    container.innerHTML = `
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    // Query Sanity for gallery items (limit to 6 for home page)
    const query = '*[_type == "galleryItem"] | order(_createdAt desc)[0...6]';
    const results = await sanityClient.fetch(query);

    // Clear loading state
    container.innerHTML = "";

    if (results.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <p>No gallery items available yet.</p>
        </div>
      `;
      return;
    }

    // Render gallery items
    results.forEach((item) => {
      const imageUrl = item.image ? urlFor(item.image).width(800).url() : "";

      const categoryTag = item.category
        ? `<a href="gallery.html" rel="tag">${item.category}</a>`
        : '<a href="gallery.html" rel="tag">Gallery</a>';

      const articleHtml = `
        <div class="col-md-6 col-lg-4">
          <article class="pbmit-portfolio-style-1">
            <div class="pbminfotech-post-item">
              <div class="pbmit-featured-img-wrapper">
                <div class="pbmit-featured-wrapper">
                  <img src="${imageUrl}" class="img-fluid" alt="${
        item.title || "Gallery Image"
      }" />
                </div>
              </div>
              <div class="pbminfotech-box-content">
                <div class="pbminfotech-box-content-inner">
                  <div class="pbmit-pf-box-title">
                    <h3><a href="gallery.html">${
                      item.title || "Untitled"
                    }</a></h3>
                  </div>
                  <div class="pbminfotech-box-category">
                    ${categoryTag}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      `;

      container.insertAdjacentHTML("beforeend", articleHtml);
    });
  } catch (error) {
    console.error("Error loading gallery data:", error);
    container.innerHTML = `
      <div class="col-12 text-center">
        <div class="alert alert-danger">
          Failed to load gallery items. Please try again later.
        </div>
      </div>
    `;
  }
}

// Load gallery when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadHomeGallery);
} else {
  loadHomeGallery();
}
