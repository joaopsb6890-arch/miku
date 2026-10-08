/**
 * Base de Conhecimento Enciclopédico — Miku 5.1
 * Conhecimento em dezenas de áreas para a IA responder sem APIs.
 * Organizado por categoria, cada entrada tem palavras-chave + resposta.
 */

const CONHECIMENTO = {
  // ===================== CIÊNCIA =====================
  ciencia: [
    { tags: ["agua", "fervura", "ferve", "graus", "temperatura"], resposta: "a água ferve a 100°C ao nível do mar, mas em lugares altos a temperatura é menor por causa da pressão atmosférica." },
    { tags: ["velocidade", "luz", "rapida", "km"], resposta: "a luz viaja a aproximadamente 300.000 km/s no vácuo — é a coisa mais rápida do universo." },
    { tags: ["planeta", "sistema", "solar", "maior"], resposta: "Júpiter é o maior planeta do sistema solar — caberiam mais de 1.300 Terras dentro dele." },
    { tags: ["planeta", "sistema", "solar", "menor"], resposta: "Mercúrio é o menor planeta do sistema solar e também o mais próximo do Sol." },
    { tags: ["planeta", "sistema", "solar", "quantos"], resposta: "o sistema solar tem 8 planetas: Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno. Plutão foi reclassificado como planeta-anão em 2006." },
    { tags: ["sol", "estrela", "tipo"], resposta: "o Sol é uma estrela do tipo anã amarela (G2V), tem cerca de 4,6 bilhões de anos e está no meio da sua vida." },
    { tags: ["lua", "distancia", "terra"], resposta: "a Lua está a cerca de 384.400 km da Terra e é o único satélite natural do nosso planeta." },
    { tags: ["gravidade", "funciona", "o que"], resposta: "gravidade é a força que puxa objetos com massa uns para os outros. É o que nos mantém no chão e faz as coisas caírem." },
    { tags: ["atmosfera", "camadas", "terra"], resposta: "a atmosfera da Terra tem 5 camadas: troposfera, estratosfera, mesosfera, termosfera e exosfera." },
    { tags: ["dna", "o que", "sigla"], resposta: "DNA significa Ácido Desoxirribonucleico — é a molécula que guarda a informação genética de todos os seres vivos." },
    { tags: ["celula", "menor", "vida", "unidade"], resposta: "a célula é a menor unidade de vida — todos os seres vivos são formados por elas. O corpo humano tem cerca de 37 trilhões de células." },
    { tags: ["coracao", "bpm", "batimentos", "por", "minuto"], resposta: "o coração humano bate em média 60 a 100 vezes por minuto em repouso, bombeando cerca de 5 litros de sangue por minuto." },
    { tags: ["cerebro", "neuronios", "quantos"], resposta: "o cérebro humano tem cerca de 86 bilhões de neurônios e consome cerca de 20% da energia do corpo." },
    { tags: ["ossos", "corpo", "humano", "quantos"], resposta: "o corpo humano adulto tem 206 ossos. Ao nascer, temos cerca de 300, mas alguns se fundem com o tempo." },
    { tags: ["musculos", "corpo", "humano", "quantos"], resposta: "o corpo humano tem mais de 600 músculos que representam cerca de 40% do peso corporal." },
    { tags: ["sangue", "tipos", "grupos"], resposta: "existem 4 tipos sanguíneos principais: A, B, AB e O, cada um podendo ser positivo ou negativo — totalizando 8 tipos." },
    { tags: ["agua", "corpo", "humano", "porcentagem"], resposta: "cerca de 60% do corpo humano é composto de água — o cérebro tem cerca de 75% de água." },
    { tags: ["atomos", "o que", "menor"], resposta: "o átomo é a menor unidade da matéria que mantém as propriedades de um elemento. É formado por prótons, nêutrons e elétrons." },
    { tags: ["tabela", "periodica", "elementos", "quantos"], resposta: "a tabela periódica tem 118 elementos confirmados, indo do Hidrogênio (1) ao Oganessônio (118)." },
    { tags: ["agua", "formula", "h2o"], resposta: "a fórmula da água é H2O — dois átomos de hidrogênio e um de oxigênio." },
    { tags: ["sal", "formula", "nacl"], resposta: "o sal de cozinha é o cloreto de sódio (NaCl), formado por sódio e cloro." },
    { tags: ["oxigenio", "ar", "porcentagem"], resposta: "o ar que respiramos tem cerca de 21% de oxigênio, 78% de nitrogênio e 1% de outros gases." },
    { tags: ["fotossintese", "plantas", "o que"], resposta: "fotossíntese é o processo pelo qual as plantas convertem luz solar, água e CO2 em glicose e oxigênio." },
    { tags: ["evolucao", "darwin", "selecao", "natural"], resposta: "a teoria da evolução de Charles Darwin propõe que as espécies mudam ao longo do tempo através da seleção natural — os mais adaptados sobrevivem e se reproduzem." },
    { tags: ["big", "bang", "universo", "origem"], resposta: "a teoria do Big Bang diz que o universo se originou de uma grande expansão há cerca de 13,8 bilhões de anos." },
    { tags: ["buraco", "negro", "o que"], resposta: "um buraco negro é uma região do espaço onde a gravidade é tão forte que nada, nem mesmo a luz, consegue escapar." },
    { tags: ["estrelas", "quantas", "universo"], resposta: "estima-se que existam mais de 100 bilhões de estrelas só na nossa galáxia, e mais de 2 trilhões de galáxias no universo observável." },
    { tags: ["via", "latea", "galaxia", "nosso"], resposta: "a Via Láctea é a galáxia onde fica o nosso sistema solar. Tem formato espiral e cerca de 100 bilhões de estrelas." },
    { tags: ["vulcao", "o que", "funciona"], resposta: "um vulcão é uma abertura na crosta terrestre por onde sai magma (rocha derretida), gases e cinzas do interior da Terra." },
    { tags: ["terremoto", "o que", "causa"], resposta: "terremotos são causados pelo movimento das placas tectônicas que formam a crosta terrestre. Quando se chocam ou deslizam, liberam energia que sentimos como tremor." },
    { tags: ["tsunami", "o que"], resposta: "tsunami é uma série de ondas gigantes causadas geralmente por terremotos submarinos, erupções vulcânicas ou deslizamentos no fundo do mar." },
    { tags: ["eletromagnetismo", "o que"], resposta: "eletromagnetismo é o ramo da física que estuda a interação entre campos elétricos e magnéticos — é o que faz imãs funcionarem e a eletricidade fluir." },
    { tags: ["velocidade", "som", "km"], resposta: "o som viaja a cerca de 343 m/s (1.235 km/h) no ar a 20°C — mas é mais rápido na água e nos sólidos." },
  ],

  // ===================== GEOGRAFIA =====================
  geografia: [
    { tags: ["brasil", "capital"], resposta: "a capital do Brasil é Brasília, não o Rio de Janeiro. Brasília se tornou capital em 1960." },
    { tags: ["brasil", "maior", "estado"], resposta: "o maior estado do Brasil é o Amazonas, com mais de 1,5 milhão de km² — maior que a França, Espanha e Alemanha juntas." },
    { tags: ["brasil", "estados", "quantos"], resposta: "o Brasil tem 26 estados mais o Distrito Federal, totalizando 27 unidades federativas." },
    { tags: ["brasil", "populacao", "habitantes"], resposta: "o Brasil tem cerca de 215 milhões de habitantes, sendo o país mais populoso da América do Sul." },
    { tags: ["mundo", "maior", "pais", "area"], resposta: "a Rússia é o maior país do mundo em área, com mais de 17 milhões de km²." },
    { tags: ["mundo", "maior", "pais", "populacao"], resposta: "a Índia se tornou o país mais populoso do mundo em 2023, ultrapassando a China, com mais de 1,4 bilhão de habitantes." },
    { tags: ["oceano", "maior"], resposta: "o oceano Pacífico é o maior oceano do mundo, cobrindo cerca de um terço da superfície da Terra." },
    { tags: ["rio", "maior", "mundo"], resposta: "o rio Amazonas é o maior rio do mundo em volume de água, despejando cerca de 200.000 m³ por segundo no oceano." },
    { tags: ["rio", "comprido", "mundo", "nilo"], resposta: "o rio Nilo, no nordeste da África, é frequentemente considerado o rio mais longo do mundo com cerca de 6.650 km, embora alguns estudos apontem o Amazonas como mais longo." },
    { tags: ["montanha", "mais", "alta", "mundo"], resposta: "o Monte Everest, na cordilheira do Himalaia, é a montanha mais alta do mundo com 8.849 metros de altitude." },
    { tags: ["deserto", "maior", "mundo"], resposta: "o deserto do Saara, no norte da África, é o maior deserto quente do mundo, cobrindo cerca de 9 milhões de km²." },
    { tags: ["continente", "menor"], resposta: "a Oceania é o menor continente do mundo em área, seguida pela Europa." },
    { tags: ["pais", "pequeno", "mundo"], resposta: "a Cidade do Vaticano é o menor país do mundo, com apenas 0,44 km² de área." },
    { tags: ["egito", "piramides", "queops"], resposta: "as pirâmides do Egito, especialmente a de Quéops, são uma das Sete Maravilhas do Mundo Antigo ainda existentes. A Grande Pirâmide tem cerca de 138 metros de altura." },
    { tags: ["china", "muralha"], resposta: "a Grande Muralha da China tem mais de 21.000 km de extensão e foi construída ao longo de séculos para proteger o império chinês." },
    { tags: ["eua", "estados", "unidos", "capital"], resposta: "a capital dos Estados Unidos é Washington D.C., não Nova York." },
    { tags: ["japao", "capital", "tokio"], resposta: "a capital do Japão é Tóquio, a maior área metropolitana do mundo com mais de 37 milhões de habitantes." },
    { tags: ["portugal", "capital", "lisboa"], resposta: "a capital de Portugal é Lisboa, uma das cidades mais antigas da Europa, mais antiga que Roma." },
    { tags: ["australia", "capital"], resposta: "a capital da Austrália é Camberra, não Sydney como muita gente pensa." },
    { tags: ["argentina", "capital"], resposta: "a capital da Argentina é Buenos Aires, conhecada como a Paris da América do Sul." },
    { tags: ["franca", "capital"], resposta: "a capital da França é Paris, conhecada como a Cidade Luz." },
    { tags: ["inglaterra", "reino", "unido", "capital"], resposta: "a capital do Reino Unido é Londres, uma das maiores cidades da Europa." },
    { tags: ["italia", "capital"], resposta: "a capital da Itália é Roma, conhecada como a Cidade Eterna." },
    { tags: ["espanha", "capital"], resposta: "a capital da Espanha é Madri, a maior cidade do país." },
    { tags: ["alemanha", "capital"], resposta: "a capital da Alemanha é Berlim, que foi dividida por um muro de 1961 a 1989." },
    { tags: ["russia", "capital"], resposta: "a capital da Rússia é Moscou, a maior cidade da Europa com mais de 12 milhões de habitantes." },
    { tags: ["india", "capital"], resposta: "a capital da Índia é Nova Délhi, parte da região metropolitana de Délhi." },
    { tags: ["canada", "capital"], resposta: "a capital do Canadá é Ottawa, não Toronto como muitos pensam." },
    { tags: ["africa", "sul", "capital"], resposta: "a África do Sul tem três capitais: Pretória (administrativa), Cidade do Cabo (legislativa) e Bloemfontein (judiciária)." },
    { tags: ["amazonia", "floresta", "tamanho"], resposta: "a Floresta Amazônica cobre cerca de 5,5 milhões de km², abrange 9 países e abriga mais de 10% das espécies do planeta." },
    { tags: ["pantanal", "o que", "onde"], resposta: "o Pantanal é a maior planície alagada do mundo, localizada entre Brasil, Bolívia e Paraguai, com rica biodiversidade." },
  ],

  // ===================== HISTÓRIA =====================
  historia: [
    { tags: ["segunda", "guerra", "mundial", "quando"], resposta: "a Segunda Guerra Mundial ocorreu de 1939 a 1945, envolvendo a maioria das nações do mundo. Foi o conflito mais mortal da história." },
    { tags: ["primeira", "guerra", "mundial", "quando"], resposta: "a Primeira Guerra Mundial ocorreu de 1914 a 1918, também chamada de 'A Grande Guerra'. Matou cerca de 20 milhões de pessoas." },
    { tags: ["independencia", "brasil", "quando", "ano"], resposta: "a independência do Brasil foi proclamada em 7 de setembro de 1822 por Dom Pedro I, às margens do rio Ipiranga em São Paulo." },
    { tags: ["descobrimento", "brasil", "quando", "ano"], resposta: "o Brasil foi oficialmente descoberto pelos portugueses em 22 de abril de 1500, comandados por Pedro Álvares Cabral." },
    { tags: ["abolicao", "escravidao", "brasil"], resposta: "a escravidão foi abolida no Brasil em 13 de maio de 1888 com a Lei Áurea, assinada pela princesa Isabel. O Brasil foi o último país das Américas a abolir a escravatura." },
    { tags: ["proclamacao", "republica", "brasil"], resposta: "a Proclamação da República no Brasil aconteceu em 15 de novembro de 1889, pondo fim ao Império." },
    { tags: ["revolucao", "francesa", "quando"], resposta: "a Revolução Francesa ocorreu de 1789 a 1799, transformando a França e influenciando a democracia moderna. Lema: liberdade, igualdade e fraternidade." },
    { tags: ["imperio", "romano", "quando", "caiu"], resposta: "o Império Romano do Ocidente caiu em 476 d.C. O Império Romano do Oriente (Bizantino) durou até 1453." },
    { tags: ["egito", "antigo", "faraos"], resposta: "o Egito Antigo foi uma civilização que durou mais de 3.000 anos, conhecida pelos faraós, pirâmides e escrita hieroglífica." },
    { tags: ["grcia", "antiga", "filosofos"], resposta: "a Grécia Antiga é o berço da democracia e da filosofia ocidental, com pensadores como Sócrates, Platão e Aristóteles." },
    { tags: ["guerra", "fria", "o que"], resposta: "a Guerra Fria foi um período de tensão política e militar entre EUA e URSS de 1947 a 1991, sem confronto direto mas com corrida armamentista e espacial." },
    { tags: ["muro", "berlim", "quando", "caiu"], resposta: "o Muro de Berlim caiu em 9 de novembro de 1989, simbolizando o fim da Guerra Fria e a reunificação da Alemanha." },
    { tags: ["segunda", "guerra", "fim", "1945"], resposta: "a Segunda Guerra Mundial terminou em 1945 com a rendição da Alemanha em maio e do Japão em agosto, após as bombas atômicas de Hiroshima e Nagasaki." },
    { tags: ["napoleao", "bonaparte", "quem"], resposta: "Napoleão Bonaparte foi um líder militar e imperador francês que dominou a Europa no início do século XIX antes de ser derrotado em Waterloo em 1815." },
    { tags: ["cristovao", "colombo", "quem"], resposta: "Cristóvão Colombo foi um navegador que chegou à América em 1492, embora acreditasse ter chegado à Índia. Foi financiado pela Coroa espanhola." },
    { tags: ["litio", "independencia", "portugal"], resposta: "Portugal tornou-se independente do Reino de Leão em 1139, com D. Afonso Henriques como primeiro rei." },
    { tags: ["brasil", "colonial", "periodo"], resposta: "o período colonial do Brasil durou de 1500 a 1822, quando foi proclamada a independência. Foi colonizado por Portugal." },
    { tags: ["revolucao", "industrial", "quando"], resposta: "a Revolução Industrial começou na Inglaterra no século XVIII, transformando a produção artesanal em industrial e mudando a sociedade para sempre." },
  ],

  // ===================== CURIOSIDADES GERAIS =====================
  curiosidades: [
    { tags: ["polvo", "coracao", "quantos"], resposta: "um polvo tem três corações e sangue azul! Do coração bombeiam sangue para as guelras e um para o resto do corpo." },
    { tags: ["ornitorrinco", "o que", "mamifero"], resposta: "o ornitorrinco é um mamífero que bota ovo, tem bico de pato, cauda de castor e os machos têm veneno. É da Austrália." },
    { tags: ["wombat", "fezes", "cubica"], resposta: "os wombats (da Austrália) produzem fezes em formato de cubo, são os únicos animais do mundo que fazem isso." },
    { tags: ["pantera", "negra", "nao", "especie"], resposta: "a pantera negra não é uma espécie separada — é um leopardo ou onça com melanismo (excesso de pigmento escuro)." },
    { tags: ["flamingo", "rosa", "cor"], resposta: "os flamingos são rosa por causa dos crustáceos e algas que comem, que contêm pigmentos carotenoides. Nascem cinzas." },
    { tags: ["gato", "miado", "humanos"], resposta: "os gatos desenvolveram o miado especificamente para se comunicar com humanos — entre eles, gatos quase não miam." },
    { tags: ["cachorro", "olfato", "nariz", "vezes"], resposta: "o olfato de um cachorro é cerca de 10.000 a 100.000 vezes mais sensível que o dos humanos. Eles têm até 300 milhões de receptores olfativos." },
    { tags: ["abelha", "danca", "comunicacao"], resposta: "as abelhas se comunicam através de uma dança — a 'dança do balanço' — para mostrar às outras onde encontraram comida." },
    { tags: ["agua", "gelo", "flutua"], resposta: "a água é uma das poucas substâncias onde o sólido (gelo) flutua no líquido, porque o gelo é menos denso que a água líquida." },
    { tags: ["raio", "temperatura", "sol"], resposta: "um raio é mais quente que a superfície do Sol — pode chegar a 30.000°C, enquanto a superfície do Sol tem cerca de 5.500°C." },
    { tags: ["tartaruga", "vive", "quantos", "anos"], resposta: "tartarugas podem viver mais de 150 anos. A tartaruga mais velha registrada viveu 255 anos." },
    { tags: ["borboleta", "paladar", "patas"], resposta: "as borboletas sentem o paladar com as patas — é por isso que pousam nas flores antes de se alimentar." },
    { tags: ["coruja", "cabeça", "girar"], resposta: "as corujas podem girar a cabeça até 270 graus graças a uma estrutura especial no pescoço com 14 vértebras (humanos têm 7)." },
    { tags: ["golfinho", "dorme", "olho"], resposta: "os golfinhos dormem com um olho aberto e metade do cérebro acordado, para poderem respirar e ficar alertas." },
    { tags: ["elefante", "nao", "pula"], resposta: "elefantes são os únicos mamíferos que não conseguem pular — são muito pesados e suas pernas não foram feitas para isso." },
    { tags: ["camaleao", "cor", "muda"], resposta: "os camaleões mudam de cor não para se camuflarem, mas para se comunicar e regular a temperatura corporal." },
    { tags: ["arco", "iris", "cores", "quantas"], resposta: "o arco-íris tem 7 cores principais: vermelho, laranja, amarelo, verde, azul, anil e violeta, formadas pela refração da luz solar nas gotas de chuva." },
    { tags: ["universo", "idade", "bilhoes"], resposta: "o universo tem cerca de 13,8 bilhões de anos, segundo estimativas baseadas na radiação cósmica de fundo." },
    { tags: ["terra", "idade", "bilhoes"], resposta: "a Terra tem cerca de 4,5 bilhões de anos, formada a partir da poeira e gás ao redor do jovem Sol." },
    { tags: ["humanos", "existem", "anos"], resposta: "os humanos modernos (Homo sapiens) existem há cerca de 300.000 anos, uma fração minúscula da idade da Terra." },
  ],

  // ===================== TECNOLOGIA =====================
  tecnologia: [
    { tags: ["internet", "o que", "funciona"], resposta: "a internet é uma rede global de computadores interconectados que trocam dados usando protocolos padronizados (TCP/IP)." },
    { tags: ["www", "world", "wide", "web", "quem", "criou"], resposta: "a World Wide Web (WWW) foi criada por Tim Berners-Lee em 1989, no CERN, na Suíça. A internet e a WWW não são a mesma coisa." },
    { tags: ["computador", "primeiro", "historia"], resposta: "o primeiro computador eletrônico foi o ENIAC, construído em 1945 nos EUA. Pesava 30 toneladas e ocupava uma sala inteira." },
    { tags: ["smartphone", "primeiro", "historia"], resposta: "o primeiro smartphone foi o IBM Simon, lançado em 1994, mas o iPhone da Apple, lançado em 2007, revolucionou o mercado." },
    { tags: ["inteligencia", "artificial", "o que"], resposta: "inteligência artificial (IA) é a capacidade de máquinas realizarem tarefas que normalmente requerem inteligência humana, como reconhecer padrões, aprender e tomar decisões." },
    { tags: ["python", "linguagem", "programacao"], resposta: "Python é uma linguagem de programação criada por Guido van Rossum em 1991, muito popular por sua sintaxe simples e uso em IA, ciência de dados e web." },
    { tags: ["javascript", "linguagem", "o que"], resposta: "JavaScript é uma linguagem de programação criada por Brendan Eich em 1995, usada principalmente para criar páginas web interativas. Não tem relação com Java." },
    { tags: ["bitcoin", "cripto", "o que"], resposta: "Bitcoin é uma criptomoeda descentralizada criada em 2009 por Satoshi Nakamoto (pseudônimo), usando tecnologia blockchain para registrar transações sem precisar de banco central." },
    { tags: ["blockchain", "o que", "funciona"], resposta: "blockchain é um livro-razão digital distribuído que registra transações de forma segura e transparente, sem necessidade de intermediário. É a base das criptomoedas." },
    { tags: ["nuvem", "cloud", "computacao", "o que"], resposta: "computação em nuvem é o fornecimento de serviços de computação (armazenamento, processamento, software) pela internet, sob demanda, como serviços da AWS, Google Cloud e Azure." },
    { tags: ["algoritmo", "o que"], resposta: "um algoritmo é uma sequência de instruções passo a passo para resolver um problema ou executar uma tarefa. É a base de toda programação." },
    { tags: ["codigo", "binario", "o que"], resposta: "código binário é o sistema de representação de dados usando apenas 0 e 1. É a linguagem que os computadores entendem no nível mais fundamental." },
    { tags: ["processador", "cpu", "o que"], resposta: "o processador (CPU) é o 'cérebro' do computador, responsável por executar instruções e processar dados. Sua velocidade é medida em GHz." },
    { tags: ["ram", "memoria", "o que"], resposta: "a memória RAM (Random Access Memory) é a memória de trabalho do computador, onde ficam os dados em uso. É volátil — apaga quando o computador desliga." },
    { tags: ["ssd", "hd", "diferenca"], resposta: "SSD (Solid State Drive) é mais rápido, silencioso e durável que o HD (Hard Disk) tradicional, mas mais caro. HD usa discos magnéticos, SSD usa chips de memória flash." },
    { tags: ["5g", "o que", "velocidade"], resposta: "5G é a quinta geração de redes móveis, muito mais rápida que o 4G — pode chegar a 10 Gbps de velocidade teórica, com latência muito baixa." },
    { tags: ["api", "o que", "interface"], resposta: "API (Application Programming Interface) é um conjunto de regras que permite que diferentes softwares se comuniquem entre si. É como uma ponte entre programas." },
    { tags: ["dns", "o que", "dominio"], resposta: "DNS (Domain Name System) é como uma agenda telefônica da internet — traduz nomes de sites (google.com) em endereços IP numéricos." },
    { tags: ["html", "o que", "web"], resposta: "HTML (HyperText Markup Language) é a linguagem de marcação usada para criar páginas web — define a estrutura e o conteúdo das páginas." },
    { tags: ["css", "o que", "estilo"], resposta: "CSS (Cascading Style Sheets) é a linguagem usada para dar estilo às páginas web — cores, fontes, layout, animações." },
  ],

  // ===================== CULTURA E ARTE =====================
  cultura: [
    { tags: ["mona", "lisa", "quadro", "quem"], resposta: "a Mona Lisa foi pintada por Leonardo da Vinci entre 1503 e 1519. É a pintura mais famosa do mundo e está no Museu do Louvre em Paris." },
    { tags: ["shakespeare", "quem", "obras"], resposta: "William Shakespeare foi um dramaturgo inglês (1564-1616) considerado o maior escritor da língua inglesa. Escreveu Romeu e Julieta, Hamlet, Macbeth, entre outras." },
    { tags: ["picasso", "quem", "pintor"], resposta: "Pablo Picasso foi um pintor espanhol (1881-1973), cofundador do movimento cubista. Uma de suas obras mais famosas é Guernica." },
    { tags: ["davinci", "leonardo", "quem"], resposta: "Leonardo da Vinci (1452-1519) foi um gênio italiano — pintor, inventor, cientista e engenheiro. Pintou a Mona Lisa e projetou máquinas voadoras séculos antes de existirem." },
    { tags: ["van", "gogh", "quem"], resposta: "Vincent van Gogh foi um pintor holandês (1853-1890) que só vendeu um quadro em vida. Hoje é um dos artistas mais valorizados do mundo. Pintou 'A Noite Estrelada'." },
    { tags: ["beatles", "quem", "banda"], resposta: "os Beatles foram uma banda britânica formada em 1960, considerada a mais influente de todos os tempos. Integrantes: John Lennon, Paul McCartney, George Harrison e Ringo Starr." },
    { tags: ["michael", "jackson", "quem"], resposta: "Michael Jackson (1958-2009) foi um cantor e dançarino americano, conhecido como o 'Rei do Pop'. Álbum 'Thriller' é o mais vendido da história." },
    { tags: ["disney", "walt", "quem"], resposta: "Walt Disney (1901-1966) foi um animador e empresário americano que criou o Mickey Mouse e fundou a Walt Disney Company, a maior empresa de entretenimento do mundo." },
    { tags: ["harry", "potter", "quem", "escreveu"], resposta: "Harry Potter foi escrito pela autora britânica J.K. Rowling. A série tem 7 livros publicados entre 1997 e 2007, vendendo mais de 500 milhões de cópias." },
    { tags: ["senhor", "aneis", "tolkien"], resposta: "O Senhor dos Anéis foi escrito por J.R.R. Tolkien, professor de Oxford. A obra foi publicada entre 1954 e 1955 e é uma das mais influentes da fantasia." },
    { tags: ["biblia", "livro", "mais", "vendido"], resposta: "a Bíblia é o livro mais vendido e distribuído da história, com estimativas de mais de 5 bilhões de cópias. O segundo é 'Dom Quixote' de Cervantes." },
    { tags: ["oscar", "premio", "cinema", "quem"], resposta: "o Oscar é o prêmio da Academia de Artes e Ciências Cinematográficas de Hollywood, entregue anualmente desde 1929. O filme com mais Oscars é 'Ben-Hur', 'Titanic' e 'O Senhor dos Anéis: O Retorno do Rei', com 11 cada." },
    { tags: ["futebol", "origem", "inglaterra"], resposta: "o futebol moderno foi criado na Inglaterra em 1863, quando se separou do rugby. Mas jogos com bola parecidos existem há milênios — os chineses jogavam algo similar há 2.000 anos." },
    { tags: ["copa", "mundo", "fifa", "primeira"], resposta: "a primeira Copa do Mundo da FIFA foi em 1930, no Uruguai, que também foi o campeão. O Brasil é o país com mais títulos: 5." },
    { tags: ["olimpiadas", "origem", "grcia"], resposta: "os Jogos Olímpicos surgiram na Grécia Antiga em 776 a.C. As Olimpíadas modernas foram criadas em 1896 por Pierre de Coubertin." },
  ],

  // ===================== ESPORTES =====================
  esportes: [
    { tags: ["futebol", "regras", "jogadores"], resposta: "no futebol, cada time tem 11 jogadores em campo, incluindo o goleiro. A partida tem dois tempos de 45 minutos." },
    { tags: ["basquete", "regras", "jogadores", "pontos"], resposta: "no basquete, cada time tem 5 jogadores. A partida tem 4 quartos de 12 minutos (NBA) ou 10 minutos (FIBA). Cada cesta vale 2 ou 3 pontos, e lances livres valem 1." },
    { tags: ["volei", "regras", "jogadores", "pontos"], resposta: "no vôlei, cada time tem 6 jogadores em quadra. Os sets vão até 25 pontos (menos o decisivo, que vai até 15). Precisa vencer 3 sets de 5." },
    { tags: ["tenis", "regras", "pontos"], resposta: "no tênis, a pontuação é 15, 30, 40 e game. Quem vence 6 games ganha um set. As partidas são em melhor de 3 sets (mulheres) ou 5 sets (homens em Grand Slams)." },
    { tags: ["natacao", "estilos", "quantos"], resposta: "existem 4 estilos de natação competitiva: crawl (ou livre), costas, peito e borboleta. O medley combina os quatro." },
    { tags: ["boxe", "rounds", "quantos"], resposta: "no boxe profissional, as lutas geralmente têm 12 rounds de 3 minutos cada (antes eram 15). No amador, são 3 rounds de 3 minutos." },
    { tags: ["formula", "1", "o que"], resposta: "a Fórmula 1 é a categoria mais alta do automobilismo, com corridas em circuitos ao redor do mundo desde 1950. Cada equipe constrói seu próprio carro." },
    { tags: ["messi", "quem", "futebol"], resposta: "Lionel Messi é um futebolista argentino, considerado um dos maiores de todos os tempos. Venceu 8 Bolas de Ouro e a Copa do Mundo de 2022 com a Argentina." },
    { tags: ["cr7", "ronaldo", "quem"], resposta: "Cristiano Ronaldo é um futebolista português, um dos maiores da história. É o maior artilheiro em jogos oficiais de todos os tempos e venceu 5 Bolas de Ouro." },
    { tags: ["pelé", "quem", "futebol"], resposta: "Pelé (1940-2022) foi um futebolista brasileiro considerado por muitos o maior jogador de todos os tempos. Venceu 3 Copas do Mundo (1958, 1962, 1970) — feito único." },
    { tags: ["maradona", "quem"], resposta: "Diego Maradona (1960-2020) foi um futebolista argentino, lendário pela jogada 'Mão de Deus' e pelo gol do século na Copa de 1986, que a Argentina venceu." },
    { tags: ["neymar", "quem"], resposta: "Neymar Jr é um futebolista brasileiro, um dos mais talentosos de sua geração. É o maior artilheiro da história da Seleção Brasileira, ultrapassando Pelé em gols oficiais." },
  ],

  // ===================== SAÚDE E CORPO =====================
  saude: [
    { tags: ["agua", "beber", "litros", "dia"], resposta: "recomenda-se beber cerca de 2 litros de água por dia para manter o corpo hidratado e funcionando bem. Varia com clima e atividade física." },
    { tags: ["sono", "horas", "dormir"], resposta: "um adulto precisa de 7 a 9 horas de sono por noite. Crianças e adolescentes precisam de mais. Dormir bem é essencial para a saúde física e mental." },
    { tags: ["exercicio", "frequencia", "semana"], resposta: "recomenda-se pelo menos 150 minutos de exercício moderado por semana (cerca de 30 minutos, 5 dias por semana) para manter a saúde." },
    { tags: ["vitamina", "c", "o que", "serve"], resposta: "a vitamina C é essencial para o sistema imunológico, cicatrização e absorção de ferro. Encontra-se em frutas cítricas como laranja, limão e kiwi." },
    { tags: ["vitamina", "d", "sol"], resposta: "a vitamina D é produzida pelo corpo quando a pele é exposta ao sol. É importante para a saúde dos ossos e do sistema imunológico." },
    { tags: ["proteina", "o que", "serve"], resposta: "as proteínas são essenciais para construir e reparar músculos, tecidos, enzimas e hormônios. Encontram-se em carnes, ovos, leite, feijão e leguminosas." },
    { tags: ["carboidrato", "o que", "energia"], resposta: "os carboidratos são a principal fonte de energia do corpo. Encontram-se em pães, massas, arroz, batatas e açúcares." },
    { tags: ["gordura", "tipos", "boa", "ruim"], resposta: "existem gorduras boas (insaturadas, em abacate, azeite, castanhas) e ruins (saturadas e trans, em frituras e ultraprocessados). O corpo precisa de gorduras boas." },
    { tags: ["febre", "temperatura", "graus"], resposta: "a temperatura normal do corpo é cerca de 36°C a 37,2°C. Considera-se febre acima de 37,8°C. Acima de 39°C é febre alta — procure um médico." },
    { tags: ["pressao", "alta", "hipertensao"], resposta: "a pressão arterial considerada normal é até 120/80 mmHg. Acima de 140/90 é hipertensão e precisa de acompanhamento médico." },
    { tags: ["diabetes", "o que", "tipos"], resposta: "diabetes é uma condição onde o corpo não produz ou não usa bem a insulina, elevando o açúcar no sangue. Tipo 1 (autoimune) e Tipo 2 (relacionada ao estilo de vida)." },
    { tags: ["colesterol", "o que", "bom", "ruim"], resposta: "o colesterol tem dois tipos: HDL (bom, ajuda a limpar as artérias) e LDL (ruim, se acumula nas artérias). O equilíbrio entre eles é importante para a saúde cardiovascular." },
  ],

  // ===================== NATUREZA E ANIMAIS =====================
  natureza: [
    { tags: ["cachorro", "anos", "vida", "vive"], resposta: "cães vivem em média 10 a 13 anos, dependendo da raça. Raças pequenas costumam viver mais que as grandes." },
    { tags: ["gato", "anos", "vida", "vive"], resposta: "gatos podem viver de 12 a 20 anos. O gato mais velho registrado viveu 38 anos." },
    { tags: ["elefante", "anos", "vida", "vive"], resposta: "elefantes podem viver de 60 a 70 anos na natureza. São animais muito inteligentes e sociais." },
    { tags: ["tuburao", "anos", "vida", "vive"], resposta: "alguns tubarões podem viver mais de 400 anos — o tubarão da Groenlândia é o vertebrado mais longevo conhecido." },
    { tags: ["arvore", "mais", "velha", "mundo"], resposta: "a árvore mais velha do mundo é um pinheiro bristlecone chamado Methuselah, na Califórnia, com mais de 4.800 anos." },
    { tags: ["bambo", "cresce", "rapido"], resposta: "o bambu é a planta que cresce mais rápido — algumas espécies crescem até 91 cm por dia!" },
    { tags: ["fungo", "maior", "organismo"], resposta: "o maior organismo vivo do mundo é um fungo (Armillaria ostoyae) no Oregon, EUA, que cobre mais de 9 km² e tem entre 2.400 e 8.600 anos." },
    { tags: ["coral", "o que", "animal"], resposta: "os corais são animais, não plantas! Formam recifes que abrigam 25% de toda a vida marinha, mas estão ameaçados pelo aquecimento global." },
    { tags: ["extincao", "animais", "perigo"], resposta: "muitos animais estão em extinção devido à destruição de habitats, caça e mudanças climáticas. Tigres, pandas, rinocerontes e gorilas estão entre os mais ameaçados." },
    { tags: ["amazonia", "animais", "especies"], resposta: "a Amazônia abriga mais de 10% das espécies do planeta, incluindo onças-pintadas, araras, botos, capivaras e milhares de insetos." },
  ],

  // ===================== FILOSOFIA E RELIGIÃO =====================
  filosofia: [
    { tags: ["socrates", "quem", "filosofo"], resposta: "Sócrates (470-399 a.C.) foi um filósofo grego considerado o pai da filosofia ocidental. Não escreveu nada — conhecemos suas ideias através de Platão." },
    { tags: ["platao", "quem", "filosofo"], resposta: "Platão (427-347 a.C.) foi um filósofo grego, aluno de Sócrates. Fundou a Academia de Atenas e escreveu sobre justiça, conhecimento e a alma." },
    { tags: ["aristoteles", "quem", "filosofo"], resposta: "Aristóteles (384-322 a.C.) foi um filósofo grego, aluno de Platão e tutor de Alexandre, o Grande. Fez contribuições fundamentais em lógica, ética, política e ciência." },
    { tags: ["nietzsche", "quem", "filosofo"], resposta: "Friedrich Nietzsche (1844-1900) foi um filósofo alemão conhecido por criticar a moral tradicional e propor o conceito do 'super-homem' e a frase 'Deus está morto'." },
    { tags: ["descartes", "quem", "penso", "logo", "existo"], resposta: "René Descartes (1596-1650) foi um filósofo e matemático francês, conhecido por 'Penso, logo existo' — a base do racionalismo. Inventou também o sistema de coordenadas cartesianas." },
    { tags: ["kant", "quem", "filosofo"], resposta: "Immanuel Kant (1724-1804) foi um filósofo alemão, um dos mais importantes da modernidade. Sua obra 'Crítica da Razão Pura' revolucionou a epistemologia." },
    { tags: ["budismo", "o que", "buda"], resposta: "o budismo é uma religião/filosofia fundada por Siddhartha Gautama (o Buda) há cerca de 2.500 anos, baseada no caminho do meio e na superação do sofrimento." },
    { tags: ["cristianismo", "o que", "jesus"], resposta: "o cristianismo é a maior religião do mundo, baseada nos ensinamentos de Jesus Cristo, que viveu no século I na região da Palestina." },
    { tags: ["islamismo", "o que", "maome"], resposta: "o islamismo é a segunda maior religião do mundo, fundada pelo profeta Maomé no século VII. Seus seguidores são chamados de muçulmanos." },
    { tags: ["hinduismo", "o que"], resposta: "o hinduísmo é uma das religiões mais antigas do mundo, originária da Índia, com mais de 1 bilhão de seguidores. Não tem um fundador único." },
    { tags: ["judaismo", "o que"], resposta: "o judaísmo é uma das religiões monoteístas mais antigas do mundo, baseada na Torá. Tem cerca de 4.000 anos de história." },
    { tags: ["confucionismo", "o que"], resposta: "o confucionismo é um sistema filosófico e ético chinês baseado nos ensinamentos de Confúcio (551-479 a.C.), focado em moral, justiça e respeito." },
    { tags: ["stoicismo", "o que"], resposta: "o estoicismo é uma escola filosófica grega que ensina a aceitar o que não podemos controlar e focar no que podemos. Fundadores: Zenão de Cício, Epicteto, Sêneca, Marco Aurélio." },
    { tags: ["existencialismo", "o que"], resposta: "o existencialismo é uma corrente filosófica que enfatiza a liberdade individual, a responsabilidade e a busca de sentido na vida. Pensadores: Sartre, Camus, Kierkegaard." },
  ],

  // ===================== MATEMÁTICA =====================
  matematica: [
    { tags: ["pi", "valor", "numero"], resposta: "o número Pi (π) é aproximadamente 3,14159. É uma constante que representa a relação entre a circunferência e o diâmetro de um círculo. Tem infinitas casas decimais." },
    { tags: ["numero", "primo", "o que"], resposta: "um número primo é um número maior que 1 que só é divisível por 1 e por ele mesmo. Exemplos: 2, 3, 5, 7, 11, 13. O número 2 é o único primo par." },
    { tags: ["fibonacci", "sequencia", "o que"], resposta: "a sequência de Fibonacci é uma série onde cada número é a soma dos dois anteriores: 0, 1, 1, 2, 3, 5, 8, 13, 21... Aparece em padrões da natureza como conchas e galhos." },
    { tags: ["zero", "quem", "inventou"], resposta: "o zero foi inventado pelos matemáticos indianos por volta do século VII, e levado para o Ocidente pelos árabes. Antes do zero, a matemática era muito mais difícil." },
    { tags: ["infinito", "o que", "matematica"], resposta: "o infinito (∞) não é um número, mas um conceito que representa algo sem fim. Existem diferentes tamanhos de infinito, como mostrou Georg Cantor." },
    { tags: ["multiplicacao", "o que"], resposta: "a multiplicação é uma operação matemática que representa a soma repetida de um número. Ex: 3 × 4 = 3 + 3 + 3 + 3 = 12." },
    { tags: ["porcentagem", "como", "calcula"], resposta: "para calcular uma porcentagem, multiplica o número pela porcentagem e divide por 100. Ex: 20% de 50 = (20 × 50) / 100 = 10." },
  ],

  // ===================== LÍNGUAS E IDIOMAS =====================
  linguas: [
    { tags: ["portugues", "idioma", "origem"], resposta: "o português é uma língua românica derivada do latim, falada por mais de 270 milhões de pessoas no mundo. É a língua oficial de Portugal, Brasil, Angola, Moçambique e outros." },
    { tags: ["ingles", "idioma", "mais", "falado"], resposta: "o inglês é a língua mais falada no mundo (como língua materna e segunda língua combinadas), com mais de 1,5 bilhão de falantes. É a língua franca global." },
    { tags: ["espanhol", "idioma", "falantes"], resposta: "o espanhol é a segunda língua mais falada como língua materna no mundo, com cerca de 500 milhões de falantes. É a língua oficial de 21 países." },
    { tags: ["mandarim", "chines", "idioma"], resposta: "o mandarim é a língua com mais falantes nativos no mundo, com mais de 900 milhões. É o dialeto mais falado do chinês." },
    { tags: ["esperanto", "o que", "idioma"], resposta: "o esperanto é uma língua artificial criada por L.L. Zamenhof em 1887 para ser uma língua universal neutra e fácil de aprender." },
    { tags: ["latim", "idioma", "morto"], resposta: "o latim é uma língua antiga falada no Império Romano. Embora seja considerada 'morta' como língua cotidiana, é a base de muitas línguas modernas como português, espanhol, francês e italiano." },
    { tags: ["arabe", "idioma", "falantes"], resposta: "o árabe é falado por mais de 400 milhões de pessoas em 22 países. É a língua do Alcorão e tem uma rica tradição literária e científica." },
  ],

  // ===================== ESPAÇO E ASTRONOMIA =====================
  astronomia: [
    { tags: ["sistema", "solar", "idade"], resposta: "o sistema solar tem cerca de 4,6 bilhões de anos, formado a partir de uma nuvem de gás e poeira chamada nebulosa solar." },
    { tags: ["marte", "planeta", "vermelho"], resposta: "Marte é chamado de Planeta Vermelho por causa do óxido de ferro (ferrugem) em sua superfície. Tem a montanha mais alta do sistema solar: o Olympus Mons, 3 vezes mais alto que o Everest." },
    { tags: ["venus", "planeta", "quente"], resposta: "Vênus é o planeta mais quente do sistema solar, com cerca de 465°C na superfície, devido ao efeito estufa descontrolado da sua densa atmosfera de CO2." },
    { tags: ["saturno", "aneis", "planeta"], resposta: "Saturno é famoso por seus anéis, formados por bilhões de pedaços de gelo e rocha. É um planeta gasoso, tão leve que flutuaria na água." },
    { tags: ["mercurio", "planeta", "proximo", "sol"], resposta: "Mercúrio é o planeta mais próximo do Sol e o menor do sistema solar. Um dia em Mercúrio dura 59 dias terrestres." },
    { tags: ["netuno", "planeta", "azul"], resposta: "Netuno é o planeta mais distante do Sol. É azul e tem os ventos mais rápidos do sistema solar, chegando a 2.100 km/h." },
    { tags: ["urano", "planeta", "girar"], resposta: "Urano é um planeta gasoso que gira de lado, com eixo de rotação quase paralelo ao plano da órbita. Tem um tom azul-esverdeado." },
    { tags: ["plutao", "planeta", "ano"], resposta: "Plutão foi reclassificado como planeta-anão em 2006 pela União Astronômica Internacional. Tem 5 luas, sendo a maior Caronte." },
    { tags: ["estrela", "cadente", "o que"], resposta: "estrelas cadentes não são estrelas — são pequenos pedaços de rocha ou poeira que queimam ao entrar na atmosfera terrestre, criando um rastro de luz. O nome técnico é meteoro." },
    { tags: ["eclipse", "solar", "o que"], resposta: "um eclipse solar acontece quando a Lua se posiciona entre o Sol e a Terra, bloqueando a luz solar. Pode ser total, parcial ou anular." },
    { tags: ["buraco", "negro", "foto", "primeira"], resposta: "a primeira imagem de um buraco negro foi divulgada em 2019 pela equipe do Event Horizon Telescope. Era o buraco negro da galáxia M87, a 55 milhões de anos-luz da Terra." },
    { tags: ["estacao", "espacial", "iss"], resposta: "a Estação Espacial Internacional (ISS) é um laboratório orbital habitado desde 2000, orbitando a Terra a 400 km de altitude a 28.000 km/h." },
    { tags: ["lua", "fases", "quatro"], resposta: "a Lua tem 4 fases principais: nova, crescente, cheia e minguante. O ciclo completo dura cerca de 29,5 dias, influenciando as marés dos oceanos." },
  ],

  // ===================== CURIOSIDADES EXTRA =====================
  curiosidades2: [
    { tags: ["piscar", "olhos", "vezes", "dia"], resposta: "uma pessoa pisca em média 15 a 20 vezes por minuto — cerca de 20.000 vezes por dia! Cada piscada dura cerca de 0,1 segundos." },
    { tags: ["coracao", "tamanho", "mao"], resposta: "o coração humano é aproximadamente do tamanho de uma mão fechada e pesa entre 250 e 350 gramas." },
    { tags: ["pelo", "corpo", "quantos"], resposta: "o corpo humano tem cerca de 5 milhões de folículos pilosos — mais do que a maioria dos primatas. A maioria é tão fina que não vemos." },
    { tags: ["unha", "cresce", "velocidade"], resposta: "as unhas das mãos crescem cerca de 3,5 mm por mês. As unhas dos pés crescem 3-4 vezes mais devagar." },
    { tags: ["espirro", "velocidade", "km"], resposta: "um espirro pode sair a mais de 160 km/h e espalhar bactérias a até 8 metros de distância." },
    { tags: ["cabelo", "cresce", "mes"], resposta: "o cabelo humano cresce cerca de 1 a 1,5 cm por mês. Um cabelo saudável pode durar até 6 anos antes de cair." },
    { tags: ["pele", "celulas", "renovacao"], resposta: "a pele humana se renova completamente a cada 28 dias. Perdemos cerca de 30.000 a 40.000 células de pele por minuto!" },
    { tags: ["olfato", "humano", "cheiros"], resposta: "o ser humano consegue distinguir cerca de 1 trilhão de cheiros diferentes, segundo pesquisas recentes. Muito mais do que se pensava." },
    { tags: ["sabor", "língua", "gostos"], resposta: "existem 5 gostos básicos que a língua detecta: doce, salgado, azedo, amargo e umami (sabor de alimentos protéicos como queijo e tomate)." },
    { tags: ["memoria", "cerebro", "capacidade"], resposta: "a memória humana não tem capacidade definida — o cérebro pode armazenar aproximadamente 2,5 petabytes de informação (cerca de 2,5 milhões de gigabytes)." },
    { tags: ["sonhos", "quantos", "noite"], resposta: "uma pessoa tem em média 3 a 7 sonhos por noite, mas a maioria é esquecida em poucos minutos após acordar." },
    { tags: ["risada", "calorias", "gasta"], resposta: "rir queima cerca de 40 calorias por 15 minutos. Não é muito, mas rir faz bem pra saúde de várias formas!" },
  ],

  // ===================== BIOLOGIA =====================
  biologia: [
    { tags: ["dna", "o que", "sigla"], resposta: "o DNA (ácido desoxirribonucleico) é a molécula que contém o código genético de todos os seres vivos. Tem formato de dupla hélice e foi descoberta por Watson e Crick em 1953." },
    { tags: ["rna", "o que"], resposta: "o RNA (ácido ribonucleico) é uma molécula similar ao DNA que ajuda a sintetizar proteínas. Existem vários tipos: mensageiro (mRNA), transportador (tRNA) e ribossomal (rRNA)." },
    { tags: ["mitose", "o que", "celula"], resposta: "a mitose é o processo de divisão celular onde uma célula se divide em duas idênticas. É assim que o corpo cresce e repara tecidos." },
    { tags: ["meiose", "o que", "celula"], resposta: "a meiose é a divisão celular que produz gametas (espermatozoides e óvulos) com metade do DNA. É por isso que filhos herdam características de ambos os pais." },
    { tags: ["bacteria", "o que"], resposta: "as bactérias são organismos unicelulares microscópicos sem núcleo definido. Existem trilhões delas no corpo humano — a maioria inofensiva ou benéfica." },
    { tags: ["virus", "o que"], resposta: "os vírus são agentes infecciosos que precisam de uma célula hospedeira para se reproduzir. Não são considerados seres vivos por muitos cientistas porque não conseguem se reproduzir sozinhos." },
    { tags: ["fungos", "o que"], resposta: "os fungos são organismos como cogumelos, leveduras e bolores. Pertencem a um reino separado de plantas e animais. O fermento do pão é um fungo!" },
    { tags: ["protista", "o que"], resposta: "os protistas são organismos eucariontes que não são plantas, animais nem fungos. Incluem algas, amebas e paramecícios." },
    { tags: ["ecossistema", "o que"], resposta: "um ecossistema é o conjunto de seres vivos e o ambiente físico onde vivem, interagindo entre si. Inclui plantas, animais, solo, água, ar e luz solar." },
    { tags: ["cadeia", "alimentar", "o que"], resposta: "a cadeia alimentar mostra quem come quem na natureza. Come com os produtores (plantas), passa pelos consumidores (herbívoros e carnívoros) e termina com os decompositores." },
    { tags: ["fotossintese", "o que"], resposta: "a fotossíntese é o processo pelo qual as plantas convertem luz solar, água e CO2 em glicose e oxigênio." },
    { tags: ["respiracao", "celular", "o que"], resposta: "a respiração celular é o processo onde as células convertem glicose e oxigênio em energia (ATP), água e CO2. É como o corpo produz energia." },
    { tags: ["sistema", "nervoso", "o que"], resposta: "o sistema nervoso controla o corpo através de sinais elétricos. Inclui o cérebro, medula espinhal e nervos. É o 'computador' do corpo." },
    { tags: ["sistema", "circulatorio", "o que"], resposta: "o sistema circulatório transporta sangue, oxigênio e nutrientes pelo corpo. Inclui o coração, veias, artérias e capilares." },
    { tags: ["sistema", "digestivo", "o que"], resposta: "o sistema digestivo transforma comida em energia e nutrientes. Inclui boca, esôfago, estômago, intestinos, fígado e pâncreas." },
    { tags: ["sistema", "respiratorio", "o que"], resposta: "o sistema respiratório é responsável pela troca de gases — absorve oxigênio e elimina CO2. Inclui nariz, traqueia, brônquios e pulmões." },
    { tags: ["hormonio", "o que"], resposta: "os hormônios são substâncias químicas produzidas pelas glândulas que regulam funções do corpo como crescimento, metabolismo, humor e reprodução." },
    { tags: ["enzima", "o que"], resposta: "as enzimas são proteínas que aceleram reações químicas no corpo. Sem elas, a digestão e outras funções seriam lentas demais." },
    { tags: ["anticorpo", "o que"], resposta: "os anticorpos são proteínas produzidas pelo sistema imunológico para reconhecer e neutralizar invasores como vírus e bactérias." },
    { tags: ["vacina", "como", "funciona"], resposta: "as vacinas funcionam ensinando o sistema imunológico a reconhecer um patógeno sem causar a doença. O corpo cria anticorpos que ficam prontos para um ataque real." },
    { tags: ["gene", "o que"], resposta: "um gene é um trecho de DNA que contém instruções para produzir uma proteína específica. Os genes determinam características como cor dos olhos e tipo sanguíneo." },
    { tags: ["cromossomo", "o que"], resposta: "os cromossomos são estruturas de DNA compactado. O ser humano tem 23 pares (46 no total). O par 23 determina o sexo (XX feminino, XY masculino)." },
    { tags: ["evolucao", "darwin", "o que"], resposta: "a teoria da evolução de Charles Darwin propõe que as espécies mudam ao longo do tempo através da seleção natural — os mais adaptados sobrevivem e se reproduzem mais." },
    { tags: ["especiacao", "o que"], resposta: "a especiação é o processo de formação de novas espécies. Acontece quando populações ficam isoladas e evoluem de forma diferente ao longo de milhares de gerações." },
    { tags: ["simbiose", "o que"], resposta: "a simbiose é uma relação íntima entre espécies diferentes. Pode ser mutualismo (ambas ganham), comensalismo (uma ganha, outra não afeta) ou parasitismo (uma ganha, outra perde)." },
  ],

  // ===================== QUÍMICA =====================
  quimica: [
    { tags: ["atomo", "o que"], resposta: "o átomo é a menor unidade da matéria que mantém as propriedades de um elemento. Formado por prótons, nêutrons e elétrons." },
    { tags: ["proton", "o que"], resposta: "os prótons são partículas com carga positiva no núcleo do átomo. O número de prótons define qual é o elemento químico." },
    { tags: ["neutron", "o que"], resposta: "os nêutrons são partículas sem carga no núcleo do átomo. Junto com os prótons, formam a massa do átomo." },
    { tags: ["eletron", "o que"], resposta: "os elétrons são partículas com carga negativa que orbitam o núcleo do átomo. São responsáveis pelas ligações químicas e pela eletricidade." },
    { tags: ["molecula", "o que"], resposta: "uma molécula é um grupo de átomos unidos por ligações químicas. A água (H2O) é uma molécula formada por 2 átomos de hidrogênio e 1 de oxigênio." },
    { tags: ["elemento", "quimico", "o que"], resposta: "um elemento químico é uma substância pura formada por átomos com o mesmo número de prótons. Existem 118 elementos na tabela periódica." },
    { tags: ["tabela", "periodica", "o que"], resposta: "a tabela periódica organiza todos os elementos químicos por número atômico e propriedades. Foi criada por Dmitri Mendeleev em 1869." },
    { tags: ["agua", "formula", "h2o"], resposta: "a água é uma molécula (H2O) formada por 2 átomos de hidrogênio e 1 de oxigênio. Cerca de 60% do corpo humano é água." },
    { tags: ["oxigenio", "o que"], resposta: "o oxigênio (O) é um gás essencial para a vida. Cerca de 21% da atmosfera terrestre é oxigênio. É necessário para a respiração celular." },
    { tags: ["hidrogenio", "o que"], resposta: "o hidrogênio (H) é o elemento mais abundante do universo — compõe cerca de 75% da massa de todos os elementos. É a estrela do Sol!" },
    { tags: ["carbono", "o que"], resposta: "o carbono (C) é a base de toda a vida na Terra. Forma cadeias e anéis que criam moléculas orgânicas como proteínas, carboidratos e DNA." },
    { tags: ["nitrogenio", "o que"], resposta: "o nitrogênio (N) compõe 78% da atmosfera terrestre. É essencial para proteínas e DNA, mas a maioria dos seres vivos não consegue usá-lo diretamente do ar." },
    { tags: ["ferro", "elemento"], resposta: "o ferro (Fe) é um metal essencial para o corpo humano — faz parte da hemoglobina que transporta oxigênio no sangue. Também é o núcleo da Terra." },
    { tags: ["ouro", "elemento"], resposta: "o ouro (Au) é um metal precioso que não oxida nem enferruja. É tão raro que todo o ouro já minerado caberia em um cubo de 21 metros de lado." },
    { tags: ["sal", "cloreto", "sodio"], resposta: "o sal de cozinha é cloreto de sódio (NaCl). O sódio é essencial para o corpo, mas em excesso causa pressão alta." },
    { tags: ["acido", "o que"], resposta: "um ácido é uma substância que libera íons H+ em solução. Tem pH abaixo de 7. Exemplos: vinagre (ácido acético), limão (ácido cítrico), estômago (ácido clorídrico)." },
    { tags: ["base", "alcalina", "o que"], resposta: "uma base é uma substância que libera íons OH- em solução. Tem pH acima de 7. Exemplos: sabão, bicarbonato de sódio, leite de magnésia." },
    { tags: ["ph", "o que"], resposta: "o pH mede a acidez ou alcalinidade de uma substância numa escala de 0 a 14. Abaixo de 7 é ácido, acima de 7 é básico, e 7 é neutro (como a água pura)." },
    { tags: ["reacao", "quimica", "o que"], resposta: "uma reação química é quando substâncias se transformam em outras novas. Ex: queimar madeira, enferrujar ferro, cozinhar um ovo." },
    { tags: ["ligacao", "quimica", "o que"], resposta: "as ligações químicas unem átomos para formar moléculas. Podem ser iônicas (troca de elétrons), covalentes (compartilhamento) ou metálicas." },
    { tags: ["estado", "materia", "o que"], resposta: "os estados da matéria são: sólido, líquido, gasoso e plasma. A água pode ser gelo, líquido ou vapor dependendo da temperatura." },
    { tags: ["pressao", "atmosferica", "o que"], resposta: "a pressão atmosférica é o peso do ar sobre a Terra. No nível do mar é de 1 atmosfera. Diminui com a altitude — por isso é difícil respirar em grandes altitudes." },
    { tags: ["calor", "temperatura", "diferenca"], resposta: "calor é a energia térmica em trânsito (que flui de quente para frio). Temperatura é a medida do grau de agitação das moléculas. Não é a mesma coisa!" },
  ],

  // ===================== FÍSICA =====================
  fisica: [
    { tags: ["gravidade", "o que"], resposta: "a gravidade é a força que atrai objetos com massa entre si. Na Terra, nos puxa para o centro com aceleração de 9,8 m/s². É a fraqueza mais fraca das forças fundamentais." },
    { tags: ["velocidade", "luz", "o que"], resposta: "a velocidade da luz é cerca de 300.000 km/s no vácuo. Nada no universo viaja mais rápido. A luz do Sol demora 8 minutos para chegar à Terra." },
    { tags: ["som", "velocidade", "o que"], resposta: "o som viaja a 343 m/s no ar a 20°C. É mais rápido na água e no metal. No vácuo o som não se propaga — no espaço ninguém te ouve gritar." },
    { tags: ["energia", "o que", "fisica"], resposta: "a energia é a capacidade de realizar trabalho. Pode ser cinética (movimento), potencial (posição), térmica, elétrica, luminosa, química ou nuclear." },
    { tags: ["forca", "o que"], resposta: "uma força é um empurrão ou puxão que pode mudar a velocidade ou direção de um objeto. Medida em Newtons (N)." },
    { tags: ["atrito", "o que"], resposta: "o atrito é a força que resiste ao movimento entre duas superfícies em contato. Sem atrito, não conseguiríamos andar nem segurar objetos." },
    { tags: ["inercia", "o que"], resposta: "a inércia é a tendência de um objeto em manter seu estado de movimento. Um corpo em repouso tende a ficar parado; um em movimento tende a continuar movendo." },
    { tags: ["einstein", "teoria", "relatividade"], resposta: "Albert Einstein propôs a Teoria da Relatividade em 1905 (especial) e 1915 (geral). Mostrou que tempo e espaço são relativos, e que energia e massa são equivalentes (E=mc²)." },
    { tags: ["newton", "leis", "fisica"], resposta: "Isaac Newton formulou as 3 leis do movimento: 1) inércia, 2) F=ma (força = massa × aceleração), 3) ação e reação. Também descobriu a lei da gravitação universal." },
    { tags: ["eletricidade", "o que"], resposta: "a eletricidade é o fluxo de elétrons através de um material condutor. É causada por cargas elétricas em movimento, geralmente em fios de cobre." },
    { tags: ["magnetismo", "o que"], resposta: "o magnetismo é uma força exercida por ímãs e correntes elétricas. A Terra tem um campo magnético que protege dos ventos solares e orienta as bússolas." },
    { tags: ["eletromagnetismo", "o que"], resposta: "o eletromagnetismo é a interação entre eletricidade e magnetismo. James Clerk Maxwell unificou os dois em 4 equações famosas. É a base de rádio, Wi-Fi e luz." },
    { tags: ["termodinamica", "o que"], resposta: "a termodinâmica estuda calor, energia e entropia. A 1ª lei: energia não se cria nem se destrói. A 2ª lei: entropia (desordem) do universo sempre aumenta." },
    { tags: ["entropia", "o que"], resposta: "a entropia mede a desordem de um sistema. A 2ª lei da termodinâmica diz que a entropia do universo sempre aumenta — é por isso que um quarto bagunçado não se arruma sozinho." },
    { tags: ["quantica", "fisica", "o que"], resposta: "a física quântica estuda o comportamento de partículas em escala atômica. Revela que partículas podem estar em vários estados ao mesmo tempo (superposição) até serem observadas." },
    { tags: ["schrodinger", "gato"], resposta: "o gato de Schrödinger é um experimento mental famoso: um gato dentro de uma caixa estaria vivo e morto ao mesmo tempo até alguém abrir a caixa e observar." },
    { tags: ["particulas", "subatomicas"], resposta: "as partículas subatômicas incluem quarks (que formam prótons e nêutrons), léptons (como elétrons), bósons (como o bóson de Higgs) e neutrinos." },
    { tags: ["boson", "higgs", "o que"], resposta: "o bóson de Higgs é a partícula que dá massa a outras partículas. Foi confirmado em 2012 no CERN. Apelidado de 'partícula de Deus'." },
    { tags: ["nuclear", "fissao", "o que"], resposta: "a fissão nuclear é a divisão de um núcleo atômico pesado (como urânio) em dois menores, liberando muita energia. É o princípio das usinas nucleares e bombas atômicas." },
    { tags: ["nuclear", "fusao", "o que"], resposta: "a fusão nuclear é quando dois núcleos leves se unem formando um mais pesado, liberando energia. É o que faz o Sol brilhar. Cientistas tentam recriá-la na Terra como fonte de energia limpa." },
    { tags: ["laser", "o que"], resposta: "o laser (amplificação de luz por emissão estimulada de radiação) produz um feixe de luz concentrado e direcionado. Usado em cirurgias, leitores de código de barras e fibras ópticas." },
    { tags: ["onda", "frequencia", "o que"], resposta: "uma onda é uma oscilação que transporta energia. A frequência é o número de oscilações por segundo (medida em Hertz). Sons graves têm baixa frequência; agudos, alta." },
  ],

  // ===================== MATEMÁTICA AVANÇADA =====================
  matematicaAvancada: [
    { tags: ["pitagoras", "teorema"], resposta: "o teorema de Pitágoras diz que num triângulo retângulo, a soma dos quadrados dos catetos equivale ao quadrado da hipotenusa: a² + b² = c²." },
    { tags: ["algebra", "o que"], resposta: "a álgebra é a parte da matemática que usa letras para representar números desconhecidos. Permite resolver equações e generalizar padrões." },
    { tags: ["geometria", "o que"], resposta: "a geometria estuda formas, tamanhos, posições e propriedades do espaço. Triângulos, círculos, cubos e esferas são objetos de estudo da geometria." },
    { tags: ["trigonometria", "o que"], resposta: "a trigonometria estuda as relações entre lados e ângulos de triângulos. As funções principais são seno, cosseno e tangente." },
    { tags: ["calculo", "o que"], resposta: "o cálculo é a matemática das mudanças contínuas. Dividido em diferencial (taxas de variação) e integral (acumulação). Desenvolvido por Newton e Leibniz." },
    { tags: ["estatistica", "o que"], resposta: "a estatística é a ciência de coletar, organizar e interpretar dados. Usa média, mediana, moda e desvio padrão para resumir informações." },
    { tags: ["probabilidade", "o que"], resposta: "a probabilidade mede a chance de algo acontecer, de 0 (impossível) a 1 (certo). Lançar uma moeda tem 50% de chance de dar cara." },
    { tags: ["logaritmo", "o que"], resposta: "um logaritmo é o expoente ao qual uma base deve ser elevada para obter um número. log₁₀(100) = 2, porque 10² = 100. Usado em escala Richter e pH." },
    { tags: ["equacao", "segundo", "grau"], resposta: "uma equação do 2º grau tem a forma ax² + bx + c = 0. A fórmula de Bhaskara resolve: x = (-b ± √(b²-4ac)) / 2a." },
    { tags: ["teorema", "fermat"], resposta: "o Último Teorema de Fermat diz que aⁿ + bⁿ = cⁿ não tem solução para n > 2. Fermat escreveu em 1637 mas a prova só veio em 1994 por Andrew Wiles." },
    { tags: ["teoria", "caos", "o que"], resposta: "a teoria do caos estuda sistemas sensíveis a condições iniciais — o 'efeito borboleta', onde o bater de asas de uma borboleta pode influenciar um furacão do outro lado do mundo." },
    { tags: ["fractal", "o que"], resposta: "um fractal é uma figura geométrica que se repete em qualquer escala de ampliação. Aparece na natureza: costa de continentes, flocos de neve, samambaias, raios." },
    { tags: ["numero", "aureo", "proporcao"], resposta: "o número áureo (φ ≈ 1,618) é uma proporção que aparece na natureza, arte e arquitetura. Também chamado de 'proporção divina'." },
    { tags: ["conjuntos", "teoria"], resposta: "a teoria dos conjuntos estuda coleções de elementos. É a base da matemática moderna. Um conjunto pode ser finito (números de 1 a 10) ou infinito (números naturais)." },
    { tags: ["topologia", "o que"], resposta: "a topologia estuda propriedades que não mudam quando objetos são deformados sem rasgar. Um copo e uma rosquinha são topologicamente iguais!" },
  ],

  // ===================== GEOGRAFIA EXTRA =====================
  geografiaExtra: [
    { tags: ["amazonia", "floresta", "tamanho"], resposta: "a Amazônia cobre 9 países da América do Sul e é a maior floresta tropical do mundo. Abriga cerca de 10% de todas as espécies conhecidas." },
    { tags: ["sahara", "deserto", "tamanho"], resposta: "o deserto do Saara é o maior deserto quente do mundo, cobrindo 9 milhões de km² no norte da África. Quase do tamanho dos Estados Unidos." },
    { tags: ["everest", "monte", "altura"], resposta: "o Monte Everest é a montanha mais alta do mundo com 8.849 metros, na fronteira entre Nepal e China. A primeira escalada foi em 1953 por Edmund Hillary e Tenzing Norgay." },
    { tags: ["mariana", "fossa", "profundidade"], resposta: "a Fossa das Marianas é o ponto mais profundo dos oceanos, com 10.994 metros de profundidade. Mais fundo que o Everest é alto!" },
    { tags: ["nilo", "rio", "comprimento"], resposta: "o rio Nilo é frequentemente considerado o mais longo do mundo, com 6.650 km. Outros dizem que o Amazonas é mais longo. A controvérsia continua." },
    { tags: ["amazonas", "rio", "volume"], resposta: "o rio Amazonas é o maior rio do mundo em volume de água — despeja 209.000 m³ por segundo no oceano, mais que os 7 próximos rios juntos." },
    { tags: ["antartida", "continente"], resposta: "a Antártida é o continente mais frio, seco e ventoso da Terra. É 98% coberta de gelo e não tem habitantes permanentes, só cientistas em estações de pesquisa." },
    { tags: ["pantanal", "o que"], resposta: "o Pantanal é a maior planície alagada do mundo, localizada entre Brasil, Bolívia e Paraguai. Tem biodiversidade incrível, com onças, capivaras e jacarés." },
    { tags: ["cristo", "redentor", "rio"], resposta: "o Cristo Redentor no Rio de Janeiro tem 38 metros de altura e foi eleito uma das 7 Maravilhas do Mundo Moderno em 2007. Foi inaugurado em 1931." },
    { tags: ["machu", "picchu"], resposta: "Machu Picchu é uma cidade inca no Peru, a 2.430 metros de altitude. Foi construída no século XV e redescoberta em 1911 por Hiram Bingham." },
    { tags: ["grande", "muralha", "china"], resposta: "a Grande Muralha da China tem mais de 21.000 km de extensão. Foi construída ao longo de séculos para defender o império chinês de invasões." },
    { tags: ["taj", "mahal"], resposta: "o Taj Mahal é um mausoléu de mármore branco em Agra, Índia. Foi construído pelo imperador Shah Jahan em memória de sua esposa. Demorou 22 anos (1632-1653)." },
    { tags: ["coliseu", "roma"], resposta: "o Coliseu de Roma foi o maior anfiteatro do mundo, com capacidade para 50.000 espectadores. Foi construído em 70-80 d.C. e usado para combates de gladiadores." },
    { tags: ["estatua", "liberdade"], resposta: "a Estátua da Liberdade foi um presente da França aos EUA em 1886. Tem 93 metros de altura e fica na ilha da Liberdade em Nova York." },
    { tags: ["piramide", "giza", "egito"], resposta: "as Pirâmides de Gizé, no Egito, foram construídas há mais de 4.500 anos. A Grande Pirâmide de Quéops tem 146 metros e era a estrutura mais alta do mundo por 3.800 anos." },
    { tags: ["petra", "jordania"], resposta: "Petra é uma cidade esculpida em rocha na Jordânia, capital do reino nabateu. Ficou famosa como 'a cidade rosa' e é uma das 7 Maravilhas do Mundo Moderno." },
    { tags: ["chichen", "itza", "mexico"], resposta: "Chichén Itzá é uma cidade maia no México. A pirâmide de Kukulkán tem 365 degraus (um por dia do ano) e foi eleita uma das 7 Maravilhas do Mundo Moderno." },
    { tags: ["veneza", "italia", "canais"], resposta: "Veneza é uma cidade italiana construída sobre 118 pequenas ilhas ligadas por mais de 400 pontes. Não tem ruas para carros — só canais e gôndolas." },
    { tags: ["torre", "pisa"], resposta: "a Torre de Pisa inclinou-se porque o solo sob ela é macio demais. A inclinação é de cerca de 4 graus. Construída entre 1173 e 1372, tem 8 andares." },
    { tags: ["angkor", "wat", "camboja"], resposta: "Angkor Wat é o maior templo religioso do mundo, no Camboja. Foi construído no século XII pelo rei Suryavarman II. Originalmente hindu, depois budista." },
  ],

  // ===================== HISTÓRIA EXTRA =====================
  historiaExtra: [
    { tags: ["egito", "antigo", "faraos"], resposta: "o Antigo Egito foi uma civilização que durou mais de 3.000 anos. Os faraós eram considerados deuses vivos. Construíram pirâmides e desenvolveram escrita hieroglífica." },
    { tags: ["roma", "antiga", "imperio"], resposta: "o Império Romano dominou o Mediterrâneo por séculos. No auge, tinha 70 milhões de pessoas em 5 milhões de km². Caiu em 476 d.C. com a invasão bárbara." },
    { tags: ["grecia", "antiga", "atenas"], resposta: "a Grécia Antiga foi berço da democracia, filosofia, teatro e dos Jogos Olímpicos. Atenas e Esparta eram as cidades-Estado mais famosas, frequentemente rivais." },
    { tags: ["china", "imperio", "historia"], resposta: "a China tem uma das civilizações mais antigas do mundo, com mais de 4.000 anos de história contínua. Inventou papel, pólvora, bússola e impressão." },
    { tags: ["mesopotamia", "o que"], resposta: "a Mesopotâmia (entre os rios Tigre e Eufrates) é considerada o berço da civilização. Os sumérios criaram a escrita cuneiforme há 5.000 anos." },
    { tags: ["maya", "civilizacao"], resposta: "os maias foram uma civilização da Mesoamérica que floresceu entre 250 e 900 d.C. Desenvolveram um calendário preciso e escrita hieroglífica." },
    { tags: ["azteca", "civilizacao"], resposta: "os astecas dominaram o centro do México no século XIV e XV. A capital Tenochtitlán (hoje Cidade do México) tinha 200.000 habitantes — maior que Londres na época." },
    { tags: ["incas", "civilizacao"], resposta: "os incas foram a maior civilização da América do Sul pré-colombiana. O império ia do Equador ao Chile. A capital era Cusco, no Peru." },
    { tags: ["renascimento", "o que"], resposta: "o Renascimento foi um período de efervescência cultural entre os séculos XIV e XVII. Marcou a transição da Idade Média para a Era Moderna, com avanços em arte, ciência e filosofia." },
    { tags: ["iluminismo", "o que"], resposta: "o Iluminismo foi um movimento do século XVIII que valorizava a razão, ciência e liberdade. Pensadores como Voltaire, Rousseau e Montesquieu influenciaram revoluções." },
    { tags: ["revolucao", "industrial"], resposta: "a Revolução Industrial começou na Inglaterra no século XVIII. Mudou o mundo da produção artesanal para as máquinas. Trouxe progresso mas também exploração e poluição." },
    { tags: ["guerra", "fria", "o que"], resposta: "a Guerra Fria foi um período de tensão (1947-1991) entre EUA e URSS. Nunca houve guerra direta, mas conflitos indiretos como Coréia e Vietnã. Terminou com a queda da URSS." },
    { tags: ["muro", "berlim", "queda"], resposta: "o Muro de Berlim dividiu a cidade de 1961 a 1989. Caiu em 9 de novembro de 1989, simbolizando o fim da Guerra Fria. Pessoas cruzaram livremente pela primeira vez em 28 anos." },
    { tags: ["escravatura", "brasil", "abolicao"], resposta: "a escravidão no Brasil foi abolida em 13 de maio de 1888 pela Lei Áurea, assinada pela princesa Isabel. O Brasil foi o último país das Américas a abolir a escravidão." },
    { tags: ["proclamacao", "republica", "brasil"], resposta: "a República foi proclamada no Brasil em 15 de novembro de 1889 por um golpe militar liderado pelo marechal Deodoro da Fonseca, derrubando o imperador Dom Pedro II." },
    { tags: ["independencia", "brasil", "1822"], resposta: "a independência do Brasil foi proclamada por Dom Pedro I em 7 de setembro de 1822, às margens do rio Ipiranga em São Paulo. O 'Grito do Ipiranga'." },
    { tags: ["descobrimento", "brasil", "1500"], resposta: "o Brasil foi oficialmente descoberto por Pedro Álvares Cabral em 22 de abril de 1500. A região já era habitada por milhões de indígenas há milhares de anos." },
    { tags: ["guerra", "vietnam"], resposta: "a Guerra do Vietnã (1955-1975) foi um conflito entre o Vietnã do Norte (comunista) e do Sul (apoiado pelos EUA). Terminou com a vitória do Norte e a reunificação do país." },
    { tags: ["guerra", "coreia"], resposta: "a Guerra da Coreia (1950-1953) foi o primeiro conflito armado da Guerra Fria. Terminou com um armistício que dividiu a Coreia em Norte e Sul no paralelo 38." },
  ],

  // ===================== TECNOLOGIA EXTRA =====================
  tecnologiaExtra: [
    { tags: ["internet", "como", "funciona"], resposta: "a internet é uma rede global de computadores que se comunicam através de protocolos padronizados (TCP/IP). Os dados viajam em pacotes por cabos submarinos e satélites." },
    { tags: ["www", "world", "wide", "web"], resposta: "a World Wide Web foi criada por Tim Berners-Lee em 1989 no CERN. É um sistema de páginas interligadas por hyperlinks que rodam sobre a internet." },
    { tags: ["bluetooth", "o que"], resposta: "o Bluetooth é uma tecnologia de comunicação sem fio de curto alcance (cerca de 10 metros). O nome vem do rei dinamarquês Harald Bluetooth, que unificou tribos." },
    { tags: ["wifi", "o que"], resposta: "o Wi-Fi é uma tecnologia que permite dispositivos se conectarem à internet sem fios, usando ondas de rádio. O padrão mais comum é o 802.11." },
    { tags: ["computador", "historia", "primeiro"], resposta: "o primeiro computador eletrônico foi o ENIAC, construído em 1945. Pesava 30 toneladas e ocupava uma sala inteira. Fazia cálculos de artilharia." },
    { tags: ["smartphone", "primeiro"], resposta: "o primeiro smartphone foi o IBM Simon, lançado em 1994. Tinha tela sensível ao toque e podia fazer chamadas, e-mails e tinha apps. Mas era caro e grande." },
    { tags: ["iphone", "lancamento"], resposta: "o primeiro iPhone foi lançado por Steve Jobs em 2007. Revolucionou a indústria de celulares com tela sensível ao toque multi-toque e loja de aplicativos." },
    { tags: ["google", "historia"], resposta: "o Google foi fundado por Larry Page e Sergey Brin em 1998. Começou como um projeto de doutorado em Stanford. O nome vem de 'googol' (10^100)." },
    { tags: ["facebook", "historia"], resposta: "o Facebook foi criado por Mark Zuckerberg em 2004 na Universidade de Harvard. Originalmente chamava-se 'TheFacebook' e era só para estudantes de Harvard." },
    { tags: ["youtube", "historia"], resposta: "o YouTube foi fundado em 2005 por Chad Hurley, Steve Chen e Jawed Karim. O primeiro vídeo ('Me at the zoo') foi postado em 23 de abril de 2005." },
    { tags: ["bitcoin", "o que"], resposta: "o Bitcoin é uma criptomoeda criada em 2009 por 'Satoshi Nakamoto' (pseudônimo). Funciona em uma rede descentralizada chamada blockchain, sem banco central." },
    { tags: ["blockchain", "o que"], resposta: "a blockchain é um registro digital distribuído e imutável. Cada bloco contém dados e está ligado ao anterior, formando uma cadeia. É a base das criptomoedas." },
    { tags: ["inteligencia", "artificial", "o que"], resposta: "a inteligência artificial é a capacidade de máquinas simularem inteligência humana — reconhecimento de padrões, aprendizado, tomada de decisão e linguagem natural." },
    { tags: ["machine", "learning", "o que"], resposta: "machine learning (aprendizado de máquina) é um ramo da IA onde computadores aprendem com dados em vez de serem programados explicitamente. Redes neurais são um exemplo." },
    { tags: ["rede", "neural", "o que"], resposta: "as redes neurais artificiais são modelos inspirados no cérebro humano. Camadas de 'neurônios' processam dados e aprendem padrões. São a base do deep learning." },
    { tags: ["algoritmo", "o que"], resposta: "um algoritmo é uma sequência de passos para resolver um problema. Desde uma receita de bolo até o sistema de recomendação do YouTube — tudo é algoritmo." },
    { tags: ["programacao", "o que"], resposta: "a programação é o ato de escrever instruções que um computador pode executar. Linguagens populares: Python, JavaScript, Java, C++, Go, Rust." },
    { tags: ["python", "linguagem"], resposta: "Python é uma linguagem de programação criada por Guido van Rossum em 1991. É simples, legível e usada em IA, ciência de dados, web e automação." },
    { tags: ["javascript", "linguagem"], resposta: "JavaScript é a linguagem da web — roda em todos os navegadores. Criada por Brendan Eich em 1995 em apenas 10 dias. Hoje também roda no servidor com Node.js." },
    { tags: ["html", "o que"], resposta: "o HTML (HyperText Markup Language) é a linguagem de marcação que estrutura as páginas web. Define títulos, parágrafos, imagens e links." },
    { tags: ["css", "o que"], resposta: "o CSS (Cascading Style Sheets) controla a aparência visual das páginas web — cores, fontes, layout e animações. Trabalha junto com HTML." },
    { tags: ["api", "o que"], resposta: "uma API (Interface de Programação de Aplicações) é um conjunto de regras que permite que programas se comuniquem. Como um garçom entre você e a cozinha." },
    { tags: ["nuvem", "cloud", "computacao"], resposta: "a computação em nuvem entrega serviços pela internet — armazenamento, processamento e software. Exemplos: Google Drive, AWS, Dropbox." },
    { tags: ["bitcoin", "satoshi"], resposta: "a menor unidade do Bitcoin é chamada 'satoshi', em homenagem ao criador. 1 Bitcoin = 100 milhões de satoshis." },
    { tags: ["robo", "robotica", "o que"], resposta: "a robótica combina engenharia mecânica, elétrica e computação para criar máquinas autônomas. Robôs são usados em fábricas, cirurgias, exploração espacial e muito mais." },
  ],

  // ===================== CULTURA EXTRA =====================
  culturaExtra: [
    { tags: ["shakespeare", "obras"], resposta: "William Shakespeare escreveu 39 peças e 154 sonetos. As mais famosas: Romeu e Julieta, Hamlet, Macbeth, Otelo, Rei Lear. É considerado o maior dramaturgo da língua inglesa." },
    { tags: ["beatles", "banda"], resposta: "os Beatles foram uma banda britânica formada em 1960 por John Lennon, Paul McCartney, George Harrison e Ringo Starr. São a banda mais vendida da história, com mais de 600 milhões de discos." },
    { tags: ["michael", "jackson"], resposta: "Michael Jackson (1958-2009) foi o 'Rei do Pop'. Seu álbum 'Thriller' (1982) é o mais vendido da história, com mais de 66 milhões de cópias." },
    { tags: ["walt", "disney"], resposta: "Walt Disney (1901-1966) criou Mickey Mouse em 1928 e fundou a Disney. 'Branca de Neve' (1937) foi o primeiro longa de animação da história." },
    { tags: ["picasso", "pintor"], resposta: "Pablo Picasso (1881-1973) foi um pintor espanhol que co-fundou o movimento cubista. Produziu mais de 20.000 obras de arte em sua vida." },
    { tags: ["van", "gogh"], resposta: "Vincent van Gogh (1853-1890) foi um pintor holandês pós-impressionista. Vend apenas um quadro em vida. 'A Noite Estrelada' é uma de suas obras mais famosas." },
    { tags: ["davinci", "leonardo"], resposta: "Leonardo da Vinci (1452-1519) foi pintor, cientista, engenheiro e inventor. Pintou a Mona Lisa e A Última Ceia. É considerado o maior gênio do Renascimento." },
    { tags: ["mona", "lisa"], resposta: "a Mona Lisa foi pintada por Leonardo da Vinci por volta de 1503-1519. Está no Museu do Louvre em Paris. É famosa pelo sorriso enigmático da modelo." },
    { tags: ["oscar", "premio"], resposta: "o Oscar é o prêmio da Academia de Artes e Ciências Cinematográficas de Hollywood. A primeira cerimônia foi em 1929. O nome 'Oscar' surgiu em 1939." },
    { tags: ["biblia", "livro", "vendido"], resposta: "a Bíblia é o livro mais vendido e distribuído de todos os tempos, com estimativas de 5 a 7 bilhões de cópias. Foi escrita por mais de 40 autores ao longo de 1.500 anos." },
    { tags: ["harry", "potter", "livro"], resposta: "Harry Potter foi escrito pela britânica J.K. Rowling. A série tem 7 livros publicados entre 1997 e 2007, vendendo mais de 500 milhões de cópias em 80 idiomas." },
    { tags: ["tolkien", "senhor", "aneis"], resposta: "O Senhor dos Anéis foi escrito por J.R.R. Tolkien entre 1937 e 1949. É uma das obras mais influentes da literatura fantástica, adaptada em filmes de enorme sucesso." },
    { tags: ["star", "wars", "george"], resposta: "Star Wars foi criada por George Lucas em 1977. A frase 'Que a Força esteja com você' se tornou icônica. A franquia já arrecadou mais de 10 bilhões de dólares." },
    { tags: ["marvel", "comics"], resposta: "a Marvel Comics foi fundada em 1939 por Martin Goodman. Criou personagens como Homem-Aranha, Homem de Ferro, Capitão América e os Vingadores." },
    { tags: ["dc", "comics"], resposta: "a DC Comics foi fundada em 1934. Criou personagens como Superman (1938), Batman (1939), Mulher-Maravilha (1941) e Flash." },
    { tags: ["anime", "o que", "japao"], resposta: "anime é a palavra japonesa para animação. No Ocidente, refere-se à animação japonesa, caracterizada por estilo de arte distinto e narrativas complexas. Estúdios famosos: Studio Ghibli, Toei." },
    { tags: ["ghibli", "studio"], resposta: "o Studio Ghibli é um estúdio de animação japonês fundado em 1985 por Hayao Miyazaki e Isao Takahata. Filmes famosos: A Viagem de Chihiro, Meu Amigo Totoro, Princesa Mononoke." },
    { tags: ["kpop", "o que"], resposta: "K-pop (Korean Pop) é um gênero musical da Coreia do Sul que combina pop, hip-hop, R&B e dança. Grupos famosos: BTS, Blackpink, EXO. Fenômeno global desde os anos 2010." },
    { tags: ["jogo", "vorazes"], resposta: "Jogos Vorazes é uma série de livros de Suzanne Collins (2008-2010), adaptada para filmes com Jennifer Lawrence. Inspirou o gênero distópico para jovens adultos." },
    { tags: ["netflix", "historia"], resposta: "a Netflix foi fundada em 1997 como serviço de aluguel de DVDs por correio. Começou streaming em 2007. Hoje é a maior plataforma de streaming do mundo." },
  ],

  // ===================== ESPORTES EXTRA =====================
  esportesExtra: [
    { tags: ["messi", "futebolista"], resposta: "Lionel Messi é um futebolista argentino, nascido em 1987. Conquistou 8 Bolas de Ouro (recorde) e a Copa do Mundo de 2022 com a Argentina." },
    { tags: ["cristiano", "ronaldo", "futebolista"], resposta: "Cristiano Ronaldo é um futebolista português, nascido em 1985. Conquistou 5 Bolas de Ouro e é o maior artilheiro da história do futebol em jogos oficiais." },
    { tags: ["pele", "futebolista"], resposta: "Pelé (1940-2022) foi um futebolista brasileiro, considerado por muitos o maior de todos os tempos. Único a vencer 3 Copas do Mundo (1958, 1962, 1970). Marcou mais de 1.000 gols." },
    { tags: ["maradona", "futebolista"], resposta: "Diego Maradona (1960-2020) foi um futebolista argentino. Famoso pelo gol 'La Mano de Dios' e pelo gol do século contra a Inglaterra na Copa de 1986." },
    { tags: ["neymar", "futebolista"], resposta: "Neymar Jr é um futebolista brasileiro nascido em 1992. É um dos maiores artilheiros da história da Seleção Brasileira, atrás apenas de Pelé." },
    { tags: ["copa", "mundo", "fifa"], resposta: "a Copa do Mundo da FIFA é o maior evento de futebol, realizada a cada 4 anos desde 1930. O Brasil é o maior campeão com 5 títulos (1958, 1962, 1970, 1994, 2002)." },
    { tags: ["olimpiadas", "jogos", "olimpicos"], resposta: "os Jogos Olímpicos modernos começaram em 1896 em Atenas, idealizados por Pierre de Coubertin. Acontecem a cada 4 anos. O símbolo são 5 anéis representando os continentes." },
    { tags: ["nba", "basquete"], resposta: "a NBA é a principal liga de basquete do mundo, com 30 times dos EUA e Canadá. Michael Jordan, LeBron James e Kobe Bryant são lendas da NBA." },
    { tags: ["michael", "jordan", "basquete"], resposta: "Michael Jordan é considerado o maior jogador de basquete de todos os tempos. Conquistou 6 títulos da NBA com o Chicago Bulls nos anos 90." },
    { tags: ["ufc", "mma", "o que"], resposta: "o UFC (Ultimate Fighting Championship) é a principal organização de MMA (artes marciais mistas) do mundo. Combina boxe, muay thai, jiu-jitsu, wrestling e outras artes." },
    { tags: ["formula", "1", "automobilismo"], resposta: "a Fórmula 1 é a principal categoria do automobilismo mundial, disputada desde 1950. Carros chegam a 370 km/h. Lewis Hamilton tem 7 títulos (empatado com Schumacher)." },
    { tags: ["tenis", "esporte", "grand"], resposta: "os torneios de Grand Slam do tênis são: Aberto da Austrália, Roland Garros, Wimbledon e US Open. Novak Djokovic tem o recorde de 24 títulos de Grand Slam." },
    { tags: ["vôlei", "volei", "esporte"], resposta: "o vôlei foi inventado em 1895 por William G. Morgan nos EUA. A Seleção Brasileira de Vôlei é uma das melhores do mundo, com 3 ouros olímpicos." },
    { tags: ["surfe", "esporte"], resposta: "o surfe é um esporte aquático originário do Havaí, onde era praticado por reis. Tornou-se esporte olímpico em Tóquio 2020. O brasileiro Gabriel Medina é bicampeão mundial." },
    { tags: ["skate", "esporte"], resposta: "o skate nasceu na Califórnia nos anos 50. Tornou-se esporte olímpico em Tóquio 2020. O brasileiro Rayssa Leal ganhou prata aos 13 anos." },
  ],

  // ===================== SAÚDE EXTRA =====================
  saudeExtra: [
    { tags: ["sono", "quantas", "horas"], resposta: "um adulto precisa de 7 a 9 horas de sono por noite. Crianças precisam de 9-12 horas e bebês de 12-17 horas. Dormir bem é essencial para a saúde física e mental." },
    { tags: ["agua", "beber", "litros"], resposta: "recomenda-se beber cerca de 2 litros de água por dia. A necessidade varia com peso, clima e atividade física. O corpo humano é 60% água." },
    { tags: ["exercicio", "minutos", "semana"], resposta: "a OMS recomenda pelo menos 150 minutos de exercício moderado ou 75 minutos de intenso por semana. Pode ser caminhada, corrida, natação ou musculação." },
    { tags: ["diabetes", "o que", "tipos"], resposta: "a diabetes é uma doença onde o açúcar no sangue está alto. Tipo 1: o corpo não produz insulina. Tipo 2: o corpo não usa bem a insulina (mais comum, ligada à obesidade)." },
    { tags: ["pressao", "alta", "hipertensao"], resposta: "a hipertensão (pressão alta) é quando a pressão do sangue nas artérias está cronicamente elevada. É uma 'doença silenciosa' — muitas vezes sem sintomas. Pode causar infarto e AVC." },
    { tags: ["colesterol", "o que"], resposta: "o colesterol é uma gordura no sangue. O LDL ('ruim') entope artérias; o HDL ('bom') ajuda a limpar. Níveis altos de LDL aumentam o risco de doenças cardíacas." },
    { tags: ["vacina", "como", "funciona"], resposta: "as vacinas ensinam o sistema imunológico a reconhecer patógenos sem causar a doença. O corpo cria anticorpos e fica pronto para um ataque real. Salva milhões de vidas por ano." },
    { tags: ["antibiotico", "o que"], resposta: "os antibióticos são medicamentos que matam bactérias ou impedem sua reprodução. Não funcionam contra vírus. O uso excessivo causa resistência bacteriana — um problema grave." },
    { tags: ["estresse", "o que", "saude"], resposta: "o estresse crônico aumenta o risco de doenças cardíacas, obesidade, diabetes e problemas mentais. Pode causar dores de cabeça, insônia e problemas digestivos." },
    { tags: ["depressao", "o que", "sintomas"], resposta: "a depressão é uma doença mental caracterizada por tristeza persistente, perda de interesse e falta de energia. É tratável com terapia e/ou medicação. Não é frescura." },
    { tags: ["ansiedade", "o que", "sintomas"], resposta: "a ansiedade é uma resposta natural do corpo ao perigo, mas quando é excessiva se torna um transtorno. Sintomas: palpitações, sudorese, tensão, preocupação constante." },
    { tags: ["vitamina", "c", "o que"], resposta: "a vitamina C é essencial para o sistema imunológico e produção de colágeno. Encontrada em frutas cítricas, kiwi, morango. O corpo não a produz nem armazena." },
    { tags: ["vitamina", "d", "sol"], resposta: "a vitamina D é produzida pelo corpo quando a pele é exposta ao sol. É importante para a saúde dos ossos e do sistema imunológico." },
    { tags: ["ferro", "anemia", "alimentos"], resposta: "a anemia por falta de ferro é comum, especialmente em mulheres. Sintomas: cansaço, palidez, fraqueza. Fontes de ferro: carne vermelha, feijão, espinafre, lentilha." },
    { tags: ["dormir", "melhor", "dicas"], resposta: "para dormir melhor: evite telas antes de dormir, mantenha horário regular, evite cafeína à tarde, mantenha o quarto escuro e fresco, faça exercício durante o dia." },
  ],

  // ===================== NATUREZA EXTRA =====================
  naturezaExtra: [
    { tags: ["arvore", "mais", "velha"], resposta: "a árvore mais velha do mundo é um pinheiro-bristlecone chamado Matusalém, na Califórnia, com mais de 4.850 anos. A localização exata é secreta para protegê-la." },
    { tags: ["fungo", "maior", "organismo"], resposta: "o maior organismo vivo do mundo é um fungo (Armillaria ostoyae) no Oregon, EUA. Cobre 9,6 km² e tem entre 2.400 e 8.650 anos." },
    { tags: ["recife", "coral", "barreira"], resposta: "a Grande Barreira de Coral é a maior estrutura viva do mundo, com 2.300 km na costa da Austrália. Pode ser vista do espaço." },
    { tags: ["amazonia", "arvores", "especies"], resposta: "a Amazônia tem mais de 40.000 espécies de plantas, 1.300 de aves e 2,5 milhões de espécies de insetos. Uma única árvore pode abrigar mais espécies de formigas que toda a Grã-Bretanha." },
    { tags: ["capivara", "maior", "roedor"], resposta: "a capivara é o maior roedor do mundo, pesando até 65 kg. É nativa da América do Sul e é um animal semiaquático muito sociável." },
    { tags: ["baleia", "azul", "maior"], resposta: "a baleia azul é o maior animal que já existiu — maior que qualquer dinossauro. Pode chegar a 30 metros e 200 toneladas. Seu coração é do tamanho de um carro." },
    { tags: ["polvo", "cerebros", "coracao"], resposta: "os polvos têm 3 corações e sangue azul. Dois corações bombeiam sangue para as guelras e um para o resto do corpo. Têm 9 cérebros — um central e 8 em cada tentáculo." },
    { tags: ["morcego", "unico", "voo"], resposta: "os morcegos são os únicos mamíferos capazes de voo verdadeiro. Usam ecolocalização para caçar insetos no escuro — emitem sons e ouvem o eco." },
    { tags: ["borboleta", "metamorfose"], resposta: "as borboletas passam por metamorfose completa: ovo → lagarta → crisálida → borboleta. A borboleta-monarca migra até 4.000 km do Canadá ao México." },
    { tags: ["abelha", "polinizacao"], resposta: "as abelhas são responsáveis pela polinização de cerca de 75% das plantas que produzimos para alimentação. Sem elas, haveria escassez de comida." },
    { tags: ["coruja", "noturna"], resposta: "as corujas são aves de rapina noturnas. Podem girar a cabeça 270 graus. Têm visão noturna excepcional e audição super apurada para caçar no escuro." },
    { tags: ["tubarao", "pré", "historico"], resposta: "os tubarões existem há mais de 400 milhões de anos — antes dos dinossauros. Sobreviveram a 5 extinções em massa. O maior é o tubarão-baleia, pacífico e filter-feeder." },
    { tags: ["golfinho", "inteligente"], resposta: "os golfinhos são uns dos animais mais inteligentes. Têm nomes (assobios únicos), usam ferramentas e se reconhecem no espelho. Dormem com meio cérebro de cada vez." },
    { tags: ["elefante", "memoria"], resposta: "os elefantes têm uma memória incrível e são muito sociais. Reconhecem indivíduos mesmo após anos de separação. As fêmeas lideram os rebanhos (sociedade matriarcal)." },
  ],

  // ===================== CURIOSIDADES GERAIS =====================
  curiosidadesGerais: [
    { tags: ["abacaxi", "fruta", "absorve"], resposta: "o abacaxi contém uma enzima (bromelina) que digere proteínas. É por isso que sua boca 'arde' quando você come abacaxi — a fruta está digerindo você de volta!" },
    { tags: ["casca", "banana", "escorrega"], resposta: "a clássica casca de banana é realmente escorregadia! As fibras da casca liberam um gel quando esmagadas, reduzindo a fricção. Mas é mais comum em desenhos animados que na vida real." },
    { tags: ["mel", "estraga"], resposta: "o mel é um dos poucos alimentos que nunca estraga. Potes de mel de milhares de anos atrás ainda são comestíveis. A acidez, baixa umidade e enzimas das abelhas criam um ambiente inóspito para bactérias." },
    { tags: ["chocolate", "toxico", "caes"], resposta: "o chocolate é tóxico para cães e gatos porque contém teobromina, que eles não conseguem metabolizar. Causa taquicardia, tremores e pode ser fatal." },
    { tags: ["piscar", "olhos", "vezes"], resposta: "uma pessoa pisca em média 15 a 20 vezes por minuto — cerca de 20.000 vezes por dia! Cada piscada dura cerca de 0,1 segundos." },
    { tags: ["coracao", "tamanho", "mao"], resposta: "o coração humano é aproximadamente do tamanho de uma mão fechada e pesa entre 250 e 350 gramas." },
    { tags: ["estomago", "reveste"], resposta: "o revestimento do estômago se renova a cada 3 a 4 dias. Sem isso, o ácido estomacal (pH 1-2) digeriria o próprio estômago." },
    { tags: ["dna", "comprido"], resposta: "se você desenrolasse todo o DNA de uma célula, teria 2 metros. Com todas as células do corpo, daria para ir e voltar ao Sol 600 vezes!" },
    { tags: ["ossos", "corpo", "quantos"], resposta: "o corpo humano adulto tem 206 ossos. Bebês nascem com cerca de 300, mas muitos se fundem durante o crescimento." },
    { tags: ["musculo", "mais", "forte"], resposta: "o músculo mais forte do corpo em proporção ao tamanho é o masseter (mandíbula). Pode gerar uma força de até 90 kg ao morder." },
    { tags: ["figado", "regenera"], resposta: "o fígado é o único órgão humano que pode se regenerar. Pode crescer de volta mesmo se 75% for removido." },
    { tags: ["pele", "maior", "orgao"], resposta: "a pele é o maior órgão do corpo humano. Um adulto tem cerca de 2 metros quadrados de pele, que pesa 4-5 kg." },
    { tags: ["olhos", "distingue", "cores"], resposta: "o olho humano consegue distinguir cerca de 1 milhão de cores. As mulheres, em média, distinguem mais tons que os homens." },
    { tags: ["sabor", "lingua", "gostos"], resposta: "existem 5 gostos básicos: doce, salgado, azedo, amargo e umami. O umami é o sabor de alimentos protéicos como queijo e tomate." },
    { tags: ["espirro", "velocidade"], resposta: "um espirro pode sair a mais de 160 km/h e espalhar bactérias a até 8 metros de distância." },
    { tags: ["cabelo", "cresce"], resposta: "o cabelo humano cresce cerca de 1 a 1,5 cm por mês. Um cabelo saudável pode durar até 6 anos antes de cair naturalmente." },
    { tags: ["memoria", "cerebro", "capacidade"], resposta: "a memória humana não tem capacidade definida — o cérebro pode armazenar aproximadamente 2,5 petabytes de informação (2,5 milhões de gigabytes)." },
    { tags: ["sonhos", "noite", "quantos"], resposta: "uma pessoa tem em média 3 a 7 sonhos por noite, mas a maioria é esquecida em poucos minutos após acordar." },
    { tags: ["risada", "calorias", "gasta"], resposta: "rir queima cerca de 40 calorias por 15 minutos. Não é muito, mas rir faz bem pra saúde de várias formas!" },
    { tags: ["formiga", "nao", "dorme"], resposta: "as formigas não dormem como nós. Elas fazem 'cochilos' curtos — cerca de 250 por dia, cada um durando cerca de 1 minuto. As formigas operárias vivem apenas 1-2 anos." },
    { tags: ["pinguim", "salta"], resposta: "os pinguins-imperador podem mergulhar a 500 metros de profundidade e ficar submersos por 20 minutos. Sobrevivem a temperaturas de -60°C." },
    { tags: ["camaleao", "cor", "muda"], resposta: "os camaleões não mudam de cor para se camuflar — mudam para se comunicar e regular a temperatura. A cor reflete humor, dominância e prontidão para acasalar." },
    { tags: ["waffle", "origem"], resposta: "a palavra 'waffle' vem do holandês 'wafel', que significa 'favo de mel'. Os waffles existem desde a Idade Média na Europa." },
  ],

  // ===================== PAÍSES E CAPITAIS =====================
  paises: [
    { tags: ["brasil", "capital", "brasilia"], resposta: "a capital do Brasil é Brasília, desde 1960. Antes eram Salvador e depois Rio de Janeiro. Brasília foi construída em apenas 41 meses." },
    { tags: ["portugal", "capital", "lisboa"], resposta: "a capital de Portugal é Lisboa. É uma das cidades mais antigas da Europa, mais antiga que Roma. Fica na foz do rio Tejo." },
    { tags: ["estados", "unidos", "capital", "washington"], resposta: "a capital dos Estados Unidos é Washington D.C. (Distrito de Colúmbia). Não é o mesmo que o Estado de Washington, que fica no noroeste do país." },
    { tags: ["franca", "capital", "paris"], resposta: "a capital da França é Paris. Conhecida como 'Cidade Luz'. A Torre Eiffel foi construída para a Exposição Universal de 1889." },
    { tags: ["japao", "capital", "toquio"], resposta: "a capital do Japão é Tóquio. É a maior área metropolitana do mundo, com mais de 37 milhões de habitantes. Significa 'capital do leste'." },
    { tags: ["china", "capital", "pequim"], resposta: "a capital da China é Pequim (Beijing). A Cidade Proibida, no centro de Pequim, foi o palácio imperial por 500 anos." },
    { tags: ["russia", "capital", "moscou"], resposta: "a capital da Rússia é Moscou. É a maior cidade da Europa, com mais de 12 milhões de habitantes. A Praça Vermelha e o Kremlin são pontos famosos." },
    { tags: ["egito", "capital", "cairo"], resposta: "a capital do Egito é Cairo. Fica próxima às pirâmides de Gizé. É a maior cidade do mundo árabe e da África." },
    { tags: ["italia", "capital", "roma"], resposta: "a capital da Itália é Roma. Conhecida como 'Cidade Eterna'. O Vaticano, sede da Igreja Católica, fica dentro de Roma." },
    { tags: ["espanha", "capital", "madri"], resposta: "a capital da Espanha é Madri. É a cidade mais alta da Europa (667 metros de altitude). O Real Madrid é o time de futebol mais laureado da Europa." },
    { tags: ["alemanha", "capital", "berlim"], resposta: "a capital da Alemanha é Berlim. Foi dividida por um muro de 1961 a 1989. Hoje é uma das cidades mais culturais e vibrantes da Europa." },
    { tags: ["india", "capital", "delhi"], resposta: "a capital da Índia é Nova Deli. A Índia é o país mais populoso do mundo (mais de 1,4 bilhão), superando a China em 2023." },
    { tags: ["australia", "capital", "canberra"], resposta: "a capital da Austrália é Canberra, não Sydney como muitos pensam. Canberra foi planejada e construída especialmente para ser a capital." },
    { tags: ["canada", "capital", "ottawa"], resposta: "a capital do Canadá é Ottawa, não Toronto. O Canadá é o segundo maior país do mundo em área, depois da Rússia." },
    { tags: ["mocambique", "capital", "maputo"], resposta: "a capital de Moçambique é Maputo. O país fica na costa leste da África e tem como língua oficial o português." },
    { tags: ["angola", "capital", "luanda"], resposta: "a capital de Angola é Luanda. Angola é o segundo maior país de língua portuguesa em área, depois do Brasil." },
    { tags: ["coreia", "sul", "capital", "seul"], resposta: "a capital da Coreia do Sul é Seul. É uma das cidades mais tecnológicas do mundo. A banda BTS é de Seul." },
    { tags: ["argentina", "capital", "buenos"], resposta: "a capital da Argentina é Buenos Aires. Conhecida como 'Paris da América do Sul' pela arquitetura e cultura. O tango nasceu lá." },
    { tags: ["mexico", "capital", "cidade"], resposta: "a capital do México é a Cidade do México. Foi construída sobre as ruínas de Tenochtitlán, capital asteca. É uma das maiores cidades do mundo." },
    { tags: ["suiça", "capital", "berna"], resposta: "a capital da Suíça é Berna, não Zurique como muitos pensam. A Suíça é famosa por chocolate, relógios, bancos e neutralidade política." },
  ],

  // ===================== COMIDA E CULINÁRIA =====================
  culinaria: [
    { tags: ["feijoada", "prato", "brasileiro"], resposta: "a feijoada é considerada o prato nacional do Brasil. Feita com feijão-preto e carnes de porco. Servida com arroz, farofa, couve e laranja." },
    { tags: ["pizza", "origem", "italia"], resposta: "a pizza nasceu em Nápoles, Itália, no século XVIII. A pizza Margherita tem as cores da bandeira italiana: vermelho (molho), branco (mozarela) e verde (manjericão)." },
    { tags: ["sushi", "origem", "japao"], resposta: "o sushi foi criado no Japão como forma de conservar peixe em arroz fermentado. O sushi moderno (peixe cru sobre arroz) foi inventado no século XIX em Tóquio." },
    { tags: ["chocolate", "origem", "azteca"], resposta: "o chocolate vem do cacau, cultivado pelos astecas e maias. A palavra 'chocolate' vem do náhuatl 'xocolātl'. Foi levado para a Europa pelos espanhóis no século XVI." },
    { tags: ["cafe", "origem", "etopia"], resposta: "o café foi descoberto na Etiópia. A lenda diz que um pastor notou que suas cabras ficavam energéticas após comer as bagas de café." },
    { tags: ["acai", "fruta", "amazonia"], resposta: "o açaí é uma fruta da Amazônia, tradicionalmente consumida como alimento básico pelos ribeirinhos. Fica famoso no Brasil como sobremesa, misturado com granola e banana." },
    { tags: ["pao", "frances", "historia"], resposta: "a pão francês (ou pão de sal) é um dos símbolos do Brasil. Apesar do nome, não existe na França — é uma adaptação brasileira do pão europeu." },
    { tags: ["hamburguer", "origem", "alemanha"], resposta: "o hambúrguer tem origem na cidade de Hamburgo, Alemaos. Mas o hambúrguer moderno (no pão) se popularizou nos EUA no início do século XX." },
    { tags: ["churrasco", "brasil", "gaucho"], resposta: "o churrasco é uma tradição gaúcha que se espalhou pelo Brasil. A carne é assada em espetos sobre fogo, temperada apenas com sal grosco." },
    { tags: ["macarrao", "origem", "china"], resposta: "a origem do macarrão é disputada entre Itália e China. Os chineses já faziam massas há 4.000 anos. Marco Polo pode ter trazido a ideia da China para a Itália." },
    { tags: ["acucar", "origem", "india"], resposta: "o açúcar foi descoberto na Índia há milhares de anos. A palavra 'açúcar' vem do sânscrito 'sharkara'. Foi levado para o Oriente Médio e depois para a Europa." },
    { tags: ["queijo", "tipos"], resposta: "existem mais de 1.800 tipos de queijo no mundo. Os mais consumidos no Brasil são muçarela, prato e minas. O queijo mais caro do mundo vem de leite de jumenta." },
  ],

  // ===================== MITOLOGIA =====================
  mitologia: [
    { tags: ["mitologia", "grega", "o que"], resposta: "a mitologia grega é o conjunto de mitos e lendas dos deuses gregos. Os 12 deuses do Olimpo: Zeus, Hera, Poseidon, Atena, Apolo, Ártemis, Afrodite, Hermes, Ares, Hefesto, Deméter e Dioniso." },
    { tags: ["zeus", "deus", "grego"], resposta: "Zeus era o rei dos deuses gregos, deus do trovão e do céu. Filho de Cronos e Réia. Seus símbolos eram o raio, a águia e o carvalho." },
    { tags: ["poseidon", "deus", "mares"], resposta: "Poseidon era o deus grego dos mares, terremotos e cavalos. Irmão de Zeus. Carregava um tridente que podia causar tempestades e terremotos." },
    { tags: ["atenas", "deusa", "sabedoria"], resposta: "Atena era a deusa grega da sabedoria, estratégia e artes. A cidade de Atenas foi nomeada em sua homenagem após um concurso com Poseidon." },
    { tags: ["hercules", "heroi", "trabalhos"], resposta: "Hércules (Héracles) era um herói grego, filho de Zeus com uma mortal. Famoso pelos 12 trabalhos — provações impostas pelo rei Euristeu para expiar sua culpa." },
    { tags: ["odin", "deus", "nordico"], resposta: "Odin era o deus supremo da mitologia nórdica. Deus da guerra, sabedoria e poesia. Sacrificou um olho em troca de sabedoria e podia transformar-se em corvo." },
    { tags: ["thor", "deus", "nordico", "martelo"], resposta: "Thor era o deus nórdico do trovão. Empunhava o martelo Mjölnir, que podia destruir montanhas e voltava à sua mão como um bumerangue." },
    { tags: ["loki", "deus", "nordico"], resposta: "Loki era o deus nórdico da trapaça e do caos. Era metamorfo e podia mudar de forma. Apesar de ser dos Aesir, frequentemente causava problemas." },
    { tags: ["isis", "deusa", "egipcia"], resposta: "Ísis era uma das deusas mais importantes do Egito antigo. Deusa da magia, maternidade e fertilidade. Esposa e irmã de Osíris, mãe de Hórus." },
    { tags: ["ra", "deus", "sol", "egipcio"], resposta: "Rá era o deus do sol no Egito antigo. Acreditavam que ele viajava pelo céu de dia e pelo submundo de noite, lutando contra a serpente Apófis." },
    { tags: ["anubis", "deus", "egipcio", "morte"], resposta: "Anúbis era o deus egípcio da morte e mumificação. Tinha cabeça de chacal. Pesava o coração dos mortos contra uma pena para julgar suas vidas." },
  ],

  // ===================== ECONOMIA =====================
  economia: [
    { tags: ["inflacao", "o que"], resposta: "a inflação é o aumento geral dos preços ao longo do tempo. Diminui o poder de compra do dinheiro. Uma inflação baixa (2-3% ao ano) é considerada saudável." },
    { tags: ["juros", "compostos", "o que"], resposta: "os juros compostos são quando você ganha juros sobre os juros. Einstein chamou de 'a oitava maravilha do mundo'. Quanto mais tempo, mais o dinheiro cresce." },
    { tags: ["pib", "produto", "interno"], resposta: "o PIB (Produto Interno Bruto) é a soma de todos os bens e serviços produzidos por um país. É a medida principal do tamanho da economia." },
    { tags: ["reserva", "emergencia", "o que"], resposta: "uma reserva de emergência é dinheiro guardado para imprevistos. Recomenda-se 6 meses de despesas. Deve estar em um investimento seguro e líquido (fácil de sacar)." },
    { tags: ["acoes", "bolsa", "o que"], resposta: "as ações são frações de uma empresa negociadas na bolsa de valores. Ao comprar uma ação, você se torna sócio da empresa. O preço varia conforme oferta e demanda." },
    { tags: ["dolar", "moeda", "reserva"], resposta: "o dólar americano é a principal moeda de reserva do mundo. Cerca de 60% das reservas internacionais são em dólares. O euro é o segundo." },
    { tags: ["criptomoeda", "o que"], resposta: "as criptomoedas são moedas digitais descentralizadas baseadas em blockchain. A primeira e mais famosa é o Bitcoin (2009). Não são controladas por governos ou bancos." },
    { tags: ["orçamento", "pessoal", "o que"], resposta: "um orçamento pessoal é o controle de suas receitas e despesas. A regra 50-30-20: 50% necessidades, 30% desejos, 20% poupança/investimento." },
  ],

  // ===================== PSICOLOGIA =====================
  psicologia: [
    { tags: ["freud", "psicanalise"], resposta: "Sigmund Freud (1856-1939) foi o criador da psicanálise. Dividiu a mente em consciente, pré-consciente e inconsciente. Desenvolveu a ideia de id, ego e superego." },
    { tags: ["efeito", "placebo", "o que"], resposta: "o efeito placebo é quando um tratamento falso (como uma pílula de açúcar) melhora os sintomas porque o paciente acredita que está sendo tratado. Mostra o poder da mente." },
    { tags: ["cognitivo", "comportamental", "terapia"], resposta: "a terapia cognitivo-comportamental (TCC) é uma das mais eficazes. Foca em identificar e mudar padrões de pensamento negativos que afetam comportamentos e emoções." },
    { tags: ["personalidade", "tipos"], resposta: "existem vários modelos de personalidade. O mais conhecido é o MBTI (16 tipos). A psicologia moderna prefere o modelo dos 5 Grandes Fatores: abertura, conscienciosidade, extroversão, agradabilidade e neuroticismo." },
    { tags: ["trauma", "psicologia"], resposta: "um trauma é uma resposta emocional a um evento terrível. Pode causar TEPT (transtorno de estresse pós-traumático): flashbacks, pesadelos, ansiedade. É tratável com terapia." },
    { tags: ["inteligencia", "emocional"], resposta: "a inteligência emocional é a capacidade de reconhecer, entender e gerenciar suas próprias emoções e as dos outros. Daniel Goleman popularizou o conceito em 1995." },
    { tags: ["vieses", "cognitivos", "o que"], resposta: "os vieses cognitivos são atalhos mentais que causam erros de raciocínio. Exemplos: viés de confirmação (buscar só informações que confirmam o que já acreditamos), efeito Dunning-Kruger." },
  ],

  // ===================== DIREITOS HUMANOS E SOCIEDADE =====================
  sociedade: [
    { tags: ["direitos", "humanos", "o que"], resposta: "os direitos humanos são direitos inerentes a toda pessoa, independente de raça, gênero, nacionalidade ou religião. Foram formalizados na Declaração Universal de 1948." },
    { tags: ["democracia", "o que"], resposta: "a democracia é um sistema de governo onde o poder vem do povo. A palavra vem do grego 'demos' (povo) + 'kratos' (poder). Pode ser direta ou representativa." },
    { tags: ["constituicao", "o que"], resposta: "a Constituição é a lei suprema de um país. A Constituição Brasileira de 1988 é chamada de 'Constituição Cidadã' por ampliar direitos sociais." },
    { tags: ["globalizacao", "o que"], resposta: "a globalização é o processo de integração entre os países — comércio, cultura, tecnologia e comunicação em escala mundial. Traz benefícios mas também desigualdade." },
    { tags: ["mudancas", "climaticas", "o que"], resposta: "as mudanças climáticas são alterações no clima causadas principalmente pela queima de combustíveis fósseis. Causam aumento da temperatura, eventos extremos e perda de biodiversidade." },
    { tags: ["sustentabilidade", "o que"], resposta: "a sustentabilidade é atender às necessidades do presente sem comprometer as futuras gerações. Envolve equilíbrio entre desenvolvimento econômico, social e ambiental." },
  ],
};

// Tags genéricas que não devem contar como match
const TAGS_GENERICAS = new Set([
  "o", "que", "quem", "como", "onde", "quando", "qual", "sobre", "de", "do",
  "da", "dos", "das", "e", "ou", "para", "por", "com", "sem", "em", "no",
  "na", "nos", "nas", "um", "uma", "uns", "umas", "a", "os", "as",
  "miku", "kok", "eh", "voce", "vc", "seu", "sua", "teu", "tua",
  "meu", "minha", "nosso", "nossa", "se", "muito", "mais", "menos",
  "so", "ja", "ainda", "tambem", "mas", "porem", "me", "da", "um",
  "pra", "pro", "nas", "pelos", "pelas", "d", "a", "o",
]);

// Função para buscar conhecimento por palavras-chave
function buscarConhecimento(tokens, limite = 0.3) {
  if (!tokens || tokens.length < 2) return null;

  // Filtra tokens genéricos — só palavras distintivas contam
  const tokensRelevantes = tokens.filter((t) => t.length > 2 && !TAGS_GENERICAS.has(t));
  if (tokensRelevantes.length === 0) return null;

  let melhorEntrada = null;
  let melhorScore = 0;

  for (const [categoria, entradas] of Object.entries(CONHECIMENTO)) {
    for (const entrada of entradas) {
      const tags = entrada.tags.filter((t) => t.length > 2 && !TAGS_GENERICAS.has(t.toLowerCase()));
      if (tags.length === 0) continue;

      let matches = 0;
      for (const token of tokensRelevantes) {
        for (const tag of tags) {
          const tagLower = tag.toLowerCase();
          // Match exato ou prefixo (token deve ter pelo menos 4 chars para match parcial)
          if (token === tagLower) {
            matches++;
            break;
          } else if (token.length >= 4 && tagLower.length >= 4 && (tagLower.startsWith(token) || token.startsWith(tagLower))) {
            matches++;
            break;
          }
        }
      }
      const score = matches / Math.max(tokensRelevantes.length, 1);
      if (score > melhorScore) {
        melhorScore = score;
        melhorEntrada = entrada;
      }
    }
  }

  if (melhorEntrada && melhorScore >= limite) {
    return melhorEntrada.resposta;
  }
  return null;
}

module.exports = { CONHECIMENTO, buscarConhecimento };
