/**
 * Conteúdo estático usado pelos comandos de brincadeira.
 * Tudo local, sem depender de nenhuma API externa.
 */

const PIADAS = [
  "Por que o livro de matemática ficou triste? Porque tinha muitos problemas.",
  "O que o pato disse pra namorada? Vem quá.",
  "Por que o computador foi ao médico? Porque estava com vírus.",
  "O que é um cachorro sem cabeça e sem rabo? Chorro.",
  "Por que a bicicleta caiu? Porque estava cansada de ficar em pé.",
  "O que o zero disse pro oito? Belo cinto!",
  "Qual é o cúmulo da sorte? Encontrar um trevo de quatro folhas dentro de outro trevo de quatro folhas.",
  "Por que os passarinhos não usam Facebook? Porque já têm Twitter.",
  "O que o tomate foi fazer no banco? Tirar extrato.",
  "Por que o esqueleto não vai a festas? Porque ele não tem corpo pra isso.",
  "O que uma impressora disse pra outra? Essa folha é sua ou é impressão minha?",
  "Por que o Word e o Excel não se casaram? Porque ele já tinha um documento e ela tinha muitas planilhas.",
  "Qual é o contrário de volátil? Vem de trem.",
  "O que o gato disse quando bateu no poste? Miau!",
  "Por que a matemática é triste? Porque tem muitos problemas e poucas soluções.",
  "O que o oceano disse pra praia? Nada, só deu uma onda.",
  "Por que o computador foi preso? Estava sendo hackeado (viciado) demais.",
  "Qual é o cúmulo da preguiça? Deitar na cama e mandar a barriga se cobrir.",
  "O que um jornal disse pro outro? Tenho uma notícia estampada pra te contar.",
  "Por que a porta ficou de castigo? Porque ela estava batendo em todo mundo.",
];

const MEMES_TEXTO = [
  "🗿 *Estátua de Páscoa aprova essa mensagem*",
  "📈 Isso subiu mais rápido que meu nível de procrastinação.",
  "🤡 Eu, tentando entender minha própria vida:",
  "🔥 Esse chat tá pegando fogo hoje.",
  "🐸 *pepe reage silenciosamente*",
];

const SORTES = [
  "Hoje é seu dia de sorte! 🍀",
  "Cuidado com decisões precipitadas hoje.",
  "Uma boa notícia está a caminho.",
  "Evite discussões desnecessárias hoje.",
  "Um dinheiro inesperado pode aparecer!",
  "Hoje não é um bom dia para apostas.",
  "Alguém está pensando em você agora.",
];

const DESAFIOS = [
  "Manda um áudio cantando a próxima música que tocar no seu celular.",
  "Fica 10 minutos sem usar emoji nas mensagens.",
  "Manda uma foto aleatória da sua galeria (sem escolher).",
  "Conta uma vergonha alheia engraçada pro grupo.",
  "Fala um trava-língua 3 vezes rápido em áudio.",
];

const PREVISOES = [
  "As estrelas indicam um dia produtivo pela frente.",
  "Talvez seja hora de repensar aquela decisão.",
  "Uma conversa importante pode acontecer hoje.",
  "Momento de foco: guarde o celular um pouco.",
  "Boas energias chegando essa semana!",
];

const LOJA = [
  { id: "vip", nome: "🌟 VIP", preco: 200 },
  { id: "lenda", nome: "👑 Lenda", preco: 500 },
  { id: "sortudo", nome: "🍀 Sortudo", preco: 100 },
  { id: "top1", nome: "🥇 Top 1", preco: 1000 },
];

const FATOS_ALEATORIOS = [
  "O mel nunca estraga — arqueólogos encontraram potes de mel comestível com mais de 3000 anos.",
  "Um raio é cerca de 5 vezes mais quente que a superfície do Sol.",
  "Polvos têm três corações e sangue azul.",
  "O som não se propaga no vácuo do espaço — não existe barulho de explosão lá fora.",
  "Bananas são tecnicamente uma baga (fruta), mas morangos não são.",
  "O coração de uma baleia-azul é do tamanho de um carro pequeno.",
  "Existem mais estrelas no universo observável do que grãos de areia em todas as praias da Terra.",
  "Os flamingos nascem cinzas — a cor rosa vem da alimentação rica em camarões e algas.",
  "O Monte Everest cresce cerca de 4 mm por ano.",
  "Formigas não têm pulmões — elas respiram por pequenos poros pelo corpo.",
];

// Molduras/temas de cor pro !perfil personalizado (compradas com moedas)
const MOLDURAS = [
  { id: "azul", nome: "🔵 Moldura Azul", preco: 60, cor: 0x1d4ed8ff },
  { id: "verde", nome: "🟢 Moldura Verde", preco: 60, cor: 0x15803dff },
  { id: "vermelha", nome: "🔴 Moldura Vermelha", preco: 60, cor: 0xb91c1cff },
  { id: "roxa", nome: "🟣 Moldura Roxa", preco: 80, cor: 0x7e22ceff },
  { id: "rosa", nome: "🌸 Moldura Rosa", preco: 80, cor: 0xdb2777ff },
  { id: "dourada", nome: "🟡 Moldura Dourada", preco: 150, cor: 0xca8a04ff },
  { id: "preta", nome: "⚫ Moldura Preta", preco: 100, cor: 0x18181bff },
  { id: "arco-iris", nome: "🌈 Moldura Arco-íris", preco: 250, cor: 0x9333eaff },
];

module.exports = { PIADAS, MEMES_TEXTO, SORTES, DESAFIOS, PREVISOES, LOJA, FATOS_ALEATORIOS, MOLDURAS };
