const API_URL = "http://127.0.0.1:8085/api/products";

document.addEventListener("DOMContentLoaded", () => {
    loadCheckoutSummary();
    setupOrderSubmission();
});

// --- SAĞ PANELDEKİ SİPARİŞ ÖZETİNİ SEPETE GÖRE DOLDURAN FONKSİYON ---
function loadCheckoutSummary() {
    const previewWrapper = document.getElementById("checkout-items-preview");
    let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];

    if (cart.length === 0) {
        previewWrapper.innerHTML = "<p>Sepetiniz boş.</p>";
        return;
    }

    previewWrapper.innerHTML = "";
    let totalOrderPrice = 0;
    let loadedCount = 0;

    cart.forEach(cartItem => {
        fetch(`${API_URL}/${cartItem.id}`)
            .then(response => response.json())
            .then(plant => {
                const itemTotalPrice = plant.price * cartItem.quantity;
                totalOrderPrice += itemTotalPrice;

                const previewHtml = `
                    <div class="preview-item" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>${plant.name} x ${cartItem.quantity}</span>
                        <strong>₺${itemTotalPrice.toFixed(2)}</strong>
                    </div>
                `;
                previewWrapper.innerHTML += previewHtml;

                loadedCount++;
                if (loadedCount === cart.length) {
                    document.getElementById("checkout-subtotal").innerText = `₺${totalOrderPrice.toFixed(2)}`;
                    document.getElementById("checkout-total").innerText = `₺${totalOrderPrice.toFixed(2)}`;
                }
            })
            .catch(error => console.error("Sipariş özeti yükleme hatası:", error));
    });
    
    updateCartBadge();
}

// --- FORMDAN VERİLERİ TOPLAYIP BACKEND'E POST EDEN FONKSİYON ---
function setupOrderSubmission() {
    const completeOrderBtn = document.getElementById("complete-order-btn");
    const form = document.getElementById("checkout-form");
    
    if (completeOrderBtn && form) {
        completeOrderBtn.addEventListener("click", (event) => {
            event.preventDefault(); 

            // 1. Form alanlarının boş olup olmadığını kontrol et
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // 2. Sepet kontrolü
            let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];
            if (cart.length === 0) {
                alert("Sepetiniz boş olduğu için sipariş veremezsiniz! 🌿");
                return;
            }

            // 3. Backend'deki Order entity yapısına birebir uygun payload hazırlıyoruz
            const orderPayload = {
                customerEmail: document.getElementById("checkout-email").value,
                customerFirstName: document.getElementById("checkout-firstname").value,
                customerLastName: document.getElementById("checkout-lastname").value,
                address: document.getElementById("checkout-address").value,
                city: document.getElementById("checkout-city").value,
                district: document.getElementById("checkout-district").value,
                cardName: document.getElementById("checkout-cardname").value,
                cardNumber: document.getElementById("checkout-cardnumber").value, 
                // Backend'deki List<OrderItem> yapısı için id'yi productId olarak eşliyoruz
                cartItems: cart.map(item => ({
                    productId: parseInt(item.id),
                    quantity: item.quantity
                }))
            };

            // 4. Backend'e GERÇEK POST isteği atıyoruz
            fetch("http://127.0.0.1:8085/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderPayload)
            })
            .then(response => {
                if (!response.ok) throw new Error("Sipariş veritabanına kaydedilemedi.");
                return response.json();
            })
            .then(data => {
                // Başarı durumunda sepeti sıfırla ve yönlendir
            
                localStorage.removeItem("flora_cart"); 
                window.location.href = `success.html?orderId=${data.id}`; 
            })
            .catch(error => {
                console.error("Sipariş hatası:", error);
                alert("Sipariş oluşturulurken backend tarafında bir hata meydana geldi. ❌");
            });
        });
    }
}

function updateCartBadge() {
    const badge = document.getElementById("global-cart-count");
    if (badge) {
        let cart = JSON.parse(localStorage.getItem("flora_cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}