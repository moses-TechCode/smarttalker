// Predefined responses
let responses = {
  "hello": "Hi there! How can I assist you?",
  "how are you": "I'm just a bot, but I'm doing great! How can I help?",
  "bye": "Goodbye! Have a great day!",
  "price": "Our prices range from $20 to $100. What product are you looking for?",
  "contact": "You can contact us at support@mosestechcode.com",
  "what is photosynthesis": "Photosynthesis is the process by which green plants use sunlight to make food from carbon dioxide and water, producing oxygen as a byproduct.",
  "parts of a cell": "The main parts of a cell include the nucleus, cytoplasm, cell membrane, mitochondria, and ribosomes.",
  "what is an atom": "An atom is the smallest unit of matter that retains the properties of an element. It consists of protons, neutrons, and electrons.",
  "what is an acid": "An acid is a substance that donates hydrogen ions (H+) and has a pH less than 7.",
  "what is force": "Force is a push or pull upon an object resulting from its interaction with another object. It is measured in Newtons (N).",
  "newton's first law": "Newton's first law states that an object will remain at rest or move at a constant speed in a straight line unless acted upon by an external force.",
  "what is your name": "I'm your virtual assistant bot created by Moses TechCode.",
  "what can you do": "I can answer basic questions, provide science explanations, share our prices, and assist with general queries.",
  "who created you": "I was created by Moses TechCode to assist users efficiently.",
  "how do i order": "To order, please visit our website or contact us directly for assistance.",
  "do you offer delivery": "Yes, we offer delivery services. Contact support@mosestechcode.com for more details."
};

// Load learned responses from Local Storage
let learnedResponses = {};
if (localStorage.getItem("responses")) {
  learnedResponses = JSON.parse(localStorage.getItem("responses"));
}

function sendMessage() {
  let userInput = document.getElementById("userInput").value.toLowerCase();
  let chatBody = document.getElementById("chat-body");

  if (userInput.trim() === "") return;

  chatBody.innerHTML += `<div class="user-message">${userInput}</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;
  document.getElementById("userInput").value = "";

  chatBody.innerHTML += `<div class="bot-message typing">Typing...</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;

  setTimeout(() => {
    let botResponse;

    // Check if input is a calculation
    if (/^[0-9+\-*/().\s]+$/.test(userInput)) {
      botResponse = calculate(userInput);
    } else if (responses[userInput]) {
      botResponse = responses[userInput];
    } else if (learnedResponses[userInput]) {
      botResponse = learnedResponses[userInput];
    } else {
      botResponse = "I don't understand that. Can you teach me the answer?";
      let answer = prompt(`Teach me how to respond to: "${userInput}"`);
      if (answer) {
        learnedResponses[userInput] = answer;
        localStorage.setItem("responses", JSON.stringify(learnedResponses));
        botResponse = `Thanks! I've learned something new!`;
      }
    }

    chatBody.removeChild(chatBody.lastChild);
    chatBody.innerHTML += `<div class="bot-message">${botResponse}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    speak(botResponse);
  }, 1000);
}

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

function calculate(expression) {
  try {
    let result = eval(expression);
    if (!isNaN(result)) {
      return `The result is ${result}`;
    } else {
      return "Sorry, I couldn't calculate that.";
    }
  } catch (error) {
    return "Sorry, that calculation is invalid.";
  }
}
