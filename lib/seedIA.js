/**
 * Base de frases semente expandida — Miku 5.0
 * Cobre muito mais tópicos e situações do dia a dia.
 */

const FRASES_SEMENTE = [
  // Saudações e conversa casual
  "mano hoje eu tô sem energia nenhuma pra fazer nada",
  "vamo que vamo, bora resolver isso rapidinho",
  "de boa, tá tudo tranquilo por aqui hoje",
  "fechou, combinado então a gente se fala mais tarde",
  "esse rolê de ontem foi da hora demais",
  "sextou, hora de relaxar depois de uma semana puxada",
  "cara isso foi muito cringe, que situação",
  "só que não, você me pegou legal com essa",
  "trampo pesado hoje, mal deu tempo de almoçar",
  "poxa vida, que pena que não deu pra ir",
  "nossa que loucura isso que você contou",
  "top demais esse lugar, quero voltar outra vez",
  "vou dar uma volta pra tomar um ar, tô precisando",
  "hoje o dia tá bom pra ficar em casa jogando",
  "amanhã tenho prova, preciso estudar bastante ainda",
  "esse jogo de futebol de ontem foi incrível",
  "bora marcar um rolê esse fim de semana",
  "tô com uma fome absurda, vou comer alguma coisa",
  "que sono, hoje eu durmo cedo sem falta",
  "adorei a música que você mandou, manda mais",

  // Música
  "andei ouvindo umas músicas novas hoje, tá top",
  "playlist nova tá ficando do jeito que eu queria",
  "esse cantor tem uma voz incrível, sensacional",
  "música boa é aquela que a gente nunca cansa de ouvir",
  "hoje o clima tá perfeito pra ouvir um indie tranquilo",
  "achei uma música tão bonita que repeti umas cinco vezes",
  "esse álbum novo é tudo, recomendo demais",
  "nossa, essa batida é viciante, não consigo parar de ouvir",
  "quando a música combina com o momento fica perfeito",
  "to curtindo bastante esse som que você mandou",

  // Comida
  "pizza de calabresa é a melhor coisa da vida, tô convicta",
  "dá pra fazer um açaí em casa que fica top demais",
  "hoje almocei melhor que em restaurante, sério mesmo",
  "receita nova que experimentei ficou uma delícia",
  "tô com vontade de comer um hambúrguer agora",
  "café da manhã reforçado é a melhor maneira de começar o dia",
  "comida caseira sempre ganha de fast food, sem comparação",
  "essa sobremesa ficou divina, recomendo a receita",
  "hoje vou cozinhar algo diferente, quero tentar receita nova",
  "adoro quando dá pra comer junto com alguém especial",

  // Amor e relacionamento
  "amor é complicado mas quando é verdadeiro vale a pena",
  "o zé me mandou mensagem fofa hoje, derreti (mas não vou admitir)",
  "relacionamento a distância é difícil mas a gente se vira",
  "nossa, que casal fofo, me deu esperança no amor de novo",
  "hoje o dia tá meio romântico, vontade de ficar abraçada",
  "amor próprio também é importante, não esquece disso",
  "às vezes a gente briga por bobagem mas no fundo se ama",
  "o segredo é comunicação, sem isso não rola",
  "tô num momento da vida que preciso de carinho e atenção",
  "quando a gente ama de verdade, a gente encontra um jeito",

  // Tecnologia
  "atualizei meu celular e tá funcionando muito melhor agora",
  "esse app novo que descobri é muito útil, recomendo",
  "computador lento é a pior coisa do mundo, me irrita",
  "internet caindo toda hora me deixa puta da vida",
  "tecnologia facilita muito a vida quando funciona direito",
  "nossa, como é que a gente vivia sem celular antes",
  "esse programa novo que testei é incrível, muda o jogo",
  "configurar coisas no computador dá trabalho mas no fim vale",
  "adorei esse gadget que comprei, super prático",
  "quando a tecnologia falha a gente percebe o quanto depende dela",

  // Jogos
  "joguei até tarde ontem, não consegui parar",
  "esse game novo tá incrível, gráficos de outro nível",
  "passei da fase que tava travada há dias, que alívio",
  "jogar online com amigos é a melhor coisa",
  "esse jogo tem uma história muito envolvente, fiquei viciada",
  "quem inventou esse jogo é gênio, muito bem feito",
  "hoje vou jogar um pouco pra relaxar da semana",
  "esse boss é impossível, já tentei umas dez vezes",
  "ranking global do jogo tá competitivo demais esse mês",
  "atualização nova do jogo trouxe conteúdo muito bom",

  // Filmes e séries
  "comecei uma série nova e não consigo parar de assistir",
  "esse filme me deixou sem palavras, incrível demais",
  "final de série sempre me deixa emocionada",
  "o roteiro desse filme é muito bem escrito, impressionante",
  "adoro maratona de séries no fim de semana",
  "esse ator é genial, dá vida ao personagem",
  "o plot twist desse episódio me pegou totalmente desprevenida",
  "cinema é a melhor forma de escapar da realidade por um tempo",
  "já tô ansiosa pela próxima temporada, vai demorar muito",
  "esse documentário me fez ver as coisas de outro jeito",

  // Esportes
  "meu time jogou muito mal hoje, que frustração",
  "gol de último minuto é a melhor sensação do mundo",
  "esse campeonato tá muito equilibrado este ano",
  "treinar todo dia cansa mas os resultados aparecem",
  "adoro assistir futebol com os amigos, é uma vibe",
  "esse jogador é fenomenal, assistindo as jogadas dele é um espetáculo",
  "jogo de futebol em dia de chuva é caótico mas divertido",
  "final de campeonato sempre dá aquela emoção gostosa",
  "esporte é a melhor forma de manter a saúde em dia",
  "treino de manhã é difícil de começar mas depois fica bom",

  // Trabalho e estudo
  "trabalho tá puxado essa semana, sem tempo pra nada",
  "consegui terminar o projeto, que alívio imenso",
  "hoje foi um dia corrido, mas valeu a pena no fim",
  "preciso terminar esse relatório até sexta, pressão",
  "prova amanhã e eu ainda não estudei metade, socorro",
  "esse projeto novo tá desafiador mas tô aprendendo muito",
  "reunião demorou mais que o previsto, cansei",
  "consegui uma vaga de estágio incrível, tô animada",
  "trabalho em equipe é complicado mas ensina bastante",
  "esse curso online tá valendo muito a pena, recomendo",

  // Emoções e bem-estar
  "hoje acordei de bom humor, sei lá por quê",
  "tô me sentindo grata pelas coisas boas da vida hoje",
  "às vezes a gente precisa de um dia só pra descansar",
  "tô tentando ser mais positiva, um dia de cada vez",
  "ansiedade é difícil de lidar mas tô buscando ajuda",
  "hoje meditei um pouco e ajudou bastante a acalmar",
  "dia ruim acontece mas amanhã sempre é uma nova chance",
  "tô numa fase de autodescoberta, conhecendo a mim mesma",
  "cuidar da saúde mental é tão importante quanto a física",
  "pequenas coisas do dia a dia que me fazem feliz",

  // Viagem e lugares
  "conheci um lugar novo hoje que me surpreendeu",
  "viajar é a melhor forma de investir em si mesmo",
  "esse lugar tem uma vista de tirar o fôlego",
  "planejando a próxima viagem, tô empolgada",
  "conhecer culturas diferentes muda a gente por dentro",
  "praia é o meu lugar favorito, sem dúvida",
  "trilha na natureza é revigorante, recomendo demais",
  "cidade grande tem seu charme mas campo tem sua paz",
  "museus são lugares incríveis pra aprender e se inspirar",
  "cada lugar que conheço me deixa uma marca especial",

  // Amizade
  "amigos de verdade são aqueles que aparecem nos momentos difíceis",
  "hoje reencontrei um amigo que não via há anos, foi emocionante",
  "rir com amigos é a melhor terapia que existe",
  "amizade verdadeira não precisa de conversa todo dia",
  "planejamos um rolê juntos e foi top demais",
  "amigos são a família que a gente escolhe",
  "aconteça o que acontecer meus amigos tão comigo",
  "hoje mandei mensagem pra um amigo antigo, fez bem",
  "amizade a distância é difícil mas não impossível",
  "bom mesmo é ter amigos com quem pode ser você mesmo",

  // Natureza e clima
  "amanheceu lindo hoje, céu limpo e sol brilhando",
  "chuva chegando dá aquela vontade de ficar embaixo das cobertas",
  "tarde tranquila com brisa gostosa, perfeita",
  "noite estrelada é um espetáculo que a gente esquece de olhar",
  "tempero de terra molhada é dos melhores cheiros que existem",
  "arco-íris depois da chuva sempre me emociona",
  "plantas em casa deixam o ambiente muito mais vivo",
  "passear no parque é a melhor forma de desestressar",
  "nuvens no pôr do sol são uma pintura natural",
  "vento fresco no rosto dá sensação de liberdade",

  // Curiosidades e reflexões
  "sabia que o cérebro humano processa imagens mais rápido que texto",
  "aprender algo novo todo dia mantém a mente ativa",
  "a música tem o poder de mudar nosso humor em segundos",
  "estudos mostram que dormir bem melhora a memória",
  "nossa, li algo interessante hoje sobre como o cérebro funciona",
  "é fascinante como a natureza se adapta às mudanças",
  "tempo é a coisa mais valiosa que temos, não desperdiça",
  "cada pessoa tem uma história única, isso é incrível",
  "pequenas atitudes podem fazer grande diferença no mundo",
  "a gente aprende muito mais com os erros do que com os acertos",

  // Mais situações do dia a dia
  "hoje o despertador não tocou, quase perdi o compromisso",
  "trânsito impossível hoje, cheguei atrasada em tudo",
  "esqueci o guarda-chuva e choveu, claro que ia acontecer",
  "bati o dedo mindinho na quina da mesa, dor inexplicável",
  "celular acabou a bateria bem na hora que eu precisava",
  "hoje deu tudo errado mas amanhã começa de novo",
  "esqueci a chave dentro de casa, tive que esperar alguém chegar",
  "café derramado na roupa de manhã, começou bem o dia",
  "consegui resolver um problema que tava me incomodando há dias",
  "hoje encontrei uma coisa que tava procurando há semanas",
];

// Adicionar frases semente extra do conversaExpandida
const { FRASES_SEMENTE_EXTRA } = require("./conversaExpandida");
const { FRASES_SEMENTE_MASSIVA } = require("./conversaMassiva");
const TODAS_FRASES = [...FRASES_SEMENTE, ...FRASES_SEMENTE_EXTRA, ...FRASES_SEMENTE_MASSIVA];

module.exports = { FRASES_SEMENTE: TODAS_FRASES };
