# 🩵 Hatsune Miku Bot

Bot de WhatsApp com IA 100% local (sem APIs externas), sistema de pets, batalhas dinâmicas, jogos, RPG e muito mais.

## 📦 Instalação

### Replit

Na raiz do workspace:
```bash
pnpm install
pnpm --filter @workspace/miku-bot start
```

O bot mostra um QR code no console. Escaneie em **WhatsApp → Configurações → Aparelhos conectados → Conectar aparelho**.

### Termux

Instale Node.js, Python e FFmpeg pelo Termux e instale o `yt-dlp` com o gerenciador Python. Depois, dentro da pasta do bot:
```bash
npm install
npm start
```

Na primeira execução sem `auth_info/`, aparece um QR code no terminal.

### Manter dados antigos (opcional)

Se você já tinha o bot rodando e quer manter seus dados:
- Copie a pasta `auth_info/` do bot antigo (mantém a sessão do WhatsApp — não precisa escanear QR de novo)
- Copie `data/db.json` do bot antigo (mantém XP, moedas, perfis, grupos)
- Copie `aprendizado-miku.json` do bot antigo (mantém o que a IA aprendeu)

Não compartilhe `auth_info/`, `.env`, `data/db.json` ou fotos de perfil: podem conter sessão e dados privados.

## 🧠 IA Local (SEM APIs)

A IA foi reescrita para funcionar **100% offline**, sem Groq nem UnRouter. Ela usa:
- Detecção de intenções (saudações, perguntas, emoções)
- Busca semântica na base de Q&A (aprendizado-miku.json)
- Cadeia de Markov (aprendizado.js) como tempero
- Respostas por tópico (música, comida, amor, tecnologia, etc.)
- Detecção de sentimentos

Gatilho: digite **"kok"** ou **"miku"** para falar com ela.

## 🆕 Novidades da v5.0

### Sistema de Pets 🐾
- Adote entre 10 tipos de pets (cachorro, gato, dragão, fênix, etc.)
- Alimente, brinque, treine, cure e batalhe com seu pet sem precisar criar personagem RPG
- O vínculo e a felicidade podem dar bônus nas batalhas
- Cartão visual de atributos, evolução de nível e recompensa de moedas nas vitórias
- Comandos: `!petadotar`, `!petperfil`, `!petalimentar`, `!petcurar`, `!petbrincar`, `!pettreinar`, `!petbatalhar`, `!petrenomear`, `!petlista`

### Missões e bônus diários 🎁
- `!diario` entrega moedas uma vez por dia e aumenta a sequência de dias
- `!missao` mostra objetivos de mensagens, minijogos e cuidados do pet
- `!missao resgatar` coleta as recompensas sem permitir resgate duplicado
- O progresso é salvo por usuário no banco local do bot

### Batalhas ⚔️
- **!batalhagolpes** — Batalha por golpes usando poderes da classe
- **!batalhamembros @p1 @p2** — Dois membros se enfrentam
- **!batalhamonstros** — Dois monstros lutam entre si
- **!batalhadinamica** — Batalha com botões/lista interativa de poderes
- **!rpgacao <poder>** — Escolhe o poder na batalha dinâmica
- **!fugirbatalha** — Foge da batalha dinâmica

### Shipp Melhorado 💘
- Agora pode shippar **duas pessoas**: `!shipp @p1 @p2`
- Ou usar o modo antigo: `!shipp @pessoa` (você + pessoa)

### Copa Dinâmica 🏆
- Escolha os times: `!copa time1 | time2 | time3 | ...`
- Sem times, sorteia automaticamente

### Futebol e Basquete ⚽🏀
- Escolha os times: `!futebol Time A | Time B`

### Perfil Melhorado 👤
- Cartão visual redesenhado com progresso de XP, status, dados sociais, pet e RPG
- `!perfil editar` mostra os comandos e limites para personalizar o perfil
- Imagem personalizada: `!definirfoto` (responda a uma imagem)
- Mais detalhes: idade, cidade, status, pet, RPG
- Comandos de edição: `!definirbio`, `!definiridade`, `!definircidade`, `!definirstatus`, `!definirfoto`, `!removerfoto`

### Música Otimizada 🎵
- Pedidos simultâneos da mesma música compartilham uma busca e um download
- Cache LRU por 30 minutos, limitado a 12 músicas e 60 MB
- Cache de fontes das imagens para gerar cartões mais rápido
- Filtro de duração (máx 15 min)

### Boas-vindas e minijogos 🎮
- Cartão de boas-vindas ilustrado com fallback para mensagem de texto
- Partidas de TERMO, forca, adivinhação e quiz separadas por pessoa em cada grupo
- Respostas sem acentos são aceitas nos desafios de texto
- Apostas têm limites e o jogo do bicho agora desconta a aposta antes do sorteio

### Botões Interativos 🔘
- Menu principal com botões de acesso rápido
- Batalhas dinâmicas com seleção de poder via botões/lista

## 📋 Comandos

Digite `!menu` para ver os comandos. Use `!perfil editar`, `!diario`, `!missao` e `!menupet` para descobrir os sistemas novos.

## ⚙️ Configuração

Configure os números de dono em `index.js` antes de iniciar o bot. Não publique esses números nem a pasta `auth_info/`.
