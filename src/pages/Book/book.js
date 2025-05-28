import { Header } from '../../components/simple/Header/header.js';
import { Footer } from '../../components/simple/Footer/footer.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('header');
  const footer = document.getElementById('footer');
  console.log(app);
  if (app) app.innerHTML = Header();
  if (footer) footer.innerHTML = Footer();
});
