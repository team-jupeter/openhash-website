const panelData = {
    valuation: { title: '재무제표 기반의 가치 평가', content: '<p>테슬라 자율주행이 라이다(LiDar) 등 복잡한 기계 장치를 제거하고, 오직 카메라만으로 최고의 자율주행 기술을 완성하였듯이, AI 모델이 자동으로 생성하고 갱신하는 오픈해시 기반의 재무제표만으로 최상의 기업 평가를 도출합니다.</p><p>재무제표 생성 메커니즘은 <a href="/currency/bank.html">무인 은행 페이지</a>를 참고하십시오.</p>' },
    transparency: { title: '글로벌 규모의 투명성 확보', content: '<p>한국 5천만 인구와 1천만 기업의 재무제표가 상호 연동되어 분식 회계나 허위 데이터가 원천 차단됩니다.</p>' },
    realtime: { title: '실시간 가치 조정', content: '<p>매 거래마다 실시간으로 기업 가치를 조정합니다. 사람이 아니라 AI 모델만 가능한 속도입니다.</p>' },
    fee: { title: '거래 수수료 1/10~1/100', content: '<p>직원, 경영진, 점포가 없는 순수 AI 모델입니다. 고정 비용이 없어 서버 비용이 수수료의 전부입니다.</p>' }
};

const companies = {
    alphaTech: { bs: { ca: 850, fa: 1200, cl: 320, fl: 480, cap: 500, ret: 750 }, is: { rev: 2400, cogs: 1440, opex: 480, int: 48, tax: 86.4 }, shares: 1000, inv: 200 },
    betaSoft: { bs: { ca: 620, fa: 380, cl: 180, fl: 120, cap: 300, ret: 400 }, is: { rev: 1200, cogs: 480, opex: 360, int: 12, tax: 69.6 }, shares: 500, inv: 80 },
    gammaAI: { bs: { ca: 1500, fa: 2500, cl: 600, fl: 900, cap: 1000, ret: 1500 }, is: { rev: 5000, cogs: 2500, opex: 1000, int: 90, tax: 282 }, shares: 2000, inv: 400 }
};

const risks = {
    country: { KR: { lv: 'low', r: 2 }, US: { lv: 'low', r: 1 }, JP: { lv: 'low', r: 1.5 }, CN: { lv: 'medium', r: 4 }, DE: { lv: 'low', r: 1 } },
    industry: { tech: { lv: 'medium', r: 5 }, manufacturing: { lv: 'low', r: 3 }, retail: { lv: 'medium', r: 4 }, food: { lv: 'low', r: 2 }, finance: { lv: 'high', r: 7 } }
};

// 패널
const panel = document.getElementById('sec-panel');
let curCard = null;
document.querySelectorAll('#sec-cards .card').forEach(c => {
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

// 모달
const modal = document.getElementById('modal');
const openModal = () => modal.classList.add('active');
const closeModal = () => modal.classList.remove('active');
document.getElementById('modal-x').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

const mAct = n => document.querySelector(`.m-step[data-s="${n}"]`).classList.add('active');
const mDone = n => { 
    const s = document.querySelector(`.m-step[data-s="${n}"]`); 
    s.classList.remove('active'); 
    s.classList.add('done'); 
};
const mReset = () => { 
    document.querySelectorAll('.m-step').forEach(s => s.classList.remove('active', 'done')); 
    document.getElementById('m-hash').classList.remove('show'); 
};

const fmt = (n, d = 0) => n.toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d });
const genHash = () => Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
const wait = ms => new Promise(r => setTimeout(r, ms));
const lvTxt = lv => lv === 'low' ? '낮음' : lv === 'medium' ? '보통' : '높음';

document.getElementById('btn-run').addEventListener('click', async () => {
    const co = document.getElementById('sel-country').value;
    const ind = document.getElementById('sel-industry').value;
    const comp = document.getElementById('sel-company').value;
    const d = companies[comp];

    mReset(); 
    openModal();
    document.getElementById('m-status').textContent = '평가 시작...';

    // Step 1: 재무제표 로드
    await wait(200); 
    mAct(1);
    document.getElementById('m-status').textContent = '재무제표 로드 중...';
    await wait(350);
    document.getElementById('bs-ca').textContent = fmt(d.bs.ca);
    document.getElementById('bs-fa').textContent = fmt(d.bs.fa);
    const ta = d.bs.ca + d.bs.fa; 
    document.getElementById('bs-ta').textContent = fmt(ta);
    document.getElementById('bs-cl').textContent = fmt(d.bs.cl);
    document.getElementById('bs-fl').textContent = fmt(d.bs.fl);
    const tl = d.bs.cl + d.bs.fl; 
    document.getElementById('bs-tl').textContent = fmt(tl);
    document.getElementById('bs-cap').textContent = fmt(d.bs.cap);
    document.getElementById('bs-ret').textContent = fmt(d.bs.ret);
    const te = d.bs.cap + d.bs.ret; 
    document.getElementById('bs-te').textContent = fmt(te);
    document.getElementById('is-rev').textContent = fmt(d.is.rev);
    document.getElementById('is-cogs').textContent = fmt(d.is.cogs);
    const gp = d.is.rev - d.is.cogs; 
    document.getElementById('is-gp').textContent = fmt(gp);
    document.getElementById('is-opex').textContent = fmt(d.is.opex);
    const op = gp - d.is.opex; 
    document.getElementById('is-op').textContent = fmt(op);
    document.getElementById('is-int').textContent = fmt(d.is.int);
    document.getElementById('is-tax').textContent = fmt(d.is.tax, 1);
    const ni = op - d.is.int - d.is.tax; 
    document.getElementById('is-ni').textContent = fmt(ni, 1);
    mDone(1);

    // Step 2: 재무지표 계산
    mAct(2); 
    document.getElementById('m-status').textContent = '재무지표 계산 중...';
    await wait(350);
    const pbr = 1.8; 
    document.getElementById('r-pbr').textContent = pbr.toFixed(2) + 'x';
    const mc = te * pbr, per = mc / ni; 
    document.getElementById('r-per').textContent = per.toFixed(1) + 'x';
    const roe = ni / te * 100; 
    document.getElementById('r-roe').textContent = roe.toFixed(1) + '%';
    const roa = ni / ta * 100; 
    document.getElementById('r-roa').textContent = roa.toFixed(1) + '%';
    const dr = tl / te * 100; 
    document.getElementById('r-debt').textContent = dr.toFixed(0) + '%';
    const cr = d.bs.ca / d.bs.cl * 100; 
    document.getElementById('r-cur').textContent = cr.toFixed(0) + '%';
    const invt = d.is.cogs / d.inv; 
    document.getElementById('r-inv').textContent = invt.toFixed(1) + '회';
    const opm = op / d.is.rev * 100; 
    document.getElementById('r-opm').textContent = opm.toFixed(1) + '%';
    mDone(2);

    // Step 3: 국가위험 반영
    mAct(3); 
    document.getElementById('m-status').textContent = '국가위험 반영 중...';
    await wait(350);
    const rc = risks.country[co];
    document.getElementById('rk-c').textContent = lvTxt(rc.lv);
    document.getElementById('rk-c').className = 'risk-level ' + rc.lv;
    document.getElementById('rd-c').textContent = rc.r + '%';
    mDone(3);

    // Step 4: 산업위험 반영
    mAct(4); 
    document.getElementById('m-status').textContent = '산업위험 반영 중...';
    await wait(350);
    const ri = risks.industry[ind];
    document.getElementById('rk-i').textContent = lvTxt(ri.lv);
    document.getElementById('rk-i').className = 'risk-level ' + ri.lv;
    document.getElementById('rd-i').textContent = ri.r + '%';
    mDone(4);

    // Step 5: 기업위험 반영
    mAct(5); 
    document.getElementById('m-status').textContent = '기업위험 반영 중...';
    await wait(350);
    let elv, er;
    if (dr < 50) { elv = 'low'; er = 2; } 
    else if (dr < 100) { elv = 'medium'; er = 4; } 
    else { elv = 'high'; er = 6; }
    document.getElementById('rk-e').textContent = lvTxt(elv);
    document.getElementById('rk-e').className = 'risk-level ' + elv;
    document.getElementById('rd-e').textContent = er + '%';
    mDone(5);

    // Step 6: 적정가치 산출
    mAct(6); 
    document.getElementById('m-status').textContent = '적정가치 산출 중...';
    await wait(350);
    const disc = rc.r + ri.r + er;
    const bv = op / 0.1;
    const ev = bv * (1 - disc / 100);
    const eq = ev - tl;
    const price = eq / d.shares * 10000;
    document.getElementById('res-ev').textContent = fmt(ev, 0);
    document.getElementById('res-eq').textContent = fmt(eq, 0);
    document.getElementById('res-sh').textContent = fmt(d.shares);
    document.getElementById('res-pr').textContent = fmt(price, 0);
    mDone(6);

    // Step 7: Hash 기록
    mAct(7); 
    document.getElementById('m-status').textContent = 'Hash 기록 중...';
    await wait(350);
    document.getElementById('m-hash-val').textContent = genHash();
    document.getElementById('m-hash').classList.add('show');
    mDone(7);

    document.getElementById('m-status').textContent = '✓ 평가 완료';
});
