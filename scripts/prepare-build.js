const fs = require('fs');
const path = require('path');

// API 라우트를 임시로 이동 (빌드에서 제외)
const apiDir = path.join(__dirname, '../app/api');
const tempApiDir = path.join(__dirname, '../app/.api-temp');

if (fs.existsSync(apiDir)) {
  // 임시 디렉토리로 이동
  if (fs.existsSync(tempApiDir)) {
    fs.rmSync(tempApiDir, { recursive: true, force: true });
  }
  fs.renameSync(apiDir, tempApiDir);
  console.log('API 라우트를 빌드에서 제외했습니다.');
}

