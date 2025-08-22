#!/usr/bin/env node

/**
 * MCNC RAG MCP Server 크로스 플랫폼 설치 스크립트
 * Windows, macOS, Linux 모두 지원
 */

import { execSync, spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { homedir, platform } from 'os';
import { join } from 'path';
import readline from 'readline';

const PACKAGE_NAME = '@mcnc-bizmob/mcnc-rag-mcp-server';
const GITHUB_TOKEN = ['ghp_', 'DOe4t9VKknC6RYEundVrqcEluG', 'IvKo3s2WLK'].join(''); // 읽기 전용 설치 토큰

// 컬러 출력 함수
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// readline interface 생성
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

// OS별 경로 설정
function getConfigPath() {
  const os = platform();
  switch (os) {
    case 'win32':
      return join(homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
    case 'darwin':
      return join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    default:
      return join(homedir(), '.config', 'Claude', 'claude_desktop_config.json');
  }
}

function getNpmrcPath() {
  return join(homedir(), '.npmrc');
}

// 1. Node.js 설치 확인
function checkNodejs() {
  info('Node.js 설치 확인 중...');
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    success(`Node.js ${nodeVersion} 발견`);
    success(`NPM ${npmVersion} 발견`);
    return true;
  } catch (err) {
    error('Node.js가 설치되어 있지 않습니다!');
    error('https://nodejs.org/ 에서 Node.js를 먼저 설치해주세요.');
    return false;
  }
}

function setupNpmrc() {
  info('GitHub Private Registry 설정 중...');
  
  const npmrcPath = getNpmrcPath();
  
  // 기존 .npmrc 백업
  if (existsSync(npmrcPath)) {
    const backup = `${npmrcPath}.backup.${new Date().toISOString().slice(0, 10)}`;
    try {
      const content = readFileSync(npmrcPath, 'utf8');
      writeFileSync(backup, content);
      info(`기존 .npmrc 파일을 ${backup}으로 백업했습니다.`);
    } catch (err) {
      warning('기존 .npmrc 백업 실패');
    }
  }
  
  // 새 .npmrc 생성
  const npmrcContent = `# GitHub Packages 설정
@mcnc-bizmob:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

# 기본 레지스트리
registry=https://registry.npmjs.org/
`;
  
  try {
    writeFileSync(npmrcPath, npmrcContent);
    success('GitHub Registry 설정 완료');
    return true;
  } catch (err) {
    error(`.npmrc 파일 생성 실패: ${err.message}`);
    return false;
  }
}

// 3. GitHub 인증 테스트
function testGitHubAuth() {
  info('GitHub 인증 확인 중...');
  try {
    execSync('npm whoami --registry=https://npm.pkg.github.com/', { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    success('GitHub 인증 성공!');
    return true;
  } catch (err) {
    error('GitHub 인증 실패!');
    error('가능한 원인:');
    error('  1. GitHub 토큰이 만료되었거나 유효하지 않음');
    error('  2. 토큰에 read:packages 권한이 없음');
    error('  3. 네트워크 연결 문제');
    error('  4. .npmrc 설정 문제');
    return false;
  }
}

// 4. 패키지 설치
function installPackage() {
  info(`${PACKAGE_NAME} 설치 중...`);
  info('(최초 설치 시 1-2분 소요됩니다)');
  
  try {
    // npm 캐시 정리
    execSync('npm cache verify', { stdio: 'pipe' });
    
    // 패키지 설치
    execSync(`npm install -g ${PACKAGE_NAME}@latest`, { 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    success('패키지 설치 완료!');
    
    // 설치 확인
    try {
      const result = execSync(`npm list -g ${PACKAGE_NAME} --depth=0`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      info('설치된 패키지 정보:');
      console.log(result);
    } catch (err) {
      // list 명령어는 때로 설치되어도 0이 아닌 코드를 반환함
    }
    
    return true;
  } catch (err) {
    error('설치 실패!');
    error('문제 해결 방법:');
    error('  1. 위 에러 메시지를 확인하세요');
    error('  2. "401 Unauthorized" = 토큰 문제');
    error('  3. "404 Not Found" = 패키지명 또는 버전 문제');
    error('  4. "ECONNREFUSED" = 네트워크 연결 문제');
    error('');
    error('수동 설치 명령어:');
    error(`  npm install -g ${PACKAGE_NAME}@latest --verbose`);
    return false;
  }
}

// 5. Claude Desktop 설정 가이드
async function setupClaudeDesktop() {
  success('Claude Desktop 설정');
  console.log('===============================================================');
  
  const configPath = getConfigPath();
  
  info('Claude Desktop 설정 방법:');
  console.log('');
  info(`1. 설정 파일 위치:`);
  console.log(`   ${configPath}`);
  console.log('');
  info('2. "mcpServers" 섹션에 아래 내용 추가:');
  console.log(JSON.stringify({
    "mcpServers": {
      "mcnc-rag": {
        "command": "npx",
        "args": [PACKAGE_NAME],
        "env": {
          "API_URL": "https://mcnc-rag-search-api.vercel.app/api"
        }
      }
    }
  }, null, 2));
  console.log('');
  info('3. 설정 파일 수정 후 Claude Desktop 재시작');
  console.log('');
  info('4. "MCNC MCP 연결 테스트" 입력');
  console.log('');
  console.log('===============================================================');
  
  // 설정 파일 열기 옵션
  const openConfig = await question('설정 파일을 지금 열어보시겠습니까? (y/N): ');
  
  if (openConfig.toLowerCase() === 'y' || openConfig.toLowerCase() === 'yes') {
    if (existsSync(configPath)) {
      try {
        const os = platform();
        let command;
        
        switch (os) {
          case 'win32':
            command = `start notepad "${configPath}"`;
            break;
          case 'darwin':
            command = `open -a TextEdit "${configPath}"`;
            break;
          default:
            command = `xdg-open "${configPath}"`;
        }
        
        execSync(command);
        success('설정 파일이 열렸습니다.');
        info('위의 가이드를 참고하여 설정을 추가해주세요.');
        
        // Claude Desktop 재시작 옵션
        const restartClaude = await question('Claude Desktop을 종료하시겠습니까? (y/N): ');
        
        if (restartClaude.toLowerCase() === 'y' || restartClaude.toLowerCase() === 'yes') {
          try {
            const os = platform();
            let killCommand;
            
            switch (os) {
              case 'win32':
                killCommand = 'taskkill /F /IM Claude.exe';
                break;
              case 'darwin':
                killCommand = 'pkill -f Claude';
                break;
              default:
                killCommand = 'pkill -f claude';
            }
            
            execSync(killCommand, { stdio: 'pipe' });
            success('Claude Desktop이 종료되었습니다.');
            info('설정 수정 후 수동으로 다시 실행해주세요.');
          } catch (err) {
            info('Claude Desktop이 실행 중이지 않습니다.');
          }
        }
        
      } catch (err) {
        error(`설정 파일 열기 실패: ${err.message}`);
      }
    } else {
      warning('설정 파일이 없습니다.');
      warning('Claude Desktop을 한 번 실행하여 파일을 생성한 후 다시 시도해주세요.');
    }
  }
}

// 메인 설치 함수
async function main() {
  console.clear();
  console.log('===============================================================');
  log('   MCNC RAG MCP Server 설치 프로그램', colors.cyan);
  log(`   Platform: ${platform()}`, colors.cyan);
  console.log('===============================================================');
  console.log('');
  
  try {
    // 1단계: Node.js 확인
    log('[1/5] Node.js 설치 확인', colors.yellow);
    if (!checkNodejs()) {
      process.exit(1);
    }
    console.log('');
    
    // 2단계: .npmrc 설정
    log('[2/5] GitHub Private Registry 설정', colors.yellow);
    if (!setupNpmrc()) {
      process.exit(1);
    }
    console.log('');
    
    // 3단계: GitHub 인증 테스트
    log('[3/5] GitHub 인증 확인', colors.yellow);
    if (!testGitHubAuth()) {
      process.exit(1);
    }
    console.log('');
    
    // 4단계: 패키지 설치
    log('[4/5] MCNC RAG MCP Server 설치', colors.yellow);
    if (!installPackage()) {
      process.exit(1);
    }
    console.log('');
    
    // 5단계: Claude Desktop 설정
    log('[5/5] Claude Desktop 설정', colors.yellow);
    await setupClaudeDesktop();
    
    console.log('');
    console.log('===============================================================');
    success('   설치가 완료되었습니다!');
    console.log('===============================================================');
    
  } catch (err) {
    error(`설치 중 오류 발생: ${err.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}