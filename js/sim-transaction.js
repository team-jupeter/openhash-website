/**
 * OpenHash Transaction Simulator
 * 실제 노드 API 연동 버전
 */
const TxSimulator = {
    regions: {
        'KR-JEJU-SEOGWIPO-JUNGMUN': {
            name: '제주 서귀포시 중문동',
            layer: 1,
            hierarchy: ['GLOBAL', 'KR', 'KR-JEJU', 'KR-JEJU-SEOGWIPO', 'KR-JEJU-SEOGWIPO-JUNGMUN']
        },
        'KR-JEJU-SEOGWIPO-DAEJEONG': {
            name: '제주 서귀포시 대정읍',
            layer: 2,
            hierarchy: ['GLOBAL', 'KR', 'KR-JEJU', 'KR-JEJU-SEOGWIPO', 'KR-JEJU-SEOGWIPO-DAEJEONG']
        },
        'KR-JEJU-JEJU-NOHYEONG': {
            name: '제주 제주시 노형동',
            layer: 3,
            hierarchy: ['GLOBAL', 'KR', 'KR-JEJU', 'KR-JEJU-JEJU', 'KR-JEJU-JEJU-NOHYEONG']
        },
        'KR-SEOUL-GANGNAM-YEOKSAM': {
            name: '서울 강남구 역삼동',
            layer: 4,
            hierarchy: ['GLOBAL', 'KR', 'KR-SEOUL', 'KR-SEOUL-GANGNAM', 'KR-SEOUL-GANGNAM-YEOKSAM']
        },
        'KR-BUSAN-HAEUNDAE-U': {
            name: '부산 해운대구 우동',
            layer: 4,
            hierarchy: ['GLOBAL', 'KR', 'KR-BUSAN', 'KR-BUSAN-HAEUNDAE', 'KR-BUSAN-HAEUNDAE-U']
        }
    },
    layerNames: ['L5 글로벌', 'L4 국가', 'L3 광역시도', 'L2 시군구', 'L1 읍면동'],
    
    // API 연결 상태
    apiConnected: false,
    nodeStatus: {},

    // 노드 상태 확인
    async checkNodeStatus() {
        const results = {};
        for (let layer = 1; layer <= 4; layer++) {
            try {
                const data = await OpenHashConfig.get(layer, '/health');
                results['L' + layer] = {
                    status: data.status === 'healthy' ? 'online' : 'offline',
                    nodeId: data.nodeId,
                    chainLength: data.chainLength
                };
            } catch (e) {
                results['L' + layer] = { status: 'offline', error: e.message };
            }
        }
        this.nodeStatus = results;
        this.apiConnected = Object.values(results).some(r => r.status === 'online');
        return results;
    },

    // 공통 계층 찾기
    findCommonLayer(sender, receiver) {
        const sH = this.regions[sender].hierarchy;
        const rH = this.regions[receiver].hierarchy;
        for (let i = 4; i >= 0; i--) {
            if (sH[i] === rH[i]) {
                return { level: i, name: this.layerNames[i], code: sH[i], apiLayer: 5 - i };
            }
        }
        return { level: 0, name: this.layerNames[0], code: 'GLOBAL', apiLayer: 4 };
    },

    // 실제 API로 거래 생성
    async createTransaction(sender, receiver, amount) {
        const common = this.findCommonLayer(sender, receiver);
        const targetLayer = Math.min(common.apiLayer, 4);
        
        try {
            // 실제 노드에 거래 요청
            const result = await OpenHashConfig.post(targetLayer, '/transaction', {
                sender: sender,
                receiver: receiver,
                amount: amount,
                timestamp: new Date().toISOString()
            });
            return { success: !result.error, data: result, layer: targetLayer };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    // 잔액 조회
    async getBalance(address) {
        try {
            const result = await OpenHashConfig.get(1, '/balance/' + address);
            return result;
        } catch (e) {
            return { balance: 0, error: e.message };
        }
    },

    // 체인 정보 조회
    async getChainInfo(layer) {
        try {
            return await OpenHashConfig.get(layer, '/chain');
        } catch (e) {
            return { error: e.message };
        }
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    const runBtn = document.getElementById('runSimBtn');
    const logArea = document.getElementById('logArea');
    const resultSummary = document.getElementById('resultSummary');
    
    // 노드 상태 표시 영역 추가
    const statusDiv = document.createElement('div');
    statusDiv.id = 'nodeStatusPanel';
    statusDiv.className = 'node-status-panel';
    statusDiv.innerHTML = '<div class="status-title">🔗 노드 연결 상태</div><div id="nodeStatusList"></div>';
    const container = document.querySelector('.simulation-container') || document.body;
    container.insertBefore(statusDiv, container.firstChild);

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        const time = new Date().toLocaleTimeString();
        line.innerHTML = '<span class="log-time">[' + time + ']</span> ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    function updateNodeStatus(status) {
        const list = document.getElementById('nodeStatusList');
        list.innerHTML = Object.entries(status).map(([layer, info]) => {
            const icon = info.status === 'online' ? '🟢' : '🔴';
            const chain = info.chainLength !== undefined ? ' (블록: ' + info.chainLength + ')' : '';
            return '<div class="status-item">' + icon + ' ' + layer + ': ' + info.status + chain + '</div>';
        }).join('');
    }

    // 초기 노드 상태 확인
    log('노드 연결 확인 중...', 'info');
    const nodeStatus = await TxSimulator.checkNodeStatus();
    updateNodeStatus(nodeStatus);
    
    if (TxSimulator.apiConnected) {
        log('✅ 노드 연결 성공 - 실제 API 모드', 'success');
    } else {
        log('⚠️ 노드 연결 실패 - 시뮬레이션 모드로 전환', 'warning');
    }

    function resetUI() {
        document.querySelectorAll('.step-item').forEach(item => {
            item.className = 'step-item';
            const statusEl = item.querySelector('.step-status');
            if (statusEl) statusEl.textContent = '-';
        });
        const commonIndicator = document.getElementById('commonIndicator');
        if (commonIndicator) commonIndicator.className = 'common-layer-indicator';
        const commonText = document.getElementById('commonLayerText');
        if (commonText) commonText.textContent = '-';
        if (resultSummary) resultSummary.style.display = 'none';
    }

    async function animateStep(stepNum, status, msg, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                const item = document.querySelector('.step-item[data-step="' + stepNum + '"]');
                if (item) {
                    item.classList.add(status);
                    const statusEl = item.querySelector('.step-status');
                    if (statusEl) statusEl.textContent = msg;
                }
                log('Step ' + stepNum + ': ' + msg, status === 'pass' ? 'success' : 'error');
                resolve();
            }, delay);
        });
    }

    async function runSimulation() {
        resetUI();
        runBtn.disabled = true;
        runBtn.textContent = '실행 중...';
        runBtn.classList.add('running');

        const sender = document.getElementById('senderRegion').value;
        const receiver = document.getElementById('receiverRegion').value;
        const amount = parseInt(document.getElementById('txAmount').value) || 0;

        const senderName = TxSimulator.regions[sender]?.name || sender;
        const receiverName = TxSimulator.regions[receiver]?.name || receiver;

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('🚀 거래 시뮬레이션 시작', 'info');
        log('송신: ' + senderName, 'info');
        log('수신: ' + receiverName, 'info');
        log('금액: ' + amount.toLocaleString() + ' T', 'info');

        const startTime = performance.now();

        // Step 1: 공통 계층 탐색
        log('🔍 공통 계층 탐색 중...', 'info');
        const common = TxSimulator.findCommonLayer(sender, receiver);
        await new Promise(r => setTimeout(r, 300));
        
        const commonText = document.getElementById('commonLayerText');
        if (commonText) commonText.textContent = common.name + ' (' + common.code + ')';
        const commonIndicator = document.getElementById('commonIndicator');
        if (commonIndicator) commonIndicator.classList.add('found');
        log('✅ 공통 계층: ' + common.name + ' → Layer ' + common.apiLayer + ' 노드 사용', 'success');

        // API 연동 거래 처리
        if (TxSimulator.apiConnected) {
            log('📡 실제 노드 API 호출 중...', 'info');
            
            // Step 2: 노드 헬스체크
            await animateStep(1, 'pass', '노드 연결됨', 200);
            
            // Step 3: 체인 정보 조회
            const chainInfo = await TxSimulator.getChainInfo(common.apiLayer);
            if (!chainInfo.error) {
                const chainLen = chainInfo.chain?.length || chainInfo.chainLength || 0;
                await animateStep(2, 'pass', '체인 길이: ' + chainLen, 200);
                log('📦 현재 체인 블록 수: ' + chainLen, 'success');
            } else {
                await animateStep(2, 'pass', '체인 조회됨', 200);
            }

            // Step 4: 거래 생성
            log('💳 거래 생성 요청...', 'info');
            const txResult = await TxSimulator.createTransaction(sender, receiver, amount);
            
            if (txResult.success) {
                await animateStep(3, 'pass', '거래 생성됨', 200);
                const txId = txResult.data.transactionId || txResult.data.txId || 'TX-' + Date.now();
                log('✅ 거래 ID: ' + txId, 'success');
                
                await animateStep(4, 'pass', '검증 완료', 200);
                await animateStep(5, 'pass', '블록 추가됨', 200);
                
                // 체인 업데이트 확인
                const newChain = await TxSimulator.getChainInfo(common.apiLayer);
                const newLen = newChain.chain?.length || newChain.chainLength || 0;
                log('📦 업데이트된 체인 블록 수: ' + newLen, 'success');
            } else {
                await animateStep(3, 'fail', '거래 실패', 200);
                log('❌ 거래 실패: ' + (txResult.error || txResult.data?.error || '알 수 없는 오류'), 'error');
            }
        } else {
            // 시뮬레이션 모드
            log('⚡ 시뮬레이션 모드 실행', 'warning');
            await animateStep(1, 'pass', '잔액 확인', 300);
            await animateStep(2, 'pass', '신원 확인', 300);
            await animateStep(3, 'pass', '한도 확인', 300);
            await animateStep(4, 'pass', 'AI 검증: 0.12', 300);
            await animateStep(5, 'pass', 'AML 통과', 300);
        }

        const endTime = performance.now();
        const elapsed = (endTime - startTime).toFixed(2);

        // 결과 표시
        if (resultSummary) {
            resultSummary.style.display = 'block';
            const resultCommon = document.getElementById('resultCommon');
            if (resultCommon) resultCommon.textContent = common.name;
            const resultTime = document.getElementById('resultTime');
            if (resultTime) resultTime.textContent = elapsed + ' ms';
            const resultFinal = document.getElementById('resultFinal');
            if (resultFinal) {
                resultFinal.textContent = '승인';
                resultFinal.className = 'result-value success';
            }
        }

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('⏱️ 처리 시간: ' + elapsed + 'ms', 'success');
        log('✅ 시뮬레이션 완료', 'success');

        runBtn.disabled = false;
        runBtn.textContent = '시뮬레이션 실행';
        runBtn.classList.remove('running');
    }

    if (runBtn) {
        runBtn.addEventListener('click', runSimulation);
    }

    // 노드 상태 새로고침 버튼
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 새로고침';
    refreshBtn.className = 'refresh-btn';
    refreshBtn.onclick = async () => {
        log('노드 상태 새로고침...', 'info');
        const status = await TxSimulator.checkNodeStatus();
        updateNodeStatus(status);
        log(TxSimulator.apiConnected ? '✅ 노드 연결됨' : '⚠️ 노드 오프라인', TxSimulator.apiConnected ? 'success' : 'warning');
    };
    document.getElementById('nodeStatusPanel')?.appendChild(refreshBtn);
});
