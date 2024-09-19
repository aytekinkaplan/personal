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
          img.addEventListener("load", () => {
            img.classList.add("fade-in");
          });
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
            newPosts.forEach((post) => {
              post.classList.add("fade-in");
              postfeed.appendChild(post);
            });
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

  // Responsive navigation menu
  const menuToggle = document.querySelector(".gh-burger");
  const menu = document.querySelector(".gh-head-menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("is-active");
      menuToggle.classList.toggle("is-active");
    });
  }

  // Reading progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "reading-progress-bar";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });

  // Dark mode toggle
  const darkModeToggle = document.createElement("button");
  darkModeToggle.innerHTML = "🌓";
  darkModeToggle.className = "dark-mode-toggle";
  document.body.appendChild(darkModeToggle);

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode")
    );
  });

  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
});
