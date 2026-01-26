/**
 * OpenHash Node API Configuration
 * Nginx 프록시를 통한 노드 연결
 */
const OpenHashConfig = {
    // 계층별 프록시 경로
    LAYERS: {
        L4: { path: '/api/node/l4', id: 'KR', name: '국가' },
        L3: { path: '/api/node/l3', id: 'KR-JEJU', name: '광역시도' },
        L2: { path: '/api/node/l2', id: 'KR-JEJU-SEOGWIPO', name: '시군구' },
        L1: { path: '/api/node/l1', id: 'KR-JEJU-SEOGWIPO-JUNGMUN', name: '읍면동' }
    },
    
    // 계층별 URL 반환
    getLayerUrl: function(layer) {
        const l = this.LAYERS['L' + layer];
        return l ? l.path : null;
    },
    
    // API 엔드포인트
    endpoints: {
        health: '/health',
        chain: '/chain',
        chainVerify: '/chain/verify',
        transaction: '/transaction',
        balance: '/balance',
        layerSelect: '/layer-select',
        lpbftStatus: '/lpbft/status',
        lpbftTrigger: '/lpbft/trigger',
        verify: '/verify',
        info: '/info'
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
    }
};

// 전역 노출
window.OpenHashConfig = OpenHashConfig;
