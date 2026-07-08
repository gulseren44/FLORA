const API_URL = "http://127.0.0.1:8085/api/products";

document.addEventListener("DOMContentLoaded", () => {
    loadCartItems();
});

// --- SEPETTEKİ ÜRÜNLERİ BACKEND'DEN DETAYIYLA ÇEKEN VE EKRANA BASAN ANA FONKSİYON ---
function loadCartItems() {
    const cartWrapper = document.getElementById("cart-page-items");
    let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];

    if (cart.length === 0) {
        cartWrapper.innerHTML = "<p style='padding: 20px;'>Sepetinizde henüz bitki bulunmuyor. 🌿</p>";
        updateSummary(0);
        updateCartBadge();
        return;
    }

    cartWrapper.innerHTML = ""; // Yükleniyor yazısını temizle
    let totalOrderPrice = 0;
    let loadedCount = 0;

    cart.forEach((cartItem, index) => {
        // Her bir sepet ürünü için backend'den güncel bilgileri çekiyoruz
        fetch(`${API_URL}/${cartItem.id}`)
            .then(response => {
                if (!response.ok) throw new Error("Ürün bilgisi alınamadı.");
                return response.json();
            })
            .then(plant => {
                const itemTotalPrice = plant.price * cartItem.quantity;
                totalOrderPrice += itemTotalPrice;

                // FIX: Eğer veritabanında görsel yoksa patlamasın diye yedek bir görsel koyduk
                const productImg = plant.imageUrl || 'https://via.placeholder.com/150';

                // Dinamik kart satırını oluşturuyoruz
                const itemHtml = `
                    <div class="cart-page-item" data-id="${cartItem.id}">
                        <img src="${productImg}" alt="${plant.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                        <div class="item-info">
                            <h3>${plant.name}</h3>
                            <p class="meta">BİTKİ • DOĞAL HAVA FİLTRESİ</p>
                            <div class="item-controls">
                                <div class="mini-counter">
                                    <button onclick="changeQuantity('${cartItem.id}', -1)">-</button>
                                    <span>${cartItem.quantity}</span>
                                    <button onclick="changeQuantity('${cartItem.id}', 1)">+</button>
                                </div>
                                <button class="remove-btn" onclick="removeFromCart('${cartItem.id}')">🗑️ Kaldır</button>
                            </div>
                        </div>
                        <div class="item-price">₺${itemTotalPrice.toFixed(2)}</div>
                    </div>
                `;
                cartWrapper.innerHTML += itemHtml;
                
                loadedCount++;
                // Tüm ürünler asenkron olarak yüklendiğinde toplam fiyat özetini güncelle
                if (loadedCount === cart.length) {
                    updateSummary(totalOrderPrice);
                }
            })
            .catch(error => {
                console.error("Sepet öğesi yükleme hatası:", error);
                loadedCount++;
                if (loadedCount === cart.length) updateSummary(totalOrderPrice);
            });
    });

    updateCartBadge();
}

// --- ADET DEĞİŞTİRME FONKSİYONU (+ ve - Butonları için) ---
function changeQuantity(id, amount) {
    let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];
    // TİP KONTROLÜ SAĞLAMLAŞTIRILDI: String veya Number fark etmeksizin eşler
    const item = cart.find(item => String(item.id) === String(id));

    if (item) {
        item.quantity += amount;
        // Eğer miktar 1'in altına düşerse sepetten tamamen sil
        if (item.quantity <= 0) {
            cart = cart.filter(item => String(item.id) !== String(id));
        }
        localStorage.setItem("flora_cart", JSON.stringify(cart));
        loadCartItems(); // Sayfayı dinamik olarak yeniden çiz
    }
}

// --- SEPETTEN ÜRÜN KALDIRMA ---
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];
    cart = cart.filter(item => String(item.id) !== String(id));
    localStorage.setItem("flora_cart", JSON.stringify(cart));
    loadCartItems();
}

// --- SİPARİŞ ÖZETİ PANELİNİ GÜNCELLEME ---
function updateSummary(total) {
    const subtotalEl = document.getElementById("summary-subtotal");
    const totalEl = document.getElementById("summary-total");

    if (subtotalEl) subtotalEl.innerText = `₺${total.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `₺${total.toFixed(2)}`;
}

// --- SEPET SİMGESİ BADGE GÜNCELLEME ---
function updateCartBadge() {
    const badge = document.getElementById("global-cart-count");
    if (badge) {
        let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}