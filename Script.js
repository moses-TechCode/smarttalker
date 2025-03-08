let responses = {
    "hello": "Hi there! How can I assist you?",
    "how are you": "I'm just a bot, but I'm doing great! How can I help?",
    "price": "Our prices range from $20 to $100. What product are you looking for?",
    "contact": "You can contact us at support@mosestechcode.com",
    "bye": "Goodbye! Have a great day!"
};

// Load learned responses from Local Storage
if (localStorage.getItem("responses")) {
    responses = JSON.parse(localStorage.getItem("responses"));
}
//displaying the text
function sendMessage() {
    let userInput = document.getElementById("userInput").value.toLowerCase();
    let chatBody = document.getElementById("chat-body");

    if (userInput.trim() === "") return;

    chatBody.innerHTML += `<div class="user-message" id="replace"onclick="replace()">${userInput}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
   // clear the inputbox
    document.getElementById("userInput").value = "";
 //typing Indicator
    chatBody.innerHTML += `<div class="bot-message typing">Typing...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        let botResponse = responses[userInput] || "I don't understand that. Can you teach me the answer?";

        if (!responses[userInput]) {
            let answer = prompt(`Teach me how to respond to: "${userInput}"`);
            if (answer) {
                responses[userInput] = answer;
                localStorage.setItem("responses", JSON.stringify(responses));
                botResponse = `Thanks! I've learned something new!`;
            }
        }

        chatBody.removeChild(chatBody.lastChild);
        chatBody.innerHTML += `<div class="bot-message">${botResponse}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;

        speak(botResponse);
    }, 1000);
}

//the function for showing the Typing Indicator 
function typingIndicator(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function speak(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}

// Voice Recognition (Microphone)
let recognition;
function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Sorry, your browser does not support speech recognition.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.start();

    recognition.onresult = function(event) {
        let speechResult = event.results[0][0].transcript;
        document.getElementById("userInput").value = speechResult;

        if (event.results[0].isFinal) {
            sendMessage();
        }
    };

    recognition.onerror = function(event) {
        alert("Speech recognition error: " + event.error);
    };
}

  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && (event.key === "u" || event.key === "s" || event.key === "c" || event.key === "x" || event.key === "v" || event.key === "j" || event.key === "i" || event.key === "p")) {
      event.preventDefault();
    }
  });