const panelData = {
    vault: { 
        title: '정보금고 기반 위험 평가', 
        content: '<p>개인 및 단체의 Data Vault(정보금고)에서 익명화된 활동 기록을 토대로 위험도를 산정합니다.</p><p>고팡 시스템이 모든 기록의 주체이므로 허위나 조작이 원천적으로 불가능합니다. 건강검진 기록, 운동량, 운전습관, 주거환경 등 실제 생활 데이터가 보험료 산정의 근거가 됩니다.</p>' 
    },
    unified: { 
        title: '통합 보험 시스템', 
        content: '<p>생명보험, 질병보험, 상해보험, 자동차보험, 화재보험 등 모든 종류의 보험을 단일 플랫폼에서 통합 관리합니다.</p><p>중복 가입을 방지하고, 개인별 최적의 보장 설계가 가능합니다. 하나의 통합 보험료로 모든 위험에 대비할 수 있습니다.</p>' 
    },
    realtime: { 
        title: '실시간 보험료 조정', 
        content: '<p>정보금고의 활동 기록 변화에 따라 보험료가 실시간으로 조정됩니다.</p><p>건강 개선, 안전 운전, 금연 성공 등 긍정적인 행동 변화가 즉시 보험료 인하로 이어집니다. 반대로 위험 행동 증가 시 보험료가 상향 조정됩니다.</p>' 
    },
    fee: { 
        title: '수수료 1/10~1/100', 
        content: '<p>직원, 경영진, 점포가 없는 순수 AI 모델입니다. 고팡 웹앱(<a href="https://gopang.kr" target="_blank">gopang.kr</a>)에 탑재됩니다.</p><p>고정 비용이 없으므로 서버 비용만이 수수료의 전부입니다. 기존 보험사 대비 1/10~1/100 수준의 수수료로 운영됩니다.</p>' 
    }
};

// 개인 데이터
const personData = {
    p30m: { age: '30대', gender: '남성', health: 'good', exercise: 'high', smoking: 'no', driving: 'safe', housing: 'apt', job: 'low' },
    p30f: { age: '30대', gender: '여성', health: 'good', exercise: 'mid', smoking: 'no', driving: 'safe', housing: 'apt', job: 'low' },
    p40m: { age: '40대', gender: '남성', health: 'warn', exercise: 'mid', smoking: 'ex', driving: 'minor', housing: 'house', job: 'mid' },
    p40f: { age: '40대', gender: '여성', health: 'good', exercise: 'high', smoking: 'no', driving: 'safe', housing: 'apt', job: 'low' },
    p50m: { age: '50대', gender: '남성', health: 'warn', exercise: 'low', smoking: 'yes', driving: 'minor', housing: 'house', job: 'mid' },
    p60f: { age: '60대', gender: '여성', health: 'warn', exercise: 'low', smoking: 'no', driving: 'safe', housing: 'multi', job: 'low' }
};

// 사업자 데이터
const bizData = {
    manuSmall: { type: '제조업', size: '소형', safety: 'B', accidents: 1, employees: 15, vehicles: 3, facility: 5 },
    manuMid: { type: '제조업', size: '중형', safety: 'B', accidents: 2, employees: 80, vehicles: 12, facility: 30 },
    serviceSmall: { type: '서비스업', size: '소형', safety: 'A', accidents: 0, employees: 8, vehicles: 2, facility: 3 },
    serviceMid: { type: '서비스업', size: '중형', safety: 'A', accidents: 0, employees: 45, vehicles: 8, facility: 15 },
    constructMid: { type: '건설업', size: '중형', safety: 'C', accidents: 3, employees: 120, vehicles: 25, facility: 50 },
    transportLarge: { type: '운수업', size: '대형', safety: 'B', accidents: 5, employees: 200, vehicles: 80, facility: 100 }
};

// 패널 동작
const panel = document.getElementById('ins-panel');
let curCard = null;
document.querySelectorAll('#ins-cards .card').forEach(c => {
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

// 가입자 유형 변경 시 UI 전환
const typeSelect = document.getElementById('sel-type');
const personControls = document.getElementById('person-controls');
const bizControls = document.getElementById('biz-controls');
const vaultPerson = document.getElementById('vault-person');
const vaultBiz = document.getElementById('vault-biz');
const premiumPerson = document.getElementById('premium-person');
const premiumBiz = document.getElementById('premium-biz');

typeSelect.addEventListener('change', () => {
    const isPerson = typeSelect.value === 'person';
    personControls.classList.toggle('hidden', !isPerson);
    bizControls.classList.toggle('hidden', isPerson);
    vaultPerson.classList.toggle('hidden', !isPerson);
    vaultBiz.classList.toggle('hidden', isPerson);
    premiumPerson.classList.toggle('hidden', !isPerson);
    premiumBiz.classList.toggle('hidden', isPerson);
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

const statusText = { good: '정상', warn: '주의', bad: '위험' };
const statusClass = { good: 'good', warn: 'warn', bad: 'bad' };
const exerciseText = { high: '주3회+', mid: '주1-2회', low: '거의없음' };
const smokingText = { no: '비흡연', ex: '과거흡연', yes: '현재흡연' };
const drivingText = { safe: '무사고5년', minor: '경미사고', major: '중대사고' };
const housingText = { apt: '아파트', house: '단독주택', multi: '다세대' };
const jobText = { low: '저위험', mid: '중위험', high: '고위험' };
const safetyText = { A: 'A등급', B: 'B등급', C: 'C등급', D: 'D등급' };

document.getElementById('btn-run').addEventListener('click', async () => {
    const type = typeSelect.value;
    const isPerson = type === 'person';

    mReset(); 
    openModal();
    document.getElementById('m-status').textContent = '보험료 산정 시작...';

    // Step 1: Vault 접근 요청
    await wait(200); 
    mAct(1);
    document.getElementById('m-status').textContent = 'Vault 접근 동의 요청 중...';
    await wait(400);
    mDone(1);

    // Step 2: 데이터 익명화 인출
    mAct(2);
    document.getElementById('m-status').textContent = '데이터 익명화 인출 중...';
    await wait(400);

    if (isPerson) {
        const age = document.getElementById('sel-age').value;
        const gender = document.getElementById('sel-gender').value;
        const key = 'p' + age + gender;
        const d = personData[key] || personData.p30m;

        document.getElementById('v-health').innerHTML = `<span class="vault-status ${statusClass[d.health]}">${statusText[d.health]}</span>`;
        document.getElementById('v-exercise').textContent = exerciseText[d.exercise];
        document.getElementById('v-smoking').textContent = smokingText[d.smoking];
        document.getElementById('v-driving').textContent = drivingText[d.driving];
        document.getElementById('v-housing').textContent = housingText[d.housing];
        document.getElementById('v-job').textContent = jobText[d.job];
    } else {
        const biz = document.getElementById('sel-biz').value;
        const size = document.getElementById('sel-size').value;
        const key = biz + size.charAt(0).toUpperCase() + size.slice(1);
        const d = bizData[key] || bizData.serviceSmall;

        document.getElementById('v-safety').textContent = safetyText[d.safety];
        document.getElementById('v-accidents').textContent = d.accidents + '건';
        document.getElementById('v-employees').textContent = d.employees + '명';
        document.getElementById('v-vehicles').textContent = d.vehicles + '대';
        document.getElementById('v-facility').textContent = d.facility + '억T';
    }
    mDone(2);

    // Step 3: 생명/질병 위험 산정
    mAct(3);
    document.getElementById('m-status').textContent = '생명/질병 위험 산정 중...';
    await wait(400);
    
    let lifeRisk, diseaseRisk, injuryRisk, autoRisk, fireRisk;
    let lifePrem, diseasePrem, injuryPrem, autoPrem, firePrem, totalPrem;

    if (isPerson) {
        const age = document.getElementById('sel-age').value;
        const key = 'p' + age + document.getElementById('sel-gender').value;
        const d = personData[key] || personData.p30m;

        // 위험도 계산
        lifeRisk = d.health === 'good' ? 'low' : d.health === 'warn' ? 'medium' : 'high';
        diseaseRisk = d.smoking === 'yes' ? 'high' : d.smoking === 'ex' ? 'medium' : 'low';
        
        const baseLife = age === '30' ? 15000 : age === '40' ? 25000 : age === '50' ? 40000 : 55000;
        const baseDisease = age === '30' ? 12000 : age === '40' ? 20000 : age === '50' ? 35000 : 50000;
        
        lifePrem = Math.round(baseLife * (d.health === 'good' ? 0.8 : d.health === 'warn' ? 1.2 : 1.5));
        diseasePrem = Math.round(baseDisease * (d.smoking === 'no' ? 0.7 : d.smoking === 'ex' ? 1.0 : 1.4));

        document.getElementById('rk-life').textContent = lifeRisk === 'low' ? '낮음' : lifeRisk === 'medium' ? '보통' : '높음';
        document.getElementById('rk-life').className = 'risk-level ' + lifeRisk;
        document.getElementById('rs-life').textContent = fmt(lifePrem) + 'T';

        document.getElementById('rk-disease').textContent = diseaseRisk === 'low' ? '낮음' : diseaseRisk === 'medium' ? '보통' : '높음';
        document.getElementById('rk-disease').className = 'risk-level ' + diseaseRisk;
        document.getElementById('rs-disease').textContent = fmt(diseasePrem) + 'T';
    }
    mDone(3);

    // Step 4: 상해 위험 산정
    mAct(4);
    document.getElementById('m-status').textContent = '상해 위험 산정 중...';
    await wait(400);

    if (isPerson) {
        const key = 'p' + document.getElementById('sel-age').value + document.getElementById('sel-gender').value;
        const d = personData[key] || personData.p30m;

        injuryRisk = d.job === 'low' ? 'low' : d.job === 'mid' ? 'medium' : 'high';
        injuryPrem = Math.round(8000 * (d.job === 'low' ? 0.8 : d.job === 'mid' ? 1.2 : 1.8));

        document.getElementById('rk-injury').textContent = injuryRisk === 'low' ? '낮음' : injuryRisk === 'medium' ? '보통' : '높음';
        document.getElementById('rk-injury').className = 'risk-level ' + injuryRisk;
        document.getElementById('rs-injury').textContent = fmt(injuryPrem) + 'T';
    } else {
        const biz = document.getElementById('sel-biz').value;
        const size = document.getElementById('sel-size').value;
        const key = biz + size.charAt(0).toUpperCase() + size.slice(1);
        const d = bizData[key] || bizData.serviceSmall;

        // 사업자용 - 종업원 상해
        const empRisk = d.safety === 'A' ? 'low' : d.safety === 'B' ? 'medium' : 'high';
        const empPrem = Math.round(d.employees * 5000 * (d.safety === 'A' ? 0.7 : d.safety === 'B' ? 1.0 : 1.5));

        document.getElementById('rk-emp').textContent = empRisk === 'low' ? '낮음' : empRisk === 'medium' ? '보통' : '높음';
        document.getElementById('rk-emp').className = 'risk-level ' + empRisk;
        document.getElementById('rs-emp').textContent = fmt(empPrem) + 'T';

        // 배상책임
        const liabRisk = d.accidents === 0 ? 'low' : d.accidents <= 2 ? 'medium' : 'high';
        const liabPrem = Math.round(d.facility * 10000 * (d.accidents === 0 ? 0.5 : d.accidents <= 2 ? 1.0 : 1.8));

        document.getElementById('rk-liab').textContent = liabRisk === 'low' ? '낮음' : liabRisk === 'medium' ? '보통' : '높음';
        document.getElementById('rk-liab').className = 'risk-level ' + liabRisk;
        document.getElementById('rs-liab').textContent = fmt(liabPrem) + 'T';
    }
    mDone(4);

    // Step 5: 자동차/화재 위험 산정
    mAct(5);
    document.getElementById('m-status').textContent = '자동차/화재 위험 산정 중...';
    await wait(400);

    if (isPerson) {
        const key = 'p' + document.getElementById('sel-age').value + document.getElementById('sel-gender').value;
        const d = personData[key] || personData.p30m;

        autoRisk = d.driving === 'safe' ? 'low' : d.driving === 'minor' ? 'medium' : 'high';
        fireRisk = d.housing === 'apt' ? 'low' : 'medium';

        autoPrem = Math.round(25000 * (d.driving === 'safe' ? 0.6 : d.driving === 'minor' ? 1.0 : 1.6));
        firePrem = Math.round(5000 * (d.housing === 'apt' ? 0.7 : 1.2));

        document.getElementById('rk-auto').textContent = autoRisk === 'low' ? '낮음' : autoRisk === 'medium' ? '보통' : '높음';
        document.getElementById('rk-auto').className = 'risk-level ' + autoRisk;
        document.getElementById('rs-auto').textContent = fmt(autoPrem) + 'T';

        document.getElementById('rk-fire').textContent = fireRisk === 'low' ? '낮음' : fireRisk === 'medium' ? '보통' : '높음';
        document.getElementById('rk-fire').className = 'risk-level ' + fireRisk;
        document.getElementById('rs-fire').textContent = fmt(firePrem) + 'T';
    } else {
        const biz = document.getElementById('sel-biz').value;
        const size = document.getElementById('sel-size').value;
        const key = biz + size.charAt(0).toUpperCase() + size.slice(1);
        const d = bizData[key] || bizData.serviceSmall;

        // 차량보험
        const vehRisk = d.vehicles < 10 ? 'low' : d.vehicles < 30 ? 'medium' : 'high';
        const vehPrem = Math.round(d.vehicles * 30000 * (d.accidents === 0 ? 0.8 : 1.2));

        document.getElementById('rk-veh').textContent = vehRisk === 'low' ? '낮음' : vehRisk === 'medium' ? '보통' : '높음';
        document.getElementById('rk-veh').className = 'risk-level ' + vehRisk;
        document.getElementById('rs-veh').textContent = fmt(vehPrem) + 'T';

        // 화재보험
        const facRisk = d.safety === 'A' ? 'low' : d.safety === 'B' ? 'medium' : 'high';
        const facPrem = Math.round(d.facility * 20000 * (d.safety === 'A' ? 0.6 : d.safety === 'B' ? 1.0 : 1.5));

        document.getElementById('rk-fac').textContent = facRisk === 'low' ? '낮음' : facRisk === 'medium' ? '보통' : '높음';
        document.getElementById('rk-fac').className = 'risk-level ' + facRisk;
        document.getElementById('rs-fac').textContent = fmt(facPrem) + 'T';
    }
    mDone(5);

    // Step 6: 통합 보험요율 결정
    mAct(6);
    document.getElementById('m-status').textContent = '통합 보험요율 결정 중...';
    await wait(400);

    if (isPerson) {
        totalPrem = lifePrem + diseasePrem + injuryPrem + autoPrem + firePrem;
        const grade = totalPrem < 50000 ? 'A' : totalPrem < 80000 ? 'B' : totalPrem < 120000 ? 'C' : 'D';

        document.getElementById('p-life').textContent = fmt(lifePrem);
        document.getElementById('p-disease').textContent = fmt(diseasePrem);
        document.getElementById('p-injury').textContent = fmt(injuryPrem);
        document.getElementById('p-auto').textContent = fmt(autoPrem);
        document.getElementById('p-fire').textContent = fmt(firePrem);

        document.getElementById('res-total').textContent = fmt(totalPrem);
        document.getElementById('res-grade').textContent = grade + '등급';
        document.getElementById('res-discount').textContent = (grade === 'A' ? '20%' : grade === 'B' ? '10%' : grade === 'C' ? '0%' : '-10%');
    } else {
        const biz = document.getElementById('sel-biz').value;
        const size = document.getElementById('sel-size').value;
        const key = biz + size.charAt(0).toUpperCase() + size.slice(1);
        const d = bizData[key] || bizData.serviceSmall;

        const empPrem = parseInt(document.getElementById('rs-emp').textContent.replace(/[^0-9]/g, ''));
        const liabPrem = parseInt(document.getElementById('rs-liab').textContent.replace(/[^0-9]/g, ''));
        const vehPrem = parseInt(document.getElementById('rs-veh').textContent.replace(/[^0-9]/g, ''));
        const facPrem = parseInt(document.getElementById('rs-fac').textContent.replace(/[^0-9]/g, ''));

        totalPrem = empPrem + liabPrem + vehPrem + facPrem;
        const grade = d.safety === 'A' ? 'A' : d.safety === 'B' ? 'B' : 'C';

        document.getElementById('pb-emp').textContent = fmt(empPrem);
        document.getElementById('pb-liab').textContent = fmt(liabPrem);
        document.getElementById('pb-veh').textContent = fmt(vehPrem);
        document.getElementById('pb-fac').textContent = fmt(facPrem);

        document.getElementById('res-total').textContent = fmt(totalPrem);
        document.getElementById('res-grade').textContent = grade + '등급';
        document.getElementById('res-discount').textContent = (grade === 'A' ? '15%' : grade === 'B' ? '5%' : '-5%');
    }
    mDone(6);

    // Step 7: Hash 기록
    mAct(7);
    document.getElementById('m-status').textContent = 'Hash 기록 중...';
    await wait(400);
    document.getElementById('m-hash-val').textContent = genHash();
    document.getElementById('m-hash').classList.add('show');
    mDone(7);

    document.getElementById('m-status').textContent = '✓ 보험료 산정 완료';
});
