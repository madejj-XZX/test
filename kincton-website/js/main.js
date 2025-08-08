/**
 * HTML组件加载器
 * 使用方式：在HTML中添加 <div data-component="header"></div> 这样的占位元素
 */
class ComponentLoader {
  constructor() {
    this.components = {};
    this.loaded = false;
  }
  
  // 注册组件
  register(name, url) {
    this.components[name] = { url, content: null };
  }
  
  // 加载所有组件
  async loadAll() {
    const promises = [];
    
    for (const [name, component] of Object.entries(this.components)) {
      promises.push(
        fetch(component.url)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to load ${name}`);
            return res.text();
          })
          .then(html => {
            this.components[name].content = html;
            console.log(`Component loaded: ${name}`);
          })
          .catch(err => console.error(`Error loading ${name}:`, err))
      );
    }
    
    await Promise.all(promises);
    this.loaded = true;
    this.renderAll();
  }
  
  // 渲染所有组件
  renderAll() {
    if (!this.loaded) return;
    
    document.querySelectorAll('[data-component]').forEach(el => {
      const name = el.getAttribute('data-component');
      if (this.components[name]) {
        el.innerHTML = this.components[name].content;
      }
    });
    
    // 触发自定义事件通知组件已加载
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  }
}

// 创建全局组件加载器实例
window.componentLoader = new ComponentLoader();

// 注册组件（使用绝对路径避免部署问题）
componentLoader.register('header', 'header.html');
componentLoader.register('footer', 'footer.html');

/**
 * 初始化所有页面交互逻辑
 */
function initApp() {
  // ===== 移动端菜单切换 =====
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    mobileNavClose.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // ===== 移动端下拉菜单 =====
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    if (link.nextElementSibling?.classList.contains('mobile-dropdown-menu')) {
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

  // ===== 语言切换功能 =====
  const langBtns = document.querySelectorAll('.lang-btn');
  if (langBtns.length > 0) {
    langBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        langBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        switchLanguage(this.dataset.lang);
      });
    });

    // 初始化语言（默认中文）
    const preferredLang = localStorage.getItem('preferredLang') || 'zh';
    document.querySelector(`.lang-btn[data-lang="${preferredLang}"]`)?.click();
  }

  // ===== 当前页面导航高亮 =====
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
      // 如果是下拉菜单项，高亮父项
      if (link.closest('.dropdown-content')) {
        link.closest('.nav-item').querySelector('.nav-link').classList.add('active');
      }
    }
  });

  // ===== 滚动时导航栏效果 =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===== 资源分类标签切换 =====
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.resource-pane').forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const category = tab.dataset.category;
      document.querySelector(`.resource-pane[data-category="${category}"]`)?.classList.add('active');
    });
  });
}

/**
 * 语言切换函数
 */
function switchLanguage(lang) {
  document.querySelectorAll('[data-zh], [data-en]').forEach(el => {
    if (el.hasAttribute(`data-${lang}`)) {
      el.textContent = el.getAttribute(`data-${lang}`);
    }
  });
  localStorage.setItem('preferredLang', lang);
}

// ===== 页面初始化流程 =====
document.addEventListener('DOMContentLoaded', () => {
  // 1. 先加载组件
  componentLoader.loadAll().then(() => {
    // 2. 组件加载完成后初始化交互逻辑
    initApp();
    
    // 3. 调试用：确保导航栏已渲染
    console.log('Header content:', document.querySelector('.header').innerHTML);
  }).catch(err => {
    console.error('Failed to load components:', err);
  });
});