// ── Config (API keys loaded from backend) ──────────────────────────────────
let ETHERSCAN_API_KEY = '';
const TOKEN_DECIMALS = 18;
const PROFILE_DECIMALS = 3;

async function loadConfig() {
    try {
        const res = await fetch('/api/config');
        const cfg = await res.json();
        ETHERSCAN_API_KEY = cfg.etherscanKey || '';
    } catch (e) {
        console.error('Failed to load config:', e);
    }
}

const configLoaded = loadConfig();

// ── Login modal ────────────────────────────────────────────────────────────
var modal = document.getElementById('loginModal');
var btn = document.getElementById('b4');
var span = document.getElementsByClassName('close-button')[0];

btn.addEventListener('click', () => (modal.style.display = 'block'));
span.addEventListener('click', () => (modal.style.display = 'none'));
window.addEventListener('click', (event) => {
    if (event.target == modal) modal.style.display = 'none';
});

// ── Helpers ────────────────────────────────────────────────────────────────
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function logInUser(balance) {
    closeLoginModal();
    document.getElementById('login').style.display = 'none';
    document.getElementById('b4').style.display = 'none';
    document.getElementById('b5').style.display = 'block';
    document.getElementById('profile').style.display = 'flex';
    localStorage.setItem('isLoggedIn', 'true');
    if (balance === undefined) balance = 0;
    document.getElementById('currentBalance').innerText = balance.toFixed(PROFILE_DECIMALS) + ' BF';
    document.getElementById('profilePublicKey').innerText = localStorage.getItem('publicKey');
    document.getElementById('profileBalance').innerText = balance + ' BF';
    document.getElementById('publicAddress').innerText =
        localStorage.getItem('publicKey').slice(0, 6) + '...' + localStorage.getItem('publicKey').slice(-4);

    // Show holder-only links in the mobile menu
    document.querySelectorAll('.mobile-holder-link').forEach(el => (el.style.display = 'block'));
}

// ── Dark mode ──────────────────────────────────────────────────────────────
function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

const toggle = document.getElementById('darkmode-toggle');

toggle.addEventListener('change', function () {
    const isDarkMode = this.checked;
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
    applyTheme(isDarkMode);
});

// ── Hamburger / Mobile menu ────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
        const isOpen = mobileMenu.style.display === 'flex';
        mobileMenu.style.display = isOpen ? 'none' : 'flex';
        hamburger.setAttribute('aria-expanded', String(!isOpen));
        hamburger.textContent = isOpen ? '\u2630' : '\u2715';
    });

    // Close mobile menu when any link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.style.display = 'none';
            hamburger.textContent = '\u2630';
        });
    });
}

// ── DOMContentLoaded: restore session + nav setup ─────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Restore dark mode
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    toggle.checked = isDarkMode;
    applyTheme(isDarkMode);

    // Restore login session
    if (localStorage.getItem('isLoggedIn') === 'true') {
        configLoaded.then(() => {
            fetch(
                `https://api-sepolia.etherscan.io/api?module=account&action=tokenbalance` +
                `&contractaddress=0xbC1AA1F461ac8B7359fC833F957c355F19BB4144` +
                `&address=${localStorage.getItem('publicKey')}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
            )
                .then(r => r.json())
                .then(data => {
                    if (data.status === '1') {
                        const balance = parseInt(data.result, 10) / Math.pow(10, TOKEN_DECIMALS);
                        if (balance > 0) {
                            logInUser(balance);
                        } else {
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('publicKey');
                        }
                    }
                })
                .catch(err => console.error('Error fetching token balance:', err));
        });
    }

    // Nav button → page mapping
    const buttonUrlMap = {
        'BF': '/html/index.html',
        'b1': '/html/Learn.html',
        'b2': '/html/Use.html',
        'b3': '/html/Participate.html',
        'technology': '/html/Learn.html',
        'guide': '/html/Use.html',
        'join': '/html/Participate.html',
        'getBF': '/html/Learn.html#third',
        'box1': '/html/Learn.html#secondDiv',
        'getB': '/html/Learn.html#third',
        'box2': '/html/Learn.html#thirdDiv',
    };

    Object.keys(buttonUrlMap).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function () {
                window.location.href = buttonUrlMap[buttonId];
            });
        }
    });

    // Active button highlight
    const pageMap = {
        '/html/Learn.html': 'b1',
        '/html/Use.html': 'b2',
        '/html/Participate.html': 'b3',
        '/html/News.html': 'b5',
        '/html/Graphs.html': 'b5',
        '/html/Chat.html': 'b5',
    };
    const currentButtonId = pageMap[window.location.pathname];
    if (currentButtonId) {
        const activeBtn = document.getElementById(currentButtonId);
        if (activeBtn) {
            activeBtn.style.backgroundColor = 'rgba(55, 64, 144, 0.511)';
            activeBtn.style.color = 'white';
            activeBtn.style.transform = 'scale(1.09)';
            activeBtn.style.boxShadow = 'none';
        }
    }

    // Dropdown modals (desktop hover only)
    const buttonModalMap = {
        'b1': 'learnModal',
        'b2': 'useModal',
        'b3': 'participateModal',
        'b5': 'holderBenefitsModal',
    };

    let currentlyVisibleModal = null;
    const isMouseOverModal = {};

    function showDropdown(modalId) {
        if (currentlyVisibleModal && currentlyVisibleModal !== modalId) {
            hideDropdown(currentlyVisibleModal);
        }
        const m = document.getElementById(modalId);
        if (m) {
            m.style.display = 'flex';
            m.style.pointerEvents = 'none';
            setTimeout(() => { m.style.pointerEvents = 'all'; }, 500);
        }
        currentlyVisibleModal = modalId;
    }

    function hideDropdown(modalId) {
        setTimeout(() => {
            if (!isMouseOverModal[modalId]) {
                const m = document.getElementById(modalId);
                if (m) m.style.display = 'none';
                if (currentlyVisibleModal === modalId) currentlyVisibleModal = null;
            }
        }, 200);
    }

    // Only wire up hover dropdowns on non-touch desktop
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        Object.keys(buttonModalMap).forEach(buttonId => {
            const button = document.getElementById(buttonId);
            const modalId = buttonModalMap[buttonId];
            if (button) {
                button.addEventListener('mouseenter', () => showDropdown(modalId));
                button.addEventListener('mouseleave', () => hideDropdown(modalId));
            }
        });

        Object.values(buttonModalMap).forEach(modalId => {
            const m = document.getElementById(modalId);
            if (m) {
                m.addEventListener('mouseenter', () => { isMouseOverModal[modalId] = true; });
                m.addEventListener('mouseleave', () => {
                    isMouseOverModal[modalId] = false;
                    hideDropdown(modalId);
                });
                m.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => hideDropdown(modalId));
                });
            }
        });
    }

    // Footer LinkedIn / GitHub modals
    const linkedinLink = document.getElementById('linkedinLink');
    const githubLink = document.getElementById('githubLink');
    const linkedinLinkIcon = document.getElementById('linkedinLinkIcon');
    const githubLinkIcon = document.getElementById('githubLinkIcon');
    const linkedinModal = document.getElementById('linkedinModalCustom');
    const githubModal = document.getElementById('githubModalCustom');
    const closeButtons = document.querySelectorAll('.close-custom');

    function openModal(m) { if (m) m.style.display = 'block'; }
    function closeModal(m) { if (m) m.style.display = 'none'; }

    if (linkedinLink) linkedinLink.addEventListener('click', e => { e.preventDefault(); openModal(linkedinModal); });
    if (githubLink) githubLink.addEventListener('click', e => { e.preventDefault(); openModal(githubModal); });
    if (linkedinLinkIcon) linkedinLinkIcon.addEventListener('click', e => { e.preventDefault(); openModal(linkedinModal); });
    if (githubLinkIcon) githubLinkIcon.addEventListener('click', e => { e.preventDefault(); openModal(githubModal); });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => { closeModal(linkedinModal); closeModal(githubModal); });
    });
    window.addEventListener('click', event => {
        if (event.target == linkedinModal) closeModal(linkedinModal);
        if (event.target == githubModal) closeModal(githubModal);
    });
});

// ── Smooth scroll for anchor links ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── Login form submission ──────────────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const publicKey = document.getElementById('publicKey').value;
        const password = document.getElementById('password').value;

        if (publicKey.length !== 42) {
            alert('Public Key needs to be 42 characters long');
            return;
        }

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicKey, password }),
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    fetch(
                        `https://api-sepolia.etherscan.io/api?module=account&action=tokenbalance` +
                        `&contractaddress=0xbC1AA1F461ac8B7359fC833F957c355F19BB4144` +
                        `&address=${publicKey}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
                    )
                        .then(r => r.json())
                        .then(data => {
                            if (data.status === '1') {
                                const balance = parseInt(data.result, 10) / Math.pow(10, TOKEN_DECIMALS);
                                if (balance > 0) {
                                    localStorage.setItem('publicKey', publicKey);
                                    logInUser(balance);
                                } else {
                                    alert('This address does not hold any BlockFund tokens');
                                }
                            } else {
                                alert('Failed to fetch token balance');
                            }
                        })
                        .catch(err => {
                            console.error('Error fetching token balance:', err);
                            alert('Error checking token balance');
                        });
                } else {
                    alert(data.error || 'Incorrect public key or password');
                }
            })
            .catch(err => {
                console.error('Error sending login data:', err);
                alert('Error sending login data');
            });
    });
}

// ── Profile modal ──────────────────────────────────────────────────────────
const profileInfo1 = document.getElementById('profileInfo1');
if (profileInfo1) {
    profileInfo1.addEventListener('click', () => {
        document.getElementById('profileModal').style.display = 'block';
    });
}

const closeButtons2 = document.getElementsByClassName('close-button');
if (closeButtons2[1]) {
    closeButtons2[1].addEventListener('click', () => {
        document.getElementById('profileModal').style.display = 'none';
    });
}

window.addEventListener('click', function (event) {
    const pm = document.getElementById('profileModal');
    if (pm && event.target == pm) pm.style.display = 'none';
});

// ── Logout ─────────────────────────────────────────────────────────────────
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        const b5Pages = ['/html/News.html', '/html/Graphs.html', '/html/Chat.html'];
        document.getElementById('b4').style.display = 'block';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('profileModal').style.display = 'none';
        document.getElementById('b5').style.display = 'none';
        document.querySelectorAll('.mobile-holder-link').forEach(el => (el.style.display = 'none'));
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('publicKey');
        if (b5Pages.includes(window.location.pathname)) {
            window.location.href = '/html/index.html';
        }
    });
}

// ── Home page: total transactions ──────────────────────────────────────────
const txElement = document.getElementById('numberOfTransactions');
if (txElement) {
    const CONTRACT = '0xbC1AA1F461ac8B7359fC833F957c355F19BB4144';
    configLoaded.then(async () => {
        try {
            const res = await fetch(
                `https://api-sepolia.etherscan.io/api?module=account&action=txlist` +
                `&address=${CONTRACT}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`
            );
            const data = await res.json();
            if (data.status === '1') {
                txElement.innerText = data.result.length;
            } else {
                txElement.innerText = 'N/A';
            }
        } catch (err) {
            console.error('Error fetching transaction data:', err);
            txElement.innerText = 'N/A';
        }
    });
}
