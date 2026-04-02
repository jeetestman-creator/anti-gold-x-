const fs = require('fs');
const path = require('path');

const pages = [
  'Landing', 'Login', 'Register', 'OtpVerification', 'Dashboard', 
  'AdminPanel', 'Deposit', 'Withdraw', 'ReferralLevels', 'Profile', 
  'Transactions', 'Support', 'DownlineAnalytics', 'TeamGrowthSimulator'
];

const srcDir = path.join(__dirname, 'frontend', 'src');
const pagesDir = path.join(srcDir, 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

let appImports = `import React from 'react';\nimport { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';\nimport Calculator from './pages/Calculator/Calculator';\n`;
let appRoutes = `<Router>\n  <div className="app-wrapper">\n    <Routes>\n      <Route path="/calculator" element={<Calculator />} />\n`;

pages.forEach(page => {
  const pageDir = path.join(pagesDir, page);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

  const compContent = `import React from 'react';
import './${page}.css';

const ${page} = () => {
  return (
    <div className="page-container ${page.toLowerCase()}">
      <h2>${page.replace(/([A-Z])/g, ' $1').trim()}</h2>
      <p>This is the placeholder for the ${page} page functionality.</p>
    </div>
  );
};

export default ${page};
`;
  
  const cssContent = `.${page.toLowerCase()} {\n  /* Vanilla CSS for ${page} */\n}\n`;

  fs.writeFileSync(path.join(pageDir, `${page}.jsx`), compContent);
  fs.writeFileSync(path.join(pageDir, `${page}.css`), cssContent);

  appImports += `import ${page} from './pages/${page}/${page}';\n`;
  
  let routePath = `/${page.toLowerCase().replace('panel', '').replace('analytics', '-analytics')}`;
  if (page === 'Landing') routePath = '/';
  if (page === 'Dashboard' || page === 'AdminPanel') routePath += '/*';
  
  appRoutes += `      <Route path="${routePath}" element={<${page} />} />\n`;
});

appRoutes += `      <Route path="*" element={<Navigate to="/" replace />} />\n    </Routes>\n  </div>\n</Router>`;

const appContent = `${appImports}\nconst App = () => {\n  return (\n    ${appRoutes}\n  );\n};\n\nexport default App;\n`;

fs.writeFileSync(path.join(srcDir, 'App.jsx'), appContent);
console.log('Successfully generated all pages and routed App.jsx');
