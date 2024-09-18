document.addEventListener("DOMContentLoaded", function () {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Lazy load images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.01,
    }
  );

  images.forEach((img) => imageObserver.observe(img));

  // Infinite scroll for post feed
  const postfeed = document.querySelector(".gh-postfeed");
  let nextPageUrl = document.querySelector("link[rel=next]")?.href;

  if (postfeed && nextPageUrl) {
    const loadMorePosts = (entries, observer) => {
      if (entries[0].isIntersecting && nextPageUrl) {
        fetch(nextPageUrl)
          .then((response) => response.text())
          .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newPosts = doc.querySelectorAll(".gh-card");
            newPosts.forEach((post) => postfeed.appendChild(post));
            nextPageUrl = doc.querySelector("link[rel=next]")?.href;
            if (!nextPageUrl) {
              observer.unobserve(entries[0].target);
            }
          });
      }
    };

    const observer = new IntersectionObserver(loadMorePosts, {
      rootMargin: "200px",
    });

    observer.observe(postfeed.lastElementChild);
  }

  // Add 'data-src' to post images for lazy loading
  document.querySelectorAll(".gh-content img").forEach((img) => {
    img.dataset.src = img.src;
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // 1x1 transparent png
  });

  // Fade-in animation for posts
  const fadeInPosts = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  };

  const fadeInObserver = new IntersectionObserver(fadeInPosts, {
    threshold: 0.1,
  });

  document.querySelectorAll(".gh-card").forEach((card) => {
    fadeInObserver.observe(card);
  });
});
