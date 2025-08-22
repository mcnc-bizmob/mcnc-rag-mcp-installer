# MCNC RAG MCP Server 설치 프로그램

MCNC RAG MCP Server를 위한 크로스 플랫폼 설치 스크립트입니다. Windows, macOS, Linux 모두 지원합니다.

## 🚀 빠른 설치

### 방법 1: 직접 실행 (권장)

**모든 플랫폼:**
```bash
curl -fsSL https://raw.githubusercontent.com/mcnc-bizmob/mcnc-rag-mcp-installer/main/install.js | node
```

**Windows PowerShell:**
```powershell
iwr https://raw.githubusercontent.com/mcnc-bizmob/mcnc-rag-mcp-installer/main/install.js -OutFile install.js; node install.js
```

### 방법 2: 저장소 클론

```bash
git clone https://github.com/mcnc-bizmob/mcnc-rag-mcp-installer.git
cd mcnc-rag-mcp-installer
node install.js
```

## 📋 사전 요구사항

- Node.js 18.0 이상만 있으면 됩니다!

## ✨ 간편 설치

**토큰 설정이나 권한 설정이 필요 없습니다!**  
공통 읽기 전용 토큰이 내장되어 있어 바로 설치할 수 있습니다.

## 📦 설치 과정

스크립트는 다음 작업을 자동으로 수행합니다:

1. **Node.js 설치 확인** - 필수 버전 체크
2. **Registry 설정** - `.npmrc` 파일 자동 생성 (토큰 포함)
3. **인증 테스트** - GitHub 접근 권한 확인
4. **패키지 설치** - `@mcnc-bizmob/mcnc-rag-mcp-server` 설치
5. **Claude 설정** - Claude Desktop 설정 가이드 제공

## 🛠️ Claude Desktop 설정

설치 완료 후 Claude Desktop 설정 파일에 다음 내용을 추가하세요:

**설정 파일 위치:**
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**설정 내용:**
```json
{
  "mcpServers": {
    "mcnc-rag": {
      "command": "npx",
      "args": ["@mcnc-bizmob/mcnc-rag-mcp-server"],
      "env": {
        "API_URL": "https://mcnc-rag-search-api.vercel.app/api"
      }
    }
  }
}
```

## 🔍 설치 확인

Claude Desktop에서 다음을 입력하여 설치를 확인하세요:

```
MCNC MCP 연결 테스트
```

## 🐛 문제 해결

### 일반적인 문제들

| 문제 | 해결방법 |
|------|----------|
| "401 Unauthorized" | 스크립트를 다시 실행해보세요 |
| "404 Not Found" | 네트워크 연결 확인 |
| "Node.js를 찾을 수 없음" | https://nodejs.org 에서 Node.js 설치 |
| "Claude에서 서버를 찾을 수 없음" | 설정 파일 경로와 내용 재확인 |

### 수동 설치 (문제 발생 시)

```bash
# 1. .npmrc 수동 설정 (읽기 전용 토큰 사용)
echo "@mcnc-bizmob:registry=https://npm.pkg.github.com/" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=ghp_DOe4t9***REDACTED***" >> ~/.npmrc

# 2. 패키지 설치
npm install -g @mcnc-bizmob/mcnc-rag-mcp-server

# 3. 설치 확인
npm list -g @mcnc-bizmob/mcnc-rag-mcp-server
```

## 📞 지원

문제가 발생하면 다음을 확인해주세요:

1. Node.js 버전: `node --version` (18.0 이상 필요)
2. npm 버전: `npm --version`
3. 네트워크 연결: 회사 방화벽 설정
4. GitHub 접근: https://github.com 접속 확인

## 🔄 업데이트

새 버전이 출시되면 동일한 명령어로 업데이트할 수 있습니다:

```bash
curl -fsSL https://raw.githubusercontent.com/mcnc-bizmob/mcnc-rag-mcp-installer/main/install.js | node
```

---

MCNC Bizmob Team에서 제공하는 공식 설치 도구입니다.