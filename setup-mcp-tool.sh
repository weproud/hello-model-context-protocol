#!/bin/bash

# MCP Tool 설정 스크립트
echo "🔧 MCP Tool 설정을 시작합니다..."

PROJECT_DIR="/Users/raiiz/madeinnook/workspace/hello-model-context-protocol"

# 1. 프로젝트 디렉토리로 이동
echo "📁 프로젝트 디렉토리로 이동: $PROJECT_DIR"
cd "$PROJECT_DIR" || {
    echo "❌ 프로젝트 디렉토리를 찾을 수 없습니다: $PROJECT_DIR"
    exit 1
}

# 2. 의존성 설치 확인
echo "📦 의존성 확인 중..."
if [ ! -d "node_modules" ]; then
    echo "📥 의존성 설치 중..."
    npm install
fi

# 3. bash 스크립트 실행 권한 부여
echo "🔐 실행 권한 설정 중..."
chmod +x mcp-tool.sh

# 4. 테스트 실행
echo "🧪 CLI 테스트 중..."
echo "Add 명령 테스트:"
npm run mcp-tool -- add 3 2

echo ""
echo "Help 명령 테스트:"
npm run mcp-tool -- --help

echo ""
echo "✅ MCP Tool 설정이 완료되었습니다!"
echo ""
echo "🚀 사용 방법:"
echo "1. 프로젝트 디렉토리에서:"
echo "   npm run mcp-tool -- add 3 2"
echo "   ./mcp-tool.sh add 3 2"
echo ""
echo "2. 전역 설치 (선택사항):"
echo "   npm link"
echo "   mcp-tool add 3 2"
echo ""
echo "3. Alias 설정 (선택사항):"
echo "   echo 'alias mcp-tool=\"cd $PROJECT_DIR && npm run mcp-tool --\"' >> ~/.zshrc"
echo "   source ~/.zshrc"
