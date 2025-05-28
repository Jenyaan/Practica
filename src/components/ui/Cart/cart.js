export function Cart(bookData = {}) {
  if (!document.getElementById('cart-style')) {
    const link = document.createElement('link');
    link.id = 'cart-style';
    link.rel = 'stylesheet';
    link.href = '../../components/ui/Cart/cart.css'; 
    document.head.appendChild(link);
  }

  const {
    image = '../../public/cart.png',
    description = 'Історія про людей...Історія про людей...Історія про людей...',
    title = 'Назва книги'
  } = bookData;

  return `
    <div class="cart_book">
        <div><img src="${image}" alt="${title}"></div>
        <p>${description}</p>
    </div>
  `;
}