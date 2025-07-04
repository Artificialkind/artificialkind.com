// Setup module functions for testing
// Load the actual JavaScript files and make functions available globally

const fs = require('fs');
const path = require('path');

// Create a mock window object
global.window = global;

// Load and execute each module file
const modules = ['navigation', 'preloader', 'animations', 'accessibility'];

modules.forEach(moduleName => {
    const filePath = path.join(__dirname, '../../js', `${moduleName}.js`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Execute the file content in the global context
    // This will create the window.initXXX functions
    eval(fileContent);
});

// Export the functions for tests
module.exports = {
    initNavigation: global.initNavigation,
    initPreloader: global.initPreloader,
    initAnimations: global.initAnimations,
    initAccessibility: global.initAccessibility
};