export function Header() {
  if (!document.getElementById('header-style')) {
    const link = document.createElement('link');
    link.id = 'header-style';
    link.rel = 'stylesheet';
    link.href = '../../components/simple/Header/header.css'; 
    document.head.appendChild(link);
  }

  return `
    <header class="header">
      <div class="header_left">
        <div class="header_logo"><img src="../../public/logo.svg" alt=""></div>
        <div class="header_search">
          <input type="text">
          <a href=""><img src="../../public/icons/search.svg" alt=""></a>
        </div>
      </div>
      <div class="header_right">
        <div class="header_avatar"><img src="../../public/icons/avatar.svg" alt=""></div>
        <p>Jekan34</p>
        <div class="header_dropmenu"><img src="../../public/icons/dropmenu.svg" alt=""></div>
      </div>
    </header>
  `;
}
