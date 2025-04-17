# Base Image: Node.js 18 - LTS (Long Term Support) sürümünü tercih ediyoruz.
# Alpine versiyonunu daha küçük boyutta ve güvenlik açıkları daha az.
FROM node:20-alpine

# Çalışma dizini oluşturuyoruz - Tüm uygulama dosyalarımız bu dizinde olacak
WORKDIR /app

# Önce package.json ve package-lock.json dosyalarını kopyalıyoruz
# Bu adımı ayrı yaparak, sadece bağımlılıklar değiştiğinde Docker'ın npm install'u tekrar çalıştırmasını sağlıyoruz
# Bu Docker cache mekanizmasını daha verimli kullanmamızı sağlar
COPY package.json ./
COPY package-lock.json ./

# Bağımlılıkları yüklüyoruz
# production flag'i ile sadece production bağımlılıklarını yüklüyoruz
RUN npm install --only=production

# Tüm proje dosyalarını kopyalıyoruz
# .dockerignore dosyası ile node_modules gibi gereksiz dosyaları hariç tutacağız
COPY . .

# TypeScript kodu derlemek için gerekli paketleri geçici olarak yüklüyoruz
# --no-save ile package.json'a eklenmesini önlüyoruz
RUN npm install --no-save typescript ts-node

# TypeScript kodunu JavaScript'e derliyoruz
RUN npx tsc

# Uygulamanın çalışacağı portu belirtiyoruz
EXPOSE 3000

# Container başlatıldığında çalışacak komutu belirtiyoruz
# Derlenen JavaScript dosyasını çalıştırıyoruz
CMD ["npm", "run", "dev"]
