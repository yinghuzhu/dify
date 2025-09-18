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

  // SVG icons for open and close states
  const svgIcons = `<svg version="1.1" id="openIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
<path d="M12,24c-1,0-1.9-0.1-2.9-0.4c-1.6-0.4-3-1.1-4.3-2c-1.2-0.9-2.3-2.1-3.1-3.4s-1.3-2.8-1.6-4.3c-0.3-1.6-0.2-3.2,0.2-4.8
	C0.7,7.8,1.2,6.6,2,5.4c0.7-1.1,1.6-2.1,2.7-2.9c1-0.8,2.2-1.4,3.4-1.9C9.3,0.2,10.7,0,12,0c1,0,1.9,0.1,2.9,0.4
	c1.6,0.4,3,1.1,4.3,2c1.2,0.9,2.3,2.1,3.1,3.4c0.8,1.3,1.3,2.8,1.6,4.3c0.3,1.6,0.2,3.2-0.2,4.8c-0.3,1.3-0.9,2.6-1.6,3.7
	s-1.6,2.1-2.7,2.9c-1,0.8-2.2,1.4-3.4,1.9C14.6,23.8,13.3,24,12,24L12,24z M12,0.6c-5.3,0-9.8,3.6-11.1,8.7
	c-1.5,6.1,2.2,12.4,8.4,13.9c0.9,0.2,1.8,0.3,2.7,0.3c5.3,0,9.8-3.6,11.1-8.7c0.7-3,0.3-6-1.3-8.7c-1.6-2.6-4.1-4.5-7.1-5.2
	C13.8,0.7,12.9,0.6,12,0.6L12,0.6z"/>
<path d="M14.4,0.8l0.5,0.1l-3.7,15l-0.5-0.1L14.4,0.8z"/>
<path d="M11.4,12l0.4,0.4L3.6,20l-0.4-0.4L11.4,12z"/>
<path d="M8.1,11.3l15.6,0.8v0.5L8.1,11.9V11.3z"/>
<path d="M11.2,8.7L15.7,23l-0.5,0.2L10.7,8.8L11.2,8.7z"/>
<path d="M2,6.9l13.7,6.3l-0.2,0.5L1.8,7.4L2,6.9z"/>
<path d="M5.4,8.8L4.7,3.1H4.4C2.6,4.6,1.2,6.7,0.6,9.2c-0.2,0.6-0.3,1.3-0.3,1.9L5.4,8.8z"/>
<path d="M6.5,17.1L1,16c1.1,2.9,3.3,5.4,6.2,6.7L6.5,17.1z"/>
<path d="M10.7,23.5l0.1,0.2c3.2,0.3,6.3-0.7,8.7-2.6l-5.2-2L10.7,23.5z"/>
<path d="M19.5,12.4l3,4.8c0.4-0.8,0.7-1.6,0.9-2.4c0.6-2.3,0.4-4.5-0.3-6.6L19.5,12.4z"/>
<path d="M10,0.5l3.7,4.3L19,2.6c-1.2-0.9-2.6-1.6-4.2-2S11.5,0.2,10,0.5L10,0.5z"/>
<path d="M13.7,16.9l3-4.9L13,7.7L7.7,9.8l0.4,5.7L13.7,16.9z"/>
</svg>
<svg version="1.1" id="closeIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#FF5715;}
</style>
<path class="st0" d="M12,24c-1,0-1.9-0.1-2.9-0.4c-1.6-0.4-3-1.1-4.3-2c-1.2-0.9-2.3-2.1-3.1-3.4s-1.3-2.8-1.6-4.3
	c-0.3-1.6-0.2-3.2,0.2-4.8C0.7,7.8,1.2,6.6,2,5.4c0.7-1.1,1.6-2.1,2.7-2.9c1-0.8,2.2-1.4,3.4-1.9C9.3,0.2,10.7,0,12,0
	c1,0,1.9,0.1,2.9,0.4c1.6,0.4,3,1.1,4.3,2c1.2,0.9,2.3,2.1,3.1,3.4c0.8,1.3,1.3,2.8,1.6,4.3c0.3,1.6,0.2,3.2-0.2,4.8
	c-0.3,1.3-0.9,2.6-1.6,3.7s-1.6,2.1-2.7,2.9c-1,0.8-2.2,1.4-3.4,1.9C14.6,23.8,13.3,24,12,24L12,24z M12,0.6
	c-5.3,0-9.8,3.6-11.1,8.7c-1.5,6.1,2.2,12.4,8.4,13.9c0.9,0.2,1.8,0.3,2.7,0.3c5.3,0,9.8-3.6,11.1-8.7c0.7-3,0.3-6-1.3-8.7
	c-1.6-2.6-4.1-4.5-7.1-5.2C13.8,0.7,12.9,0.6,12,0.6L12,0.6z"/>
<path class="st0" d="M14.4,0.8l0.5,0.1l-3.7,15l-0.5-0.1L14.4,0.8z"/>
<path class="st0" d="M11.4,12l0.4,0.4L3.6,20l-0.4-0.4L11.4,12z"/>
<path class="st0" d="M8.1,11.3l15.6,0.8v0.5L8.1,11.9V11.3z"/>
<path class="st0" d="M11.2,8.7L15.7,23l-0.5,0.2L10.7,8.8L11.2,8.7z"/>
<path class="st0" d="M2,6.9l13.7,6.3l-0.2,0.5L1.8,7.4L2,6.9z"/>
<path class="st0" d="M5.4,8.8L4.7,3.1H4.4C2.6,4.6,1.2,6.7,0.6,9.2c-0.2,0.6-0.3,1.3-0.3,1.9L5.4,8.8z"/>
<path class="st0" d="M6.5,17.1L1,16c1.1,2.9,3.3,5.4,6.2,6.7L6.5,17.1z"/>
<path class="st0" d="M10.7,23.5l0.1,0.2c3.2,0.3,6.3-0.7,8.7-2.6l-5.2-2L10.7,23.5z"/>
<path class="st0" d="M19.5,12.4l3,4.8c0.4-0.8,0.7-1.6,0.9-2.4c0.6-2.3,0.4-4.5-0.3-6.6L19.5,12.4z"/>
<path class="st0" d="M10,0.5l3.7,4.3L19,2.6c-1.2-0.9-2.6-1.6-4.2-2S11.5,0.2,10,0.5L10,0.5z"/>
<path class="st0" d="M13.7,16.9l3-4.9L13,7.7L7.7,9.8l0.4,5.7L13.7,16.9z"/>
</svg>
    `;


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
