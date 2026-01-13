const fs = require('fs');
const path = require('path');

// 빌드 후 API 라우트 복원
const apiDir = path.join(__dirname, '../app/api');
const tempApiDir = path.join(__dirname, 'api-temp');

if (fs.existsSync(tempApiDir)) {
  // 원래 위치로 복원
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
  }
  fs.renameSync(tempApiDir, apiDir);
  console.log('✓ API 라우트를 복원했습니다.');
} else {
  console.log('ℹ 복원할 API 라우트가 없습니다.');
}

