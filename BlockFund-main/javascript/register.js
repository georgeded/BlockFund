registerForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var publicKey = document.getElementById("publicKeyInput").value;
    var password = document.getElementById("passwordInput").value;
    console.log("Public Key:", publicKey);
    console.log("Password:", password);
    if (publicKey.length !== 42) {
        alert("Public Key needs to be 42 characters long");
        return;
    }

    // Send register data to the backend
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publicKey, password })
    })
    .then(response => response.json())
    .then(data => {
        // console.log("API Response:", data);
        if (data.success) {
            document.querySelector(".wrapperSuccess").style.display = "flex";
            document.querySelector(".wrapperSuccess").style.opacity = "0";
            setTimeout(() => {
                document.querySelector(".wrapperSuccess").style.opacity = "1";
            }, 100);
            setTimeout(() => window.location.href = "/html/index.html", 2000);
        } else {
            alert("Public key is taken");
        }
    })
    .catch(error => {
        console.error('Error sending register data:', error);
        alert("Error sending register data");
    });
});
function checkScreenSize() {
    const isMobile = window.innerWidth <= 768;
    const isMobilePage = window.location.pathname.includes('mobile-not-supported.html');
    const previousUrl = localStorage.getItem('previousUrl'); // Get previous URL from localStorage

    if (isMobile && !isMobilePage) {
        // Store the current URL before redirecting to the mobile page
        localStorage.setItem('previousUrl', window.location.href);
        // Redirect to the mobile-not-supported page if on a non-mobile page
        window.location.href = '../html/mobile-not-supported.html';
    } else if (!isMobile && isMobilePage && previousUrl) {
        // Redirect back to the previous page if resizing back to desktop
        window.location.href = previousUrl;
        localStorage.removeItem('previousUrl'); // Clear previousUrl after redirection
    }
}

// Run the function continuously on window resize
window.addEventListener('resize', checkScreenSize);

// Run the function once on page load
window.addEventListener('load', checkScreenSize);