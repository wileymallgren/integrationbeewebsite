const accordions = document.querySelectorAll(".accordion");

accordions.forEach(button => {
  button.addEventListener("click", function (e) {
    const panel = this.nextElementSibling;
    const isMain = this.parentElement === document.body;

    // Main accordion: close other main panels (and nested ones within them)
    if (isMain) {
      document.querySelectorAll("body > .accordion").forEach(sibling => {
        if (sibling !== this) {
          const sibPanel = sibling.nextElementSibling;
          sibPanel.style.maxHeight = null;
          sibPanel.querySelectorAll(".panel").forEach(nestedPanel => {
            nestedPanel.style.maxHeight = null;
          });
        }
      });
    }

    // Toggle the current panel
    if (panel.style.maxHeight && panel.style.maxHeight !== "0px") {
      panel.style.maxHeight = null;
      if (isMain) {
        // When closing a main panel, also close its nested panels.
        panel.querySelectorAll(".panel").forEach(nestedPanel => {
          nestedPanel.style.maxHeight = null;
        });
      }
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

    // For nested accordions, update the main panel's height dynamically during transition
    if (!isMain) {
      const mainPanel = this.closest("body > .panel");
      if (mainPanel) {
        // Start a loop to update mainPanel's maxHeight while the nested panel is transitioning.
        let updating = true;
        const updateParentHeight = () => {
          if (!updating) {
            return;
          }
          mainPanel.style.maxHeight = mainPanel.scrollHeight + "px";
          requestAnimationFrame(updateParentHeight);
        };
        requestAnimationFrame(updateParentHeight);

        // When the nested panel finishes its transition, stop the loop.
        panel.addEventListener("transitionend", function handler(e) {
          if (e.propertyName === "max-height") {
            updating = false;
            mainPanel.style.maxHeight = mainPanel.scrollHeight + "px";
            panel.removeEventListener("transitionend", handler);
          }
        });
      }
    }

    // Prevent event bubbling so that a nested click doesn't affect the main accordion.
    e.stopPropagation();
  });
});
