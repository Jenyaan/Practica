export function Footer() {
  if (!document.getElementById('footer-style')) {
    const link = document.createElement('link');
    link.id = 'footer-style';
    link.rel = 'stylesheet';
    link.href = '../../components/simple/Footer/footer.css'; 
    document.head.appendChild(link);
  }

  return `
    <footer class="footer">
        <div class="footer_description">
            <p>Про нас</p>
            <p>План оплати</p>
            <p>Правила сайту</p>
        </div>
        <div class="footer_social">
            <p>Соціальні мережі</p>
            <div class="footer_message">            
                <div><img src="../../public/icons/facebook.svg" alt=""></div>
                <div><img src="../../public/icons/instagram.svg" alt=""></div>
            </div>
        </div>
    </footer>
  `;
}
