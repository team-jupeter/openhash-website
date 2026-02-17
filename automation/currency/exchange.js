// 패널 데이터 - 오픈해시 기술 강조
const panelData = {
    trust: { 
        title: '오픈해시 기반 거래 신뢰성', 
        content: '<p><strong>모든 거래 데이터의 진실성을 오픈해시가 보장합니다.</strong></p><p>SHA-256 이중 재해싱과 BLS 서명 검증을 통해 거래 당사자는 상대방이 보유한 주식의 종류와 수량이 진실됨을 신뢰할 수 있습니다.</p><p>오염된 노드는 5ms 이내에 격리되며, 위변조된 거래는 원천 차단됩니다. 오픈해시는 "디지털 공증인" 역할을 수행합니다.</p>' 
    },
    realtime: { 
        title: '실시간 시세 (평균 4ms 응답)', 
        content: '<p>체결가, 호가, 거래량이 실시간으로 표시됩니다. 평균 응답 시간 4ms로 기존 블록체인(비트코인 10분) 대비 즉각적인 거래 확정이 가능합니다.</p><p>모든 거래는 Merkle Tree 구조로 오픈해시 네트워크에 기록되며, 누구나 검증할 수 있습니다.</p>' 
    },
    products: { 
        title: '다양한 금융상품', 
        content: '<p>주식, 채권, 선물, 파생상품 등 다양한 금융상품을 거래할 수 있습니다.</p><p>AI 이상 탐지 에이전트(Isolation Forest)가 비정상 거래 패턴을 실시간 감지하고, 법률 준수 검증 에이전트가 금융법 준수를 자동 확인합니다.</p>' 
    },
    fee: { 
        title: '수수료 1/10~1/100', 
        content: '<p>작업증명(PoW)이나 지분증명(PoS) 없이 기존 통신 인프라를 활용하여 에너지 98.5% 절감을 달성합니다.</p><p>직원, 점포 없는 순수 AI 운영으로 기존 증권사 대비 1/10~1/100 수준의 초저비용 수수료입니다.</p>' 
    }
};

// 종목 데이터
const stocks = {
    AIC: { name: 'AI City Inc.', price: 10250, prev: 10000, open: 10000, high: 10400, low: 9950, vol: 1234567, shares: 20000000 },
    OHT: { name: 'OpenHash Tech', price: 5800, prev: 5730, open: 5750, high: 5900, low: 5700, vol: 876543, shares: 10000000 },
    DFB: { name: 'Digital Finance', price: 3200, prev: 3225, open: 3210, high: 3280, low: 3180, vol: 2345678, shares: 50000000 }
};

let curStock = 'AIC';
let orderMode = 'buy';
let balance = { cash: 50000, hold: { AIC: 100, OHT: 0, DFB: 0 } };
let trades = [];
let prices = [];

// 유틸
const fmt = n => n.toLocaleString('ko-KR');
const genHash = () => [...Array(64)].map(() => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
const wait = ms => new Promise(r => setTimeout(r, ms));

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initPrices();
    render();
    startSim();
    document.getElementById('inp-price').value = stocks[curStock].price;
});

function initPrices() {
    const s = stocks[curStock];
    prices = [];
    for (let i = 0; i < 30; i++) {
        prices.push(s.prev + Math.round((Math.random() - 0.5) * 300));
    }
}

function render() {
    renderStock();
    renderOrderbook();
    renderList();
    renderBalance();
    renderChart();
    renderTrades();
}

// 패널 토글
const panel = document.getElementById('panel');
let curCard = null;
document.querySelectorAll('#cards .card').forEach(c => {
    c.addEventListener('click', () => {
        const k = c.dataset.card;
        if (curCard === k && panel.classList.contains('open')) {
            panel.classList.remove('open');
            curCard = null;
        } else {
            document.getElementById('panel-title').textContent = panelData[k].title;
            document.getElementById('panel-content').innerHTML = panelData[k].content;
            panel.classList.add('open');
            curCard = k;
        }
    });
});
document.getElementById('panel-close').addEventListener('click', () => {
    panel.classList.remove('open');
    curCard = null;
});

// 종목 정보
function renderStock() {
    const s = stocks[curStock];
    const chg = s.price - s.prev;
    const pct = ((chg / s.prev) * 100).toFixed(2);
    const up = chg >= 0;

    document.getElementById('s-name').textContent = s.name;
    document.getElementById('s-code').textContent = curStock;
    document.getElementById('s-price').textContent = fmt(s.price);
    document.getElementById('s-price').className = 'stock-price ' + (up ? 'up' : 'down');
    document.getElementById('s-change').innerHTML = `${up ? '▲' : '▼'} ${fmt(Math.abs(chg))} (${up ? '+' : ''}${pct}%)`;
    document.getElementById('s-change').className = 'stock-change ' + (up ? 'up' : 'down');
    document.getElementById('m-open').textContent = fmt(s.open);
    document.getElementById('m-high').textContent = fmt(s.high);
    document.getElementById('m-low').textContent = fmt(s.low);
    document.getElementById('m-vol').textContent = fmt(s.vol);
    document.getElementById('m-val').textContent = fmt(Math.round(s.vol * s.price / 100000000)) + '억';
    document.getElementById('m-shares').textContent = fmt(s.shares / 10000) + '만';
}

// 호가창
function renderOrderbook() {
    const s = stocks[curStock];
    const base = s.price;
    let html = '';
    
    for (let i = 5; i >= 1; i--) {
        const p = base + i * 50;
        const q = Math.round(Math.random() * 8000 + 1000);
        const cls = p > s.prev ? 'up' : 'down';
        html += `<div class="ob-row"><div class="ob-ask">${fmt(q)}</div><div class="ob-price ${cls}">${fmt(p)}</div><div class="ob-bid"></div></div>`;
    }
    html += `<div class="ob-spread">현재가 ${fmt(base)} T</div>`;
    for (let i = 1; i <= 5; i++) {
        const p = base - i * 50;
        const q = Math.round(Math.random() * 8000 + 1000);
        const cls = p > s.prev ? 'up' : 'down';
        html += `<div class="ob-row"><div class="ob-ask"></div><div class="ob-price ${cls}">${fmt(p)}</div><div class="ob-bid">${fmt(q)}</div></div>`;
    }
    document.getElementById('orderbook').innerHTML = html;
}

// 종목 리스트
function renderList() {
    let html = '';
    Object.keys(stocks).forEach(code => {
        const s = stocks[code];
        const chg = s.price - s.prev;
        const pct = ((chg / s.prev) * 100).toFixed(1);
        const up = chg >= 0;
        html += `<div class="sl-row ${code === curStock ? 'active' : ''}" data-code="${code}">
            <div class="sl-code">${code}</div>
            <div class="sl-name">${s.name}</div>
            <div class="sl-price">${fmt(s.price)}</div>
            <div class="sl-chg ${up ? 'up' : 'down'}">${up ? '+' : ''}${pct}%</div>
        </div>`;
    });
    document.getElementById('stock-list').innerHTML = html;

    document.querySelectorAll('.sl-row').forEach(row => {
        row.addEventListener('click', () => {
            curStock = row.dataset.code;
            initPrices();
            render();
            document.getElementById('inp-price').value = stocks[curStock].price;
        });
    });
}

// 잔고
function renderBalance() {
    const s = stocks[curStock];
    const qty = balance.hold[curStock] || 0;
    const evalVal = qty * s.price;
    const cost = qty * s.prev;
    const profit = evalVal - cost;
    const pct = cost > 0 ? ((profit / cost) * 100).toFixed(1) : 0;

    document.getElementById('b-cash').textContent = fmt(balance.cash);
    document.getElementById('b-hold').textContent = fmt(qty) + '주';
    document.getElementById('b-eval').textContent = fmt(evalVal);
    const profitEl = document.getElementById('b-profit');
    profitEl.textContent = `${profit >= 0 ? '+' : ''}${fmt(profit)} (${profit >= 0 ? '+' : ''}${pct}%)`;
    profitEl.className = 'bal-value ' + (profit >= 0 ? 'up' : 'down');
}

// 체결 내역
function addTrade(type, price, qty) {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    trades.unshift({ time, price, qty, type });
    if (trades.length > 15) trades.pop();
    renderTrades();
}

function renderTrades() {
    const s = stocks[curStock];
    if (trades.length === 0) {
        document.getElementById('trades').innerHTML = '<div style="padding:0.5rem;text-align:center;color:var(--gray-400);font-size:0.7rem;">체결 내역 없음</div>';
        return;
    }
    let html = '';
    trades.forEach(t => {
        const cls = t.price >= s.prev ? 'up' : 'down';
        html += `<div class="trade-row">
            <div class="trade-time">${t.time}</div>
            <div class="trade-price ${cls}">${fmt(t.price)}</div>
            <div class="trade-qty">${fmt(t.qty)}</div>
            <div class="trade-type ${t.type}">${t.type === 'buy' ? '매수' : '매도'}</div>
        </div>`;
    });
    document.getElementById('trades').innerHTML = html;
}

// 차트
function renderChart() {
    const canvas = document.getElementById('chart');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    const w = rect.width, h = rect.height;

    if (prices.length < 2) return;
    const min = Math.min(...prices) - 50;
    const max = Math.max(...prices) + 50;
    const range = max - min || 1;
    const stepX = w / (prices.length - 1);

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
        const y = h * (i / 3);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = prices[prices.length - 1] >= prices[0] ? '#dc2626' : '#2563eb';
    ctx.lineWidth = 1.5;
    prices.forEach((p, i) => {
        const x = i * stepX;
        const y = h - ((p - min) / range) * (h - 10) - 5;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    document.getElementById('chart-info').textContent = `${curStock} ${fmt(prices[prices.length - 1])} T`;
}

// 주문 탭
document.querySelectorAll('.order-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.order-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        orderMode = tab.dataset.type;
        const btn = document.getElementById('btn-order');
        btn.className = 'btn-order ' + orderMode;
        btn.textContent = orderMode === 'buy' ? '매수 주문' : '매도 주문';
    });
});

// 주문 총액 계산
document.getElementById('inp-price').addEventListener('input', calcTotal);
document.getElementById('inp-qty').addEventListener('input', calcTotal);
function calcTotal() {
    const price = parseInt(document.getElementById('inp-price').value) || 0;
    const qty = parseInt(document.getElementById('inp-qty').value) || 0;
    document.getElementById('order-total').textContent = fmt(price * qty) + ' T';
}

// 모달
const modal = document.getElementById('modal');
const openModal = () => modal.classList.add('active');
const closeModal = () => modal.classList.remove('active');
document.getElementById('modal-x').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

const mAct = n => document.querySelector(`.m-step[data-s="${n}"]`).classList.add('active');
const mDone = n => {
    const el = document.querySelector(`.m-step[data-s="${n}"]`);
    el.classList.remove('active');
    el.classList.add('done');
};
const mReset = () => {
    document.querySelectorAll('.m-step').forEach(s => s.classList.remove('active', 'done'));
    document.getElementById('m-hash').classList.remove('show');
};

// 주문 실행
document.getElementById('btn-order').addEventListener('click', async () => {
    const price = parseInt(document.getElementById('inp-price').value) || 0;
    const qty = parseInt(document.getElementById('inp-qty').value) || 0;
    const total = price * qty;

    if (price <= 0 || qty <= 0) { alert('가격과 수량을 입력하세요.'); return; }
    if (orderMode === 'buy' && total > balance.cash) { alert('예수금이 부족합니다.'); return; }
    if (orderMode === 'sell' && qty > (balance.hold[curStock] || 0)) { alert('보유 주식이 부족합니다.'); return; }

    mReset();
    openModal();
    document.getElementById('modal-title').textContent = orderMode === 'buy' ? '매수 주문 처리' : '매도 주문 처리';
    document.getElementById('m-status').textContent = '주문 처리 시작...';

    await wait(150); mAct(1);
    document.getElementById('m-status').textContent = 'SHA-256 해시 생성 중...';
    await wait(250); mDone(1);

    mAct(2);
    document.getElementById('m-status').textContent = 'BLS 서명 검증 중...';
    await wait(250); mDone(2);

    mAct(3);
    document.getElementById('m-status').textContent = '보유 데이터 진실성 검증 중...';
    await wait(250); mDone(3);

    mAct(4);
    document.getElementById('m-status').textContent = '호가 매칭 중...';
    await wait(250); mDone(4);

    mAct(5);
    document.getElementById('m-status').textContent = '체결 처리 중...';
    await wait(250); mDone(5);

    mAct(6);
    document.getElementById('m-status').textContent = 'Merkle Root 갱신 중...';
    await wait(250);
    if (orderMode === 'buy') {
        balance.cash -= total;
        balance.hold[curStock] = (balance.hold[curStock] || 0) + qty;
    } else {
        balance.cash += total;
        balance.hold[curStock] -= qty;
    }
    renderBalance();
    addTrade(orderMode, price, qty);
    mDone(6);

    mAct(7);
    document.getElementById('m-status').textContent = '오픈해시 네트워크 기록 중...';
    await wait(250);
    document.getElementById('m-hash-val').textContent = genHash();
    document.getElementById('m-hash').classList.add('show');
    mDone(7);

    document.getElementById('m-status').textContent = '✓ 체결 완료 (4ms)';
    document.getElementById('inp-qty').value = '';
    calcTotal();
});

// 시뮬레이션
function startSim() {
    setInterval(() => {
        Object.keys(stocks).forEach(code => {
            const s = stocks[code];
            const chg = Math.round((Math.random() - 0.5) * 80);
            s.price = Math.max(s.low, Math.min(s.high, s.price + chg));
            if (s.price > s.high) s.high = s.price;
            if (s.price < s.low) s.low = s.price;
            s.vol += Math.round(Math.random() * 500);
        });

        prices.push(stocks[curStock].price);
        if (prices.length > 40) prices.shift();

        render();

        if (Math.random() > 0.6) {
            const s = stocks[curStock];
            const type = Math.random() > 0.5 ? 'buy' : 'sell';
            const p = s.price + Math.round((Math.random() - 0.5) * 80);
            const q = Math.round(Math.random() * 300 + 50);
            addTrade(type, p, q);
        }
    }, 2000);
}
