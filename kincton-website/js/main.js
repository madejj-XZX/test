document.addEventListener('DOMContentLoaded', function() {
  // 移动端菜单切换
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    mobileNavClose.addEventListener('click', function() {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // 移动端下拉菜单
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    if (link.nextElementSibling && link.nextElementSibling.classList.contains('mobile-dropdown-menu')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = this.nextElementSibling;
        
        // 关闭其他打开的菜单
        document.querySelectorAll('.mobile-dropdown-menu').forEach(menu => {
          if (menu !== dropdown) {
            menu.style.maxHeight = null;
            menu.previousElementSibling.classList.remove('active');
          }
        });
        
        // 切换当前菜单
        if (dropdown.style.maxHeight) {
          dropdown.style.maxHeight = null;
          this.classList.remove('active');
        } else {
          dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
          this.classList.add('active');
        }
      });
    }
  });
  
  // 视频自动播放
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    const playPromise = heroVideo.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        heroVideo.poster = 'assets/img/hero-fallback.jpg';
        heroVideo.load();
      });
    }
  }
  
  // 当前页面高亮
  const currentPage = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      
      // 如果是下拉菜单项，也高亮父项
      if (link.closest('.dropdown-content')) {
        link.closest('.nav-item').querySelector('.nav-link').classList.add('active');
      }
    }
  });
  
  // 导航栏滚动效果
  const header = document.querySelector('.header');
  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
});
// 在main.js中添加
document.addEventListener('DOMContentLoaded', function() {
  const langBtns = document.querySelectorAll('.lang-btn');
  
  langBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除所有active类
      langBtns.forEach(b => b.classList.remove('active'));
      // 添加active类到当前按钮
      this.classList.add('active');
      
      const lang = this.dataset.lang;
      // 切换语言
      switchLanguage(lang);
    });
  });
  
  function switchLanguage(lang) {
    // 获取所有需要翻译的元素
    const elements = document.querySelectorAll('[data-zh], [data-en]');
    
    elements.forEach(el => {
      if (el.hasAttribute(`data-${lang}`)) {
        // 根据选择的语言显示对应文本
        el.textContent = el.getAttribute(`data-${lang}`);
      }
    });
    
    // 也可以存储用户的语言偏好
    localStorage.setItem('preferredLang', lang);
  }
  
  // 检查是否有存储的语言偏好
  const preferredLang = localStorage.getItem('preferredLang') || 'zh';
  document.querySelector(`.lang-btn[data-lang="${preferredLang}"]`).click();
});
document.querySelectorAll('.category-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // 移除所有标签和内容面板的active类
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.resource-pane').forEach(p => p.classList.remove('active'));
    
    // 为点击的标签添加active类
    tab.classList.add('active');
    
    // 显示对应的内容面板
    const category = tab.dataset.category;
    document.querySelector(`.resource-pane[data-category="${category}"]`).classList.add('active');
  });
});


// 加载头部和页脚
document.addEventListener('DOMContentLoaded', function() {
  // 加载头部
  fetch('../header.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
    });

  // 加载页脚
  fetch('../footer.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
      // 确保加载完成后初始化语言切换
      if(typeof initLanguageSwitcher === 'function') {
        initLanguageSwitcher();
      }
    });
});