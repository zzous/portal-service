const fs = require('fs');
const path = require('path');

// API 라우트를 scripts 디렉토리 안으로 이동 (Next.js가 스캔하지 않음)
const apiDir = path.join(__dirname, '../app/api');
const tempApiDir = path.join(__dirname, 'api-temp');

if (fs.existsSync(apiDir)) {
  // scripts 디렉토리 안의 임시 디렉토리로 이동 (Next.js가 스캔하지 않음)
  if (fs.existsSync(tempApiDir)) {
    fs.rmSync(tempApiDir, { recursive: true, force: true });
  }
  fs.renameSync(apiDir, tempApiDir);
  console.log('✓ API 라우트를 빌드에서 제외했습니다.');
} else {
  console.log('ℹ API 라우트가 없습니다.');
}

