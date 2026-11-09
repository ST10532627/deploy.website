const animals = [
    {
        name: "Milo",
        type: "Dog",
        fee: 850,
        cat: "Dog",
        desc: "2 Year Old Male - Jack Russell mix from Thokoza. Loves kids, long walks and belly rubs.",
        img: "images/milo-jack-russell-adopt-alberton.jpg"
    },
    {
        name: "Luna",
        type: "Cat",
        fee: 650,
        cat: "Cat",
        desc: "1 Year Old Female - Shy but loving cat from Brackenhurst Foster. Quiet, litter-trained.",
        img: "images/luna-cat-adopt-brackenhurst.jpg"
    },
    {
        name: "Max & Bella",
        type: "Pair",
        fee: 850,
        cat: "Pair",
        desc: "Bonded Pair - 3 Years Old. Surrendered together, cannot be separated. Calm and loyal.",
        img: "images/max-bella-bonded-pair-addTransitionType.jpg"
    }
];

function loadAnimals() {
    const box = document.getElementById("animalList");
    if (!box) return;

    box.innerHTML = animals.map(a => `
        <article class="card fade-in">
            <h3>${a.name} - R${a.fee}</h3>
            <img src="${a.img}" alt="${a.name} available for adoption at Paws & Hope" onclick="openLightbox(this.src)" width="250">
            <p>${a.desc}</p>
            <a href="enquiry.html">Enquire About ${a.name}</a>
        </article>
    `).join("");
}

function filterAnimals() {
    const q = document.getElementById("searchBox")?.value.toLowerCase() || "";
    const cat = document.getElementById("filterCat")?.value || "All";
    const sort = document.getElementById("sortPrice")?.value || "";

    let filtered = animals.filter(a =>
        a.name.toLowerCase().includes(q) &&
        (cat === "All" || a.cat === cat)
    );

    if (sort === "low") filtered.sort((a, b) => a.fee - b.fee);
    if (sort === "high") filtered.sort((a, b) => b.fee - a.fee);

    const box = document.getElementById("animalList");
    if (box) {
        box.innerHTML = filtered.map(a => `
            <article class="card">
                <h3>${a.name} - R${a.fee}</h3>
                <p>${a.desc}</p>
            </article>
        `).join("");
    }
}

function showTab(id) {
    ["tab1", "tab2", "tab3"].forEach(tab => {
        const el = document.getElementById(tab);
        if (el) el.style.display = tab === id ? "block" : "none";
    });
}

document.querySelectorAll(".accordion-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        if (panel) panel.classList.toggle("open");
    });
});

function openModal() {
    const modal = document.getElementById("adoptModal");
    if (modal) modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("adoptModal");
    if (modal) modal.style.display = "none";
}

function openLightbox(src) {
    const lightboxImg = document.getElementById("lightboxImg");
    const lightbox = document.getElementById("lightbox");
    if (lightboxImg) lightboxImg.src = src;
    if (lightbox) lightbox.style.display = "flex";
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) lightbox.style.display = "none";
}

if (document.getElementById("map") && typeof L !== "undefined") {
    const map = L.map("map").setView([-26.2698, 28.1200], 14);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/reset/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
        maxZoom: 19
    }).addTo(map);
    L.marker([-26.2698, 28.1200]).addTo(map).bindPopup("Paws & Hope - 45 Voortrekker Road, Alberton North").openPopup();
    L.marker([-26.2800, 28.1600]).addTo(map).bindPopup("Paws & Hope - Brackenhurst").openPopup();
}

document.getElementById("enquiryForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;
    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const date = document.getElementById("date")?.value.trim() || "";
    const msg = document.getElementById("message")?.value.trim() || "";
    const interest = document.querySelector('input[name="interest"]:checked');
    const animal = document.getElementById("animal")?.value || "";
    const agree = document.getElementById("agree");

    if (name.length < 3) {
        document.getElementById("nameError").textContent = "Enter full name (min 3 letters)";
        valid = false;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email";
        valid = false;
    } else {
        document.getElementById("emailError").textContent = "";
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        document.getElementById("phoneError").textContent = "Phone must be 10 digits, e.g. 0821234567";
        valid = false;
    } else {
        document.getElementById("phoneError").textContent = "";
    }

    if (!date || new Date(date) < new Date().setHours(0, 0, 0, 0)) {
        document.getElementById("dateError").textContent = "Date cannot be in the past";
        valid = false;
    } else {
        document.getElementById("dateError").textContent = "";
    }

    if (msg.length > 0 && msg.length < 20) {
        document.getElementById("messageError").textContent = "Message must be at least 20 characters";
        valid = false;
    } else {
        document.getElementById("messageError").textContent = "";
    }

    if (!interest) {
        document.getElementById("interestError").textContent = "Please select an interest";
        valid = false;
    } else {
        document.getElementById("interestError").textContent = "";
    }

    if (!agree || !agree.checked) {
        document.getElementById("agreeError").textContent = "Please agree to be contacted";
        valid = false;
    } else {
        document.getElementById("agreeError").textContent = "";
    }

    if (!valid) return;

    let cost = "";
    if (interest.value === "Adopt") {
        cost = animal === "Luna" ? "Adoption fee: 650 (cats)" : animal === "Milo" ? "Adoption fee: 850 (dogs)" : "Adoption fee: 850 (bonded pair)";
    }
    if (interest.value === "Sponsor/Donate") cost = "Sponsor a kennel: R250 per month";
    if (interest.value === "Volunteer") cost = "Volunteer: Free - we will contact you";
    if (interest.value === "Foster") cost = "Foster: Free - 2 weeks foster period";

    document.getElementById("enquiryResult").innerHTML = `Thank you ${name}! Your enquiry for <b>${interest.value} - ${animal}</b> on ${date} - <b>${cost}</b>. ${animal} is currently available. We will confirm within 24 hours at ${email}.`;
    this.reset();
});

document.getElementById("contactForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;
    const name = document.getElementById("contactName")?.value.trim() || "";
    const email = document.getElementById("contactEmail")?.value.trim() || "";
    const msg = document.getElementById("contactMessage")?.value.trim() || "";

    if (name.length < 3) {
        document.getElementById("contactNameError").textContent = "Enter full name (min 3 letters)";
        valid = false;
    } else {
        document.getElementById("contactNameError").textContent = "";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("cEmailError").textContent = "Enter a valid email";
        valid = false;
    } else {
        document.getElementById("cEmailError").textContent = "";
    }

    if (msg.length > 0 && msg.length < 20) {
        document.getElementById("cMessageError").textContent = "Message must be at least 20 characters";
        valid = false;
    } else {
        document.getElementById("cMessageError").textContent = "";
    }

    if (!valid) return;

    const subject = document.getElementById("cType")?.value || "General inquiry";
    const body = `Name: ${name}\nMessage: ${msg}`;
    window.location.href = `mailto:hello@pawandhope.org.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const result = document.getElementById("contactResult");
    if (result) result.textContent = "Thank you! Your email to hello@pawandhope.org.za is ready to send.";
});

loadAnimals();

