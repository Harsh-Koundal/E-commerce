import fs from 'fs';
import path from 'path';

const routesDir = './routes'; // adjust path

// Matches: authMiddleware and inserts after it
const authRegex = /(authMiddleware)(\s*,)/g;

function injectSwaggerAfterAuth(content) {
  return content.replace(authRegex, (match, auth, comma) => {
    return `${auth}${comma}
  /*#swagger.tags = ['Protected']
  #swagger.security = [{ "BearerAuth": [] }]
  #swagger.description = 'Protected route'*/`;
  });
}

function processRoutes(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      processRoutes(filePath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const updated = injectSwaggerAfterAuth(content);
      if (updated !== content) {
        fs.writeFileSync(filePath, updated, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
      } else {
        console.log(`⚠️ No authMiddleware found: ${filePath}`);
      }
    }
  });
}

processRoutes(routesDir);
