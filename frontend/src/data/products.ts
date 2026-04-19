export type ProductCategory = "marmitas" | "fitness" | "carnes" | "bebidas" | "sobremesas" | "pastel";

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  desc: string;
  price: number;
  tag?: string;
  image: string;
}

export const initialProducts: Product[] = [
  // MARMITAS (7)
  {
    id: "marmita-1", category: "marmitas", name: "Marmita P",
    desc: "Arroz, feijão, 1 carne à escolha, macarronada, e salada separada. Ideal para o dia a dia.", price: 20.0, tag: "Mais Vendida",
    image: "https://readdy.ai/api/search-image?query=brazilian+marmita+small+portion+rice+beans+meat+salad+overhead&width=600&height=600&seq=1&orientation=squarish",
  },
  {
    id: "marmita-2", category: "marmitas", name: "Marmita M",
    desc: "A queridinha da galera. Porção generosa com 2 misturas à sua escolha.", price: 28.0, tag: "Favorita",
    image: "https://readdy.ai/api/search-image?query=brazilian+marmita+two+meats+generous+portion+appetizing+lighting&width=600&height=600&seq=2&orientation=squarish",
  },
  {
    id: "marmita-3", category: "marmitas", name: "Marmita G",
    desc: "Para quem tem muita fome. 3 opções de carnes e acompanhamentos caprichados.", price: 35.0, tag: "Tamanho Família",
    image: "https://readdy.ai/api/search-image?query=large+brazilian+marmita+three+meats+family+size+abundant+overhead&width=600&height=600&seq=3&orientation=squarish",
  },
  {
    id: "marmita-4", category: "marmitas", name: "Feijoada Completa",
    desc: "Feijoada rica em carnes servida com arroz branco, couve refogada, farofa e laranja.", price: 30.0, tag: "Quarta e Sábado",
    image: "https://readdy.ai/api/search-image?query=brazilian+feijoada+complete+meal+rice+farofa+greens&width=600&height=600&seq=4&orientation=squarish",
  },
  {
    id: "marmita-5", category: "marmitas", name: "Bife à Parmegiana",
    desc: "Bife empanado coberto com queijo e molho, arroz e batata frita.", price: 32.0, tag: "Clássico",
    image: "https://readdy.ai/api/search-image?query=beef+parmigiana+rice+fries+brazilian+plate&width=600&height=600&seq=5&orientation=squarish",
  },
  {
    id: "marmita-6", category: "marmitas", name: "Strogonoff de Frango",
    desc: "Strogonoff cremoso de frango, acompanhado de arroz soltinho e batata palha.", price: 26.0,
    image: "https://readdy.ai/api/search-image?query=chicken+stroganoff+rice+potato+sticks+overhead&width=600&height=600&seq=6&orientation=squarish",
  },
  {
    id: "marmita-7", category: "marmitas", name: "Peixe Frito Escabeche",
    desc: "Filé de peixe frito com molho escabeche, arroz, pirão e salada.", price: 34.0, tag: "Sexta-feira",
    image: "https://readdy.ai/api/search-image?query=fried+fish+fillet+rice+vegetables+brazilian+meal&width=600&height=600&seq=7&orientation=squarish",
  },

  // FITNESS (7)
  {
    id: "fit-1", category: "fitness", name: "Frango com Batata Doce",
    desc: "Filé de peito de frango grelhado e purê rústico de batata doce.", price: 28.0, tag: "Foco",
    image: "https://readdy.ai/api/search-image?query=grilled+chicken+breast+sweet+potato+mash+healthy+plate&width=600&height=600&seq=8&orientation=squarish",
  },
  {
    id: "fit-2", category: "fitness", name: "Salmão Grelhado Fit",
    desc: "Posta de salmão com crosta de gergelim acompanhada de legumes no vapor.", price: 42.0, tag: "Premium",
    image: "https://readdy.ai/api/search-image?query=grilled+salmon+sesame+steamed+vegetables+fitness+meal&width=600&height=600&seq=9&orientation=squarish",
  },
  {
    id: "fit-3", category: "fitness", name: "Escondidinho Low Carb",
    desc: "Escondidinho de frango desfiado com purê de abóbora cabotiá.", price: 29.0,
    image: "https://readdy.ai/api/search-image?query=low+carb+pumpkin+chicken+pie+escondidinho+healthy&width=600&height=600&seq=10&orientation=squarish",
  },
  {
    id: "fit-4", category: "fitness", name: "Omelete Proteico",
    desc: "Omelete de 3 ovos recheado com peito de peru e queijo branco, mix de folhas.", price: 22.0,
    image: "https://readdy.ai/api/search-image?query=healthy+omelette+salad+protein+plate&width=600&height=600&seq=11&orientation=squarish",
  },
  {
    id: "fit-5", category: "fitness", name: "Salada Completa",
    desc: "Alface, rúcula, tomate cereja, cenoura ralada, ovo de codorna e tiras de frango grelhado.", price: 25.0,
    image: "https://readdy.ai/api/search-image?query=chicken+salad+bowl+fresh+vegetables+healthy+lunch&width=600&height=600&seq=12&orientation=squarish",
  },
  {
    id: "fit-6", category: "fitness", name: "Panqueca Fit",
    desc: "Panqueca com massa de aveia recheada de carne moída magra e molho de tomate caseiro.", price: 26.0,
    image: "https://readdy.ai/api/search-image?query=healthy+oat+pancakes+ground+beef+tomato+sauce&width=600&height=600&seq=13&orientation=squarish",
  },
  {
    id: "fit-7", category: "fitness", name: "Wrap Frango Light",
    desc: "Massa integral fininha enrolada com frango desfiado, creme de ricota e cenoura.", price: 24.0,
    image: "https://readdy.ai/api/search-image?query=healthy+chicken+wrap+whole+wheat+fresh&width=600&height=600&seq=14&orientation=squarish",
  },

  // CARNES EM KILO (7)
  {
    id: "carne-1", category: "carnes", name: "Picanha Grill",
    desc: "Picanha assada na brasa com capa de gordura dourada no ponto perfeito.", price: 90.0, tag: "Mais Pedida",
    image: "https://readdy.ai/api/search-image?query=picanha+bbq+grilled+juicy+meat+board&width=600&height=600&seq=15&orientation=squarish",
  },
  {
    id: "carne-2", category: "carnes", name: "Fraldinha na Mostarda",
    desc: "Fraldinha suculenta assada lentamente com molho de mostarda e mel.", price: 75.0,
    image: "https://readdy.ai/api/search-image?query=grilled+flank+steak+mustard+sauce+bbq&width=600&height=600&seq=16&orientation=squarish",
  },
  {
    id: "carne-3", category: "carnes", name: "Cupim Casqueirado",
    desc: "Cupim que desmancha na boca servido em lascas assadas no carvão.", price: 80.0,
    image: "https://readdy.ai/api/search-image?query=brazilian+hump+steak+cupim+bbq+sliced&width=600&height=600&seq=17&orientation=squarish",
  },
  {
    id: "carne-4", category: "carnes", name: "Linguiça Toscana",
    desc: "Linguiça toscana artesanal perfeitamente grelhada ao estilo churrascaria.", price: 45.0,
    image: "https://readdy.ai/api/search-image?query=grilled+sausage+bbq+plate&width=600&height=600&seq=18&orientation=squarish",
  },
  {
    id: "carne-5", category: "carnes", name: "Costela no Bafo",
    desc: "Costela bovina assada por 8 horas até o osso se soltar facilmente.", price: 65.0, tag: "Especial",
    image: "https://readdy.ai/api/search-image?query=beef+ribs+slow+cooked+bbq+meat&width=600&height=600&seq=19&orientation=squarish",
  },
  {
    id: "carne-6", category: "carnes", name: "Maminha na Manteiga",
    desc: "Maminha assada recheada ou banhada na manteiga de alho deliciosa.", price: 85.0,
    image: "https://readdy.ai/api/search-image?query=grilled+maminha+beef+butter+garlic&width=600&height=600&seq=20&orientation=squarish",
  },
  {
    id: "carne-7", category: "carnes", name: "Frango Desossado",
    desc: "Frango inteiro desossado crocante temperado com ervas especiais.", price: 40.0,
    image: "https://readdy.ai/api/search-image?query=grilled+boneless+chicken+bbq+herbs&width=600&height=600&seq=21&orientation=squarish",
  },

  // BEBIDAS (7)
  {
    id: "bebida-1", category: "bebidas", name: "Refrigerante Lata",
    desc: "Opções: Coca-Cola, Guaraná, Fanta (Lata 350ml). Bem gelada.", price: 6.0,
    image: "https://readdy.ai/api/search-image?query=cold+soda+cans+ice+drops+refreshing&width=600&height=600&seq=22&orientation=squarish",
  },
  {
    id: "bebida-2", category: "bebidas", name: "Guaraná 2L",
    desc: "Para a família toda. Guaraná Antarctica 2 Litros.", price: 14.0,
    image: "https://readdy.ai/api/search-image?query=large+bottle+guarana+soda+brazil&width=600&height=600&seq=23&orientation=squarish",
  },
  {
    id: "bebida-3", category: "bebidas", name: "Suco Natural de Laranja",
    desc: "Suco espremido na hora, copo de 500ml. Sem adição de açúcar.", price: 9.0, tag: "Natural",
    image: "https://readdy.ai/api/search-image?query=fresh+orange+juice+glass+ice&width=600&height=600&seq=24&orientation=squarish",
  },
  {
    id: "bebida-4", category: "bebidas", name: "Água Mineral s/ Gás",
    desc: "Garrafa de 500ml, purificada e gelada.", price: 3.5,
    image: "https://readdy.ai/api/search-image?query=bottle+of+mineral+water+pure+clean&width=600&height=600&seq=25&orientation=squarish",
  },
  {
    id: "bebida-5", category: "bebidas", name: "Água Mineral c/ Gás",
    desc: "Garrafa de 500ml de água com gás.", price: 4.0,
    image: "https://readdy.ai/api/search-image?query=sparkling+water+bottle+bubbles&width=600&height=600&seq=26&orientation=squarish",
  },
  {
    id: "bebida-6", category: "bebidas", name: "Suco de Limão Suíço",
    desc: "Limonada suíça cremosa com um toque de adoçante ou açúcar (500ml).", price: 10.0,
    image: "https://readdy.ai/api/search-image?query=creamy+lemonade+glass+mint+fresh&width=600&height=600&seq=27&orientation=squarish",
  },
  {
    id: "bebida-7", category: "bebidas", name: "Cerveja Long Neck",
    desc: "Heineken, Stella ou Budweiser (330ml), super gelada.", price: 12.0, tag: "+18",
    image: "https://readdy.ai/api/search-image?query=cold+beer+bottle+condensation+bar&width=600&height=600&seq=28&orientation=squarish",
  },

  // SOBREMESAS (7)
  {
    id: "sobre-1", category: "sobremesas", name: "Pudim de Leite Condensado",
    desc: "Fatia generosa de pudim cremoso sem furinhos, com calda de caramelo intenso.", price: 12.0, tag: "Clássica",
    image: "https://readdy.ai/api/search-image?query=brazilian+pudim+flan+slice+caramel+sauce&width=600&height=600&seq=29&orientation=squarish",
  },
  {
    id: "sobre-2", category: "sobremesas", name: "Mousse de Maracujá",
    desc: "Mousse leve e aerada com calda concentrada e sementes de maracujá por cima.", price: 10.0,
    image: "https://readdy.ai/api/search-image?query=passion+fruit+mousse+dessert+cup+fresh&width=600&height=600&seq=30&orientation=squarish",
  },
  {
    id: "sobre-3", category: "sobremesas", name: "Bolo no Pote Ninho c/ Nutella",
    desc: "Camadas de massa fofinha com creme de Leite Ninho e Nutella original.", price: 15.0,
    image: "https://readdy.ai/api/search-image?query=cake+in+a+jar+chocolate+cream+dessert&width=600&height=600&seq=31&orientation=squarish",
  },
  {
    id: "sobre-4", category: "sobremesas", name: "Torta de Limão",
    desc: "Fatia de torta de limão com base crocante, creme azedinho e merengue tostado.", price: 14.0,
    image: "https://readdy.ai/api/search-image?query=lemon+tart+slice+merengue+dessert&width=600&height=600&seq=32&orientation=squarish",
  },
  {
    id: "sobre-5", category: "sobremesas", name: "Petit Gateau",
    desc: "Bolinho de chocolate com recheio derretido (não acompanha sorvete).", price: 16.0,
    image: "https://readdy.ai/api/search-image?query=petit+gateau+chocolate+molten+cake&width=600&height=600&seq=33&orientation=squarish",
  },
  {
    id: "sobre-6", category: "sobremesas", name: "Brigadeiro Tradicional",
    desc: "Unidade grande de brigadeiro gourmet feito com puro chocolate belga.", price: 5.0,
    image: "https://readdy.ai/api/search-image?query=gourmet+brigadeiro+chocolate+truffle+brazil&width=600&height=600&seq=34&orientation=squarish",
  },
  {
    id: "sobre-7", category: "sobremesas", name: "Açaí no Copão 500ml",
    desc: "Açaí puro montado em camadas com leite condensado, leite em pó e morangos.", price: 22.0,
    image: "https://readdy.ai/api/search-image?query=acai+bowl+cup+strawberries+condensed+milk&width=600&height=600&seq=35&orientation=squarish",
  },

  // PASTEL (7)
  {
    id: "pastel-1", category: "pastel", name: "Pastel Especial de Carne",
    desc: "Massa sequinha recheada com carne moída bem temperada, azeitona e ovo.", price: 12.0,
    image: "https://readdy.ai/api/search-image?query=fried+pastel+brazilian+meat+filling+crispy&width=600&height=600&seq=36&orientation=squarish",
  },
  {
    id: "pastel-2", category: "pastel", name: "Pastel de Queijo",
    desc: "Massa crocante com muito queijo mussarela derretido.", price: 10.0,
    image: "https://readdy.ai/api/search-image?query=fried+pastel+melted+cheese+stretching+crispy&width=600&height=600&seq=37&orientation=squarish",
  },
  {
    id: "pastel-3", category: "pastel", name: "Pastel Frango com Catupiry",
    desc: "Recheio cremoso e farto de frango desfiado com o verdadeiro requeijão Catupiry.", price: 14.0, tag: "Destaque",
    image: "https://readdy.ai/api/search-image?query=fried+pastel+chicken+cream+cheese+catupiry&width=600&height=600&seq=38&orientation=squarish",
  },
  {
    id: "pastel-4", category: "pastel", name: "Pastel Sabor Pizza",
    desc: "Queijo, presunto, tomate picadinho e orégano. O clássico favorito em formato pastel.", price: 13.0,
    image: "https://readdy.ai/api/search-image?query=fried+pastel+pizza+flavor+cheese+ham+tomato&width=600&height=600&seq=39&orientation=squarish",
  },
  {
    id: "pastel-5", category: "pastel", name: "Pastel de Palmito",
    desc: "Creme de palmito macio e bem temperado, leve e saboroso.", price: 15.0,
    image: "https://readdy.ai/api/search-image?query=fried+pastel+hearts+of+palm+creamy+filling&width=600&height=600&seq=40&orientation=squarish",
  },
  {
    id: "pastel-6", category: "pastel", name: "Pastel Doce de Leite",
    desc: "Massa frita passada na canela e açúcar recheada de doce de leite cremoso.", price: 12.0, tag: "Sobremesa",
    image: "https://readdy.ai/api/search-image?query=fried+pastel+dulce+de+leche+sugar+cinnamon&width=600&height=600&seq=41&orientation=squarish",
  },
  {
    id: "pastel-7", category: "pastel", name: "Pastel Combo 3 Queijos",
    desc: "Mussarela, provolone e requeijão. Muito recheio e sabor intenso.", price: 16.0,
    image: "https://readdy.ai/api/search-image?query=fried+pastel+three+cheeses+melted+crispy&width=600&height=600&seq=42&orientation=squarish",
  },
];
