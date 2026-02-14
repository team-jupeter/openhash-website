import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 통계 섹션 패턴 (div.stats 내부의 모든 내용)
pattern = r'<div class="stats">[\s\S]*?</div>'

# 새로운 안내 메시지
new_content = '''        <!-- 안내 메시지 -->
        <div style="text-align: center; padding: 30px; color: #666; background: #f8f9ff; border-radius: 15px; margin-bottom: 40px;">
            <i class="fas fa-info-circle" style="font-size: 2rem; color: #5c6bc0; margin-bottom: 15px; display: block;"></i>
            <h3 style="color: #1a237e; margin-bottom: 10px;">특허 데이터베이스 사용 안내</h3>
            <p>우리는 오픈소스 원칙에 따라 모든 기술을 공개하지만, 제주도 필드 테스트 비용 조달을 위해, 일부 기술을 한시적으로 특허 출원하였습니다.</p>
        </div>'''

# 통계 섹션을 새로운 내용으로 교체
new_html = re.sub(pattern, new_content, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("통계 섹션이 새로운 안내 메시지로 교체되었습니다.")
