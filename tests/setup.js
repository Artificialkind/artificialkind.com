// Test setup file for Jest
// Mock DOM elements that the scripts expect

// Setup basic DOM structure
document.body.innerHTML = `
  <div id="page-container">
    <header id="main-header">
      <div class="container et_menu_container">
        <nav id="top-menu-nav">
          <ul id="top-menu" class="nav"></ul>
        </nav>
        <div id="et_mobile_nav_menu">
          <div class="mobile_nav closed">
            <span class="mobile_menu_bar"></span>
          </div>
        </div>
      </div>
      <div class="et_search_outer">
        <div class="container et_search_form_container">
          <form class="et-search-form">
            <input type="search" class="et-search-field">
          </form>
        </div>
      </div>
    </header>
    <div id="loftloader-wrapper" class="pl-imgloading">
      <div class="loader-inner">
        <div id="loader"></div>
      </div>
    </div>
  </div>
`;

// Mock window methods
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));