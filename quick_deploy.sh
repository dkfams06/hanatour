#!/bin/bash

# 한아투어 빠른 배포 스크립트
echo "🚀 한아투어 배포를 시작합니다..."

# 1. Git 변경사항 확인 및 자동 커밋 메시지 생성
echo "📝 변경사항을 확인하여 커밋 메시지를 생성 중..."

# Git 상태 확인
git_status=$(git status --porcelain)
added_files=$(echo "$git_status" | grep "^A" | wc -l | tr -d ' ')
modified_files=$(echo "$git_status" | grep "^M" | wc -l | tr -d ' ')
deleted_files=$(echo "$git_status" | grep "^D" | wc -l | tr -d ' ')
untracked_files=$(echo "$git_status" | grep "^??" | wc -l | tr -d ' ')

# 변경사항이 있는지 확인
if [ -z "$git_status" ]; then
    echo "ℹ️ 변경사항이 없습니다. 서버 배포만 진행합니다."
    skip_git=true
else
    # 변경사항 상세 분석 및 자동 커밋 메시지 생성
    echo "🔍 변경된 파일들을 분석 중..."
    
    # 변경된 파일 목록 가져오기
    modified_list=$(echo "$git_status" | grep "^M" | sed 's/^M *//' | head -5)
    added_list=$(echo "$git_status" | grep "^A" | sed 's/^A *//' | head -5)
    deleted_list=$(echo "$git_status" | grep "^D" | sed 's/^D *//' | head-3)
    untracked_list=$(echo "$git_status" | grep "^??" | sed 's/^?? *//' | head -3)
    
    # 변경 유형 분석
    has_components=false
    has_api=false
    has_config=false
    has_styles=false
    has_docs=false
    has_scripts=false
    
    # 모든 변경된 파일 검사
    all_files=$(echo "$git_status" | sed 's/^.. *//')
    
    for file in $all_files; do
        case "$file" in
            *components*|*Components*)
                has_components=true
                ;;
            *api*|*API*|*route.ts|*route.js)
                has_api=true
                ;;
            *.env*|*config*|*.json|package*)
                has_config=true
                ;;
            *.css|*.scss|*.sass|*styles*|*tailwind*)
                has_styles=true
                ;;
            *.md|*README*|*docs*)
                has_docs=true
                ;;
            *.sh|*deploy*|*script*)
                has_scripts=true
                ;;
        esac
    done
    
    # 커밋 메시지 구성
    commit_type="feat"
    commit_scope=""
    commit_description=""
    
    # 주요 변경 영역 판별
    if [ "$has_api" = true ] && [ "$has_components" = true ]; then
        commit_scope="api,ui"
        commit_description="API 라우트 및 UI 컴포넌트 업데이트"
    elif [ "$has_api" = true ]; then
        commit_scope="api"
        commit_description="API 엔드포인트 및 서버 로직 개선"
    elif [ "$has_components" = true ]; then
        commit_scope="ui"
        commit_description="사용자 인터페이스 컴포넌트 개선"
    elif [ "$has_config" = true ]; then
        commit_type="config"
        commit_description="프로젝트 설정 및 의존성 업데이트"
    elif [ "$has_styles" = true ]; then
        commit_scope="style"
        commit_description="UI 스타일링 및 디자인 개선"
    elif [ "$has_scripts" = true ]; then
        commit_type="build"
        commit_description="빌드 스크립트 및 배포 프로세스 개선"
    elif [ "$has_docs" = true ]; then
        commit_type="docs"
        commit_description="문서 및 README 업데이트"
    else
        commit_description="프로젝트 파일 업데이트"
    fi
    
    # 구체적인 변경 내용 추가
    details=""
    if [ $modified_files -gt 0 ]; then
        details="${details}${modified_files}개 파일 수정"
        if [ $modified_files -le 3 ]; then
            key_files=$(echo "$modified_list" | head -3 | tr '\n' ',' | sed 's/,$//')
            details="${details} (${key_files})"
        fi
    fi
    
    if [ $added_files -gt 0 ]; then
        if [ ! -z "$details" ]; then
            details="${details}, "
        fi
        details="${details}${added_files}개 파일 추가"
        if [ $added_files -le 2 ]; then
            key_files=$(echo "$added_list" | head -2 | tr '\n' ',' | sed 's/,$//')
            details="${details} (${key_files})"
        fi
    fi
    
    if [ $deleted_files -gt 0 ]; then
        if [ ! -z "$details" ]; then
            details="${details}, "
        fi
        details="${details}${deleted_files}개 파일 삭제"
    fi
    
    # 최종 커밋 메시지 구성
    if [ ! -z "$commit_scope" ]; then
        commit_message="${commit_type}(${commit_scope}): ${commit_description}"
    else
        commit_message="${commit_type}: ${commit_description}"
    fi
    
    if [ ! -z "$details" ]; then
        commit_message="${commit_message}

- ${details}
- 자동 배포: $(date '+%Y-%m-%d %H:%M:%S')"
    else
        commit_message="${commit_message} - 자동 배포 $(date '+%Y-%m-%d %H:%M')"
    fi
    
    echo "📋 생성된 커밋 메시지:"
    echo "   $commit_message"
    skip_git=false
fi

# 2. Git 작업 (로컬)
if [ "$skip_git" = false ]; then
    echo "📦 Git에 변경사항을 업로드 중..."
    git add .
    git commit -m "$commit_message"
    git push origin main

    if [ $? -eq 0 ]; then
        echo "✅ Git 업로드 완료!"
        
        # Git push 완료 확인 및 대기
        echo "⏳ 원격 저장소 동기화 확인 중..."
        sleep 3
        
        # 로컬과 원격 커밋 해시 비교
        local_commit=$(git rev-parse HEAD)
        remote_commit=$(git ls-remote origin main | head -1 | cut -f1)
        
        if [ "$local_commit" = "$remote_commit" ]; then
            echo "✅ 원격 저장소 동기화 확인 완료!"
        else
            echo "⚠️ 원격 저장소 동기화 대기 중..."
            sleep 5
            
            # 재확인
            remote_commit=$(git ls-remote origin main | head -1 | cut -f1)
            if [ "$local_commit" = "$remote_commit" ]; then
                echo "✅ 원격 저장소 동기화 확인 완료!"
            else
                echo "❌ 원격 저장소 동기화 실패! 배포를 중단합니다."
                echo "   로컬 커밋: $local_commit"
                echo "   원격 커밋: $remote_commit"
                exit 1
            fi
        fi
    else
        echo "❌ Git 업로드 실패!"
        exit 1
    fi
else
    echo "⏭️ Git 변경사항이 없으므로 업로드를 건너뜁니다."
fi

# 3. 서버 접속 및 배포 실행
echo "🌐 서버에 접속하여 배포를 시작합니다..."
ssh opc@193.123.248.53 << 'EOF'
cd myproject
echo "📂 myproject 디렉토리로 이동완료"
echo "🔄 deploy_hanatour.sh 실행 중..."
./deploy_hanatour.sh
echo "✅ 서버 배포 완료!"
EOF

echo "🎉 전체 배포가 성공적으로 완료되었습니다!"
echo "💡 이제 웹사이트에서 변경사항을 확인할 수 있습니다."