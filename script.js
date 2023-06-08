window.onload = function() {
    // Select the target node you want to observe (e.g., body)
    const targetNode = document.body;

    // Create the div element
    const div = document.createElement('div');
    div.id = 'floating-button';

    // Create the image span container
    const logo = document.createElement('span');

    const img = document.createElement('img');
    img.src = 'https://i.imgur.com/TGEDSuI.png';
    img.id = 'extension-logo';

    // Create the selection span container
    const span = document.createElement('span');
    span.id = 'selection';

    // Create the label element
    const label = document.createElement('label');
    label.htmlFor = 'toggle';
    label.textContent = 'Supress Bard Voicer ';

    // Create the input element
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'toggle';

    // Append elements
    div.appendChild(span);
    span.appendChild(label);
    span.appendChild(input);
    div.appendChild(logo);
    logo.append(img);

    // Create the style element
    const style = document.createElement('style');
    style.textContent = `
    #floating-button {
        position: fixed;
        font-family: 'Product Sans';
        bottom: 220px;
        right: -7px;
        z-index: 9999;
        background-color: #020d6e;
        color: #ffffff;
        border: 2px solid #3d43e5;
        border-radius: 5px;
        padding: 8px;
        height: 20px;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
        transition: width 0.3s ease, height 0.3s ease;
    }

    #selection {
        visibility: hidden;
        display: none;
    }

    #extension-logo {
        border-radius: 50%;
    }
    `;

    // Append the style element to the head of the document
    document.head.appendChild(style);

    // Append the div element to the body of the document
    document.body.appendChild(div);

    // Add event listener to the element
    div.addEventListener('mouseover', function() {
        div.style.width = '200px';
        span.style.visibility = "visible";
        span.style.display = "block";
        logo.style.visibility = "hidden";
        logo.style.display = "none";

    });
    div.addEventListener('mouseout', function() {
        div.style.width = 'auto';
        span.style.visibility = "hidden";
        span.style.display = "none";
        logo.style.visibility = "visible";
        logo.style.display = "block";
    });

    // Get the toggle element
    const toggle = document.getElementById('toggle');

    // Check if the user's preference is stored in localStorage
    const storedPreference = localStorage.getItem('togglePreference');
    if (storedPreference) {
    toggle.checked = JSON.parse(storedPreference);
    }

    // Function to handle the toggle change event
    function handleToggleChange() {
        // Store the current value in localStorage
        localStorage.setItem('togglePreference', toggle.checked);
    }

    // Add event listener to the toggle change event
    toggle.addEventListener('change', handleToggleChange);

    // Create a new instance of MutationObserver
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // New element added
                var node = mutation.addedNodes[0];
                // console.log(node);
                // console.log(node.nodeName);
                
                // Check if the added node is a MESSAGE-CONTENT element
                if (node.nodeName == "MESSAGE-CONTENT" && localStorage.getItem('togglePreference') == "false") {
                    console.log("IM HERE");

                    // Function to extract all text content from a node and its descendants
                    function getAllTextContent(parentNode) {
                        const textContent = [];

                        function traverse(node) {
                        if (node instanceof Element) {
                            for (let i = 0; i < node.childNodes.length; i++) {
                            traverse(node.childNodes[i]);
                            }
                        } else if (node instanceof Text) {
                            textContent.push(node.textContent);
                        }
                        }

                        traverse(parentNode);

                        return textContent;
                    }

                    // Get all the text content from the MESSAGE-CONTENT element
                    const text = getAllTextContent(node);

                    let voices, utterance;

                    function speakVoice() {
                        voices = this.getVoices();
                        utterance = new SpeechSynthesisUtterance(text);
                        utterance.voice = null;
                        speechSynthesis.speak(utterance);
                    };

                    console.log("IM HERE 2.0");
                    speechSynthesis.addEventListener('voiceschanged', speakVoice);
                    console.log("IM HERE 3.0");
                }
            }
        }
    });

    // Configuration of the observer
    const config = { childList: true, subtree: true };

    // Start observing the target node for mutations
    observer.observe(targetNode, config);
}
