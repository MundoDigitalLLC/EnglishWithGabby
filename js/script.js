/* =========================================================
   ENGLISH WITH GABBY
   COMPLETE SITE JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const SITE_CONFIG = {

  defaultLanguage: "en",

  supportedLanguages: [
    "en",
    "es"
  ],

  languageStorageKey:
    "englishWithGabbyLanguage",

  whatsappNumber:
    "593987807383"

};


/* =========================================================
   START SITE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initializeLanguage();

    initializeMobileMenu();

    initializeProductGalleries();

    initializeSmoothScrolling();

    initializeCurrentYear();

    initializeExternalLinks();

  }
);


/* =========================================================
   LANGUAGE
========================================================= */

function getInitialLanguage() {

  try {

    const savedLanguage =
      localStorage.getItem(
        SITE_CONFIG.languageStorageKey
      );


    if (
      savedLanguage &&
      SITE_CONFIG.supportedLanguages.includes(
        savedLanguage
      )
    ) {

      return savedLanguage;

    }

  } catch (error) {

    console.warn(
      "Could not read language preference.",
      error
    );

  }


  const browserLanguage =
    (
      navigator.language ||
      navigator.userLanguage ||
      ""
    ).toLowerCase();


  if (
    browserLanguage.startsWith("es")
  ) {

    return "es";

  }


  return SITE_CONFIG.defaultLanguage;

}


/* =========================================================
   INITIALIZE LANGUAGE BUTTONS
========================================================= */

function initializeLanguage() {

  const buttons =
    document.querySelectorAll(
      ".language-btn[data-language]"
    );


  const initialLanguage =
    getInitialLanguage();


  setLanguage(
    initialLanguage,
    false
  );


  buttons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const language =
            button.dataset.language;


          if (
            !SITE_CONFIG.supportedLanguages.includes(
              language
            )
          ) {

            return;

          }


          setLanguage(
            language,
            true
          );

        }
      );

    }
  );

}


/* =========================================================
   SET LANGUAGE
========================================================= */

function setLanguage(
  language,
  savePreference = true
) {

  if (
    !SITE_CONFIG.supportedLanguages.includes(
      language
    )
  ) {

    language =
      SITE_CONFIG.defaultLanguage;

  }


  if (
    typeof translations === "undefined" ||
    !translations[language]
  ) {

    console.error(
      "Translation dictionary unavailable."
    );

    return;

  }


  document.documentElement.lang =
    language;


  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      (element) => {

        const key =
          element.dataset.i18n;


        const value =
          translations[language][key];


        if (
          typeof value === "string"
        ) {

          element.textContent =
            value;

        }

      }
    );


  document
    .querySelectorAll(
      ".language-btn[data-language]"
    )
    .forEach(
      (button) => {

        const active =
          button.dataset.language ===
          language;


        button.classList.toggle(
          "active",
          active
        );


        button.setAttribute(
          "aria-pressed",
          String(active)
        );

      }
    );


  updateAccessibilityLabels(
    language
  );


  updateWhatsAppLinks(
    language
  );


  if (savePreference) {

    try {

      localStorage.setItem(
        SITE_CONFIG.languageStorageKey,
        language
      );

    } catch (error) {

      console.warn(
        "Could not save language preference.",
        error
      );

    }

  }


  document.dispatchEvent(
    new CustomEvent(
      "languageChanged",
      {
        detail: {
          language
        }
      }
    )
  );

}


/* =========================================================
   ACCESSIBILITY LABELS
========================================================= */

function updateAccessibilityLabels(
  language
) {

  const menuToggle =
    document.querySelector(
      ".menu-toggle"
    );


  if (menuToggle) {

    const open =
      menuToggle.getAttribute(
        "aria-expanded"
      ) === "true";


    menuToggle.setAttribute(

      "aria-label",

      language === "es"

        ? (
            open
              ? "Cerrar menú de navegación"
              : "Abrir menú de navegación"
          )

        : (
            open
              ? "Close navigation menu"
              : "Open navigation menu"
          )

    );

  }


  document
    .querySelectorAll(
      ".floating-whatsapp"
    )
    .forEach(
      (button) => {

        button.setAttribute(

          "aria-label",

          language === "es"

            ? "Escríbele a English With Gabby por WhatsApp"

            : "Message English With Gabby on WhatsApp"

        );

      }
    );

}


/* =========================================================
   WHATSAPP
========================================================= */

function updateWhatsAppLinks(
  language
) {

  if (
    typeof translations === "undefined" ||
    !translations[language]
  ) {

    return;

  }


  const message =
    translations[language][
      "whatsapp.message"
    ];


  if (!message) {

    return;

  }


  const url =
    "https://wa.me/" +
    SITE_CONFIG.whatsappNumber +
    "?text=" +
    encodeURIComponent(message);


  document
    .querySelectorAll(
      "[data-whatsapp-link]"
    )
    .forEach(
      (link) => {

        link.href =
          url;

      }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function initializeMobileMenu() {

  const toggle =
    document.querySelector(
      ".menu-toggle"
    );


  const menu =
    document.getElementById(
      "mobileMenu"
    );


  if (
    !toggle ||
    !menu
  ) {

    return;

  }


  toggle.addEventListener(
    "click",
    () => {

      if (
        menu.classList.contains(
          "open"
        )
      ) {

        closeMobileMenu(
          toggle,
          menu
        );

      } else {

        openMobileMenu(
          toggle,
          menu
        );

      }

    }
  );


  menu
    .querySelectorAll("a")
    .forEach(
      (link) => {

        link.addEventListener(
          "click",
          () => {

            closeMobileMenu(
              toggle,
              menu
            );

          }
        );

      }
    );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        menu.classList.contains(
          "open"
        )
      ) {

        closeMobileMenu(
          toggle,
          menu
        );


        toggle.focus();

      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth >= 900 &&
        menu.classList.contains(
          "open"
        )
      ) {

        closeMobileMenu(
          toggle,
          menu
        );

      }

    }
  );

}


/* =========================================================
   OPEN MOBILE MENU
========================================================= */

function openMobileMenu(
  toggle,
  menu
) {

  menu.classList.add(
    "open"
  );


  toggle.classList.add(
    "active"
  );


  toggle.setAttribute(
    "aria-expanded",
    "true"
  );


  const language =
    document.documentElement.lang ||
    SITE_CONFIG.defaultLanguage;


  toggle.setAttribute(

    "aria-label",

    language === "es"
      ? "Cerrar menú de navegación"
      : "Close navigation menu"

  );

}


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

function closeMobileMenu(
  toggle,
  menu
) {

  menu.classList.remove(
    "open"
  );


  toggle.classList.remove(
    "active"
  );


  toggle.setAttribute(
    "aria-expanded",
    "false"
  );


  const language =
    document.documentElement.lang ||
    SITE_CONFIG.defaultLanguage;


  toggle.setAttribute(

    "aria-label",

    language === "es"
      ? "Abrir menú de navegación"
      : "Open navigation menu"

  );

}


/* =========================================================
   PRODUCT GALLERIES
========================================================= */

function initializeProductGalleries() {

  initializeGallery({

    mainImageSelector:
      "#homeBrilliantImage",

    thumbnailSelector:
      ".home-product-thumb",

    imageDataAttribute:
      "homeProductImage",

    altDataAttribute:
      "homeProductAlt"

  });


  initializeGallery({

    mainImageSelector:
      "#brilliantMainImage",

    thumbnailSelector:
      ".brilliant-thumb",

    imageDataAttribute:
      "brilliantImage",

    altDataAttribute:
      "brilliantAlt"

  });

}


/* =========================================================
   GENERIC GALLERY FUNCTION
========================================================= */

function initializeGallery({

  mainImageSelector,

  thumbnailSelector,

  imageDataAttribute,

  altDataAttribute

}) {

  const mainImage =
    document.querySelector(
      mainImageSelector
    );


  const thumbnails =
    document.querySelectorAll(
      thumbnailSelector
    );


  if (
    !mainImage ||
    !thumbnails.length
  ) {

    return;

  }


  thumbnails.forEach(
    (thumbnail, index) => {

      thumbnail.setAttribute(
        "aria-pressed",
        index === 0
          ? "true"
          : "false"
      );


      thumbnail.addEventListener(
        "click",
        () => {

          const image =
            thumbnail.dataset[
              imageDataAttribute
            ];


          const alt =
            thumbnail.dataset[
              altDataAttribute
            ];


          if (!image) {

            return;

          }


          mainImage.classList.add(
            "changing"
          );


          window.setTimeout(
            () => {

              mainImage.src =
                image;


              if (alt) {

                mainImage.alt =
                  alt;

              }


              mainImage.classList.remove(
                "changing"
              );

            },
            120
          );


          thumbnails.forEach(
            (item) => {

              item.classList.remove(
                "active"
              );


              item.setAttribute(
                "aria-pressed",
                "false"
              );

            }
          );


          thumbnail.classList.add(
            "active"
          );


          thumbnail.setAttribute(
            "aria-pressed",
            "true"
          );

        }
      );

    }
  );

}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

function initializeSmoothScrolling() {

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(
      (link) => {

        link.addEventListener(
          "click",
          (event) => {

            const href =
              link.getAttribute(
                "href"
              );


            if (
              !href ||
              href === "#"
            ) {

              return;

            }


            const target =
              document.querySelector(
                href
              );


            if (!target) {

              return;

            }


            event.preventDefault();


            const reducedMotion =
              window.matchMedia(
                "(prefers-reduced-motion: reduce)"
              ).matches;


            target.scrollIntoView({

              behavior:
                reducedMotion
                  ? "auto"
                  : "smooth",

              block:
                "start"

            });

          }
        );

      }
    );

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function initializeCurrentYear() {

  document
    .querySelectorAll(
      "#currentYear"
    )
    .forEach(
      (element) => {

        element.textContent =
          new Date().getFullYear();

      }
    );

}


/* =========================================================
   EXTERNAL LINK SECURITY
========================================================= */

function initializeExternalLinks() {

  document
    .querySelectorAll(
      'a[target="_blank"]'
    )
    .forEach(
      (link) => {

        const existingRel =
          link.getAttribute(
            "rel"
          ) || "";


        if (
          !existingRel.includes(
            "noopener"
          )
        ) {

          link.setAttribute(

            "rel",

            (
              existingRel +
              " noopener noreferrer"
            ).trim()

          );

        }

      }
    );

}
