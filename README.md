🚀 Projeyi Çalıştırma Rehberi (How to Run):
Bu projeyi yerelinizde çalıştırmak için ana dizini (Flora) klonladıktan sonra aşağıdaki adımları takip edebilirsiniz:

1. Backend (Spring Boot) Çalıştırma: 
Projeyi en dış dizinden (Flora/) açtıysanız, Maven bağımlılıklarının ve klasör yollarının doğru çözülmesi için backend servisini iki farklı şekilde ayaklandırabilirsiniz:

Yöntem A (Doğrudan Ana Dizinden): Alt klasöre geçiş yapmadan, ana dizindeki terminalden Maven parametresiyle tetikleyebilirsiniz:

```bash
./backend/mvnw spring-boot:run -f backend/pom.xml
````
Yöntem B (Klasör İçine Dallanarak - Önerilen): Terminalden backend dizinine geçiş yapıp projeyi yerel Maven wrapper ile çalıştırabilirsiniz:

```bash

cd backend

./mvnw spring-boot:run

````

💡 Not: Backend servisinin log-trace korelasyonunu (Loki & Tempo entegrasyonu) anlık izleyebilmek için yerelinizde Docker Desktop'ın açık ve docker-compose.yml dosyasının ayaklandırılmış olması gerekmektedir.

2. Frontend Çalıştırma: 
Ana dizinden frontend terminaline geçiş yaparak statik dosyalarınızı yerel bir sunucuyla veya doğrudan tarayıcı üzerinden açabilirsiniz:

```bash

cd frontend

# Eğer yerel bir http-server kullanıyorsanız:

npx http-server .

````


<img width="1632" height="967" alt="image" src="https://github.com/user-attachments/assets/87537dad-b661-44c5-8dca-7141498a22a3" />
<img width="1711" height="922" alt="image" src="https://github.com/user-attachments/assets/fc3e07db-523a-4998-aba2-d1478f60d1c2" />
<img width="1677" height="952" alt="image" src="https://github.com/user-attachments/assets/e3789de1-a84d-44fd-9450-0ebac9d984cc" />
<img width="1612" height="831" alt="image" src="https://github.com/user-attachments/assets/ea7275a5-6f19-400a-a3d7-acacd83a2c39" />
<img width="1657" height="940" alt="image" src="https://github.com/user-attachments/assets/4ab149e4-56ee-4080-9019-4310c89b8770" />
<img width="1887" height="742" alt="image" src="https://github.com/user-attachments/assets/80db1d54-a717-48cd-85ac-b6a750982e38" />
<img width="1861" height="802" alt="image" src="https://github.com/user-attachments/assets/54cf6836-08dc-41aa-bfb1-4aa715ac1d5e" />
