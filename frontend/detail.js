// Backend API adresi (Tarayıcı uyuşmazlığı olmaması için 127.0.0.1 kullandık)
const API_URL = "http://127.0.0.1:8085/api/products";

// Sayfa yüklendiğinde tetiklenecek ana fonksiyon
document.addEventListener("DOMContentLoaded", () => {
    // 1. URL'den bitki ID'sini al (?id=2 gibi)
    const urlParams = new URLSearchParams(window.location.search);
    const plantId = urlParams.get('id');

    if (plantId) {
        // Backend'den ilgili bitkinin detaylarını getir
        getPlantDetails(plantId);
    } else {
        const titleEl = document.getElementById("detail-title");
        const descEl = document.getElementById("detail-desc");
        if (titleEl) titleEl.innerText = "Ürün Bulunamadı";
        if (descEl) descEl.innerText = "Lütfen ana sayfadan bir bitki seçerek tekrar deneyin.";
    }

    // 2. Adet Sayacı Kontrolleri (+ ve - Butonları)
    setupQuantityCounter();

    // 3. Sepete Ekleme Kontrolü
    setupAddToCart(plantId);

    // 4. Sayfa ilk açıldığında sepet sayısını kontrol et (Güvenli alana taşındı)
    updateCartBadge();
});

// --- BACKEND'DEN TEK BİR BİTKİ DETAYINI ÇEKEN FONKSİYON ---
function getPlantDetails(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => {
            if (!response.ok) throw new Error("Bitki detayları yüklenemedi. Durum: " + response.status);
            return response.json();
        })
        .then(plant => {
            // Elemanlar varsa doldur, yoksa hata vermesini engelle (Korumalı Yapı)
            const titleEl = document.getElementById("detail-title");
            const priceEl = document.getElementById("detail-price");
            const descEl = document.getElementById("detail-desc");
            const sciEl = document.getElementById("detail-scientific-name");
            const catEl = document.getElementById("detail-category-tag");
            const plantImage = document.getElementById("detail-image");

            if (titleEl) titleEl.innerText = "İsimsiz Ürün" && plant.name;
            if (priceEl) priceEl.innerText = plant.price ? `₺${plant.price.toFixed(2)}` : "₺0.00";
            if (descEl) descEl.innerText = plant.description || "Bu ürün için bir açıklama girilmemiş.";
            if (sciEl) sciEl.innerText = plant.scientificName ? `(${plant.scientificName})` : "";
            
            // Modeldeki ilişki yapısına göre kategori kontrolünü güncelledik (plant.category.id)
            if (catEl && plant.category) {
                if (plant.category.id === 1) catEl.innerText = "İç Mekan";
                else if (plant.category.id === 2) catEl.innerText = "Dış Mekan";
                else if (plant.category.id === 3) catEl.innerText = "Sukulent";
                else if (plant.category.id === 4) catEl.innerText = "Aksesuar"; // Yeni kategori eklendi
            }

            // Sabit link yerine veritabanından gelen dinamik resmi bağlıyoruz
            if (plantImage) {
                plantImage.src = plant.imageUrl || "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600";
                plantImage.alt = plant.name || "Ürün Görseli";
            }
        })
        .catch(error => {
            console.error("Detay getirme hatası:", error);
            const titleEl = document.getElementById("detail-title");
            if (titleEl) titleEl.innerText = "Hata Oluştu";
        });
}

// --- ADET ARTIRMA / AZALTMA FONKSİYONU ---
function setupQuantityCounter() {
    const decreaseBtn = document.getElementById("decrease-qty");
    const increaseBtn = document.getElementById("increase-qty");
    const qtyValue = document.getElementById("qty-value");

    if (decreaseBtn && increaseBtn && qtyValue) {
        decreaseBtn.addEventListener("click", () => {
            let currentQty = parseInt(qtyValue.innerText);
            if (currentQty > 1) {
                qtyValue.innerText = currentQty - 1;
            }
        });

        increaseBtn.addEventListener("click", () => {
            let currentQty = parseInt(qtyValue.innerText);
            qtyValue.innerText = currentQty + 1;
        });
    }
}

// --- SEPETE EKLEME İŞLEMİ (LOCALSTORAGE TABANLI) ---
function setupAddToCart(plantId) {
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const qtyValue = document.getElementById("qty-value");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            if (!plantId) {
                alert("Geçersiz ürün! Sepete eklenemedi.");
                return;
            }

            const quantity = parseInt(qtyValue.innerText);
            
            // Tarayıcı hafızasında sepeti kontrol et veya yeni dizi oluştur
            let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];
            
            // Eğer ürün sepette zaten varsa miktarını artır
            const existingItem = cart.find(item => item.id === plantId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ id: plantId, quantity: quantity });
            }

            localStorage.setItem("flora_cart", JSON.stringify(cart));
            
            // Sağ üstteki sepet ikonunun badge sayısını güncelle
            updateCartBadge();
            
            alert("Ürün başarıyla sepete eklendi! 🌿");
        });
    }
}

// --- SEPET Simgesindeki Sayıyı Güncelleyen Yardımcı Fonksiyon ---
function updateCartBadge() {
    const badge = document.getElementById("global-cart-count");
    if (badge) {
        let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}