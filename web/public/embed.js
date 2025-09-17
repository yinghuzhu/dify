/** this file is used to embed the chatbot in a website
 * the difyChatbotConfig should be defined in the html file before this script is included
 * the difyChatbotConfig should contain the token of the chatbot
 * the token can be found in the chatbot settings page
 */

// attention: This JavaScript script must be placed after the <body> element. Otherwise, the script will not work.

(function () {
  // Constants for DOM element IDs and configuration key
  const configKey = "difyChatbotConfig";
  const buttonId = "dify-chatbot-bubble-button";
  const iframeId = "dify-chatbot-bubble-window";
  const config = window[configKey];
  let isExpanded = false;

  const originalIframeStyleText = `
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    top: unset;
    right: var(--${buttonId}-right, 1rem); /* Align with dify-chatbot-bubble-button. */
    bottom: var(--${buttonId}-bottom, 1rem); /* Align with dify-chatbot-bubble-button. */
    left: unset;
    width: 24rem;
    max-width: calc(100vw - 2rem);
    height: 43.75rem;
    max-height: calc(100vh - 6rem);
    border: none;
    border-radius: 1rem;
    z-index: 2147483640;
    overflow: hidden;
    user-select: none;
    transition-property: width, height;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  `

  const expandedIframeStyleText = `
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    top: unset;
    right: var(--${buttonId}-right, 1rem); /* Align with dify-chatbot-bubble-button. */
    bottom: var(--${buttonId}-bottom, 1rem); /* Align with dify-chatbot-bubble-button. */
    left: unset;
    min-width: 24rem;
    width: 48%;
    max-width: 40rem; /* Match mobile breakpoint*/
    min-height: 43.75rem;
    height: 88%;
    max-height: calc(100vh - 6rem);
    border: none;
    border-radius: 1rem;
    z-index: 2147483640;
    overflow: hidden;
    user-select: none;
    transition-property: width, height;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  `

  // Main function to embed the chatbot
  async function embedChatbot() {
    let isDragging = false

    if (!config || !config.token) {
      console.error(`${configKey} is empty or token is not provided`);
      return;
    }

    // Custom icons for open and close states (embedded Base64 SVG)
    const openIconBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJDMiAxMy41NCAyLjM2IDE1LjAxIDMgMTYuMzFWMjJMOC42OSAxOUM5Ljk5IDE5LjY0IDExLjQ2IDIwIDEzIDIwSDEyQzE3LjUyIDIwIDIyIDE1LjUyIDIyIDEwQzIyIDQuNDggMTcuNTIgMCAxMiAwVjJaIiBmaWxsPSIjM0I4MkY2Ii8+CiAgPGNpcmNsZSBjeD0iOCIgY3k9IjEyIiByPSIxLjUiIGZpbGw9IndoaXRlIi8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMS41IiBmaWxsPSJ3aGl0ZSIvPgogIDxjaXJjbGUgY3g9IjE2IiBjeT0iMTIiIHI9IjEuNSIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
    const closeIconBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTggNkw2IDE4TTYgNkwxOCAxOCIgc3Ryb2tlPSIjNkI3MjgwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=';
    
    const svgIcons = `<img id="openIcon" src="${openIconBase64}" width="24" height="24" style="display:block;" alt="Open Chat" />
      <img id="closeIcon" src="${closeIconBase64}" width="24" height="24" style="display:none;" alt="Close Chat" />
      `;

    async function compressAndEncodeBase64(input) {
      const uint8Array = new TextEncoder().encode(input);
      const compressedStream = new Response(
        new Blob([uint8Array])
          .stream()
          .pipeThrough(new CompressionStream("gzip"))
      ).arrayBuffer();
      const compressedUint8Array = new Uint8Array(await compressedStream);
      return btoa(String.fromCharCode(...compressedUint8Array));
    }

    async function getCompressedInputsFromConfig() {
      const inputs = config?.inputs || {};
      const compressedInputs = {};
      await Promise.all(
        Object.entries(inputs).map(async ([key, value]) => {
          compressedInputs[key] = await compressAndEncodeBase64(value);
        })
      );
      return compressedInputs;
    }

    async function getCompressedSystemVariablesFromConfig() {
      const systemVariables = config?.systemVariables || {};
      const compressedSystemVariables = {};
      await Promise.all(
        Object.entries(systemVariables).map(async ([key, value]) => {
          compressedSystemVariables[`sys.${key}`] = await compressAndEncodeBase64(value);
        })
      );
      return compressedSystemVariables;
    }

    async function getCompressedUserVariablesFromConfig() {
      const userVariables = config?.userVariables || {};
      const compressedUserVariables = {};
      await Promise.all(
        Object.entries(userVariables).map(async ([key, value]) => {
          compressedUserVariables[`user.${key}`] = await compressAndEncodeBase64(value);
        })
      );
      return compressedUserVariables;
    }

    const params = new URLSearchParams({
      ...await getCompressedInputsFromConfig(),
      ...await getCompressedSystemVariablesFromConfig(),
      ...await getCompressedUserVariablesFromConfig()
    });

    const baseUrl =
      config.baseUrl || `https://${config.isDev ? "dev." : ""}udify.app`;
    const targetOrigin = new URL(baseUrl).origin;

    // pre-check the length of the URL
    const iframeUrl = `${baseUrl}/chatbot/${config.token}?${params}`;
    // 1) CREATE the iframe immediately, so it can load in the background:
    const preloadedIframe = createIframe();
    // 2) HIDE it by default:
    preloadedIframe.style.display = "none";
    // 3) APPEND it to the document body right away:
    document.body.appendChild(preloadedIframe);
    // ─── End Fix Snippet
    if (iframeUrl.length > 2048) {
      console.error("The URL is too long, please reduce the number of inputs to prevent the bot from failing to load");
    }

    // Function to create the iframe for the chatbot
    function createIframe() {
      const iframe = document.createElement("iframe");
      iframe.allow = "fullscreen;microphone";
      iframe.title = "dify chatbot bubble window";
      iframe.id = iframeId;
      iframe.src = iframeUrl;
      iframe.style.cssText = originalIframeStyleText;

      return iframe;
    }

    // Function to reset the iframe position
    function resetIframePosition() {
      if (window.innerWidth <= 640) return;

      const targetIframe = document.getElementById(iframeId);
      const targetButton = document.getElementById(buttonId);
      if (targetIframe && targetButton) {
        const buttonRect = targetButton.getBoundingClientRect();
        // We don't necessarily need iframeRect anymore with the center logic

        const viewportCenterY = window.innerHeight / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        if (buttonCenterY < viewportCenterY) {
          targetIframe.style.top = `var(--${buttonId}-bottom, 1rem)`;
          targetIframe.style.bottom = 'unset';
        } else {
          targetIframe.style.bottom = `var(--${buttonId}-bottom, 1rem)`;
          targetIframe.style.top = 'unset';
        }

        const viewportCenterX = window.innerWidth / 2;
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;

        if (buttonCenterX < viewportCenterX) {
          targetIframe.style.left = `var(--${buttonId}-right, 1rem)`;
          targetIframe.style.right = 'unset';
        } else {
          targetIframe.style.right = `var(--${buttonId}-right, 1rem)`;
          targetIframe.style.left = 'unset';
        }
      }
    }

    function toggleExpand() {
      isExpanded = !isExpanded;

      const targetIframe = document.getElementById(iframeId);
      if (!targetIframe) return;

      if (isExpanded) {
        targetIframe.style.cssText = expandedIframeStyleText;
      } else {
        targetIframe.style.cssText = originalIframeStyleText;
      }
      resetIframePosition();
    }

    window.addEventListener('message', (event) => {
      if (event.origin !== targetOrigin) return;

      const targetIframe = document.getElementById(iframeId);
      if (!targetIframe || event.source !== targetIframe.contentWindow) return;

      if (event.data.type === 'dify-chatbot-iframe-ready') {
        targetIframe.contentWindow?.postMessage(
          {
            type: 'dify-chatbot-config',
            payload: {
              isToggledByButton: true,
              isDraggable: !!config.draggable,
            },
          },
          targetOrigin
        );
      }

      if (event.data.type === 'dify-chatbot-expand-change') {
        toggleExpand();
      }
    });

    // Function to create the chat button
    function createButton() {
      const containerDiv = document.createElement("div");
      // Apply custom properties from config
      Object.entries(config.containerProps || {}).forEach(([key, value]) => {
        if (key === "className") {
          containerDiv.classList.add(...value.split(" "));
        } else if (key === "style") {
          if (typeof value === "object") {
            Object.assign(containerDiv.style, value);
          } else {
            containerDiv.style.cssText = value;
          }
        } else if (typeof value === "function") {
          containerDiv.addEventListener(
            key.replace(/^on/, "").toLowerCase(),
            value
          );
        } else {
          containerDiv[key] = value;
        }
      });

      containerDiv.id = buttonId;

      // Add styles for the button
      const styleSheet = document.createElement("style");
      document.head.appendChild(styleSheet);
      styleSheet.sheet.insertRule(`
        #${containerDiv.id} {
          position: fixed;
          bottom: var(--${containerDiv.id}-bottom, 1rem);
          right: var(--${containerDiv.id}-right, 1rem);
          left: var(--${containerDiv.id}-left, unset);
          top: var(--${containerDiv.id}-top, unset);
          width: var(--${containerDiv.id}-width, 48px);
          height: var(--${containerDiv.id}-height, 48px);
          border-radius: var(--${containerDiv.id}-border-radius, 25px);
          background-color: var(--${containerDiv.id}-bg-color, #155EEF);
          box-shadow: var(--${containerDiv.id}-box-shadow, rgba(0, 0, 0, 0.2) 0px 4px 8px 0px);
          cursor: pointer;
          z-index: 2147483647;
        }
      `);

      // Create display div for the button icon
      const displayDiv = document.createElement("div");
      displayDiv.style.cssText =
        "position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 2147483647;";
      displayDiv.innerHTML = svgIcons;
      containerDiv.appendChild(displayDiv);
      document.body.appendChild(containerDiv);

      // Add click event listener to toggle chatbot
      containerDiv.addEventListener("click", handleClick);
      // Add touch event listener
      containerDiv.addEventListener("touchend", (event) => {
        event.preventDefault();
        handleClick();
      }, { passive: false });

      function handleClick() {
        if (isDragging) return;

        const targetIframe = document.getElementById(iframeId);
        if (!targetIframe) {
          containerDiv.appendChild(createIframe());
          resetIframePosition();
          this.title = "Exit (ESC)";
          setSvgIcon("close");
          document.addEventListener("keydown", handleEscKey);
          return;
        }
        targetIframe.style.display =
          targetIframe.style.display === "none" ? "block" : "none";
        targetIframe.style.display === "none"
          ? setSvgIcon("open")
          : setSvgIcon("close");

        if (targetIframe.style.display === "none") {
          document.removeEventListener("keydown", handleEscKey);
        } else {
          document.addEventListener("keydown", handleEscKey);
        }

        resetIframePosition();
      }

      // Enable dragging if specified in config
      if (config.draggable) {
        enableDragging(containerDiv, config.dragAxis || "both");
      }
    }

    // Function to enable dragging of the chat button
    function enableDragging(element, axis) {
      let startX, startY, startClientX, startClientY;

      element.addEventListener("mousedown", startDragging);
      element.addEventListener("touchstart", startDragging);

      function startDragging(e) {
        isDragging = false;
        if (e.type === "touchstart") {
          startX = e.touches[0].clientX - element.offsetLeft;
          startY = e.touches[0].clientY - element.offsetTop;
          startClientX = e.touches[0].clientX;
          startClientY = e.touches[0].clientY;
        } else {
          startX = e.clientX - element.offsetLeft;
          startY = e.clientY - element.offsetTop;
          startClientX = e.clientX;
          startClientY = e.clientY;
        }
        document.addEventListener("mousemove", drag);
        document.addEventListener("touchmove", drag, { passive: false });
        document.addEventListener("mouseup", stopDragging);
        document.addEventListener("touchend", stopDragging);
        e.preventDefault();
      }

      function drag(e) {
        const touch = e.type === "touchmove" ? e.touches[0] : e;
        const deltaX = touch.clientX - startClientX;
        const deltaY = touch.clientY - startClientY;

        // Determine whether it is a drag operation
        if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
          isDragging = true;
        }

        if (!isDragging) return;

        element.style.transition = "none";
        element.style.cursor = "grabbing";

        // Hide iframe while dragging
        const targetIframe = document.getElementById(iframeId);
        if (targetIframe) {
          targetIframe.style.display = "none";
          setSvgIcon("open");
        }

        let newLeft, newBottom;
        if (e.type === "touchmove") {
          newLeft = e.touches[0].clientX - startX;
          newBottom = window.innerHeight - e.touches[0].clientY - startY;
        } else {
          newLeft = e.clientX - startX;
          newBottom = window.innerHeight - e.clientY - startY;
        }

        const elementRect = element.getBoundingClientRect();
        const maxX = window.innerWidth - elementRect.width;
        const maxY = window.innerHeight - elementRect.height;

        // Update position based on drag axis
        if (axis === "x" || axis === "both") {
          element.style.setProperty(
            `--${buttonId}-left`,
            `${Math.max(0, Math.min(newLeft, maxX))}px`
          );
        }

        if (axis === "y" || axis === "both") {
          element.style.setProperty(
            `--${buttonId}-bottom`,
            `${Math.max(0, Math.min(newBottom, maxY))}px`
          );
        }
      }

      function stopDragging() {
        setTimeout(() => {
          isDragging = false;
        }, 0);
        element.style.transition = "";
        element.style.cursor = "pointer";

        document.removeEventListener("mousemove", drag);
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("mouseup", stopDragging);
        document.removeEventListener("touchend", stopDragging);
      }
    }

    // Create the chat button if it doesn't exist
    if (!document.getElementById(buttonId)) {
      createButton();
    }
  }

  function setSvgIcon(type = "open") {
    if (type === "open") {
      document.getElementById("openIcon").style.display = "block";
      document.getElementById("closeIcon").style.display = "none";
    } else {
      document.getElementById("openIcon").style.display = "none";
      document.getElementById("closeIcon").style.display = "block";
    }
  }

  // Add esc Exit keyboard event triggered
  function handleEscKey(event) {
    if (event.key === "Escape") {
      const targetIframe = document.getElementById(iframeId);
      if (targetIframe && targetIframe.style.display !== "none") {
        targetIframe.style.display = "none";
        setSvgIcon("open");
      }
    }
  }
  document.addEventListener("keydown", handleEscKey);

  // Set the embedChatbot function to run when the body is loaded,Avoid infinite nesting
  if (config?.dynamicScript) {
    embedChatbot();
  } else {
    document.body.onload = embedChatbot;
  }
})();
