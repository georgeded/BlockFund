document.addEventListener('DOMContentLoaded', function() {
    const intervalId = setInterval(function() {
        fetchChat(intervalId);
    }, 1000);

    const sendButton = document.getElementById("send");
    const chatInput = document.getElementById("chatinput");

    // Initialize send button visibility
    toggleSendButtonVisibility();

    // Add event listeners
    sendButton.addEventListener("click", function() {
        sendMessage();
    });

    chatInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevent line break in text area
            sendMessage();
        }
    });

    chatInput.addEventListener("input", function() {
        toggleSendButtonVisibility();
    });

    // Show coordinator controls if the user is a coordinator
    const publicKey = localStorage.getItem("publicKey");
    if (publicKey === "0xd20Bb29a4eCcC43eE7e7A3140eE246c389a200cf" || publicKey === "0x0472d37869fc37C33e38acBEEcf2B1dA121E893F") {
        alert("You are a coordinator. You have access to the coordinator controls.");
        document.getElementById("coordinator-controls").style.display = "flex";
        document.getElementById("delete-messages").addEventListener("click", function() {
            if (confirm("Are you sure you want to delete all messages?")) {
                deleteAllMessages();
            }
        });

        document.getElementById("reset-messages").addEventListener("click", function() {
            if (confirm("Are you sure you want to reset old messages?")) {
                resetOldMessages();
            }
        });
    }
});

function fetchChat(intervalId) {
    console.log("Fetching chat data...");
    fetch('/api/chat', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const chat = document.querySelector("#textwindow");
        const isScrolledToBottom = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 50;

        chat.innerHTML = "";
        const publicKey = localStorage.getItem("publicKey");
        data.forEach(message => {
            const isUserMessage = message.publicKey === publicKey;
            let userLabel = message.publicKey;
            if (message.publicKey === "0xd20Bb29a4eCcC43eE7e7A3140eE246c389a200cf") {
                userLabel = "Coordinator(Dean)";
            } else if (message.publicKey === "0x0472d37869fc37C33e38acBEEcf2B1dA121E893F") {
                userLabel = "Coordinator(George)";
            }

            const timestamp = new Date(message.timestamp).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const formattedMessage = formatMessage(message.message);

            chat.innerHTML += `<div class="message-container">
                <div class="message ${isUserMessage ? 'user-message' : 'other-message'}">
                    <p>${formattedMessage}</p>
                    <div class="bottom-info">
                        <p class="user" style="font-size: 0.7rem;">${userLabel}</p>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                </div>
            </div>`;
        });

        if (isScrolledToBottom) {
            scrollToBottom(chat);
        }
    })
    .catch(error => {
        console.error('Error fetching chat data:', error);
        clearInterval(intervalId);  // stop fetching chat data if error
    });
}

function formatMessage(message) {
    const maxLineLength = 50;
    const words = message.split(' '); // Split the message into words
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
        // Check if adding the next word would exceed the max line length
        if (currentLine.length + word.length + 1 <= maxLineLength) {
            currentLine += (currentLine.length ? ' ' : '') + word;
        } else {
            // If it would exceed, push the current line to lines and start a new line
            lines.push(currentLine);
            currentLine = word;
        }
    });

    // Add the last line if there is any content left
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    return lines.join('<br>');
}


function sendMessage() {
    const publicKey = localStorage.getItem("publicKey");
    const message = document.getElementById("chatinput").value;
    if (message.trim() === "") return; // Don't send empty messages

    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publicKey, message })
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);
        document.getElementById("chatinput").value = ""; // Clear the input field
        toggleSendButtonVisibility(); // Update button visibility
        fetchChat();  // Refresh chat to include the new message

        // Scroll to the bottom after sending the message
        setTimeout(() => {
            scrollToBottom(document.querySelector("#textwindow"));
        }, 100);
    })
    .catch(error => {
        console.error('Error sending chat data:', error);
        alert("Error sending chat data");
    });
}

function deleteAllMessages() {
    fetch('/api/chat/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("All messages deleted.");
            fetchChat(); // Refresh chat to reflect the deletion
        } else {
            console.error("Failed to delete messages.");
        }
    })
    .catch(error => {
        console.error('Error deleting messages:', error);
    });
}

function resetOldMessages() {
    fetch('/api/chat/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("Old messages reset.");
            fetchChat(); // Refresh chat to reflect the reset
        } else {
            console.error("Failed to reset messages.");
        }
    })
    .catch(error => {
        console.error('Error resetting messages:', error);
    });
}

function toggleSendButtonVisibility() {
    const chatInput = document.getElementById("chatinput");
    const sendButton = document.getElementById("send");
    if (chatInput.value.trim() === "") {
        sendButton.style.display = "none";
    } else {
        sendButton.style.display = "inline-block";
    }
}

function scrollToBottom(element) {
    element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
    });
}
