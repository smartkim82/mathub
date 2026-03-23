// ============================
// 매트허브 - 견적계산기 JavaScript
// ============================

// ====== 상태 변수 ======
let calcState = {
  service: 'mattress',
  region: '',
  size: 25,
  houseType: '아파트',
};

// ====== URL 파라미터 처리 ======
document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('service')) {
    const svc = params.get('service');
    const btn = document.querySelector(`[data-service="${svc}"]`);
    if (btn) selectService(svc, btn);
  }
  if (params.get('region')) {
    const reg = params.get('region');
    const btn = Array.from(document.querySelectorAll('.region-btn')).find(b => b.textContent === reg);
    if (btn) selectRegion(reg, btn);
  }
  if (params.get('size')) {
    setSizeVal(parseInt(params.get('size')));
  }

  initSlider();
  switchTable('cleaning', document.querySelector('.tt-btn.active'));
});

// ====== 서비스 선택 ======
function selectService(service, btn) {
  calcState.service = service;
  document.querySelectorAll('.svc-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.svc-detail').forEach(d => d.classList.remove('active'));
  document.getElementById('detail-' + service)?.classList.add('active');
  updateResultPreview();
}

// ====== 지역 선택 ======
function selectRegion(region, btn) {
  calcState.region = region;
  document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateResultPreview();
}

// ====== 평형 업데이트 ======
function updateSize(val) {
  calcState.size = parseInt(val);
  document.getElementById('sizeNum').textContent = val;
  document.getElementById('sqmNum').textContent = (val * 3.305785).toFixed(1);

  // 슬라이더 색상 업데이트
  const slider = document.getElementById('sizeSlider');
  const pct = ((val - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;

  // 퀵 버튼 업데이트
  document.querySelectorAll('.qs-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.textContent) === parseInt(val));
  });

  updateResultPreview();
}

function setSizeVal(val) {
  const slider = document.getElementById('sizeSlider');
  slider.value = val;
  updateSize(val);
}

function initSlider() {
  const slider = document.getElementById('sizeSlider');
  updateSize(slider.value);
}

// ====== 주택 유형 ======
function selectHouseType(type, btn) {
  calcState.houseType = type;
  document.querySelectorAll('.house-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateResultPreview();
}

// ====== 수량 변경 ======
function changeQty(id, delta) {
  const el = document.getElementById(id);
  if (!el) return;
  let val = parseInt(el.dataset.val) + delta;
  val = Math.max(1, Math.min(10, val));
  el.dataset.val = val;
  el.textContent = val + '개';
  updateResultPreview();
}

// ====== 견적 계산 데이터 ======
const PRICE_DATA = {
  mattress: {
    icon: '🛏', name: '매트리스 청소',
    basePrice: { single: 35000, double: 45000, king: 60000 },
    extras: { steam: 15000, deodor: 10000, protect: 20000 }
  },
  cleaning: {
    icon: '🧹', name: '청소 서비스',
    basePricePerPyeong: { move_in: 5500, resident: 3800, office: 4200, move_out: 4500 },
    extras: { grouting: 80000, aircon: 70000, refrigerator: 50000, washer: 50000 }
  },
  interior: {
    icon: '🏡', name: '인테리어',
    perPyeong: { wallpaper: 25000, floor: 45000, bathroom: 600000, kitchen: 800000, window: 35000, full: 120000 }
  },
  curtain: {
    icon: '🪟', name: '커튼 설치',
    baseByType: { curtain: 80000, blind: 65000, roll: 55000, both: 140000 }
  },
  film: {
    icon: '🎬', name: '창문 필름',
    pricePerWindow: { insulation: 45000, security: 55000, uv: 35000, privacy: 40000 }
  },
  aircon: {
    icon: '🧴', name: '가전 청소',
    pricePerItem: { wallaircon: 70000, standaircon: 100000, washer: 80000, fridge: 90000, oven: 60000 }
  }
};

// 지역별 할증 (%)
const REGION_SURCHARGE = {
  '서울': 1.15, '경기': 1.05, '인천': 1.05,
  '부산': 1.02, '대구': 1.00, '대전': 1.00,
  '광주': 0.98, '울산': 0.98, '세종': 1.00,
  '강원': 1.02, '충북': 0.97, '충남': 0.97,
  '전북': 0.95, '전남': 0.95, '경북': 0.96,
  '경남': 0.97, '제주': 1.10
};

// 주택유형별 할증
const HOUSE_SURCHARGE = {
  '아파트': 1.0, '빌라': 0.95, '단독주택': 1.05, '오피스텔': 1.02
};

// ====== 견적 계산 ======
function calculateEstimate() {
  const service = calcState.service;
  const region = calcState.region || '서울';
  const size = calcState.size;
  const houseType = calcState.houseType;

  // 버튼 로딩 효과
  const btn = document.getElementById('calcBtn');
  btn.textContent = '⏳ 계산 중...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = '🧮 견적 계산하기';
    btn.disabled = false;

    const { min, max, breakdown, matchCount } = computePrice(service, region, size, houseType);

    // 결과 표시
    document.getElementById('resultInitial').style.display = 'none';
    document.getElementById('resultContent').style.display = 'block';

    // 요약
    const data = PRICE_DATA[service];
    document.getElementById('rsIcon').textContent = data.icon;
    document.getElementById('rsText').textContent = `${data.name} · ${region} · ${size}평 · ${houseType}`;

    // 날짜
    const now = new Date();
    document.getElementById('resultDate').textContent = now.toLocaleDateString('ko-KR');

    // 가격
    document.getElementById('priceMin').textContent = min.toLocaleString('ko-KR');
    document.getElementById('priceMax').textContent = max.toLocaleString('ko-KR');

    // 세부 내역
    renderBreakdown(breakdown);

    // 매칭 업체
    document.getElementById('matchCount').textContent = matchCount + '개';
    renderMatchList(service, region, matchCount);

    // 스크롤
    document.getElementById('calcResultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });

  }, 800);
}

function computePrice(service, region, size, houseType) {
  const regionMul = REGION_SURCHARGE[region] || 1.0;
  const houseMul = HOUSE_SURCHARGE[houseType] || 1.0;
  let baseMin = 0, baseMax = 0;
  const breakdown = [];

  if (service === 'mattress') {
    const typeEl = document.querySelector('input[name="mattress_type"]:checked');
    const type = typeEl ? typeEl.value : 'single';
    const qty = parseInt(document.getElementById('mattress_qty')?.dataset.val || 1);
    const base = PRICE_DATA.mattress.basePrice[type];
    baseMin = base * qty;
    baseMax = base * qty * 1.2;
    breakdown.push({ label: `${type === 'single' ? '싱글' : type === 'double' ? '더블/퀸' : '킹'} 매트리스 × ${qty}`, val: `${(base * qty).toLocaleString()}원` });

    document.querySelectorAll('input[name="extra"]:checked').forEach(c => {
      const extra = PRICE_DATA.mattress.extras[c.value] || 0;
      baseMin += extra;
      baseMax += extra;
      breakdown.push({ label: c.value === 'steam' ? '스팀 살균' : c.value === 'deodor' ? '탈취·항균' : '매트리스 커버', val: `+${extra.toLocaleString()}원` });
    });

  } else if (service === 'cleaning') {
    const typeEl = document.querySelector('input[name="cleaning_type"]:checked');
    const type = typeEl ? typeEl.value : 'move_in';
    const ppq = PRICE_DATA.cleaning.basePricePerPyeong[type];
    const base = ppq * size;
    baseMin = base * 0.9;
    baseMax = base * 1.15;
    const typeNames = { move_in: '입주청소', resident: '거주청소', office: '사무실청소', move_out: '이사청소' };
    breakdown.push({ label: `${typeNames[type]} (${size}평 × ${ppq.toLocaleString()}원)`, val: `${base.toLocaleString()}원` });

    document.querySelectorAll('input[name="extra_clean"]:checked').forEach(c => {
      const extra = PRICE_DATA.cleaning.extras[c.value] || 0;
      baseMin += extra;
      baseMax += extra * 1.1;
      const labels = { grouting: '줄눈시공', aircon: '에어컨청소', refrigerator: '냉장고청소', washer: '세탁기청소' };
      breakdown.push({ label: labels[c.value], val: `+${extra.toLocaleString()}원~` });
    });

  } else if (service === 'interior') {
    const checked = document.querySelectorAll('input[name="interior_type"]:checked');
    if (checked.length === 0) {
      baseMin = size * 50000;
      baseMax = size * 80000;
      breakdown.push({ label: '인테리어 (평균 예상)', val: `${baseMin.toLocaleString()}원~` });
    } else {
      checked.forEach(c => {
        const ppq = PRICE_DATA.interior.perPyeong[c.value] || 0;
        const labels = { wallpaper: '도배', floor: '마루·바닥', bathroom: '욕실', kitchen: '주방', window: '창호', full: '전체리모델링' };
        const isFlat = ['bathroom', 'kitchen'].includes(c.value);
        const cost = isFlat ? ppq : ppq * size;
        baseMin += cost * 0.85;
        baseMax += cost * 1.15;
        breakdown.push({ label: labels[c.value], val: `${cost.toLocaleString()}원` });
      });
    }

  } else if (service === 'curtain') {
    const typeEl = document.querySelector('input[name="curtain_type"]:checked');
    const type = typeEl ? typeEl.value : 'curtain';
    const qty = parseInt(document.getElementById('curtain_qty')?.dataset.val || 1);
    const base = PRICE_DATA.curtain.baseByType[type];
    baseMin = base * qty;
    baseMax = base * qty * 1.4;
    const typeNames = { curtain: '일반 커튼', blind: '블라인드', roll: '롤스크린', both: '2중 커튼' };
    breakdown.push({ label: `${typeNames[type]} × ${qty}개`, val: `${(base * qty).toLocaleString()}원~` });

  } else if (service === 'film') {
    const typeEl = document.querySelector('input[name="film_type"]:checked');
    const type = typeEl ? typeEl.value : 'insulation';
    const qty = parseInt(document.getElementById('film_qty')?.dataset.val || 1);
    const price = PRICE_DATA.film.pricePerWindow[type];
    baseMin = price * qty;
    baseMax = price * qty * 1.3;
    const typeNames = { insulation: '단열 필름', security: '방범 필름', uv: '자외선차단 필름', privacy: '시선차단 필름' };
    breakdown.push({ label: `${typeNames[type]} × 창문 ${qty}개`, val: `${(price * qty).toLocaleString()}원~` });

  } else if (service === 'aircon') {
    const checked = document.querySelectorAll('input[name="appliance"]:checked');
    if (checked.length === 0) {
      baseMin = 70000;
      baseMax = 150000;
      breakdown.push({ label: '가전 청소 (기본)', val: '70,000원~' });
    } else {
      checked.forEach(c => {
        const price = PRICE_DATA.aircon.pricePerItem[c.value] || 0;
        const labels = { wallaircon: '벽걸이 에어컨', standaircon: '스탠드 에어컨', washer: '세탁기', fridge: '냉장고', oven: '오븐' };
        baseMin += price;
        baseMax += price * 1.1;
        breakdown.push({ label: labels[c.value], val: `${price.toLocaleString()}원` });
      });
    }
  }

  // 할증 적용
  baseMin = Math.round(baseMin * regionMul * houseMul / 1000) * 1000;
  baseMax = Math.round(baseMax * regionMul * houseMul / 1000) * 1000;

  breakdown.push({ label: `지역 할증 (${region})`, val: `×${regionMul.toFixed(2)}` });
  if (houseType !== '아파트') {
    breakdown.push({ label: `주택 유형 (${houseType})`, val: `×${houseMul.toFixed(2)}` });
  }

  const matchCount = Math.floor(Math.random() * 8) + 5;

  return { min: baseMin, max: baseMax, breakdown, matchCount };
}

function renderBreakdown(breakdown) {
  const container = document.getElementById('priceBreakdown');
  container.innerHTML = breakdown.map(r => `
    <div class="pd-row">
      <span class="pd-row-label">${r.label}</span>
      <span class="pd-row-val">${r.val}</span>
    </div>
  `).join('');
}

const matchCompanies = {
  mattress: [
    { icon: '🛏', name: '클린매트 전문점', rating: '4.9', price: '35,000원~' },
    { icon: '🛏', name: '진드기제거 전문', rating: '4.8', price: '38,000원~' },
    { icon: '🛏', name: '스팀매트 클린', rating: '4.7', price: '40,000원~' },
  ],
  cleaning: [
    { icon: '🧹', name: '에이스청소', rating: '4.9', price: '150,000원~' },
    { icon: '🧹', name: '클린하우스', rating: '4.8', price: '160,000원~' },
    { icon: '🧹', name: '프로청소팀', rating: '4.7', price: '170,000원~' },
  ],
  interior: [
    { icon: '🏡', name: '프리미엄인테리어', rating: '4.9', price: '견적문의' },
    { icon: '🏡', name: '스마트리모델링', rating: '4.8', price: '견적문의' },
    { icon: '🏡', name: '아름다운집', rating: '4.7', price: '견적문의' },
  ],
  curtain: [
    { icon: '🪟', name: '맞춤커튼하우스', rating: '4.9', price: '80,000원~' },
    { icon: '🪟', name: '인테리어샵', rating: '4.8', price: '85,000원~' },
    { icon: '🪟', name: '커튼전문점', rating: '4.7', price: '90,000원~' },
  ],
  film: [
    { icon: '🎬', name: '썬텍필름', rating: '4.9', price: '45,000원~' },
    { icon: '🎬', name: '유리필름전문', rating: '4.8', price: '50,000원~' },
    { icon: '🎬', name: '단열필름샵', rating: '4.7', price: '48,000원~' },
  ],
  aircon: [
    { icon: '🧴', name: '홈케어서비스', rating: '4.9', price: '70,000원~' },
    { icon: '🧴', name: '에어컨클린', rating: '4.8', price: '75,000원~' },
    { icon: '🧴', name: '가전청소팀', rating: '4.7', price: '72,000원~' },
  ]
};

function renderMatchList(service, region, count) {
  const companies = matchCompanies[service] || matchCompanies.cleaning;
  const container = document.getElementById('matchList');
  container.innerHTML = companies.slice(0, 3).map(c => `
    <div class="mp-company" onclick="window.location.href='companies.html'">
      <div class="mp-company-left">
        <div class="mp-co-icon">${c.icon}</div>
        <div>
          <div class="mp-co-name">${c.name}</div>
          <div class="mp-co-rating">⭐ ${c.rating}</div>
        </div>
      </div>
      <div class="mp-co-price">${c.price}</div>
    </div>
  `).join('');
}

// ====== 실시간 미리보기 ======
function updateResultPreview() {
  // 선택 상태 표시 (선택 요약) - 간단한 표시
}

// ====== 초기화 ======
function resetCalc() {
  document.getElementById('resultInitial').style.display = 'flex';
  document.getElementById('resultContent').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== 가격표 ======
const PRICE_TABLES = {
  cleaning: {
    headers: ['평형', '입주청소', '거주청소', '사무실청소', '이사청소'],
    rows: [
      ['10평 이하', '66,000~', '38,000~', '42,000~', '45,000~'],
      ['15평', '99,000~', '57,000~', '63,000~', '68,000~'],
      ['20평', '132,000~', '76,000~', '84,000~', '90,000~'],
      ['25평', '165,000~', '95,000~', '105,000~', '113,000~'],
      ['30평', '198,000~', '114,000~', '126,000~', '135,000~'],
      ['34평', '224,000~', '130,000~', '143,000~', '153,000~'],
      ['40평', '264,000~', '152,000~', '168,000~', '180,000~'],
      ['50평 이상', '330,000~', '190,000~', '210,000~', '225,000~'],
    ]
  },
  mattress: {
    headers: ['매트리스 사이즈', '기본 청소', '스팀 살균 추가', '탈취·항균 추가', '전체 패키지'],
    rows: [
      ['싱글/슈퍼싱글', '35,000~', '+15,000', '+10,000', '60,000~'],
      ['더블/퀸', '45,000~', '+15,000', '+10,000', '70,000~'],
      ['킹 사이즈', '60,000~', '+20,000', '+15,000', '95,000~'],
    ]
  },
  interior: {
    headers: ['공사 종류', '20평', '25평', '30평', '34평', '40평 이상'],
    rows: [
      ['도배 (풀 바름)', '500,000~', '625,000~', '750,000~', '850,000~', '1,000,000~'],
      ['마루·바닥재', '900,000~', '1,125,000~', '1,350,000~', '1,530,000~', '1,800,000~'],
      ['욕실 리모델링', '기본 600만원~', '기본 700만원~', '기본 800만원~', '기본 900만원~', '협의'],
      ['도배+마루 패키지', '1,400,000~', '1,750,000~', '2,100,000~', '2,380,000~', '협의'],
      ['전체 리모델링', '2,400,000~', '3,000,000~', '3,600,000~', '4,080,000~', '협의'],
    ]
  },
  curtain: {
    headers: ['커튼 종류', '거실(대)', '방(중)', '방(소)', '특이사항'],
    rows: [
      ['일반 커튼(1겹)', '150,000~', '100,000~', '80,000~', '원단 등급에 따라 상이'],
      ['2중 커튼', '250,000~', '180,000~', '140,000~', '암막+일반 커튼'],
      ['롤스크린', '90,000~', '65,000~', '50,000~', '방문 측정 무료'],
      ['블라인드', '100,000~', '70,000~', '55,000~', '알루미늄/우드 선택'],
    ]
  },
  film: {
    headers: ['필름 종류', '일반창 1개', '대형창 1개', '특징', '하자보증'],
    rows: [
      ['단열 필름', '40,000~', '60,000~', '냉난방비 절감', '5년'],
      ['방범 필름', '55,000~', '80,000~', '파손방지', '5년'],
      ['자외선차단 필름', '35,000~', '50,000~', 'UV 99% 차단', '3년'],
      ['시선차단 필름', '40,000~', '55,000~', '개인정보 보호', '3년'],
      ['데코 필름', '30,000~', '45,000~', '인테리어 효과', '2년'],
    ]
  }
};

function switchTable(type, btn) {
  document.querySelectorAll('.tt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const tableData = PRICE_TABLES[type];
  if (!tableData) return;

  const wrap = document.getElementById('priceTableWrap');
  wrap.innerHTML = `
    <table class="price-table">
      <thead>
        <tr>${tableData.headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${tableData.rows.map(row => `
          <tr>
            <td><strong>${row[0]}</strong></td>
            ${row.slice(1).map(cell => `<td class="price-range-cell">${cell}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p class="price-note">※ 위 가격은 서울 기준 평균 시장가입니다. 지역에 따라 ±15% 차이가 발생할 수 있습니다.</p>
  `;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
