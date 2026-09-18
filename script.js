/* ==========================================================
   1. App State
   ========================================================== */
const state = {
  country: localStorage.getItem('m_country') || 'Egypt',
  city: localStorage.getItem('m_city') || 'Cairo',
  tasbihCount: parseInt(localStorage.getItem('m_tasbih')) || 0,
  azkarDone: parseInt(localStorage.getItem('m_azkar')) || 0,
  prayersCount: parseInt(localStorage.getItem('m_prayers')) || 0,
  dark: localStorage.getItem('m_dark') === 'true',
  dynTheme: localStorage.getItem('m_dyn') !== 'false',
  prayerTimes: null,
  timerInt: null,
  adhanAudio: null,
  currentNotified: {}
};

/* ==========================================================
   2. Adhan Sounds (External URLs)
   ========================================================== */
const ADHAN_SOUNDS = {
  makkah: 'https://www.islamcan.com/audio/adhan/azan1.mp3',
  madinah: 'https://www.islamcan.com/audio/adhan/azan2.mp3',
  aqsa: 'https://www.islamcan.com/audio/adhan/azan3.mp3',
  egypt: 'https://www.islamcan.com/audio/adhan/azan4.mp3',
  fajr: 'https://www.islamcan.com/audio/adhan/azan5.mp3'
};

/* ==========================================================
   3. Azkar Data
   ========================================================== */
const azkarData = {
  sabah: [
    { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ', count: 1 },
    { text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', count: 1 },
    { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ', count: 3 },
    { text: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', count: 7 },
    { text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي', count: 3 }
  ],
  misaa: [
    { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ', count: 1 },
    { text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ', count: 1 },
    { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3 },
    { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ', count: 1 }
  ]
};

/* ==========================================================
   4. Dynamic Themes
   ========================================================== */
const THEMES = {
  fajr:    { bg:'#FDF6F0', primary:'#B8909A', primaryLight:'#D4A5A5', gold:'#E8B4A8', text:'#3D2B2B', muted:'#8A7373', card:'#ffffff', border:'#F0E4E0', shadow:'rgba(184,144,154,.15)' },
  morning: { bg:'#F0F8F4', primary:'#0D5C46', primaryLight:'#157A5E', gold:'#D4AF37', text:'#1E2923', muted:'#5C6E64', card:'#ffffff', border:'#E2E8F0', shadow:'rgba(13,92,70,.08)' },
  noon:    { bg:'#FDFCF7', primary:'#1E5F8C', primaryLight:'#2E7BB0', gold:'#E8B44A', text:'#1A2B3D', muted:'#5A6E80', card:'#ffffff', border:'#E5EBF0', shadow:'rgba(30,95,140,.08)' },
  asr:     { bg:'#FBF6EE', primary:'#A0522D', primaryLight:'#C67B4D', gold:'#D4AF37', text:'#3D2817', muted:'#806B58', card:'#ffffff', border:'#F0E8DC', shadow:'rgba(160,82,45,.1)' },
  maghrib: { bg:'#FDF2EC', primary:'#8B3A52', primaryLight:'#B05A72', gold:'#E89F71', text:'#3D1F2D', muted:'#80636E', card:'#ffffff', border:'#F0E0DC', shadow:'rgba(139,58,82,.1)' },
  night:   { bg:'#EEF2F7', primary:'#2C3E50', primaryLight:'#4A6070', gold:'#95A5A6', text:'#1A2430', muted:'#5F7080', card:'#ffffff', border:'#DFE5EC', shadow:'rgba(44,62,80,.08)' }
};

function getThemeKey() {
  const h = new Date().getHours();
  if (h >= 4 && h < 7) return 'fajr';
  if (h >= 7 && h < 12) return 'morning';
  if (h >= 12 && h < 16) return 'noon';
  if (h >= 16 && h < 18) return 'asr';
  if (h >= 18 && h < 20) return 'maghrib';
  return 'night';
}

function applyTheme() {
  if (state.dark || !state.dynTheme) return;
  const t = THEMES[getThemeKey()];
  const r = document.documentElement.style;
  r.setProperty('--bg', t.bg);
  r.setProperty('--primary', t.primary);
  r.setProperty('--primary-light', t.primaryLight);
  r.setProperty('--gold', t.gold);
  r.setProperty('--text', t.text);
  r.setProperty('--muted', t.muted);
  r.setProperty('--card', t.card);
  r.setProperty('--border', t.border);
  r.setProperty('--shadow', t.shadow);
}

function toggleDark(on) {
  state.dark = on;
  localStorage.setItem('m_dark', on);
  document.body.classList.toggle('dark', on);
  if (!on) applyTheme();
}

function toggleDynTheme(on) {
  state.dynTheme = on;
  localStorage.setItem('m_dyn', on);
  if (on && !state.dark) applyTheme();
}

/* ==========================================================
   5. Navigation
   ========================================================== */
function go(id, el) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  if (el) {
    document.querySelectorAll('.nav').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }
  if (id === 'profileView') {
    document.getElementById('sTasbih').textContent = state.tasbihCount;
    document.getElementById('sAzkar').textContent = state.azkarDone;
    document.getElementById('sPrayers').textContent = state.prayersCount;
  }
  if (id === 'quranView') fetchSurahList();
}

/* ==========================================================
   6. Prayer Times + Hijri Date
   ========================================================== */
async function fetchPrayerTimes() {
  try {
    const url = 'https://api.aladhan.com/v1/timingsByCity?city=' + encodeURIComponent(state.city) + '&country=' + encodeURIComponent(state.country) + '&method=5';
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 200) {
      const t = data.data.timings;
      const h = data.data.date.hijri;
      state.prayerTimes = t;

      document.querySelector('#p-Fajr .t').textContent = fmtTime(t.Fajr);
      document.querySelector('#p-Sunrise .t').textContent = fmtTime(t.Sunrise);
      document.querySelector('#p-Dhuhr .t').textContent = fmtTime(t.Dhuhr);
      document.querySelector('#p-Asr .t').textContent = fmtTime(t.Asr);
      document.querySelector('#p-Maghrib .t').textContent = fmtTime(t.Maghrib);
      document.querySelector('#p-Isha .t').textContent = fmtTime(t.Isha);

      // التاريخ الميلادي والهجري
      const gDate = new Date();
      const gregOptions = { weekday: 'long', day: 'numeric', month: 'long' };
      document.getElementById('gregDate').textContent = gDate.toLocaleDateString('ar-EG', gregOptions);
      document.getElementById('hijriDate').textContent = h.day + ' ' + h.month.ar + ' ' + h.year + ' هـ';

      startCountdown(t);
      checkNotifications(t);
      localStorage.setItem('cachedPT', JSON.stringify({ t, h: h.day + ' ' + h.month.ar + ' ' + h.year }));
    }
  } catch (err) {
    const cached = localStorage.getItem('cachedPT');
    if (cached) {
      const { t, h } = JSON.parse(cached);
      document.querySelector('#p-Fajr .t').textContent = fmtTime(t.Fajr);
      document.querySelector('#p-Sunrise .t').textContent = fmtTime(t.Sunrise);
      document.querySelector('#p-Dhuhr .t').textContent = fmtTime(t.Dhuhr);
      document.querySelector('#p-Asr .t').textContent = fmtTime(t.Asr);
      document.querySelector('#p-Maghrib .t').textContent = fmtTime(t.Maghrib);
      document.querySelector('#p-Isha .t').textContent = fmtTime(t.Isha);
      document.getElementById('hijriDate').textContent = h + ' هـ';
      startCountdown(t);
    }
  }
}

function fmtTime(t24) {
  const [h, m] = t24.split(':').map(Number);
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return String(h12).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ' ' + period;
}

function startCountdown(t) {
  if (state.timerInt) clearInterval(state.timerInt);
  const prayers = [
    { name: 'الفجر', time: t.Fajr, id: 'p-Fajr' },
    { name: 'الظهر', time: t.Dhuhr, id: 'p-Dhuhr' },
    { name: 'العصر', time: t.Asr, id: 'p-Asr' },
    { name: 'المغرب', time: t.Maghrib, id: 'p-Maghrib' },
    { name: 'العشاء', time: t.Isha, id: 'p-Isha' }
  ];
  state.timerInt = setInterval(() => {
    const now = new Date();
    let next = null, nextT = null;
    for (const p of prayers) {
      const [h, m] = p.time.split(':').map(Number);
      const pd = new Date(); pd.setHours(h, m, 0, 0);
      if (pd > now) { next = p; nextT = pd; break; }
    }
    if (!next) {
      next = prayers[0];
      const [h, m] = prayers[0].time.split(':').map(Number);
      nextT = new Date(); nextT.setDate(nextT.getDate() + 1); nextT.setHours(h, m, 0, 0);
    }
    document.getElementById('nextP').textContent = 'صلاة ' + next.name;
    const diff = nextT - now;
    const hh = Math.floor(diff / 3600000);
    const mm = Math.floor((diff % 3600000) / 60000);
    const ss = Math.floor((diff % 60000) / 1000);
    document.getElementById('timer').textContent =
      String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
    document.querySelectorAll('.p-item').forEach(i => i.classList.remove('next'));
    const nextEl = document.getElementById(next.id);
    if (nextEl) nextEl.classList.add('next');
  }, 1000);
}

/* ==========================================================
   7. Notifications
   ========================================================== */
async function requestNotif(on) {
  if (!on) return;
  if (!('Notification' in window)) { alert('متصفحك لا يدعم الإشعارات'); return; }
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { alert('لم يتم منح إذن الإشعارات'); }
}

function checkNotifications(t) {
  setInterval(() => {
    const now = new Date();
    const hh = now.getHours();
    const mm = now.getMinutes();
    const prayers = [
      { name: 'الفجر', time: t.Fajr },
      { name: 'الظهر', time: t.Dhuhr },
      { name: 'العصر', time: t.Asr },
      { name: 'المغرب', time: t.Maghrib },
      { name: 'العشاء', time: t.Isha }
    ];
    prayers.forEach(p => {
      const [ph, pm] = p.time.split(':').map(Number);
      const key = now.toDateString() + p.name;
      if (ph === hh && pm === mm && !state.currentNotified[key]) {
        state.currentNotified[key] = true;
        if (Notification.permission === 'granted') {
          new Notification('حان وقت صلاة ' + p.name, {
            body: 'الله أكبر — قم إلى صلاتك',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="70" font-size="70">🕌</text></svg>'
          });
        }
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    });
  }, 30000);
}

/* ==========================================================
   8. Adhan Test
   ========================================================== */
function testAdhan() {
  stopAdhan();
  const key = document.getElementById('adhanSel').value;
  const url = ADHAN_SOUNDS[key];
  if (!url) return;
  state.adhanAudio = new Audio(url);
  state.adhanAudio.play().catch(e => alert('تعذر تشغيل الأذان: ' + e.message));
}
function stopAdhan() {
  if (state.adhanAudio) { state.adhanAudio.pause(); state.adhanAudio.currentTime = 0; state.adhanAudio = null; }
}

/* ==========================================================
   9. Azkar
   ========================================================== */
function loadAzkar(type, ev) {
  if (ev) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    ev.target.classList.add('active');
  }
  const container = document.getElementById('azkarList');
  container.innerHTML = '';
  (azkarData[type] || []).forEach(item => {
    const card = document.createElement('div');
    card.className = 'azkar-item';
    let count = item.count;
    card.innerHTML = '<div class="azkar-text">"' + item.text + '"</div><span class="azkar-count">التكرار: ' + count + '</span>';
    card.onclick = () => {
      if (card.classList.contains('done')) return;
      if (count > 1) {
        count--;
        card.querySelector('.azkar-count').textContent = 'التكرار: ' + count;
        if (navigator.vibrate) navigator.vibrate(30);
      } else {
        count = 0;
        card.querySelector('.azkar-count').textContent = 'تم ✓';
        card.classList.add('done');
        state.azkarDone++;
        localStorage.setItem('m_azkar', state.azkarDone);
        if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      }
    };
    container.appendChild(card);
  });
}

/* ==========================================================
   10. Tasbih
   ========================================================== */
function upTasbih() {
  const el = document.getElementById('tasbihBtn');
  if (el) el.textContent = state.tasbihCount;
}
function incTasbih() {
  state.tasbihCount++;
  upTasbih();
  localStorage.setItem('m_tasbih', state.tasbihCount);
  if (navigator.vibrate) {
    if (state.tasbihCount % 33 === 0) navigator.vibrate([50, 50, 50]);
    else navigator.vibrate(25);
  }
}
function resetTasbih() {
  if (confirm('إعادة ضبط العداد؟')) {
    state.tasbihCount = 0;
    upTasbih();
    localStorage.setItem('m_tasbih', 0);
  }
}

/* ==========================================================
   11. Qibla
   ========================================================== */
function initQibla() {
  if (!navigator.geolocation) {
    document.getElementById('qDeg').textContent = 'الجهاز لا يدعم تحديد الموقع';
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude, lng = pos.coords.longitude;
    const kLat = 21.4225, kLng = 39.8262;
    const tr = d => d * Math.PI / 180, td = r => r * 180 / Math.PI;
    const p1 = tr(lat), p2 = tr(kLat), dL = tr(kLng - lng);
    const y = Math.sin(dL);
    const x = Math.cos(p1) * Math.tan(p2) - Math.sin(p1) * Math.cos(dL);
    const qibla = (td(Math.atan2(y, x)) + 360) % 360;
    document.getElementById('qDeg').textContent = 'اتجاه القبلة: ' + qibla.toFixed(1) + '° من الشمال';
    const handle = e => {
      const h = e.webkitCompassHeading || (e.alpha ? 360 - e.alpha : null);
      if (h !== null) document.getElementById('needle').style.transform = 'rotate(' + (qibla - h) + 'deg)';
    };
    window.addEventListener('deviceorientationabsolute', handle, true);
    window.addEventListener('deviceorientation', handle, true);
  }, () => {
    document.getElementById('qDeg').textContent = 'الرجاء السماح بالوصول للموقع';
  });
}

/* ==========================================================
   12. Quran
   ========================================================== */
async function fetchSurahList() {
  const container = document.getElementById('surahList');
  if (container.dataset.loaded === 'true') return;
  container.innerHTML = '<div class="loading">جاري تحميل السور...</div>';
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await res.json();
    if (data.code === 200) {
      container.innerHTML = data.data.map(s =>
        '<div class="surah-item" onclick="loadSurah(' + s.number + ',\'' + s.name + '\')">' +
        '<div class="s-num">' + s.number + '</div>' +
        '<div class="s-name">' + s.name + '</div>' +
        '<span style="font-size:11px;color:var(--muted)">' + s.numberOfAyahs + ' آية</span></div>'
      ).join('');
      container.dataset.loaded = 'true';
    }
  } catch (e) {
    container.innerHTML = '<div class="loading">فشل التحميل. تأكد من الإنترنت.</div>';
  }
}

async function loadSurah(num, name) {
  const listEl = document.getElementById('surahList');
  const contentEl = document.getElementById('surahContent');
  listEl.style.display = 'none';
  contentEl.innerHTML = '<button class="btn-reset" onclick="closeSurah()" style="margin-bottom:15px">← السور</button>' +
    '<h2 class="page-title">' + name + '</h2>' +
    '<div class="loading">جاري التحميل...</div>';
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah/' + num);
    const data = await res.json();
    if (data.code === 200) {
      let html = '<button class="btn-reset" onclick="closeSurah()" style="margin-bottom:15px">← السور</button>' +
        '<h2 class="page-title">' + name + '</h2>';
      data.data.ayahs.forEach(a => {
        html += '<div class="ayah"><span class="ayah-num">' + a.numberInSurah + '</span>' + a.text + '</div>';
      });
      contentEl.innerHTML = html;
      window.scrollTo(0, 0);
    }
  } catch (e) {
    contentEl.innerHTML += '<div class="loading">فشل التحميل</div>';
  }
}

function closeSurah() {
  document.getElementById('surahList').style.display = 'block';
  document.getElementById('surahContent').innerHTML = '';
}

/* ==========================================================
   13. Settings
   ========================================================== */
function saveLoc() {
  const c = document.getElementById('countrySel').value;
  const ci = document.getElementById('cityIn').value.trim();
  if (!ci) { alert('اكتب اسم المدينة'); return; }
  state.country = c;
  state.city = ci;
  localStorage.setItem('m_country', c);
  localStorage.setItem('m_city', ci);
  document.getElementById('locBadge').textContent = ci + ' • متصل';
  fetchPrayerTimes();
  alert('تم حفظ الموقع بنجاح');
  go('homeView');
  document.querySelectorAll('.nav').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.nav')[0].classList.add('active');
}

function logout() {
  if (confirm('هل أنت متأكد؟ سيتم مسح كل البيانات.')) {
    localStorage.clear();
    location.reload();
  }
}

/* ==========================================================
   14. Init
   ========================================================== */
function init() {
  if (state.dark) document.body.classList.add('dark');
  if (state.dynTheme && !state.dark) applyTheme();
  setInterval(() => { if (state.dynTheme && !state.dark) applyTheme(); }, 30 * 60 * 1000);

  document.getElementById('countrySel').value = state.country;
  document.getElementById('cityIn').value = state.city;
  document.getElementById('locBadge').textContent = state.city + ' • متصل';
  document.getElementById('darkToggle').checked = state.dark;
  document.getElementById('dynThemeToggle').checked = state.dynTheme;

  upTasbih();
  loadAzkar('sabah');
  fetchPrayerTimes();
  initQibla();
}

window.addEventListener('load', init);
