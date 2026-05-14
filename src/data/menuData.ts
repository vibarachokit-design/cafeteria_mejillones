import {
  Coffee,
  UtensilsCrossed,
  Pizza,
  Sandwich,
  CupSoda,
  Sparkles,
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
  { id: 'pizzas', name: 'Pizzas', icon: Pizza },
  { id: 'selladitos', name: 'Selladitos', icon: Sandwich },
  { id: 'ciabatta', name: 'Ciabatta', icon: UtensilsCrossed },
  { id: 'bebidas', name: 'Bebidas', icon: CupSoda },
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

export const defaultMenuProducts: MenuProduct[] = [
  {
    id: 1,
    name: 'Tropical Coldbrew',
    description:
      'Café de especialidad infusionado en frío, syrup de maracuyá, agua con gas y toque exótico de pulpa de mango',
    price: 4200,
    image: asset('cafe-latte.jpg'),
    category: 'novedades',
    popular: true,
  },
  {
    id: 2,
    name: 'Mocktail de Hibiscus',
    description:
      'Refrescante y levemente ácida, elaborada con flor de jamaica, jugo de limón natural y hojas frescas de menta',
    price: 4200,
    image: asset('cafe-latte.jpg'),
    category: 'novedades',
  },
  {
    id: 3,
    name: 'Leche Dorada',
    description:
      'Deliciosa combinación de cúrcuma, especias y leche vegetal o tradicional. Propiedades antiinflamatorias y antioxidantes',
    price: 3500,
    image: asset('cafe-latte.jpg'),
    category: 'novedades',
  },
  {
    id: 4,
    name: 'Torta Helada',
    description:
      'Torta congelada de frambuesa con merengue, ideal para refrescarse con algo dulce',
    price: 3000,
    image: asset('postre.jpg'),
    category: 'novedades',
  },
  {
    id: 5,
    name: 'Expresso',
    description: 'Intenso café de grano expresso',
    price: 2000,
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  {
    id: 6,
    name: 'Americano',
    description:
      'Taza intensa y aromática preparada con café de grano recién molido. Sabor profundo y cuerpo suave',
    price: 3190,
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  {
    id: 7,
    name: 'Cortado',
    description:
      'Espresso intenso suavizado con un toque de leche caliente. Equilibrio perfecto entre fuerza y cremosidad',
    price: 3290,
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  {
    id: 8,
    name: 'Capuccino Tradicional',
    description:
      'Clásico y reconfortante: espresso con leche vaporizada y una suave capa de espuma. Cremoso y equilibrado',
    price: 3900,
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
    popular: true,
  },
  {
    id: 9,
    name: 'Capuccino Sabores',
    description:
      'Tu clásico capuchino con un toque único. Disponible en vainilla, canela, caramelo o avellana',
    price: 4200,
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  {
    id: 10,
    name: 'Mockaccino',
    description:
      'Fusión irresistible de espresso, leche vaporizada y chocolate. Cremoso, suave y con toque dulce',
    price: 3900,
    image: asset('cafe-latte.jpg'),
    category: 'tazas',
  },
  {
    id: 11,
    name: 'Milkshake Sabores',
    description:
      'Batido a base de helado de vainilla. Elige tu sabor: chocolate, café o cookies',
    price: 4500,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
    popular: true,
  },
  {
    id: 12,
    name: 'Matcha Latte Helado',
    description:
      'Refrescante mezcla de té verde matcha con leche fría y hielo. Suave, vegetal y lleno de antioxidantes',
    price: 4200,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 13,
    name: 'Chai Latte Ice',
    description:
      'Infusión especiada de té negro con canela, jengibre, clavo y cardamomo, con leche fría y hielo',
    price: 4200,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 14,
    name: 'Manzanilla Latte Ice',
    description:
      'Infusión relajante de manzanilla con leche fría y hielo. Suave, floral y naturalmente dulce',
    price: 3800,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 15,
    name: 'Menta Latte Ice',
    description:
      'Infusión refrescante de menta con leche fría y hielo. Ligero, herbal y revitalizante',
    price: 3800,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 16,
    name: 'Bombón Ice',
    description:
      'Versión helada del clásico café bombón: espresso sobre leche condensada fría, servido con hielo',
    price: 4200,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 17,
    name: 'Caramel Latte Ice',
    description:
      'Espresso con leche fría, hielo y toque de jarabe de caramelo. Dulce, cremoso y tostado',
    price: 4200,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 18,
    name: 'Café Helado',
    description:
      'Café filtrado o espresso servido bien frío, con hielo y toque de azúcar o leche a elección',
    price: 4000,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 19,
    name: 'Frapuccino',
    description:
      'Batido cremoso de café con hielo, leche y toque dulce. Elige sabor: vainilla, caramelo, chocolate o café clásico',
    price: 4000,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
    popular: true,
  },
  {
    id: 20,
    name: 'Limonadas Sabores',
    description:
      'Refrescante limonada con opción de sabores: jengibre, menta o albahaca',
    price: 4200,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 21,
    name: 'Jugos Naturales',
    description:
      'Preparado al momento con pulpa de fruta natural. Elige: piña, mango, melón o berries. Con agua o con leche',
    price: 4200,
    image: asset('cafe-latte.jpg'),
    category: 'refrescos',
  },
  {
    id: 22,
    name: 'Pizza Napolitana Artesanal',
    description:
      'Masa hecha por nosotros con queso, tomate, jamón, orégano y aceitunas. Sabor auténtico directo del horno',
    price: 5500,
    image: asset('empanadas.jpg'),
    category: 'pizzas',
    popular: true,
  },
  {
    id: 23,
    name: 'Pizza Colores',
    description:
      'Masa artesanal con queso fundido, jamón, pimentón, tomate cherry y aceitunas. Explosión de color y sabor',
    price: 5500,
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 24,
    name: 'Pizza Vegetariana',
    description:
      'Masa artesanal con queso fundido, champiñones salteados, pimentón y aceitunas. Fresca y llena de sabor',
    price: 5500,
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 25,
    name: 'Pizza Hawaiana',
    description:
      'Masa artesanal con queso fundido, jamón y trozos de piña jugosa. Combinación dulce y salada clásica',
    price: 5500,
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 26,
    name: 'Pizza Choclo & Queso',
    description:
      'Masa artesanal con queso fundido, granos de choclo, pimentón y aceitunas. Suave y colorida',
    price: 5500,
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 27,
    name: 'Pizza Queso & Albahaca',
    description:
      'Masa artesanal con queso fundido, tomate fresco y albahaca recién cosechada de nuestro huerto',
    price: 5500,
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 28,
    name: 'Pizza Española',
    description:
      'Masa artesanal con queso fundido, jamón, salame, pimentón y tomate fresco. Intensa y colorida',
    price: 5500,
    image: asset('empanadas.jpg'),
    category: 'pizzas',
  },
  {
    id: 29,
    name: 'Selladito Jamón & Queso',
    description:
      'Clásico pan de molde sellado y dorado, relleno con jamón y queso derretido. Simple y sabroso',
    price: 2500,
    image: asset('empanadas.jpg'),
    category: 'selladitos',
  },
  {
    id: 30,
    name: 'Selladito Espinaca & Queso',
    description:
      'Pan de molde dorado y sellado, relleno con queso fundido y espinaca salteada. Suave y sabroso',
    price: 2700,
    image: asset('empanadas.jpg'),
    category: 'selladitos',
  },
  {
    id: 31,
    name: 'Selladito Queso & Champiñón',
    description:
      'Pan de molde sellado y crujiente, relleno con queso fundido y champiñones salteados',
    price: 2700,
    image: asset('empanadas.jpg'),
    category: 'selladitos',
  },
  {
    id: 32,
    name: 'Tostada Palta',
    description:
      'Pan de molde dorado y crujiente, untado con palta fresca. Ideal para un desayuno liviano',
    price: 3000,
    image: asset('empanadas.jpg'),
    category: 'selladitos',
    popular: true,
  },
  {
    id: 33,
    name: 'Ciabatta Carne',
    description:
      'Crujiente pan ciabatta relleno con carne desmenuzada, palta fresca, lechuga y tomate. Sabroso y nutritivo',
    price: 7700,
    image: asset('empanadas.jpg'),
    category: 'ciabatta',
    popular: true,
  },
  {
    id: 34,
    name: 'Bebidas Express',
    description: 'Refrescos clásicos bien fríos: Coca-Cola, Fanta, Sprite',
    price: 1000,
    image: asset('cafe-latte.jpg'),
    category: 'bebidas',
  },
  {
    id: 35,
    name: 'Bebidas 600ml',
    description: 'Refrescos clásicos bien fríos: Coca-Cola, Fanta, Sprite',
    price: 1800,
    image: asset('cafe-latte.jpg'),
    category: 'bebidas',
  },
  {
    id: 36,
    name: 'Agua',
    description: 'Agua con o sin gas',
    price: 1200,
    image: asset('cafe-latte.jpg'),
    category: 'bebidas',
  },
];
