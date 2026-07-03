import {
  BookOpen,
  Coffee,
  Croissant,
  CupSoda,
  Pizza,
  Sandwich,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';

export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export interface MenuProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

export const menuCategories = [
  { id: 'novedades', name: 'Novedades', icon: Sparkles },
  { id: 'tazas', name: 'Tazas con Alma', icon: Coffee },
  { id: 'refrescos', name: 'Refrescos del Desierto', icon: CupSoda },
  { id: 'dulzura', name: 'Dulzura del Norte', icon: Croissant },
  { id: 'ciabatta', name: 'Ciabatta Raices del Norte', icon: Sandwich },
  { id: 'pizzas', name: 'Pizzas Rondas del Desierto', icon: Pizza },
  { id: 'selladitos', name: 'Selladitos y Tostadas', icon: UtensilsCrossed },
  { id: 'fajitas', name: 'Fajitas Peninsula', icon: UtensilsCrossed },
  { id: 'boutique', name: 'Boutique Kihnally', icon: BookOpen },
] as const;

export const availableProductImages = [
  'cafe-latte.jpg',
  'postre.jpg',
  'empanadas.jpg',
  'bahia.jpg',
  'caldo.jpg',
  'hero-cafe.jpg',
  'mariscos.jpg',
  'torta.jpg',
];

const fallbackImageByCategory: Record<string, string> = {
  novedades: asset('bahia.jpg'),
  tazas: asset('cafe-latte.jpg'),
  refrescos: asset('hero-cafe.jpg'),
  dulzura: asset('torta.jpg'),
  ciabatta: asset('empanadas.jpg'),
  pizzas: asset('empanadas.jpg'),
  selladitos: asset('postre.jpg'),
  fajitas: asset('mariscos.jpg'),
  boutique: asset('bahia.jpg'),
};

export const getFallbackImageForCategory = (category: string) =>
  fallbackImageByCategory[category] || asset('cafe-latte.jpg');

const remoteOrFallback = (image: string | null, category: string) =>
  image || getFallbackImageForCategory(category);

export const defaultMenuProducts: MenuProduct[] = [
  {
    id: 1,
    name: 'Butterfly Lemonade',
    description:
      'Una novedosa propuesta de limonada con te de mariposa, miel y agua con gas',
    price: 4200,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/0c4e7c5c-a905-4761-a95a-76d7cf3d486e.webp',
      'novedades'
    ),
    category: 'novedades',
    popular: true,
  },
  {
    id: 2,
    name: 'Tropical Coldbrew',
    description:
      'Una combinacion perfecta de cafe de especialidad infusionado en frio, syrup de maracuya, agua con gas y el toque exotico de pulpa de mango.',
    price: 4200,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/fad4780a-6daa-4611-a5ab-c2182ec92abb.webp',
      'novedades'
    ),
    category: 'novedades',
    popular: true,
  },
  {
    id: 3,
    name: 'Mocktail de Hibiscus',
    description:
      'Refrescante y levemente acida, elaborada con flor de jamaica, una onza de jugo de limon natural y hojas frescas de menta.',
    price: 4200,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/5cc45e6a-f0ff-4559-8c89-c728fe931e87.webp',
      'novedades'
    ),
    category: 'novedades',
  },
  {
    id: 4,
    name: 'Leche Dorada',
    description:
      'Deliciosa combinacion de curcuma, especias y leche vegetal o tradicional, ideal para un momento de bienestar.',
    price: 3500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/f5efeaa0-c33d-4547-8ce2-8d73564ab64d.webp',
      'novedades'
    ),
    category: 'novedades',
  },
  {
    id: 5,
    name: 'Expresso',
    description: 'Intenso cafe de grano expresso.',
    price: 2000,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/b19ee86e-512c-41d9-a327-8a0b34c18752.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 6,
    name: 'Americano',
    description:
      'Una taza intensa y aromatica preparada con cafe de grano recien molido. Sabor profundo y cuerpo suave.',
    price: 3190,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/2555401b-38fb-4295-acc5-95a94d02b438.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 7,
    name: 'Cortado',
    description:
      'Espresso intenso suavizado con un toque de leche caliente. Equilibrio perfecto entre fuerza y cremosidad.',
    price: 3290,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/75908d40-f723-4f41-b1e9-9630b6ac7ee8.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 8,
    name: 'Capuccino tradicional',
    description:
      'Clasico y reconfortante: espresso con leche vaporizada y una suave capa de espuma.',
    price: 3900,
    image: remoteOrFallback(null, 'tazas'),
    category: 'tazas',
    popular: true,
  },
  {
    id: 9,
    name: 'Capuccino sabores',
    description:
      'Tu clasico capuchino, con un toque unico. Disponible en vainilla, canela, caramelo o avellana.',
    price: 4200,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/6b75f770-f87e-4a15-97cb-892560670aa7.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 10,
    name: 'Mockaccino',
    description:
      'Fusion irresistible de espresso, leche vaporizada y chocolate. Cremoso, suave y con toque dulce.',
    price: 3900,
    image: remoteOrFallback(null, 'tazas'),
    category: 'tazas',
  },
  {
    id: 11,
    name: 'Cafe Hawaiano',
    description:
      'Espresso intenso con crema de coco, leche caliente y un toque de vainilla o caramelo.',
    price: 3900,
    image: remoteOrFallback(null, 'tazas'),
    category: 'tazas',
  },
  {
    id: 12,
    name: 'Chai latte',
    description:
      'Infusion especiada de te negro con canela, jengibre, clavo y cardamomo, mezclada con leche vaporizada.',
    price: 3900,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/c02b7025-c9ad-429c-acfe-54b89275eaa9.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 13,
    name: 'Cafe bombon',
    description:
      'Espresso intenso servido sobre una base de leche condensada. Dulce, cremoso y equilibrado.',
    price: 3900,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/38e526df-cb98-40f5-911f-70a5b532f5c3.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 14,
    name: 'Chocolate caliente',
    description:
      'Espeso, cremoso y reconfortante. Preparado con cacao de calidad y leche caliente.',
    price: 3900,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/3b1b0827-b57e-4a40-84e6-6d8e9bca6542.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 15,
    name: 'Matcha latte',
    description:
      'Mezcla suave de te verde matcha con leche. Rica en antioxidantes y energia natural.',
    price: 3900,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/adc63a4b-656a-441e-8930-a2f893df2e7a.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 16,
    name: 'Te con leche',
    description:
      'Natural entera, sin lactosa, almendras, arroz o coco. Elige la que mas te guste.',
    price: 2000,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/e506a21c-c79b-484d-b591-78b05da430e1.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 17,
    name: 'Te clasico',
    description: 'Seleccion de tes en bolsa: negro o verde. Servidos con agua caliente.',
    price: 1500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/3b4b14d8-395e-4f4c-8caa-274271991a04.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 18,
    name: 'Te de hoja en tetera (4 personas)',
    description:
      'Infusion natural elaborada con hojas seleccionadas, servida en tetera para compartir.',
    price: 4500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/e92e960d-848b-494f-93ea-351f196e0db2.webp',
      'tazas'
    ),
    category: 'tazas',
  },
  {
    id: 19,
    name: 'Milkshake sabores',
    description:
      'Batido a base de helado de vainilla. Puedes elegir chocolate, cafe o cookies.',
    price: 4500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/435826b8-a051-4b44-9809-2c939681a84e.webp',
      'refrescos'
    ),
    category: 'refrescos',
    popular: true,
  },
  {
    id: 20,
    name: 'Matcha Latte Helado',
    description: 'Refrescante mezcla de te verde matcha con leche fria y hielo.',
    price: 4200,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/7b12431c-bbd5-435f-913f-f63f933256ff.webp',
      'refrescos'
    ),
    category: 'refrescos',
  },
  {
    id: 21,
    name: 'Chai Latte Ice',
    description:
      'Infusion especiada de te negro con canela, jengibre, clavo y cardamomo, con leche fria y hielo.',
    price: 4200,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/e2126ced-ec47-4fa6-aa74-2a7b02ae007a.webp',
      'refrescos'
    ),
    category: 'refrescos',
  },
  {
    id: 22,
    name: 'Manzanilla Latte Ice',
    description: 'Infusion relajante de manzanilla con leche fria y hielo.',
    price: 3800,
    image: remoteOrFallback(null, 'refrescos'),
    category: 'refrescos',
  },
  {
    id: 23,
    name: 'Menta Latte Ice',
    description: 'Infusion refrescante de menta con leche fria y hielo.',
    price: 3800,
    image: remoteOrFallback(null, 'refrescos'),
    category: 'refrescos',
  },
  {
    id: 24,
    name: 'Bombon ice',
    description:
      'Version helada del clasico cafe bombon: espresso sobre leche condensada fria, servido con hielo.',
    price: 4200,
    image: remoteOrFallback(null, 'refrescos'),
    category: 'refrescos',
  },
  {
    id: 25,
    name: 'Caramel latte ice',
    description:
      'Espresso con leche fria, hielo y toque de jarabe de caramelo. Dulce, cremoso y tostado.',
    price: 4200,
    image: remoteOrFallback(null, 'refrescos'),
    category: 'refrescos',
  },
  {
    id: 26,
    name: 'Cafe Helado',
    description:
      'Cafe filtrado o espresso servido bien frio, con hielo y toque de azucar o leche a eleccion.',
    price: 4000,
    image: remoteOrFallback(null, 'refrescos'),
    category: 'refrescos',
  },
  {
    id: 27,
    name: 'Frapuccino',
    description:
      'Batido cremoso de cafe con hielo, leche y toque dulce. Elige vainilla, caramelo, chocolate o cafe clasico.',
    price: 4000,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/2d6a8867-126a-4fc5-a412-1ce8dec3c9b3.webp',
      'refrescos'
    ),
    category: 'refrescos',
    popular: true,
  },
  {
    id: 28,
    name: 'Limonadas sabores',
    description: 'Refrescante limonada con opcion de sabores: jengibre, menta o albahaca.',
    price: 4200,
    image: remoteOrFallback(null, 'refrescos'),
    category: 'refrescos',
  },
  {
    id: 29,
    name: 'Jugos Naturales sabores',
    description:
      'Preparado al momento con pulpa de fruta natural. Elige pina, mango, melon o berries. Con agua o con leche.',
    price: 4200,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/6005de58-c122-4fdf-9615-e5fdc34def19.webp',
      'refrescos'
    ),
    category: 'refrescos',
  },
  {
    id: 30,
    name: 'Bebidas Express',
    description: 'Refrescos clasicos bien frios: Coca-Cola, Fanta y Sprite.',
    price: 1000,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/5c2042ae-1b24-47f3-8fae-8e75637dd2e3.webp',
      'refrescos'
    ),
    category: 'refrescos',
  },
  {
    id: 31,
    name: 'Bebidas 600ML',
    description: 'Refrescos clasicos bien frios: Coca-Cola, Fanta y Sprite.',
    price: 1800,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/49e0a0f6-34a7-48c3-bb23-3f85a49be14e.webp',
      'refrescos'
    ),
    category: 'refrescos',
  },
  {
    id: 32,
    name: 'Agua',
    description: 'Agua con o sin gas.',
    price: 1200,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/5c2042ae-1b24-47f3-8fae-8e75637dd2e3.webp',
      'refrescos'
    ),
    category: 'refrescos',
  },
  {
    id: 33,
    name: 'Pan de chocolate',
    description: 'Masa de hojaldre esponjosa y dorada, rellena con crema de cacao.',
    price: 1500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/34b2e56e-d4cc-4c5c-92d6-b56e292a9f9e.webp',
      'dulzura'
    ),
    category: 'dulzura',
  },
  {
    id: 34,
    name: 'Dona sabores',
    description:
      'Donas de distintos sabores como mermelada, crema pastelera, chocolate o manjar.',
    price: 1500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/fc4de40e-f0aa-496b-b217-fa9597ccde00.webp',
      'dulzura'
    ),
    category: 'dulzura',
  },
  {
    id: 35,
    name: 'Medialuna',
    description: 'Clasica medialuna horneada, suave y dorada, rellena con cremoso manjar.',
    price: 1500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/b05c7026-c07f-4c70-980a-8fb2658e3af8.webp',
      'dulzura'
    ),
    category: 'dulzura',
  },
  {
    id: 36,
    name: 'Dulces de la semana',
    description:
      'Tortas, pies y delicias que cambian cada semana. Consulta por las opciones disponibles.',
    price: 4000,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/cccc450f-261e-4a71-85dd-192881f97590.webp',
      'dulzura'
    ),
    category: 'dulzura',
    popular: true,
  },
  {
    id: 37,
    name: 'Tostada smore',
    description: 'Pan tostado con cacao y marshmallow, ideal para los mas golosos.',
    price: 3000,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/642e9170-f659-4d68-ad68-60dec79b9770.webp',
      'dulzura'
    ),
    category: 'dulzura',
  },
  {
    id: 38,
    name: 'Muffin Zanahoria Nuez',
    description: 'Muffin casero de zanahoria con nuez.',
    price: 3000,
    image: remoteOrFallback(null, 'dulzura'),
    category: 'dulzura',
  },
  {
    id: 39,
    name: 'Ciabatta champinon',
    description: 'Crujiente pan ciabatta con champinones salteados, palta, lechuga y tomate.',
    price: 7500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/630b3523-ae0e-4d39-89ed-8b76c22ae491.webp',
      'ciabatta'
    ),
    category: 'ciabatta',
  },
  {
    id: 40,
    name: 'Ciabatta capresse',
    description:
      'Crujiente pan ciabatta con queso de cabra fundido, aceituna morada, tomate fresco y albahaca.',
    price: 7500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/bc21de7f-a6f3-4fa9-a954-a8b13394e8ae.webp',
      'ciabatta'
    ),
    category: 'ciabatta',
  },
  {
    id: 41,
    name: 'Ciabatta Pollo & Palta',
    description: 'Crujiente pan ciabatta relleno con pollo, palta fresca, lechuga y tomate.',
    price: 7700,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/31311fe3-eccd-4ddb-93cc-b5a90a3421c3.webp',
      'ciabatta'
    ),
    category: 'ciabatta',
    popular: true,
  },
  {
    id: 42,
    name: 'Ciabatta bacon',
    description:
      'Crujiente pan ciabatta con tocino dorado, lechuga fresca, tomate y queso derretido.',
    price: 7700,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/b6a60a67-72f4-4151-bdd3-21a675021c25.webp',
      'ciabatta'
    ),
    category: 'ciabatta',
  },
  {
    id: 43,
    name: 'Ciabatta Carne',
    description:
      'Crujiente pan ciabatta relleno con carne desmenuzada, palta fresca, lechuga y tomate.',
    price: 7700,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/31311fe3-eccd-4ddb-93cc-b5a90a3421c3.webp',
      'ciabatta'
    ),
    category: 'ciabatta',
  },
  {
    id: 44,
    name: 'Pizza Napolitana Artesanal',
    description: 'Masa hecha por nosotros con queso, tomate, jamon, oregano y aceitunas.',
    price: 5500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/92961830-6fa8-44ed-9a12-9a8314249849.webp',
      'pizzas'
    ),
    category: 'pizzas',
    popular: true,
  },
  {
    id: 45,
    name: 'Pizza Colores',
    description:
      'Masa artesanal con queso fundido, jamon, pimenton, tomate cherry y aceitunas.',
    price: 5500,
    image: remoteOrFallback(null, 'pizzas'),
    category: 'pizzas',
  },
  {
    id: 46,
    name: 'Pizza Vegetariana',
    description:
      'Masa artesanal con queso fundido, champinones salteados, pimenton y aceitunas.',
    price: 5500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/b608fb12-4ab4-416c-a2e0-640694d1df46.webp',
      'pizzas'
    ),
    category: 'pizzas',
  },
  {
    id: 47,
    name: 'Pizza Hawaiana',
    description: 'Masa artesanal con queso fundido, jamon y trozos de pina jugosa.',
    price: 5500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/199d6220-9b6c-4da8-8fdc-440088078b71.webp',
      'pizzas'
    ),
    category: 'pizzas',
  },
  {
    id: 48,
    name: 'Pizza Choclo & Queso',
    description:
      'Masa artesanal con queso fundido, granos de choclo, pimenton y aceitunas.',
    price: 5500,
    image: remoteOrFallback(null, 'pizzas'),
    category: 'pizzas',
  },
  {
    id: 49,
    name: 'Pizza Queso & Albahaca',
    description:
      'Masa artesanal con queso fundido, rodajas de tomate fresco y albahaca recien cosechada.',
    price: 5500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/78a55039-09c1-4479-a029-302ff7b834ef.webp',
      'pizzas'
    ),
    category: 'pizzas',
  },
  {
    id: 50,
    name: 'Pizza Espanola',
    description:
      'Masa artesanal con queso fundido, jamon, salame, pimenton y tomate fresco.',
    price: 5500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/093122ca-b229-4714-976a-4d9d8791aef9.webp',
      'pizzas'
    ),
    category: 'pizzas',
  },
  {
    id: 51,
    name: 'Selladito Jamon & Queso',
    description:
      'Clasico pan de molde sellado y dorado, relleno con jamon y queso derretido.',
    price: 2500,
    image: remoteOrFallback(null, 'selladitos'),
    category: 'selladitos',
  },
  {
    id: 52,
    name: 'Selladito Espinaca & Queso',
    description:
      'Pan de molde dorado y sellado, relleno con queso fundido y espinaca salteada.',
    price: 2700,
    image: remoteOrFallback(null, 'selladitos'),
    category: 'selladitos',
  },
  {
    id: 53,
    name: 'Selladito Queso & Champinon',
    description:
      'Pan de molde sellado y crujiente, relleno con queso fundido y champinones salteados.',
    price: 2700,
    image: remoteOrFallback(null, 'selladitos'),
    category: 'selladitos',
  },
  {
    id: 54,
    name: 'Tostada Palta',
    description: 'Pan de molde dorado y crujiente, untado con palta fresca.',
    price: 3000,
    image: remoteOrFallback(null, 'selladitos'),
    category: 'selladitos',
    popular: true,
  },
  {
    id: 55,
    name: 'Tostada Queso Tomate Albahaca',
    description:
      'Pan crujiente con queso fundido, rodajas de tomate fresco y albahaca de nuestro huerto.',
    price: 3000,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/32b8c039-a770-4308-8fa9-884a3a169459.webp',
      'selladitos'
    ),
    category: 'selladitos',
  },
  {
    id: 56,
    name: 'Fajita Pollo',
    description:
      'Tortilla suave rellena con pollo, lechuga fresca, palta, tomate y granos de choclo.',
    price: 3900,
    image: remoteOrFallback(null, 'fajitas'),
    category: 'fajitas',
  },
  {
    id: 57,
    name: 'Fajita Vegetariana',
    description:
      'Tortilla suave rellena con champinones salteados, lechuga, palta, tomate y granos de choclo.',
    price: 3900,
    image: remoteOrFallback(null, 'fajitas'),
    category: 'fajitas',
  },
  {
    id: 58,
    name: 'Fajita sin Gluten',
    description:
      'Tortilla sin gluten rellena con ingredientes frescos y sabrosos a eleccion, en version pollo o vegetariana.',
    price: 4500,
    image: remoteOrFallback(
      'https://d2nagnwby8accc.cloudfront.net/companies/products/images/800/7e267639-f016-4d1a-837c-54b61f258b8c.webp',
      'fajitas'
    ),
    category: 'fajitas',
  },
  {
    id: 59,
    name: 'Cuadernillo "Dibujos de Mejillones"',
    description:
      'Un recorrido ilustrado por los paisajes, la cultura y la esencia de nuestro querido puerto.',
    price: 25,
    image: remoteOrFallback(null, 'boutique'),
    category: 'boutique',
  },
  {
    id: 60,
    name: 'Cuadernillo "Gratitud"',
    description:
      'Cuadernillo con frases inspiradoras para agradecer, reflexionar y reconectar con lo simple.',
    price: 25,
    image: remoteOrFallback(null, 'boutique'),
    category: 'boutique',
  },
  {
    id: 61,
    name: 'Taza de Mejillones',
    description:
      'Diseno exclusivo que celebra los paisajes, colores y esencia de nuestro puerto.',
    price: 4500,
    image: remoteOrFallback(null, 'boutique'),
    category: 'boutique',
  },
  {
    id: 62,
    name: 'Guia Olas de Cambio - Kihnally',
    description:
      'Agenda transformadora para reconectar con tu esencia, soniar, planificar y celebrar tu camino.',
    price: 25,
    image: remoteOrFallback(null, 'boutique'),
    category: 'boutique',
  },
];
