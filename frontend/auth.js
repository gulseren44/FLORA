const AUTH_API_URL = "http://127.0.0.1:8085/api/auth";

document.addEventListener("DOMContentLoaded", () => {
    const loginBox = document.getElementById("login-box");
    const registerBox = document.getElementById("register-box");
    
    const goToRegister = document.getElementById("go-to-register");
    const goToLogin = document.getElementById("go-to-login");

    // Formlar arası geçiş mantığı
    if (goToRegister && goToLogin) {
        goToRegister.addEventListener("click", (e) => {
            e.preventDefault();
            loginBox.style.display = "none";
            registerBox.style.display = "block";
        });

        goToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            registerBox.style.display = "none";
            loginBox.style.display = "block";
        });
    }

    // --- VERİTABANI BAĞLANTILI GİRİŞ YAPMA ---
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            fetch(`${AUTH_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message); });
                }
                return response.json();
            })
            .then(user => {
                alert(`Giriş başarılı! Hoş geldin, ${user.name}! 🌿`);
                localStorage.setItem("active_user", JSON.stringify(user));
                window.location.href = "index.html"; // Başarılıysa ana sayfaya fırlat
            })
            .catch(error => {
                console.error("Giriş hatası:", error);
                alert(error.message || "E-posta veya şifre hatalı!");
            });
        });
    }

    // --- VERİTABANI BAĞLANTILI KAYIT OLMA ---
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("reg-name").value.trim();
            const email = document.getElementById("reg-email").value.trim();
            const password = document.getElementById("reg-password").value;

            fetch(`${AUTH_API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message); });
                }
                return response.json();
            })
            .then(savedUser => {
                alert("Harika! Veritabanına başarıyla kayıt oldun. 🎉 Şimdi giriş yapabilirsin.");
                registerForm.reset();
                registerBox.style.display = "none";
                loginBox.style.display = "block"; // Kayıttan sonra otomatik girişe atar
            })
            .catch(error => {
                console.error("Kayıt hatası:", error);
                alert(error.message || "Kayıt sırasında bir hata oluştu!");
            });
        });
    }
});