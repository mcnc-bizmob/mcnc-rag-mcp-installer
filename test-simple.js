#!/usr/bin/env node

console.log('=== MCNC RAG MCP Server 설치 테스트 ===');
console.log('Node.js 버전:', process.version);
console.log('플랫폼:', process.platform);

// 기본 실행 확인
if (require.main === module) {
  console.log('스크립트가 직접 실행되었습니다.');
} else {
  console.log('스크립트가 모듈로 로드되었습니다.');
}

console.log('테스트 완료!');