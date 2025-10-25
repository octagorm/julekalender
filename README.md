# 🎄 Julekalender - Daglig Vinnertrekning

En morsom måte å velge daglige vinnere for julegavekalender på jobben!

## 🚀 Komme i gang

### Installasjon

Første gang:

```bash
npm install
```

### Kjøre appen

```bash
npm start
```

Eller i utviklingsmodus (med DevTools):

```bash
npm run dev
```

## 📖 Bruk

### 1. Administrer deltakere

Når appen starter, ser du hovedvinduet med:

- **Deltakerliste**: Alle som er med i trekningen
- **+ Legg til**: Klikk for å legge til nye deltakere
- **Avkrysningsboks**: Deaktiver noen midlertidig (f.eks. på ferie)
- **🗑️ Ikon**: Slett deltakere

Alle endringer lagres automatisk mellom kjøringer!

### 2. Velg visualisering

Under "Visualiseringer" ser du tilgjengelige animasjoner:

- **⚔️ Gladiatorarena**: Episk kamp til døden
- **⛰️ Fjellklatring**: Klatrekonkurranse til toppen
- *(Flere kommer!)*

Klikk **Start** på ønsket visualisering.

### 3. Se trekningen

- Visualiseringen åpnes i fullskjerm
- Navnene dine injiseres automatisk
- ~60 sekunder med spenning
- Vinner avsløres med fanfare! 🎉

**Tips**: Trykk `ESC` for å gå tilbake til hovedvinduet.

## 🎨 Lage nye visualiseringer

### Med Claude Code (Anbefalt)

Julekalender har en innebygd Claude Code skill som gjør det enkelt å lage nye visualiseringer!

#### 1. Åpne Claude Code

Åpne dette prosjektet i Claude Code.

#### 2. Be om en ny visualisering

Bare si hva du vil ha:

```
Lag en hesterace-visualisering for Julekalender!
```

eller

```
Lag en romrace med raketter og planeter!
```

eller

```
Lag en snake.io battle royale!
```

#### 3. Claude lager alt automatisk

Skillen sørger for at:
- ✅ Riktig navneinjeksjon fra Electron
- ✅ Event listener-mønster (ingen race conditions)
- ✅ Fallback-data for testing i nettleser
- ✅ Norsk UI
- ✅ Manifest.json med metadata
- ✅ Seeded randomness for debugging
- ✅ ~60 sekunders animasjon
- ✅ Klar vinner-avsløring

#### 4. Test med en gang

Appen oppdager automatisk nye visualiseringer i `/visualizations/` mappen!

Restart appen (`npm start`) og den nye visualiseringen dukker opp som et kort.

## 📂 Prosjektstruktur

```
julekalender/
├── app/                      # Electron-app
│   ├── main/                 # Hovedprosess (navn-lasting, vinduer)
│   └── renderer/             # Launcher UI
├── visualizations/           # Visualiseringer (legg til flere her!)
│   ├── gladiator-arena/
│   │   ├── index.html
│   │   └── manifest.json
│   └── mountain-climbing/
│       ├── index.html
│       └── manifest.json
├── .claude/
│   └── skills/
│       └── julekalender/     # Claude Code skill
│           ├── SKILL.md
│           └── templates/
├── IDEAS.md                  # 20+ visualiseringskonsepter
├── PROGRESS.md               # Fremdriftsrapport
├── QUICKSTART.md             # Utviklerguide
└── package.json
```

## 💡 Idéer til visualiseringer

Se `IDEAS.md` for 20+ konsepter, inkludert:

**Racing**:
- 🏇 Hesterace
- 🚀 Romrace med gravitasjon
- 🏃 Maraton
- 🎿 Slalåm

**Kamp**:
- 🥊 Boksering
- 🐍 Snake.io battle
- 🏹 Bueskyttere

**Abstrakt**:
- 🎰 Spilleautomat
- 🎯 Plinko
- ⚡ Lyn-eliminering

## 🛠️ Teknisk stack

- **Electron**: Desktop app
- **electron-store**: Persistent lagring
- **p5.js**: Animasjoner og grafikk
- **JavaScript/Node.js**: Hovedspråk

## 📦 Bygging for distribusjon

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

Output i `dist/` mappen - ferdig app å distribuere!

## 🐛 Feilsøking

**Visualisering vises ikke:**
- Sjekk at mappen har `index.html` og `manifest.json`
- Restart appen

**Navn vises ikke:**
- Sjekk at du bruker event listener-mønsteret
- Åpne DevTools (Cmd+Option+I) og sjekk console

**Electron starter ikke:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Bidra

1. Fork prosjektet
2. Lag en ny visualisering (bruk Claude Code!)
3. Test at det fungerer
4. Send pull request

## 📄 Lisens

Internt bruk for julekalender på jobben.
