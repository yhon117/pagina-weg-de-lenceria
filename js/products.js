// Catálogo de productos — precios e IVA según el plan de negocio
// ELACE LENCERÍA Y BOUTIQUE S.A.S (valores en COP, IVA incluido)

const PX = 'https://images.pexels.com/photos';
const img = (id, w = 800) =>
  `${PX}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const CATEGORIES = {
  pantis: { label: 'Pantis', price: 18000, iva: 2874 },
  brasieres: { label: 'Brasieres', price: 40000, iva: 6387 },
  conjuntos: { label: 'Conjuntos', price: 55000, iva: 8782 },
  babydolles: { label: 'Babydolles', price: 65000, iva: 10378 } };

export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const PRODUCTS = [
  // ---------- PANTIS ----------
  {
    id: 'pan-01',
    name: 'Panti Tanga Encaje',
    category: 'pantis',
    desc: 'Prenda íntima cómoda y moderna en encaje suave, con acabado elegante y gran sujeción. Disponible en varios colores.',
    img: img(6879815) },
  {
    id: 'pan-02',
    name: 'Panti Copa Cabana',
    category: 'pantis',
    desc: 'Diseño romántico de temporada, tela transpirable y corte favorecedor. Ideal para el día a día o para regalar.',
    img: img(6675850) },
  {
    id: 'pan-03',
    name: 'Panti Solar',
    category: 'pantis',
    desc: 'Modelo fresco en tonos vivos, confeccionado en tejido ligero que brinda comodidad en climas cálidos como el de Santa Marta.',
    img: img(9162885) },

  // ---------- BRASIERES ----------
  {
    id: 'bra-01',
    name: 'Brasier Encaje Rosa',
    category: 'brasieres',
    desc: 'Brasier con encaje delicado y aro de soporte, diseñado para brindar comodidad y un buen ajuste durante todo el día.',
    img: img(8731333) },
  {
    id: 'bra-02',
    name: 'Brasier Acanalado Violeta',
    category: 'brasieres',
    desc: 'Estilo moderno con textura acanalada y copas moldeadas. Variedad de estilos y colores disponibles en tienda.',
    img: img(9644061) },
  {
    id: 'bra-03',
    name: 'Brasier Talle Alto Blanco',
    category: 'brasieres',
    desc: 'Cobertura amplia en algodón suave conillajes reforzados. El básico que toda mujer necesita en su guardarropa.',
    img: img(6303698) },

  // ---------- CONJUNTOS ----------
  {
    id: 'conj-01',
    name: 'Conjunto Encaje Floral',
    category: 'conjuntos',
    desc: 'Combinación coordinada de brasier y panty en encaje floral. Un diseño elegante y atractivo para ocasiones especiales.',
    img: img(9132316) },
  {
    id: 'conj-02',
    name: 'Conjunto Encaje Rosa',
    category: 'conjuntos',
    desc: 'Set de encaje rosa con detalles finos y ajuste perfecto. Elegancia y feminidad en una sola pieza.',
    img: img(13111271) },
  {
    id: 'conj-03',
    name: 'Conjunto Negro Elegance',
    category: 'conjuntos',
    desc: 'Clásico conjunto negro en encaje que resalta la silueta. Combinación perfecta entre comodidad y estilo.',
    img: img(13636983) },

  // ---------- BABYDOLLES ----------
  {
    id: 'bab-01',
    name: 'Babydoll Blanco Nupcial',
    category: 'babydolles',
    desc: 'Prenda ligera y delicada en encaje blanco, ideal para novias y ocasiones especiales. Sensación de bienestar y confianza.',
    img: img(16955583) },
  {
    id: 'bab-02',
    name: 'Babydoll Rojo Pasión',
    category: 'babydolles',
    desc: 'Babydoll en encaje rojo de caída fluida. Diseñado para lucir atractiva y sentirse cómoda al mismo tiempo.',
    img: img(12034236) },
  {
    id: 'bab-03',
    name: 'Babydoll Encaje Premium',
    category: 'babydolles',
    desc: 'Edición premium con encaje de alta calidad y acabados dorados. Nuestra pieza más exclusiva de la colección.',
    img: img(14659352) },
];

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

export function productPrice(product) {
  return CATEGORIES[product.category].price;
}

export function productIva(product) {
  return CATEGORIES[product.category].iva;
}
