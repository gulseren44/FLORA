document.addEventListener("DOMContentLoaded", () => {
    const adminForm = document.getElementById("admin-login-form");

    if (adminForm) {
        adminForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("admin-username").value.trim();
            const password = document.getElementById("admin-password").value;

            // Şimdilik statik bir admin kilidi koyuyoruz
            if (username === "admin" && password === "flora123") {
                alert("Yönetici girişi başarılı! Panele gidiyorsunuz... 🛠️");
                localStorage.setItem("is_admin", "true"); // Admin oturumu açıldı işareti
                window.location.href = "admin-panel.html"; // Panel sayfasına yönlendir
            } else {
                alert("Yetkisiz kullanıcı adı veya şifre! 🛑");
            }
        });
    }
});