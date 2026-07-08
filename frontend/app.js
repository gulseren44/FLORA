// Backend URL tanımlaması (Spring Boot projen arkada açık olduğu sürece buraya istek atacak)
const API_URL = "http://127.0.0.1:8085/api/products";

// Filtrelerin kesişim kümesini alabilmek için backend'den gelen güncel listeyi hafızada tutuyoruz
let currentActivePlants = []; 

// Sayfa yüklendiğinde çalışacak ana tetikleyici
document.addEventListener("DOMContentLoaded", () => {
    // 1. Veritabanındaki tüm bitkileri getir
    getAllPlants();

    // 2. Kategori kartlarına tıklama olaylarını bağla
    setupCategoryFilters();

    // 3. Kahraman afişin altındaki arama çubuğunu ve Fiyat Radyo butonlarını aktif et
    setupSearchAndPriceFilters();

    // 4. Kullanıcı oturum açmış mı kontrol et 
    checkUserSession();

    // 5. Sayfa açıldığında sepet badge sayısını localStorage'dan çek ve yaz
    updateNavbarCartBadge();
});

// --- ANA SAYFA SEPET ADETİNİ GÜNCELLEYEN FONKSİYON ---
function updateNavbarCartBadge() {
    const badge = document.getElementById("global-cart-count");
    if (badge) {
        let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}

// --- KULLANICI OTURUM KONTROLÜ FONKSİYONU  ---
function checkUserSession() {
    const loginBtn = document.getElementById("nav-login-btn");
    const userProfile = document.getElementById("nav-user-profile");
    const usernameSpan = document.getElementById("nav-username-span");
    const logoutBtn = document.getElementById("nav-logout-btn");

    const activeUser = JSON.parse(localStorage.getItem("active_user"));

    if (activeUser && userProfile && loginBtn && usernameSpan) {
        loginBtn.style.display = "none";
        userProfile.style.display = "inline-block";
        usernameSpan.innerText = activeUser.name;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("active_user");
            alert("Oturum kapatıldı. Yine bekleriz! 🌿");
            window.location.reload();
        });
    }
}

// --- BÜTÜN BİTKİLERİ GETİREN FONKSİYON ---
function getAllPlants() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Backend verisi çekilemedi.");
            return response.json();
        })
        .then(plants => {
            // Kombine filtrelerin ilk başta tüm ürünleri tanıyabilmesi için hafızaya yüklüyoruz
            currentActivePlants = plants; 

            // "Flora Favorileri" altındaki küçük kartları dinamik dolduralım
            const smallGrid = document.querySelector(".small-products-grid");
            if (smallGrid && plants.length > 0) {
                smallGrid.innerHTML = "";
                
                // Gelen verilerden ilk 3 tanesini ana sayfada favori olarak gösterelim
                plants.slice(0, 3).forEach(plant => {
                    const cardHtml = `
                        <div class="small-card" onclick="window.location.href='detail.html?id=${plant.id}'">
                            <div class="img-wrapper">
                                <img src="${plant.imageUrl}" alt="${plant.name}">
                            </div>
                            <h4>${plant.name}</h4>
                            <p class="price">₺${plant.price.toFixed(2)}</p>
                        </div>
                    `;
                    smallGrid.innerHTML += cardHtml;
                });
            }
        })
        .catch(error => console.error("Hata:", error));
}

// --- KATEGORİLERE GÖRE FİLTRELEME YAPAN FONKSİYON ---
function setupCategoryFilters() {
    const categoryCards = document.querySelectorAll(".category-card");
    const resultsSection = document.getElementById("filter-results-section");
    const filterTitle = document.getElementById("filter-title");
    const filterClearBtn = document.getElementById("filter-clear-btn");

    categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            const categoryAttr = card.getAttribute("data-category");
            
            let categoryId = null;
            if (categoryAttr === "ic-mekan") categoryId = 1;
            if (categoryAttr === "dis-mekan") categoryId = 2;
            if (categoryAttr === "sukulent") categoryId = 3;
            if (categoryAttr === "aksesuar") categoryId = 4;

            if (categoryId !== null) {
                fetch(`${API_URL}/category/${categoryId}`)
                    .then(response => {
                        if (!response.ok) throw new Error("Kategori verisi çekilemedi.");
                        return response.json();
                    })
                    .then(plants => {
                        // Kategoriye tıklandığında filtre hafızasını o kategoriye ait bitkilerle sınırlıyoruz
                        currentActivePlants = plants; 
                        
                        // Başlığı ilk olarak tıklanan kategoriye göre ayarlıyoruz
                        if (filterTitle) {
                            filterTitle.innerText = card.querySelector("span").innerText + " Bitkileri";
                        }
                        
                        // Hem kategori hem seçili fiyat filtresini aynı anda uygulamak için tetikliyoruz
                        applyCombinedFilters(true); 
                    })
                    .catch(error => console.error("Filtreleme hatası:", error));
            }
        });
    });

    // "Tümü" butonuna basıldığında her şeyi sıfırla ve tüm listeyi getir
    if (filterClearBtn) {
        filterClearBtn.addEventListener("click", () => {
            document.getElementById("global-search-input").value = "";
            const allRadio = document.querySelector('input[name="price-filter"][value="all"]');
            if (allRadio) allRadio.checked = true;

            fetch(API_URL)
                .then(res => res.json())
                .then(plants => {
                    currentActivePlants = plants;
                    if (resultsSection) resultsSection.style.display = "none";
                });
        });
    }
}

// --- KOMBİNE ARAMA VE FİYAT FİLTRELERİNİ YÖNETEN ANA MOTOR ---
function setupSearchAndPriceFilters() {
    const searchInput = document.getElementById("global-search-input");
    const priceRadios = document.querySelectorAll('input[name="price-filter"]');

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            applyCombinedFilters(false);
        });
    }

    priceRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            applyCombinedFilters(false);
        });
    });
}

// --- HEM KELİME HEM DE FİYAT ARALIĞINI SÜZEN ORTAK FONKSİYON ---
function applyCombinedFilters(isCategoryClick = false) {
    const searchInput = document.getElementById("global-search-input");
    const resultsSection = document.getElementById("filter-results-section");
    const filterTitle = document.getElementById("filter-title");
    
    const query = searchInput ? searchInput.value.trim() : "";
    const selectedPriceRange = document.querySelector('input[name="price-filter"]:checked').value;

    if (resultsSection) resultsSection.style.display = "block";

    // --- BAŞLIĞI AKILLICA AYARLAMA VE SAÇMA METİNLERİ ENGELLEME ALANI ---
    if (filterTitle) {
        if (query !== "") {
            // Eğer arama kutusunda bir kelime varsa öncelik arama kelimesindedir
            filterTitle.innerText = `"${query}" İçin Filtre Sonuçları`;
        } else if (!isCategoryClick) {
            // Arama kutusu boşsa ve kategori kartına tıklanmadıysa (yani sadece fiyata basıldıysa)
            if (selectedPriceRange === "all") {
                filterTitle.innerText = "Tüm Ürünler";
            } else if (selectedPriceRange === "0-100") {
                filterTitle.innerText = "0 - 100 TL Arasındaki Ürünler";
            } else if (selectedPriceRange === "100-300") {
                filterTitle.innerText = "100 - 300 TL Arasındaki Ürünler";
            } else if (selectedPriceRange === "300-400") {
                filterTitle.innerText = "300 - 400 TL Arasındaki Ürünler";
            } else if (selectedPriceRange === "400plus") {
                filterTitle.innerText = "400 TL ve Üzeri Ürünler";
            }
        }
        // Eğer kategoriye tıklandıysa başlık değişimini yukarıdaki setupCategoryFilters'a bırakıyoruz
    }

    // Kombine Filtreleme Algoritması
    const filteredPlants = currentActivePlants.filter(plant => {
        // 1. Kelime bazlı arama kontrolü
        const matchesSearch = plant.name.toLowerCase().includes(query.toLowerCase()) || 
                              (plant.scientificName && plant.scientificName.toLowerCase().includes(query.toLowerCase()));

        // 2. Nokta atışı fiyat aralığı kontrolü
        let matchesPrice = false;
        if (selectedPriceRange === "all") {
            matchesPrice = true;
        } else if (selectedPriceRange === "0-100") {
            matchesPrice = plant.price >= 0 && plant.price <= 100;
        } else if (selectedPriceRange === "100-300") {
            matchesPrice = plant.price > 100 && plant.price <= 300;
        } else if (selectedPriceRange === "300-400") {
            matchesPrice = plant.price > 300 && plant.price <= 400;
        } else if (selectedPriceRange === "400plus") {
            matchesPrice = plant.price > 400;
        }

        return matchesSearch && matchesPrice;
    });

    renderFilterResults(filteredPlants);
}

// --- ORTAK SONUÇ BASMA VE SAYFA KAYDIRMA FONKSİYONU ---
function renderFilterResults(plants) {
    const resultsSection = document.getElementById("filter-results-section");
    const resultsWrapper = document.getElementById("filter-products-wrapper");

    if (!resultsWrapper || !resultsSection) return;

    resultsWrapper.innerHTML = ""; 
    resultsSection.style.display = "block"; 

    if (plants.length === 0) {
        resultsWrapper.innerHTML = "<p style='padding: 20px; color: #888;'>Aradığınız kriterlere ve fiyat aralığına uygun bir bitki bulunamadı. 🍂</p>";
    } else {
        plants.forEach(plant => {
            const cardHtml = `
                <div class="small-card" onclick="window.location.href='detail.html?id=${plant.id}'" style="margin: 10px;">
                    <div class="img-wrapper">
                        <img src="${plant.imageUrl}" alt="${plant.name}">
                    </div>
                    <h4>${plant.name}</h4>
                    <p class="price">₺${plant.price.toFixed(2)}</p>
                </div>
            `;
            resultsWrapper.innerHTML += cardHtml;
        });
    }

    resultsSection.scrollIntoView({ behavior: 'smooth' });
}