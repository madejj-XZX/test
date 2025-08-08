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
          .then(res => res.text())
          .then(html => {
            this.components[name].content = html;
          })
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

// 注册组件（可以在各个页面单独注册需要的组件）
componentLoader.register('header', 'components/header.html');
componentLoader.register('footer', 'components/footer.html');

// 页面加载后自动加载组件
document.addEventListener('DOMContentLoaded', () => {
  componentLoader.loadAll();
});