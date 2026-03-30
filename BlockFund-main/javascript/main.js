// LOGIN MODAL CODE
var modal = document.getElementById("loginModal");
var btn = document.getElementById("b4");                            // Get the button that opens the modal
var span = document.getElementsByClassName("close-button")[0];      // Get the element that closes the modal

btn.addEventListener('click', () => modal.style.display = "block");
span.addEventListener('click', () => modal.style.display = "none");
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// BUTTONS
document.addEventListener('DOMContentLoaded', function() {          // Define the button destinations
    if (localStorage.getItem('isLoggedIn') === 'true') {
        fetch(`https://api-sepolia.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xbC1AA1F461ac8B7359fC833F957c355F19BB4144&address=${localStorage.getItem("publicKey")}&tag=latest&apikey=${ETHERSCAN_API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    console.log("API Response:", data);
                    if (data.status === "1") {
                        var balance = parseInt(data.result, 10) / Math.pow(10, TOKEN_DECIMALS);
                        console.log(balance);
                        if (balance > 0) {
                            logInUser(balance);
                        } else {
                            alert("Please try again: this address does not hold any BlockFund tokens");   
                        }
                    } else {
                        alert("Failed to fetch token balance");
                    }
                })
                .catch(error => {
                    console.error('Error fetching token balance:', error);
                    //alert("Error checking token balance");
                });
    }
    
    const buttonUrlMap = {
        'BF': '../html/index.html',
        'b1': '../html/Learn.html',
        'b2': '../html/Use.html',
        'b3': '../html/Participate.html',
        'technology': '../html/Learn.html',
        'guide': '../html/Use.html',
        'join': '../html/Participate.html',
        'getBF': '../html/Learn.html#third',
        'box1': '../html/Learn.html#secondDiv',
        'getB': '../html/Learn.html#third',
        'box2': '../html/Learn.html#thirdDiv'
    };

    Object.keys(buttonUrlMap).forEach(buttonId => {
        document.getElementById(buttonId).addEventListener('click', function() {
            window.location.href = buttonUrlMap[buttonId];
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Get the current URL path
    const path = window.location.pathname;

    // Map paths to button IDs
    const pageMap = {
        "/html/Learn.html": "b1",
        "/html/Use.html": "b2",
        "/html/Participate.html": "b3",
        "/html/News.html": "b5",
        "/html/Graphs.html": "b5",
        "/html/Chat.html": "b5",
    };

    // Get the button ID for the current page
    const currentButtonId = pageMap[path];

    if (currentButtonId) {
        // Add the active class to the current button
        document.getElementById(currentButtonId).style.backgroundColor = "rgba(55, 64, 144, 0.511)";
        document.getElementById(currentButtonId).style.color = "white";
        document.getElementById(currentButtonId).style.transform = "scale(1.09)";
        document.getElementById(currentButtonId).style.boxShadow = "none";
    }
});

// Step 1: Save the switch state to localStorage when it changes
document.getElementById('darkmode-toggle').addEventListener('change', function() {
    // Assuming the switch is a checkbox, save whether it's checked
    localStorage.setItem('darkMode', this.checked ? 'true' : 'false');

    // Apply the theme immediately when the switch changes
    applyTheme(this.checked);
});

// Step 2: Check localStorage on page load to apply the saved state
document.addEventListener('DOMContentLoaded', function() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply the saved state to the switch
    document.getElementById('darkmode-toggle').checked = isDarkMode;

    // Apply the theme based on the saved state
    applyTheme(isDarkMode);
});

// Step 3: Define the applyTheme function to change the page's theme
function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', function() {          // Code to show and hide top bar modals (ones that slide down)
    const buttonModalMap = {
        'b1': 'learnModal',
        'b2': 'useModal',
        'b3': 'participateModal',
        'b5': 'holderBenefitsModal',
    };

    let currentlyVisibleModal = null;
    let isMouseOverModal = {};
    
    function showModal(modalId) {
        if (currentlyVisibleModal && currentlyVisibleModal !== modalId) {
            hideModal(currentlyVisibleModal);
        }

        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.style.pointerEvents = 'none';
            setTimeout(() => {
                modal.style.pointerEvents = 'all';
            },500);
        }
        currentlyVisibleModal = modalId;
    }

    function hideModal(modalId) {
        setTimeout(() => {
            if (!isMouseOverModal[modalId]) {
                const modal = document.getElementById(modalId);
                if (modal) modal.style.display = 'none';
                if (currentlyVisibleModal === modalId) {
                    currentlyVisibleModal = null;
                }
            }
        }, 200);
    }

    Object.keys(buttonModalMap).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        const modalId = buttonModalMap[buttonId];
        if (button) {
            button.addEventListener('click', () => showModal(modalId));
            button.addEventListener('mouseenter', () => showModal(modalId));
            button.addEventListener('mouseleave', () => hideModal(modalId));
        }
    });

    Object.values(buttonModalMap).forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('mouseenter', () => isMouseOverModal[modalId] = true);
            modal.addEventListener('mouseleave', () => {
                isMouseOverModal[modalId] = false;
                hideModal(modalId);
            });

            // Ensuring modals close on clicking any internal links
            let links = modal.querySelectorAll('a');
            links.forEach(link => link.addEventListener('click', () => hideModal(modalId)));
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default anchor click behavior
        const targetId = this.getAttribute('href'); // Get the target id (e.g., "#section1")
        const targetElement = document.querySelector(targetId); // Select the target element

        if (targetElement) {
            // Use the scrollIntoView method for smooth scrolling
            targetElement.scrollIntoView({
                behavior: "smooth", // Define the smooth scroll
                block: "start"    // Align to the top
            });
        }
    });
});

const toggle = document.getElementById('darkmode-toggle');
toggle.addEventListener('change', () => {
    if (toggle.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
});

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

toggle.addEventListener('change', () => {
    const isDarkMode = toggle.checked;
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
    applyTheme(isDarkMode);
});

// CODE FOR LOGIN
const ETHERSCAN_API_KEY = "RU7DH9UJBG1JPXDVQWVC14MRXUIEYRH1MJ";
const TOKEN_DECIMALS = 18; 
const PROFILE_DECIMALS = 3;

function logInUser(balance) {
    closeLoginModal();    // if logged in, close the modal
    document.getElementById("login").style.display = "none"; // hide login button
    document.getElementById("b4").style.display = "none";
    document.getElementById("b5").style.display = "block";
    document.getElementById("profile").style.display = "flex"; // change login button to profile button
    localStorage.setItem('isLoggedIn', 'true');
    while (balance === undefined) {
        balance = 0;
    }
    document.getElementById("currentBalance").innerText = balance.toFixed(PROFILE_DECIMALS) + ' BF';
    document.getElementById("profilePublicKey").innerText = localStorage.getItem("publicKey");
    document.getElementById("profileBalance").innerText = balance + " BF";
    document.getElementById("publicAddress").innerText = localStorage.getItem("publicKey").slice(0, 6) + '...' + localStorage.getItem("publicKey").slice(-4);

}

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var publicKey = document.getElementById("publicKey").value;
    var password = document.getElementById("password").value;
    if (publicKey.length !== 42) {
        alert("Public Key needs to be 42 characters long");
        return;
    }

    // Send login data to the backend
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publicKey, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);
        if (data.success) {
            // Use etherscan API to check if the public key is a holder of the BF token
            fetch(`https://api-sepolia.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xbC1AA1F461ac8B7359fC833F957c355F19BB4144&address=${publicKey}&tag=latest&apikey=${ETHERSCAN_API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    console.log("API Response:", data);
                    if (data.status === "1") {
                        var balance = parseInt(data.result, 10) / Math.pow(10, TOKEN_DECIMALS);
                        console.log(balance);
                        if (balance > 0) {
                            localStorage.setItem("publicKey", publicKey); // store public key in local storage
                            logInUser(balance);
                        } else {
                            alert("Please try again: this address does not hold any BlockFund tokens");   
                        }
                    } else {
                        alert("Failed to fetch token balance");
                    }
                })
                .catch(error => {
                    console.error('Error fetching token balance:', error);
                    alert("Error checking token balance");
                });
        } else {
            alert("Incorrect public key or password");
        }
    })
    .catch(error => {
        console.error('Error sending login data:', error);
        alert("Error sending login data");
    });
});

// Profile modal
document.getElementById("profileInfo1").addEventListener("click", function() {
    document.getElementById("profileModal").style.display = "block";
});
document.getElementsByClassName("close-button")[1].addEventListener("click", function() {
    console.log("close");
    document.getElementById("profileModal").style.display = "none";
});
window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("profileModal")) {
        document.getElementById("profileModal").style.display = "none";
    }
});

document.getElementById("logout").addEventListener("click", function() {
    const currentPage = window.location.pathname;
    const b5Pages = [
        "/html/News.html",
        "/html/Graphs.html",
        "/html/Chat.html"
    ];

    document.getElementById("b4").style.display = "block";
    document.getElementById("profile").style.display = "none";
    document.getElementById("profileModal").style.display = "none";
    document.getElementById("b5").style.display = "none";
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("publicKey");

    // Redirect to index.html if on a b5 page
    if (b5Pages.includes(currentPage)) {
        window.location.href = "../html/index.html";
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const buttonUrlMap = {
        'BF': '../html/index.html',
        'b1': '../html/Learn.html',
        'b2': '../html/Use.html',
        'b3': '../html/Participate.html',
        'technology': '../html/Learn.html',
        'guide': '../html/Use.html',
        'join': '../html/Participate.html',
        'getBF': '../html/Learn.html#third',
        'box1': '../html/Learn.html#secondDiv',
        'getB': '../html/Learn.html#third',
        'box2': '../html/Learn.html#thirdDiv'
    };

    Object.keys(buttonUrlMap).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            console.log(`Attaching event listener to button with ID: ${buttonId}`);
            button.addEventListener('click', function() {
                console.log(`Button with ID ${buttonId} clicked, navigating to ${buttonUrlMap[buttonId]}`);
                window.location.href = buttonUrlMap[buttonId];
            });
        } else {
            console.log(`Button with ID ${buttonId} not found`);
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const linkedinLink = document.getElementById('linkedinLink');
    const githubLink = document.getElementById('githubLink');
    const linkedinLinkIcon = document.getElementById('linkedinLinkIcon');
    const githubLinkIcon = document.getElementById('githubLinkIcon');
    const linkedinModal = document.getElementById('linkedinModalCustom');
    const githubModal = document.getElementById('githubModalCustom');
    const closeButtons = document.querySelectorAll('.close-custom');

    function openModal(modal) {
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    linkedinLink.addEventListener('click', function(event) {
        event.preventDefault();
        openModal(linkedinModal);
    });

    githubLink.addEventListener('click', function(event) {
        event.preventDefault();
        openModal(githubModal);
    });

    linkedinLinkIcon.addEventListener('click', function(event) {
        event.preventDefault();
        openModal(linkedinModal);
    });

    githubLinkIcon.addEventListener('click', function(event) {
        event.preventDefault();
        openModal(githubModal);
    });

    closeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            closeModal(linkedinModal);
            closeModal(githubModal);
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target == linkedinModal) {
            closeModal(linkedinModal);
        }
        if (event.target == githubModal) {
            closeModal(githubModal);
        }
    });
});
const apiKey = 'RU7DH9UJBG1JPXDVQWVC14MRXUIEYRH1MJ';
const address = '0xbC1AA1F461ac8B7359fC833F957c355F19BB4144';
const apiUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

// Function to fetch and display total number of transactions
async function fetchTotalTransactions() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== '1') {
            throw new Error(`API Error: ${data.message}`);
        }

        const transactions = data.result;
        const totalTransactions = transactions.length;

        // Display the total number of transactions
        document.getElementById('numberOfTransactions').innerText = `${totalTransactions}`;
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        document.getElementById('numberOfTransactions').innerText = 'Error fetching transaction data';
    }
}

fetchTotalTransactions();
