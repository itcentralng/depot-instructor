(function () {

  // ── Tab switching ─────────────────────────────────────
  window.showTab = function (tab) {
    document.getElementById('screen-staff').classList.toggle('active', tab === 'staff');
    document.getElementById('screen-past').classList.toggle('active', tab === 'past');
    document.getElementById('tab-staff').classList.toggle('active', tab === 'staff');
    document.getElementById('tab-past').classList.toggle('active', tab === 'past');
  };

  // ── Profile modal ─────────────────────────────────────
  function openModal(role, name, bio, photo, tenure) {
    document.getElementById('modal-role').textContent = role || '';
    document.getElementById('modal-name').textContent = name || '—';
    document.getElementById('modal-bio').textContent  = bio  || '';

    var tenureEl = document.getElementById('modal-tenure');
    if (tenure) {
      tenureEl.textContent = tenure;
      tenureEl.classList.remove('hidden');
    } else {
      tenureEl.classList.add('hidden');
    }

    var img = document.getElementById('modal-photo');
    var sil = document.getElementById('modal-photo-sil');
    if (photo) {
      img.src = photo;
      img.style.display = 'block';
      sil.classList.add('hidden');
    } else {
      img.style.display = 'none';
      sil.classList.remove('hidden');
    }

    document.getElementById('modal').classList.remove('hidden');
    document.querySelector('.modal-bio-scroll').scrollTop = 0;
  }

  window.closeModal = function (e) {
    if (!e || e.target === document.getElementById('modal')) {
      document.getElementById('modal').classList.add('hidden');
    }
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeModal();
  });

  // ── SVG silhouette markup ─────────────────────────────
  var SIL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8">' +
    '<circle cx="12" cy="8" r="5"/><path d="M3 21c0-5 3.582-9 9-9s9 4 9 9"/></svg>';

  // ── Build staff row ───────────────────────────────────
  function buildStaffRow(staffList) {
    var row = document.getElementById('staff-row');
    row.innerHTML = '';

    // Role order: RSM first (featured), then COS, ADJ, FIN
    var roleOrder = ['rsm', 'cos', 'adj', 'fin'];
    var sorted = staffList.slice().sort(function (a, b) {
      var ai = roleOrder.indexOf((a.role_short || '').toLowerCase());
      var bi = roleOrder.indexOf((b.role_short || '').toLowerCase());
      if (ai < 0) ai = 99;
      if (bi < 0) bi = 99;
      return ai - bi;
    });

    sorted.forEach(function (s, i) {
      var isRSM = (s.role_short || '').toLowerCase() === 'rsm';
      var hasProfile = !!(s.bio && s.bio.trim());
      var vacant = !(s.name && s.name.trim());

      var card = document.createElement('div');
      card.className = 'staff-card' + (isRSM ? ' rsm' : '');
      card.style.animationDelay = (i * 60) + 'ms';

      // Photo wrap
      var wrap = document.createElement('div');
      wrap.className = 'staff-photo-wrap';

      if (s.photo) {
        var img = document.createElement('img');
        img.className = 'staff-photo';
        img.src = s.photo;
        img.alt = s.name || s.role;
        img.onerror = function () {
          img.style.display = 'none';
          sil.classList.remove('hidden');
        };
        var sil = document.createElement('div');
        sil.className = 'staff-silhouette hidden';
        sil.innerHTML = SIL_SVG;
        wrap.appendChild(img);
        wrap.appendChild(sil);
      } else {
        var sil = document.createElement('div');
        sil.className = 'staff-silhouette';
        sil.innerHTML = SIL_SVG;
        wrap.appendChild(sil);
      }

      // Role badge (between photo and info)
      var badge = document.createElement('div');
      badge.className = 'staff-role-badge';
      var badgeText = document.createElement('span');
      badgeText.className = 'staff-role-badge-text';
      badgeText.textContent = s.role || '';
      badge.appendChild(badgeText);

      // Info panel
      var info = document.createElement('div');
      info.className = 'staff-card-info';

      var nameEl = document.createElement('div');
      nameEl.className = 'staff-card-name';
      nameEl.textContent = s.name || '';

      var btn = document.createElement('button');
      btn.className = 'staff-profile-btn' + (hasProfile ? '' : ' hidden');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/></svg> View Profile';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openModal(s.role, s.name, s.bio, s.photo, '');
      });

      info.appendChild(nameEl);
      info.appendChild(btn);

      card.appendChild(wrap);
      card.appendChild(badge);
      card.appendChild(info);

      if (hasProfile) {
        card.addEventListener('click', function () {
          openModal(s.role, s.name, s.bio, s.photo, '');
        });
      }

      row.appendChild(card);
    });
  }

  // ── Build past officers grid ──────────────────────────
  function buildPastGrid(officers) {
    var grid = document.getElementById('past-grid');
    var count = document.getElementById('past-count');
    grid.innerHTML = '';

    count.textContent = officers.length + ' officer' + (officers.length !== 1 ? 's' : '');

    officers.forEach(function (o, i) {
      var card = document.createElement('div');
      card.className = 'past-card';
      card.style.animationDelay = (i * 40) + 'ms';

      // Photo wrap
      var wrap = document.createElement('div');
      wrap.className = 'past-photo-wrap';

      if (o.photo) {
        var img = document.createElement('img');
        img.className = 'past-photo';
        img.src = o.photo;
        img.alt = o.name;
        img.onerror = function () {
          img.style.display = 'none';
          sil.classList.remove('hidden');
        };
        var sil = document.createElement('div');
        sil.className = 'past-silhouette hidden';
        sil.innerHTML = SIL_SVG;
        wrap.appendChild(img);
        wrap.appendChild(sil);
      } else {
        var sil = document.createElement('div');
        sil.className = 'past-silhouette';
        sil.innerHTML = SIL_SVG;
        wrap.appendChild(sil);
      }

      var gradient = document.createElement('div');
      gradient.className = 'past-photo-gradient';
      wrap.appendChild(gradient);

      // Footer (role + name + tenure)
      var footer = document.createElement('div');
      footer.className = 'past-card-footer';

      var roleEl = document.createElement('div');
      roleEl.className = 'past-card-role';
      roleEl.textContent = o.role || '';

      var nameEl = document.createElement('div');
      nameEl.className = 'past-card-name';
      nameEl.textContent = o.name || '';

      var tenureEl = document.createElement('div');
      tenureEl.className = 'past-card-tenure';
      tenureEl.textContent = o.tenure || '';

      footer.appendChild(roleEl);
      footer.appendChild(nameEl);
      if (o.tenure) footer.appendChild(tenureEl);

      card.appendChild(wrap);
      card.appendChild(footer);

      if (o.bio && o.bio.trim()) {
        card.addEventListener('click', function () {
          openModal(o.role, o.name, o.bio, o.photo, o.tenure);
        });
      } else {
        card.style.cursor = 'default';
        card.classList.add('no-hover');
      }

      grid.appendChild(card);
    });
  }

  // ── Load data ─────────────────────────────────────────
  fetch('data.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      buildStaffRow(data.staff || []);
      buildPastGrid(data.past_officers || []);
    })
    .catch(function (e) { console.error('data.json load error', e); });

})();
