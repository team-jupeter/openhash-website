# OpenHash 웹사이트 디자인 지침서

**버전**: 1.0
**최종 업데이트**: 2026-01-26
**적용 대상**: openhash.kr 전체 페이지

---

## 1. 디자인 원칙

### 1.1 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **미니멀리즘** | 불필요한 장식 요소 배제, 콘텐츠 중심 |
| **일관성** | 동일한 색상, 간격, 컴포넌트 재사용 |
| **전문성** | 정부/공공기관 수준의 신뢰감 |
| **가독성** | 명확한 계층 구조, 충분한 여백 |

### 1.2 금지 사항

- ❌ 화려한 그라데이션 배경
- ❌ 과도한 애니메이션 (pulse, bounce 등)
- ❌ hover 시 transform/scale 효과
- ❌ 다색 무지개 보더
- ❌ 그림자 남용
- ❌ 이모지 과다 사용

### 1.3 권장 사항

- ✅ 단색 배경
- ✅ 미세한 transition (0.15s~0.2s)
- ✅ hover 시 border-color 변경만
- ✅ 단일 accent 색상
- ✅ 충분한 여백 (4px 배수)

---

## 2. 색상 시스템

### 2.1 주요 색상
```css
:root {
    /* Primary - 네이비 */
    --primary: #1a3a6e;
    --primary-dark: #0f2442;
    --primary-light: #2a4a7e;
    
    /* Accent - 골드 */
    --accent: #d4a017;
    --accent-dark: #b8860b;
    
    /* Semantic */
    --success: #0d6832;
    --success-light: rgba(13, 104, 50, 0.1);
    --warning: #e67700;
    --warning-light: rgba(230, 119, 0, 0.1);
    --error: #c92a2a;
    --error-light: rgba(201, 42, 42, 0.1);
    
    /* Neutral */
    --white: #ffffff;
    --gray-50: #f8f9fa;
    --gray-100: #f1f3f5;
    --gray-200: #e9ecef;
    --gray-300: #dee2e6;
    --gray-400: #ced4da;
    --gray-500: #868e96;
    --gray-600: #495057;
    --gray-700: #343a40;
    --gray-900: #212529;
}
```

### 2.2 색상 사용 규칙

| 용도 | 색상 |
|------|------|
| 네비게이션 배경 | `--primary` |
| 네비게이션 하단 라인 | `--accent` |
| Hero 섹션 배경 | `--primary` |
| 링크/강조 텍스트 | `--primary` |
| 버튼 (Primary) | `--primary` 배경, 흰색 텍스트 |
| 버튼 (Secondary) | 흰색 배경, `--primary` 테두리 |
| 성공 상태 | `--success` |
| 경고 상태 | `--warning` |
| 오류 상태 | `--error` |
| 본문 텍스트 | `--gray-700` 또는 `--gray-900` |
| 보조 텍스트 | `--gray-500` |
| 카드 배경 | `--white` |
| 페이지 배경 | `--gray-50` 또는 `--white` |

---

## 3. 타이포그래피

### 3.1 폰트 패밀리
```css
:root {
    --font-sans: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', 'Consolas', monospace;
}
```

### 3.2 폰트 크기

| 용도 | 크기 | 굵기 | line-height |
|------|------|------|-------------|
| 페이지 제목 (h1) | 28-32px | 700 | 1.3 |
| 섹션 제목 (h2) | 20-24px | 700 | 1.4 |
| 카드 제목 (h3) | 16-18px | 600 | 1.4 |
| 소제목 (h4) | 14-15px | 600 | 1.5 |
| 본문 | 14-15px | 400 | 1.6-1.7 |
| 보조 텍스트 | 12-13px | 400 | 1.5 |
| 코드 | 13px | 400 | 1.5 |
| 배지/라벨 | 11-12px | 500-600 | 1.2 |

### 3.3 Google Fonts 로드
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 4. 간격 시스템

### 4.1 간격 변수
```css
:root {
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 24px;
    --space-6: 32px;
    --space-7: 48px;
    --space-8: 64px;
}
```

### 4.2 사용 규칙

| 용도 | 간격 |
|------|------|
| 인라인 요소 간격 | `--space-2` (8px) |
| 관련 요소 그룹 | `--space-3` ~ `--space-4` (12-16px) |
| 카드 내부 패딩 | `--space-5` (24px) |
| 섹션 간 간격 | `--space-6` ~ `--space-7` (32-48px) |
| 페이지 상하 패딩 | `--space-8` (64px) |

---

## 5. 레이아웃

### 5.1 컨테이너
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-5);
}
```

### 5.2 그리드
```css
/* 카드 그리드 */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-5);
}

/* 2컬럼 레이아웃 (기술 페이지) */
.two-column {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: var(--space-6);
}

/* 3컬럼 레이아웃 */
.three-column {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-5);
}
```

---

## 6. 컴포넌트

### 6.1 네비게이션
```html
<nav class="nav">
    <div class="nav-inner">
        <a href="/" class="logo">
            <span class="logo-icon">◈</span> OpenHash
        </a>
        <ul class="nav-menu">
            <li><a href="/">홈</a></li>
            <li><a href="/technology/">기술</a></li>
            <li><a href="/simulation/" class="active">시뮬레이션</a></li>
            <li><a href="/tests/">테스트</a></li>
        </ul>
    </div>
</nav>
```
```css
.nav {
    background: var(--primary);
    border-bottom: 2px solid var(--accent);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-5);
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    color: var(--white);
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
}

.logo-icon {
    color: var(--accent);
}

.nav-menu {
    display: flex;
    gap: var(--space-5);
    list-style: none;
}

.nav-menu a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.15s;
}

.nav-menu a:hover,
.nav-menu a.active {
    color: var(--white);
}
```

### 6.2 Hero 섹션
```html
<section class="hero">
    <div class="container">
        <span class="hero-badge">기술 문서</span>
        <h1>5단계 계층 구조</h1>
        <p>전 세계를 5단계로 분할하여 관리하는 분산 데이터 구조</p>
    </div>
</section>
```
```css
.hero {
    background: var(--primary);
    color: var(--white);
    padding: var(--space-8) 0;
    text-align: center;
}

.hero-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.15);
    padding: var(--space-1) var(--space-3);
    border-radius: 20px;
    font-size: 12px;
    margin-bottom: var(--space-4);
}

.hero h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: var(--space-3);
}

.hero p {
    font-size: 16px;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
}
```

### 6.3 카드
```html
<div class="card">
    <div class="card-header">
        <span class="card-badge">모듈</span>
        <h3>계층 구조</h3>
    </div>
    <p class="card-desc">5단계 분산 데이터 관리 시스템</p>
</div>
```
```css
.card {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: var(--space-5);
    transition: border-color 0.15s;
}

.card:hover {
    border-color: var(--primary);
}

.card-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
}

.card-badge {
    background: var(--gray-100);
    color: var(--gray-600);
    padding: var(--space-1) var(--space-2);
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
}

.card h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
}

.card-desc {
    font-size: 14px;
    color: var(--gray-600);
    line-height: 1.6;
}
```

### 6.4 버튼
```html
<button class="btn btn-primary">실행</button>
<button class="btn btn-secondary">취소</button>
```
```css
.btn {
    padding: var(--space-2) var(--space-4);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--primary);
    color: var(--white);
    border-color: var(--primary);
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.btn-secondary {
    background: var(--white);
    color: var(--primary);
    border-color: var(--primary);
}

.btn-secondary:hover {
    background: var(--gray-50);
}
```

### 6.5 테이블
```html
<table class="table">
    <thead>
        <tr>
            <th>계층</th>
            <th>범위</th>
            <th>예시</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>L5</td>
            <td>글로벌</td>
            <td>GLOBAL</td>
        </tr>
    </tbody>
</table>
```
```css
.table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.table th,
.table td {
    padding: var(--space-3) var(--space-4);
    text-align: left;
    border: 1px solid var(--gray-200);
}

.table th {
    background: var(--gray-100);
    font-weight: 600;
    color: var(--gray-700);
}

.table td {
    color: var(--gray-600);
}

.table tr:hover td {
    background: var(--gray-50);
}
```

### 6.6 코드 블록
```html
<pre class="code-block"><code>function verify(hash) {
    return SHA256(data) === hash;
}</code></pre>
```
```css
.code-block {
    background: var(--gray-100);
    border: 1px solid var(--gray-200);
    border-radius: 6px;
    padding: var(--space-4);
    overflow-x: auto;
}

.code-block code {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--gray-700);
    line-height: 1.5;
}
```

### 6.7 사이드바
```html
<aside class="sidebar">
    <h4>관련 모듈</h4>
    <ul class="sidebar-list">
        <li><a href="#">100 - 계층 정의</a></li>
        <li><a href="#">110 - 노드 구조</a></li>
    </ul>
</aside>
```
```css
.sidebar {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: var(--space-5);
    position: sticky;
    top: 80px;
}

.sidebar h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-4);
}

.sidebar-list {
    list-style: none;
}

.sidebar-list li {
    margin-bottom: var(--space-2);
}

.sidebar-list a {
    color: var(--gray-600);
    text-decoration: none;
    font-size: 13px;
    transition: color 0.15s;
}

.sidebar-list a:hover {
    color: var(--primary);
}
```

### 6.8 Footer
```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <a href="/" class="logo">
                <span class="logo-icon">◈</span> OpenHash
            </a>
            <div class="footer-links">
                <a href="/technology/">기술</a>
                <a href="/simulation/">시뮬레이션</a>
                <a href="/tests/">테스트</a>
            </div>
        </div>
        <p class="footer-copy">© 2026 OpenHash. 차세대 분산 데이터 무결성 검증 시스템</p>
    </div>
</footer>
```
```css
.footer {
    background: var(--gray-900);
    color: var(--gray-400);
    padding: var(--space-7) 0;
    margin-top: var(--space-8);
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-5);
}

.footer .logo {
    color: var(--white);
}

.footer-links {
    display: flex;
    gap: var(--space-5);
}

.footer-links a {
    color: var(--gray-400);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.15s;
}

.footer-links a:hover {
    color: var(--white);
}

.footer-copy {
    font-size: 13px;
    text-align: center;
    padding-top: var(--space-5);
    border-top: 1px solid var(--gray-700);
}
```

---

## 7. 페이지 템플릿

### 7.1 기본 페이지 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>페이지 제목 - OpenHash</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <!-- 네비게이션 -->
    <nav class="nav">...</nav>
    
    <!-- Hero 섹션 -->
    <section class="hero">...</section>
    
    <!-- 메인 콘텐츠 -->
    <main class="content">
        <div class="container">
            ...
        </div>
    </main>
    
    <!-- Footer -->
    <footer class="footer">...</footer>
</body>
</html>
```

### 7.2 기술 문서 페이지
```html
<!-- tech-common.css 추가 로드 -->
<link rel="stylesheet" href="/technology/tech-common.css">

<main class="tech-content">
    <div class="container">
        <div class="tech-wrapper">
            <!-- 메인 콘텐츠 -->
            <article class="tech-article">
                <section class="tech-section">
                    <h2>섹션 제목</h2>
                    <p>내용...</p>
                </section>
            </article>
            
            <!-- 사이드바 -->
            <aside class="sidebar">...</aside>
        </div>
    </div>
</main>
```

### 7.3 시뮬레이션 페이지
```html
<!-- sim-common.css 추가 로드 -->
<link rel="stylesheet" href="/simulation/sim-common.css">

<main class="sim-content">
    <div class="container">
        <div class="sim-wrapper">
            <!-- 컨트롤 패널 -->
            <div class="control-panel">
                <h3>설정</h3>
                <div class="control-group">
                    <label class="control-label">옵션</label>
                    <select class="control-select">...</select>
                </div>
                <button class="run-btn">실행</button>
            </div>
            
            <!-- 시각화 영역 -->
            <div class="viz-area">
                <h3>시각화</h3>
                ...
                <div class="log-area" id="logArea">
                    <div class="log-line info">[시스템] 준비 완료</div>
                </div>
            </div>
            
            <!-- 결과 패널 -->
            <div class="result-panel">
                <h3>결과</h3>
                ...
            </div>
        </div>
    </div>
</main>
```

---

## 8. 반응형 디자인

### 8.1 브레이크포인트
```css
/* 태블릿 */
@media (max-width: 1024px) {
    .two-column {
        grid-template-columns: 1fr;
    }
    
    .sidebar {
        position: static;
    }
}

/* 모바일 */
@media (max-width: 768px) {
    .nav-menu {
        display: none; /* 햄버거 메뉴로 대체 */
    }
    
    .hero h1 {
        font-size: 24px;
    }
    
    .card-grid {
        grid-template-columns: 1fr;
    }
    
    .container {
        padding: 0 var(--space-4);
    }
}
```

---

## 9. 파일 구조
```
openhash-website/
├── index.html              # 홈페이지
├── style.css               # 메인 스타일 (공통)
│
├── css/
│   ├── variables.css       # CSS 변수
│   ├── base.css            # 기본 스타일
│   ├── components.css      # 컴포넌트
│   └── sections.css        # 섹션별 스타일
│
├── js/
│   ├── main.js             # 공통 JS
│   └── sim-*.js            # 시뮬레이션별 JS
│
├── technology/
│   ├── index.html          # 기술 목록
│   ├── tech-common.css     # 기술 페이지 공통 CSS
│   └── *.html              # 개별 기술 문서
│
├── simulation/
│   ├── index.html          # 시뮬레이션 목록
│   ├── sim-common.css      # 시뮬레이션 공통 CSS
│   └── *.html              # 개별 시뮬레이션
│
├── tests/
│   ├── index.html          # 테스트 센터
│   ├── test-detail.css     # 테스트 상세 CSS
│   └── category-*.html     # 카테고리별 페이지
│
└── docs/
    └── DESIGN_GUIDELINES.md # 이 문서
```

---

## 10. 새 페이지 추가 체크리스트

### 10.1 HTML 체크리스트

- [ ] `<!DOCTYPE html>` 선언
- [ ] `<html lang="ko">` 설정
- [ ] 적절한 `<title>` (형식: "페이지명 - OpenHash")
- [ ] Google Fonts 로드
- [ ] 공통 CSS (`/style.css`) 로드
- [ ] 페이지 유형별 CSS 로드 (tech-common.css 등)
- [ ] 네비게이션 포함 (active 클래스 적용)
- [ ] Hero 섹션 포함
- [ ] Footer 포함
- [ ] 시맨틱 태그 사용 (`<main>`, `<section>`, `<article>`)

### 10.2 스타일 체크리스트

- [ ] CSS 변수 사용 (하드코딩 금지)
- [ ] 4px 배수 간격 사용
- [ ] 정의된 색상만 사용
- [ ] hover 효과는 border-color 또는 color만
- [ ] transition은 0.15s~0.2s
- [ ] 애니메이션 최소화

### 10.3 콘텐츠 체크리스트

- [ ] h1은 페이지당 1개
- [ ] 제목 계층 순서 (h1 → h2 → h3)
- [ ] 표는 `<table class="table">` 사용
- [ ] 코드는 `<pre class="code-block">` 사용
- [ ] 링크에 적절한 hover 스타일

---

*문서 끝*
