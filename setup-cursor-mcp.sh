#!/bin/bash

# Cursor MCP 서버 설정 스크립트

echo "🚀 Cursor MCP 서버 설정을 시작합니다..."

# 현재 디렉토리 확인
CURRENT_DIR=$(pwd)
echo "📁 현재 디렉토리: $CURRENT_DIR"

# 프로젝트 빌드
echo "🔨 프로젝트를 빌드합니다..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 빌드에 실패했습니다. 오류를 확인해주세요."
    exit 1
fi

echo "✅ 빌드가 완료되었습니다."

# Cursor 설정 디렉토리 확인
CURSOR_CONFIG_DIR=""
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CURSOR_CONFIG_DIR="$HOME/.cursor"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CURSOR_CONFIG_DIR="$HOME/.config/cursor"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash)
    CURSOR_CONFIG_DIR="$APPDATA/Cursor"
fi

if [ -z "$CURSOR_CONFIG_DIR" ]; then
    echo "❌ 지원되지 않는 운영체제입니다."
    exit 1
fi

echo "📂 Cursor 설정 디렉토리: $CURSOR_CONFIG_DIR"

# 설정 디렉토리 생성 (존재하지 않는 경우)
mkdir -p "$CURSOR_CONFIG_DIR"

# MCP 서버 설정 파일 경로
MCP_CONFIG_FILE="$CURSOR_CONFIG_DIR/mcp_servers.json"

# 기존 설정 파일이 있는지 확인
if [ -f "$MCP_CONFIG_FILE" ]; then
    echo "⚠️  기존 MCP 서버 설정 파일이 존재합니다."
    echo "📄 파일 위치: $MCP_CONFIG_FILE"
    echo ""
    echo "다음 설정을 기존 파일에 추가해주세요:"
    echo ""
    cat cursor-mcp-config.json
    echo ""
    echo "또는 기존 파일을 백업하고 새로 생성하려면 'y'를 입력하세요:"
    read -p "기존 파일을 백업하고 새로 생성하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # 백업 생성
        cp "$MCP_CONFIG_FILE" "$MCP_CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
        echo "✅ 기존 파일을 백업했습니다."
        
        # 새 설정 파일 생성
        cp cursor-mcp-config.json "$MCP_CONFIG_FILE"
        echo "✅ 새로운 MCP 서버 설정을 생성했습니다."
    fi
else
    # 새 설정 파일 생성
    cp cursor-mcp-config.json "$MCP_CONFIG_FILE"
    echo "✅ MCP 서버 설정 파일을 생성했습니다."
fi

echo ""
echo "🎉 설정이 완료되었습니다!"
echo ""
echo "다음 단계:"
echo "1. Cursor를 재시작하세요"
echo "2. 새로운 채팅을 시작하세요"
echo "3. 다음 명령으로 테스트해보세요:"
echo "   - '5와 3을 더해줘'"
echo "   - '서울의 날씨를 알려줘'"
echo "   - '프로젝트를 초기화해줘'"
echo ""
echo "📚 자세한 내용은 CURSOR_MCP_SETUP.md 파일을 참고하세요."
