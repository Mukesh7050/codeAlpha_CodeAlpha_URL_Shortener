// ===============================
// Elements
// ===============================

const shortenBtn = document.getElementById("shortenBtn");
const urlInput = document.getElementById("url");
const resultBox = document.getElementById("result");
const shortUrlInput = document.getElementById("shortUrl");
const copyBtn = document.getElementById("copyBtn");
const openBtn = document.getElementById("openBtn");
const toast = document.getElementById("toast");

// ===============================
// Toast Function
// ===============================

function showToast(message, color = "#22c55e") {

    toast.innerText = message;
    toast.style.background = color;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// ===============================
// Shorten URL
// ===============================

shortenBtn.addEventListener("click", async () => {

    const originalUrl = urlInput.value.trim();

    if (!originalUrl) {

        showToast("Please enter a URL", "#ef4444");

        return;
    }

    shortenBtn.disabled = true;
    shortenBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Shortening...';

    try {

        const response = await fetch("/shorten", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                originalUrl
            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        resultBox.classList.remove("hidden");

        shortUrlInput.value = data.shortUrl;

        showToast("Short URL Created Successfully");
        clearInput();

    } catch (error) {

        showToast(error.message, "#ef4444");

    }

    shortenBtn.disabled = false;

    shortenBtn.innerHTML =
        '<i class="fa-solid fa-wand-magic-sparkles"></i> Shorten';

});

// ===============================
// Copy Button
// ===============================

copyBtn.addEventListener("click", () => {

    if (!shortUrlInput.value) {

        showToast("No Short URL Found", "#ef4444");

        return;
    }

    navigator.clipboard.writeText(shortUrlInput.value);

    showToast("URL Copied Successfully 📋");

});


// ===============================
// Open Button
// ===============================

openBtn.addEventListener("click", () => {

    if (!shortUrlInput.value) {

        showToast("No URL Available", "#ef4444");

        return;
    }

    window.open(shortUrlInput.value, "_blank");

});


// ===============================
// Press Enter to Shorten
// ===============================

urlInput.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        shortenBtn.click();

    }

});

// ===============================
// Auto Clear Input After Success
// ===============================

function clearInput() {
    urlInput.value = "";
    urlInput.focus();
}

// ===============================
// Better URL Validation
// ===============================

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ===============================
// Input Border Animation
// ===============================

function shakeInput() {

    urlInput.animate(
        [
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(0px)" }
        ],
        {
            duration: 350
        }
    );

}

// ===============================
// Improve Shorten Button
// ===============================

shortenBtn.addEventListener("click", () => {

    if (!urlInput.value.trim()) {

        shakeInput();

        return;

    }

});