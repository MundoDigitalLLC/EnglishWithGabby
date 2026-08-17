/* =========================================================
   ENGLISH WITH GABBY
   MAIN JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const SITE_CONFIG = {
  defaultLanguage: "en",
  supportedLanguages: ["en", "es"],
  languageStorageKey: "englishWithGabbyLanguage",
  whatsappNumber: "593987807383"
};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeLanguage();
  initializeMobileMenu();
  initializeBrilliantGallery();
  initializeSmoothScrolling();
  initializeCurrentYear();

});


/* =========================================================
   LANGUAGE SYSTEM
========================================================= */

/*
   Determine which language should load.

   Priority:
   1. Previously selected language in localStorage
   2. Browser language if Spanish
   3. English by default
*/

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
      "Language preference could not be read.",
      error
    );

  }


  const browserLanguage =
    (
      navigator.language ||
      navigator.userLanguage ||
      ""
    ).toLowerCase();


  if (browserLanguage.startsWith("es")) {
    return "es";
  }


  return SITE_CONFIG.defaultLanguage;

}



/* =========================================================
   INITIALIZE LANGUAGE
========================================================= */

function initializeLanguage() {

  const languageButtons =
    document.querySelectorAll(
      ".language-btn[data-language]"
    );


  if (!languageButtons.length) {
    return;
  }


  const initialLanguage =
    getInitialLanguage();


  setLanguage(
    initialLanguage,
    false
  );


  languageButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const selectedLanguage =
          button.dataset.language;


        if (
          !SITE_CONFIG.supportedLanguages.includes(
            selectedLanguage
          )
        ) {
          return;
        }


        setLanguage(
          selectedLanguage,
          true
        );

      }
    );

  });

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


  /*
     Make sure translations.js loaded correctly.
  */

  if (
    typeof translations === "undefined" ||
    !translations[language]
  ) {

    console.error(
      "Translation dictionary is unavailable."
    );

    return;

  }


  /*
     Update the HTML language attribute.
  */

  document.documentElement.lang =
    language;


  /*
     Translate all visible elements using data-i18n.
  */

  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {

      const translationKey =
        element.dataset.i18n;


      const translatedText =
        translations[language][translationKey];


      if (
        typeof translatedText === "string"
      ) {

        element.textContent =
          translatedText;

      }

    });


  /*
     Update language button states.
  */

  document
    .querySelectorAll(
      ".language-btn[data-language]"
    )
    .forEach((button) => {

      const isActive =
        button.dataset.language ===
        language;


      button.classList.toggle(
        "active",
        isActive
      );


      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );

    });


  /*
     Update translated accessibility labels.
  */

  updateAccessibilityLabels(
    language
  );


  /*
     Change WhatsApp message depending
     on selected language.
  */

  updateWhatsAppLinks(
    language
  );


  /*
     Save preference so the language
     persists between pages.
  */

  if (savePreference) {

    try {

      localStorage.setItem(
        SITE_CONFIG.languageStorageKey,
        language
      );

    } catch (error) {

      console.warn(
        "Language preference could not be saved.",
        error
      );

    }

  }


  /*
     Custom event.

     This lets future pages respond
     whenever the language changes.
  */

  document.dispatchEvent(
    new CustomEvent(
      "languageChanged",
      {
        detail: {
          language: language
        }
      }
    )
  );

}



/* =========================================================
   ACCESSIBILITY LABEL TRANSLATIONS
========================================================= */

function updateAccessibilityLabels(
  language
) {

  const menuToggle =
    document.querySelector(
      ".menu-toggle"
    );


  if (menuToggle) {

    const menuIsOpen =
      menuToggle.getAttribute(
        "aria-expanded"
      ) === "true";


    if (language === "es") {

      menuToggle.setAttribute(
        "aria-label",
        menuIsOpen
          ? "Cerrar menú de navegación"
          : "Abrir menú de navegación"
      );

    } else {

      menuToggle.setAttribute(
        "aria-label",
        menuIsOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );

    }

  }


  const whatsappButton =
    document.querySelector(
      ".floating-whatsapp"
    );


  if (whatsappButton) {

    whatsappButton.setAttribute(
      "aria-label",
      language === "es"
        ? "Escríbele a English With Gabby por WhatsApp"
        : "Message English With Gabby on WhatsApp"
    );

  }

}



/* =========================================================
   WHATSAPP LANGUAGE SYSTEM
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


  const whatsappURL =
    "https://wa.me/" +
    SITE_CONFIG.whatsappNumber +
    "?text=" +
    encodeURIComponent(message);


  document
    .querySelectorAll(
      "[data-whatsapp-link]"
    )
    .forEach((link) => {

      link.href =
        whatsappURL;

    });

}



/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initializeMobileMenu() {

  const menuToggle =
    document.querySelector(
      ".menu-toggle"
    );


  const mobileMenu =
    document.getElementById(
      "mobileMenu"
    );


  if (
    !menuToggle ||
    !mobileMenu
  ) {
    return;
  }


  /*
     Toggle menu when hamburger is tapped.
  */

  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        mobileMenu.classList.contains(
          "open"
        );


      if (isOpen) {

        closeMobileMenu(
          menuToggle,
          mobileMenu
        );

      } else {

        openMobileMenu(
          menuToggle,
          mobileMenu
        );

      }

    }
  );


  /*
     Close after selecting a navigation link.
  */

  mobileMenu
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          closeMobileMenu(
            menuToggle,
            mobileMenu
          );

        }
      );

    });


  /*
     Close when Escape is pressed.
  */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        mobileMenu.classList.contains(
          "open"
        )
      ) {

        closeMobileMenu(
          menuToggle,
          mobileMenu
        );


        menuToggle.focus();

      }

    }
  );


  /*
     If the browser becomes desktop-sized
     while the menu is open, reset it.
  */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth >= 900 &&
        mobileMenu.classList.contains(
          "open"
        )
      ) {

        closeMobileMenu(
          menuToggle,
          mobileMenu
        );

      }

    }
  );

}



/* =========================================================
   OPEN MOBILE MENU
========================================================= */

function openMobileMenu(
  menuToggle,
  mobileMenu
) {

  mobileMenu.classList.add(
    "open"
  );


  menuToggle.classList.add(
    "active"
  );


  menuToggle.setAttribute(
    "aria-expanded",
    "true"
  );


  const language =
    document.documentElement.lang ||
    SITE_CONFIG.defaultLanguage;


  menuToggle.setAttribute(
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
  menuToggle,
  mobileMenu
) {

  mobileMenu.classList.remove(
    "open"
  );


  menuToggle.classList.remove(
    "active"
  );


  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );


  const language =
    document.documentElement.lang ||
    SITE_CONFIG.defaultLanguage;


  menuToggle.setAttribute(
    "aria-label",
    language === "es"
      ? "Abrir menú de navegación"
      : "Open navigation menu"
  );

}



/* =========================================================
   BRILLIANT HOMEPAGE PRODUCT GALLERY
========================================================= */

function initializeBrilliantGallery() {

  const mainImage =
    document.getElementById(
      "homeBrilliantImage"
    );


  const thumbnails =
    document.querySelectorAll(
      ".home-product-thumb"
    );


  if (
    !mainImage ||
    !thumbnails.length
  ) {
    return;
  }


  thumbnails.forEach(
    (thumbnail) => {

      thumbnail.addEventListener(
        "click",
        () => {

          const newImage =
            thumbnail.dataset
              .homeProductImage;


          const newAlt =
            thumbnail.dataset
              .homeProductAlt;


          if (!newImage) {
            return;
          }


          /*
             Small transition effect.
          */

          mainImage.classList.add(
            "changing"
          );


          window.setTimeout(
            () => {

              mainImage.src =
                newImage;


              if (newAlt) {

                mainImage.alt =
                  newAlt;

              }


              mainImage.classList.remove(
                "changing"
              );

            },
            120
          );


          /*
             Update active thumbnail.
          */

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


  /*
     Set correct accessibility state
     when the page first loads.
  */

  thumbnails.forEach(
    (thumbnail, index) => {

      thumbnail.setAttribute(
        "aria-pressed",
        index === 0
          ? "true"
          : "false"
      );

    }
  );

}



/* =========================================================
   SMOOTH SCROLLING
========================================================= */

function initializeSmoothScrolling() {

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const targetID =
            link.getAttribute(
              "href"
            );


          if (
            !targetID ||
            targetID === "#"
          ) {
            return;
          }


          const target =
            document.querySelector(
              targetID
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          const reduceMotion =
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;


          target.scrollIntoView({
            behavior:
              reduceMotion
                ? "auto"
                : "smooth",

            block:
              "start"
          });

        }
      );

    });

}



/* =========================================================
   COPYRIGHT YEAR
========================================================= */

function initializeCurrentYear() {

  const yearElement =
    document.getElementById(
      "currentYear"
    );


  if (!yearElement) {
    return;
  }


  yearElement.textContent =
    new Date().getFullYear();

}
