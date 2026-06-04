# Discord Bot

Discord.js v14 ile yazılmış, slash komutları kullanan bir sunucu yönetim ve yardımcı botu.

## Özellikler

- Slash komutları (`/`)
- Rol tabanlı yetkilendirme (her komut için ayrı rol ID’si)
- Modül komut yapısı (`commands/` alt klasörleri)
- Sunucuya özel komut kaydı (geliştirme / test için)

## Komutlar

| Komut | Kategori | Açıklama |
|-------|----------|----------|
| `/helloworld` | utility | Test rolüne sahip kullanıcılara selamlama mesajı |
| `/kick` | management | Kullanıcıyı sunucudan atar (sebep opsiyonel) |
| `/ban` | management | Kullanıcıyı sunucudan yasaklar (sebep opsiyonel) |
| `/timeout` | management | Kullanıcıya dakika cinsinden zamanaşımı uygular |

## Gereksinimler

- [Node.js](https://nodejs.org/) (LTS önerilir)
- Discord [Developer Portal](https://discord.com/developers/applications) üzerinde oluşturulmuş bir uygulama
- Botun sunucuda **Kick Members**, **Ban Members**, **Moderate Members** gibi gerekli izinlere sahip olması

## Kurulum

1. Depoyu klonlayın veya indirin:

```bash
git clone https://github.com/kirmizimustafa9/suleymantopcu-bot.git
cd suleymantopcu-bot
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Yapılandırma dosyasını oluşturun:

```bash
copy config.json.example config.json
```

(Linux/macOS: `cp config.json.example config.json`)

4. `config.json` dosyasını doldurun:

| Alan | Açıklama |
|------|----------|
| `token` | Bot token’ı (Developer Portal → Bot) |
| `clientId` | Uygulama (client) ID |
| `guildId` | Komutların kaydedileceği sunucu ID |
| `kickRoleId` | `/kick` kullanabilecek rol ID |
| `timeoutRoleId` | `/timeout` kullanabilecek rol ID |
| `banRoleId` | `/ban` kullanabilecek rol ID |
| `testRoleId` | `/helloworld` kullanabilecek rol ID |

> `config.json` `.gitignore` içindedir; token ve ID’leri repoya eklemeyin.

## Botu çalıştırma

Önce slash komutlarını Discord’a kaydedin, ardından botu başlatın:

```bash
node deploy-commands.js
node main.js
```

Windows’ta `basla.bat` bu iki adımı sırayla çalıştırır.

## Proje yapısı

```
discord/
├── main.js              # Bot giriş noktası, komut yükleme ve etkileşimler
├── deploy-commands.js   # Slash komutlarını sunucuya kaydetme
├── config.json          # Gizli ayarlar (siz oluşturursunuz)
├── config.json.example  # Örnek yapılandırma
├── commands/
│   ├── utility/         # Genel komutlar
│   └── management/      # Moderasyon komutları
└── basla.bat            # Hızlı başlatma (Windows)
```

## Yeni komut ekleme

1. `commands/<kategori>/` altına yeni bir `.js` dosyası ekleyin.
2. Dosyada `data` (SlashCommandBuilder) ve `execute` fonksiyonunu export edin.
3. `node deploy-commands.js` ile komutları yeniden kaydedin.
4. Botu yeniden başlatın.

## Geliştirme

Projede ESLint yapılandırması (`eslint-config.js`) bulunur. Bağımlılıklar:

- `discord.js` ^14.26.3

## Lisans

ISC — Mustafa Kırmızıoğlu
