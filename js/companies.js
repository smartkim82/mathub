// ============================
// 업체찾기 JavaScript
// ============================

const ALL_COMPANIES = [
  { id: 1, emoji: '🛏', name: '클린매트 전문점', category: '매트리스 업체', type: 'mattress', region: '서울', location: '서울 강남구 · 전국 출장', rating: 4.9, reviews: 284, badge: 'partner', desc: '10년 경력의 매트리스 청소 전문업체. 살균·세척·스팀 클리닝으로 진드기 99.9% 제거 보장.', tags: ['살균세척', '스팀클리닝', '진드기제거', '당일가능'], price: '35,000원~', verified: true },
  { id: 2, emoji: '🧹', name: '에이스청소', category: '청소 업체', type: 'cleaning', region: '경기', location: '경기 성남시 · 수도권', rating: 4.8, reviews: 521, badge: 'best', desc: '입주청소부터 거주청소, 사무실청소까지. 줄눈시공, 에어컨청소 전문 업체.', tags: ['입주청소', '줄눈시공', '에어컨청소', '사무실청소'], price: '150,000원~', verified: true },
  { id: 3, emoji: '🏡', name: '프리미엄인테리어', category: '인테리어 업체', type: 'interior', region: '서울', location: '서울 전역 · 경기', rating: 4.9, reviews: 183, badge: null, desc: '도배, 마루, 타일, 욕실리모델링부터 전체 리모델링까지. 15년 경력 인테리어 전문.', tags: ['도배', '마루시공', '욕실리모델링', '전체리모델링'], price: '견적문의', verified: true },
  { id: 4, emoji: '🪟', name: '맞춤커튼하우스', category: '커튼 업체', type: 'curtain', region: '서울', location: '서울 · 경기 전역', rating: 4.7, reviews: 342, badge: null, desc: '맞춤 제작 커튼, 블라인드, 롤스크린 전문. 방문 무료 측정 및 당일 설치 가능.', tags: ['맞춤제작', '블라인드', '롤스크린', '방문측정'], price: '80,000원~', verified: true },
  { id: 5, emoji: '🎬', name: '썬텍필름', category: '필름 업체', type: 'film', region: '전국', location: '전국 출장 가능', rating: 4.8, reviews: 156, badge: 'new', desc: '단열·방범·자외선차단·시선차단 필름 시공 전문. 시공 후 5년 하자 보증.', tags: ['단열필름', '방범필름', '자외선차단', '당일시공'], price: '45,000원~', verified: true },
  { id: 6, emoji: '🧴', name: '홈케어서비스', category: '가전 청소', type: 'aircon', region: '서울', location: '서울 전역', rating: 4.9, reviews: 467, badge: 'partner', desc: '에어컨, 세탁기, 냉장고 등 가전제품 전문 청소. 분해 후 세척 및 항균 코팅.', tags: ['에어컨청소', '세탁기청소', '냉장고청소', '분해세척'], price: '70,000원~', verified: true },
  { id: 7, emoji: '🛏', name: '진드기제거 전문', category: '매트리스 업체', type: 'mattress', region: '경기', location: '경기 수원·안양·성남', rating: 4.7, reviews: 198, badge: null, desc: '특수 살균 장비로 진드기 및 각종 세균을 완전 제거. 아이 있는 가정에 특히 추천.', tags: ['진드기제거', '살균특화', '아동안전'], price: '38,000원~', verified: true },
  { id: 8, emoji: '🧹', name: '클린하우스 청소', category: '청소 업체', type: 'cleaning', region: '서울', location: '서울 전역', rating: 4.9, reviews: 389, badge: 'best', desc: '신축 아파트 전문 입주청소 업체. 꼼꼼한 청소와 친절한 서비스로 고객 만족도 1위.', tags: ['입주청소', '신축전문', '꼼꼼청소'], price: '160,000원~', verified: true },
  { id: 9, emoji: '🏡', name: '스마트리모델링', category: '인테리어 업체', type: 'interior', region: '인천', location: '인천 · 경기 서부', rating: 4.8, reviews: 143, badge: null, desc: '합리적인 가격의 전체 리모델링. 욕실, 주방, 도배, 마루 패키지 특가.', tags: ['리모델링', '특가패키지', '욕실주방'], price: '견적문의', verified: true },
  { id: 10, emoji: '🪟', name: '인테리어커튼샵', category: '커튼 업체', type: 'curtain', region: '부산', location: '부산 전역', rating: 4.6, reviews: 127, badge: null, desc: '부산 최대 커튼 전문점. 100종 이상 원단 보유, 방문 프리 측정.', tags: ['대형매장', '원단다양', '방문측정'], price: '70,000원~', verified: false },
  { id: 11, emoji: '🎬', name: '유리필름전문점', category: '필름 업체', type: 'film', region: '대구', location: '대구 전역', rating: 4.7, reviews: 89, badge: null, desc: '대구 전문 필름 시공 업체. 단열·방범·광고 필름 전문 시공.', tags: ['단열', '방범', '광고필름'], price: '40,000원~', verified: true },
  { id: 12, emoji: '🧴', name: '에어컨클린마스터', category: '가전 청소', type: 'aircon', region: '경기', location: '경기 전역', rating: 4.8, reviews: 312, badge: 'partner', desc: '에어컨 전문 청소 업체. 시스템 에어컨부터 벽걸이, 스탠드 모두 가능.', tags: ['에어컨전문', '시스템에어컨', '항균코팅'], price: '75,000원~', verified: true },
];

let filteredCompanies = [...ALL_COMPANIES];
let currentView = 'grid';
let currentRegion = '전체';
let currentRating = 0;

document.addEventListener('DOMContentLoaded', function() {
  renderCompanies(filteredCompanies);
});

function renderCompanies(companies) {
  const grid = document.getElementById('companiesListGrid');
  const count = document.getElementById('listCount');
  count.innerHTML = `전체 <strong>${companies.length}</strong>개 업체`;

  if (companies.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-gray);">😢 검색 결과가 없습니다</div>';
    return;
  }

  grid.innerHTML = companies.map(c => `
    <div class="comp-detail-card" onclick="window.location.href='estimate.html'">
      ${c.badge ? `<div class="cdc-badge ${c.badge === 'best' ? 'badge-best' : c.badge === 'partner' ? 'badge-partner' : 'badge-new'}">${c.badge === 'best' ? 'BEST' : c.badge === 'partner' ? '파트너' : 'NEW'}</div>` : ''}
      <div class="cdc-top">
        <div class="cdc-logo">${c.emoji}</div>
        <div class="cdc-info">
          <div class="cdc-name">${c.name}</div>
          <div class="cdc-cat">${c.category}</div>
          <div class="cdc-location">📍 ${c.location}</div>
        </div>
      </div>
      ${c.verified ? '<div style="font-size:12px;color:#27ae60;font-weight:600;margin-bottom:8px;">✅ 매트허브 인증 업체</div>' : ''}
      <div class="cdc-rating">
        <span class="cdc-stars">${'★'.repeat(Math.floor(c.rating))}</span>
        <span class="cdc-rnum">${c.rating}</span>
        <span class="cdc-rcnt">(${c.reviews}건)</span>
      </div>
      <p class="cdc-desc">${c.desc}</p>
      <div class="cdc-tags">${c.tags.map(t => `<span class="cdc-tag">${t}</span>`).join('')}</div>
      <div class="cdc-footer">
        <div class="cdc-price">${c.price}</div>
        <button class="cdc-btn">견적 받기</button>
      </div>
    </div>
  `).join('');
}

function filterCompanies() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  filteredCompanies = ALL_COMPANIES.filter(c => {
    const matchQuery = !query || c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query) || c.location.toLowerCase().includes(query) || c.tags.some(t => t.includes(query));
    const matchRegion = currentRegion === '전체' || c.region === currentRegion || c.region === '전국';
    const matchRating = c.rating >= currentRating;
    return matchQuery && matchRegion && matchRating;
  });
  renderCompanies(filteredCompanies);
}

function filterByService(type) {
  if (type === 'all') {
    filteredCompanies = [...ALL_COMPANIES];
  } else {
    filteredCompanies = ALL_COMPANIES.filter(c => c.type === type);
  }
  renderCompanies(filteredCompanies);
}

function filterByRegion(region, btn) {
  currentRegion = region;
  document.querySelectorAll('.region-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterCompanies();
}

function filterByRating(rating) {
  currentRating = rating;
  filterCompanies();
}

function sortCompanies(by) {
  if (by === 'rating') filteredCompanies.sort((a, b) => b.rating - a.rating);
  else if (by === 'review') filteredCompanies.sort((a, b) => b.reviews - a.reviews);
  renderCompanies(filteredCompanies);
}

function setView(view, btn) {
  currentView = view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('companiesListGrid');
  grid.classList.toggle('list-view', view === 'list');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
