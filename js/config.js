/**
 * OpenHash Node API Configuration
 * 모드 선택: Mock-up / Backend 연동
 */
const OpenHashConfig = {
    // 현재 모드 (mockup | backend)
    mode: 'mockup',
    
    // 노드 연결 상태
    connected: false,
    
    // 계층별 프록시 경로
    LAYERS: {
        L4: { path: '/api/node/l4', id: 'KR', name: '국가' },
        L3: { path: '/api/node/l3', id: 'KR-JEJU', name: '광역시도' },
        L2: { path: '/api/node/l2', id: 'KR-JEJU-SEOGWIPO', name: '시군구' },
        L1: { path: '/api/node/l1', id: 'KR-JEJU-SEOGWIPO-JUNGMUN', name: '읍면동' }
    },
    
    // 모드 설정
    setMode(mode) {
        this.mode = mode;
        localStorage.setItem('openhash_mode', mode);
        this.updateModeUI();
        console.log('OpenHash Mode:', mode);
    },
    
    // 저장된 모드 로드
    loadMode() {
        const saved = localStorage.getItem('openhash_mode');
        this.mode = saved || 'mockup';
        return this.mode;
    },
    
    // Mock 모드인지 확인
    isMockup() {
        return this.mode === 'mockup';
    },
    
    // Backend 모드인지 확인
    isBackend() {
        return this.mode === 'backend' && this.connected;
    },
    
    // 모드 UI 업데이트
    updateModeUI() {
        const toggle = document.getElementById('modeToggle');
        const label = document.getElementById('modeLabel');
        if (toggle) toggle.checked = this.mode === 'backend';
        if (label) {
            label.textContent = this.mode === 'backend' ? 'Backend 연동' : 'Mock-up';
            label.className = 'mode-label ' + this.mode;
        }
    },
    
    // 모드 선택 UI 생성
    createModeToggle(container) {
        const html = `
            <div class="mode-selector">
                <span class="mode-title">시뮬레이션 모드</span>
                <div class="mode-switch">
                    <span class="mode-option ${this.mode === 'mockup' ? 'active' : ''}" data-mode="mockup">Mock-up</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="modeToggle" ${this.mode === 'backend' ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="mode-option ${this.mode === 'backend' ? 'active' : ''}" data-mode="backend">Backend</span>
                </div>
                <span class="mode-label ${this.mode}" id="modeLabel">${this.mode === 'backend' ? 'Backend 연동' : 'Mock-up'}</span>
            </div>
        `;
        
        if (typeof container === 'string') {
            container = document.getElementById(container) || document.querySelector(container);
        }
        
        if (container) {
            container.insertAdjacentHTML('afterbegin', html);
            
            // 이벤트 리스너
            const toggle = document.getElementById('modeToggle');
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    const newMode = e.target.checked ? 'backend' : 'mockup';
                    this.setMode(newMode);
                    
                    // 옵션 활성화 표시
                    document.querySelectorAll('.mode-option').forEach(opt => {
                        opt.classList.toggle('active', opt.dataset.mode === newMode);
                    });
                    
                    // Backend 모드에서 노드 미연결 시 경고
                    if (newMode === 'backend' && !this.connected) {
                        alert('⚠️ Backend 노드에 연결되지 않았습니다.\n실제 API 호출은 실패할 수 있습니다.');
                    }
                });
            }
        }
    },
    
    // 계층별 URL 반환
    getLayerUrl(layer) {
        const l = this.LAYERS['L' + layer];
        return l ? l.path : null;
    },
    
    // API 호출 헬퍼
    async fetch(layer, endpoint, options = {}) {
        const url = this.getLayerUrl(layer) + endpoint;
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { error: error.message };
        }
    },
    
    // GET 요청
    async get(layer, endpoint) {
        return this.fetch(layer, endpoint);
    },
    
    // POST 요청
    async post(layer, endpoint, data) {
        return this.fetch(layer, endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // 노드 연결 확인
    async checkConnection() {
        try {
            const data = await this.get(1, '/health');
            this.connected = data.status === 'healthy';
        } catch (e) {
            this.connected = false;
        }
        return this.connected;
    }
};

// 초기화
OpenHashConfig.loadMode();

// 전역 노출
window.OpenHashConfig = OpenHashConfig;

// 모드 선택 CSS 주입
const modeStyles = document.createElement('style');
modeStyles.textContent = `
    .mode-selector {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        margin-left: auto;
    }
    .mode-title {
        font-size: 11px;
        color: rgba(255,255,255,0.7);
        display: none;
    }
    .mode-switch {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .mode-option {
        font-size: 11px;
        color: rgba(255,255,255,0.5);
        cursor: pointer;
        transition: all 0.3s;
    }
    .mode-option.active {
        color: #fff;
        font-weight: 600;
    }
    .toggle-switch {
        position: relative;
        width: 40px;
        height: 20px;
    }
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background: #555;
        border-radius: 20px;
        transition: 0.3s;
    }
    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background: #fff;
        border-radius: 50%;
        transition: 0.3s;
    }
    .toggle-switch input:checked + .toggle-slider {
        background: #4ade80;
    }
    .toggle-switch input:checked + .toggle-slider:before {
        transform: translateX(20px);
    }
    .mode-label {
        font-size: 10px;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;
    }
    .mode-label.mockup {
        background: #d4a017;
        color: #1a3a6e;
    }
    .mode-label.backend {
        background: #4ade80;
        color: #0d2240;
    }
`;
document.head.appendChild(modeStyles);
