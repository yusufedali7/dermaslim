# Dermaslim — E-ticaret Landing Page

> Türkçe doğal takviye ürünü için tasarlanmış statik e-ticaret sitesi. Vanilla HTML/CSS/JS ile, Netlify Forms entegrasyonlu, mobile-first.

**Canlı:** [dermaslim.com.tr](dermaslimbant.com.tr) (Netlify üzerinde)

---

## Özellikler

- **Saf vanilla stack** — build tool yok, framework yok, dependency yok. `index.html` açılır.
- **Mobile-first responsive** — 320px'den 1440px'e kadar akıcı yerleşim.
- **localStorage tabanlı sepet** — sayfa yenilendiğinde kaybolmaz, serverless.
- **Netlify Forms entegrasyonu** — sipariş bilgileri e-posta olarak satıcıya gider.
- **Semantik HTML + erişilebilirlik** — screen-reader dostu etiketler, klavye navigasyonu, ESC ile drawer kapanır.
- **Design tokens** — tüm renk/tipografi/boşluk değerleri `tokens.css` dosyasında merkezi.
- **KVKK uyumlu legal sayfalar** — gizlilik, kullanım, iade, mesafeli satış (6502 sayılı kanun).

## Tasarım Yaklaşımı

Bu proje, genel AI üretimi sitelerin klişe estetiğinden (mor-pembe gradyanlar, yuvarlak köşeler, Inter-every-where) kaçınmak üzere tasarlandı. Referans alınan stil: geleneksel eczacı / takviye gıda markaları (Solgar, Bioderma, Arkopharma).

**Seçimler:**

| Karar | Değer | Neden |
|-------|-------|-------|
| Ana renk | Orman yeşili `#2D5F3F` | Doğal/eczacı geleneği |
| Yüzey | Krem kağıt `#FAF5EB` | Matbaada basılı ambalaj hissi |
| Başlık fontu | Fraunces (serif) | AI siteler sans-only kullanır; serif editoryal ciddiyet verir |
| Gövde fontu | Inter (sans) | Form doldurma için okunabilirlik |
| Köşe yarıçapı | 2px (maks 6px) | Yuvarlaklar "AI-made" kokusu verir |
| Gölgeler | Subtle, `rgba(28,36,32,0.04)` | Glow/neon yerine matbaa gölgesi |

## Klasör Yapısı

```
dermaslim/
├── index.html                        # Ana sayfa
├── gizlilik-politikasi.html          # KVKK bilgilendirme
├── kullanim-kosullari.html           # Site şartları
├── iade-politikasi.html              # 14 gün iade
├── mesafeli-satis-sozlesmesi.html    # 6502 sayılı kanun
│
├── assets/
│   ├── css/
│   │   ├── tokens.css                # CSS değişkenleri (renk/tipografi/boşluk)
│   │   ├── main.css                  # Ana sayfa stilleri
│   │   └── legal.css                 # Legal sayfa stilleri
│   ├── js/
│   │   ├── cart.js                   # Sepet (localStorage)
│   │   ├── form.js                   # Netlify Forms submit
│   │   └── main.js                   # Navigasyon, geri sayım, SSS, scroll
│   └── images/
│       ├── product-box.jpg
│       └── product-usage.jpg
│
├── netlify.toml                      # Netlify konfigürasyonu
├── README.md
├── .gitignore
└── LICENSE
```

## Yerelde Çalıştırma

Herhangi bir statik sunucu yeterli. Örnekler:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx ile)
npx serve .

# PHP
php -S localhost:8000
```

Sonrasında tarayıcıda: `http://localhost:8000`

> **Not:** Netlify Forms sadece Netlify üzerinde çalışır. Yerel ortamda form submit çalışmaz ama UI tamamen test edilebilir.

## Netlify'a Deploy

**Seçenek 1 — Drag & Drop (en hızlı):**

1. [Netlify](https://app.netlify.com/drop) sayfasına git
2. Proje klasörünü sayfaya sürükleyip bırak
3. Otomatik bir subdomain alırsın, custom domain eklemek istersen site ayarlarından yapılır

**Seçenek 2 — Git entegrasyonu:**

1. Projeyi GitHub'a push'la
2. Netlify'da "New site from Git" → repo'yu seç
3. Build command boş, publish directory `/`

**Form kurulumu:**

Netlify otomatik olarak `data-netlify="true"` attribute'üne sahip formları algılar. İlk submit sonrası Netlify dashboard'unda "Forms" sekmesinden bildirim ayarlarını yapabilirsin (e-posta yönlendirme, Slack webhook vb.).

## Design Tokens Değiştirme

Tüm tasarım değişkenleri `assets/css/tokens.css` içinde. Örneğin ana rengi değiştirmek için:

```css
:root {
  --color-primary: #2D5F3F;  /* bu değeri değiştir, tüm site güncellenir */
}
```

## İçerik Güncelleme

- **Fiyatlar:** `index.html` içinde `.pricing-card` bloklarında (3 adet)
- **Ürün bilgisi:** `.info-grid` bloğunda (6 kart)
- **Müşteri yorumları:** `.testimonials-scroll` bloğunda
- **SSS:** `.faq-list` bloğunda (7 soru)
- **İletişim:** footer + legal sayfalar

## Yasal Uyumluluk

Bu template KVKK ve 6502 sayılı Tüketicinin Korunması Hakkında Kanun'a uygun şekilde düzenlenmiştir. Ancak kendi ticari faaliyetinize uyarlarken:

- Satıcı bilgilerini (unvan, MERSIS, VKN) mesafeli satış sözleşmesinde doldurmalısın
- Ürün ilaç olmadığından "hastalık tedavi eder" iddialarından kaçınılmıştır
- "Klinik test", "bakanlık onaylı", "%X etkili" gibi doğrulanamayan iddialar template'den çıkarılmıştır

## Teknik Notlar

- Fontlar Google Fonts'tan yüklenir (Fraunces + Inter)
- İkonlar inline SVG — CDN dependency yok
- localStorage key: `dermaslim_cart_v1`
- Form honeypot: Netlify'ın built-in bot koruması (`bot-field`)
- Tarayıcı desteği: son 2 sürüm Chrome, Firefox, Safari, Edge. IE desteği yok.

## Lisans

MIT — detaylar için [LICENSE](./LICENSE) dosyası.

---

**Portfolio notu:** Bu proje bir arkadaş için kişisel olarak yeniden tasarlandı. Orijinal sitedeki bazı yasal risk taşıyan iddialar (garantili kilo verme, bakanlık onaylı vb.) kaldırılmıştır. Refactor sürecinde tasarım sisteminin `tokens.css`'e izole edilmesi, sepet modülünün localStorage ile serverless kalması ve Netlify Forms ile zero-backend e-ticaret akışının kurulması öne çıkan noktalardır.
