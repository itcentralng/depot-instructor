(function () {

  // ── Navigation ────────────────────────────────────────
  var backTarget = 'screen-home';

  var backLabels = {
    'screen-home':        'Home',
    'screen-instructors': 'Home',
    'screen-staff':       'Key Staff'
  };

  function setScreen(id, back) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.toggle('active', s.id === id);
    });
    backTarget = back || 'screen-home';
    var onHome = id === 'screen-home';
    document.getElementById('back-btn').classList.toggle('hidden', onHome);
    var label = document.getElementById('back-label');
    if (label) label.textContent = backLabels[backTarget] || 'Back';
  }

  window.showHome        = function () { setScreen('screen-home'); };
  window.showInstructors = function () { setScreen('screen-instructors', 'screen-home'); };
  window.showStaff       = function () { setScreen('screen-staff', 'screen-home'); };
  window.goBack          = function () { setScreen(backTarget); };

  document.getElementById('back-btn').onclick = function () { window.goBack(); };

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
      img.src = photo; img.style.display = 'block';
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

  // ── SVG silhouette ────────────────────────────────────
  var SIL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8">' +
    '<circle cx="12" cy="8" r="5"/><path d="M3 21c0-5 3.582-9 9-9s9 4 9 9"/></svg>';

  // ── Build instructors grid ────────────────────────────
  function buildInstructors(list) {
    var grid  = document.getElementById('instructors-grid');
    var count = document.getElementById('instructors-count');
    grid.innerHTML = '';

    count.textContent = list.length + ' officer' + (list.length !== 1 ? 's' : '');

    list.forEach(function (o, i) {
      var card = document.createElement('div');
      card.className = 'officer-card no-hover';
      card.style.animationDelay = (i * 40) + 'ms';
      card.style.cursor = 'default';

      var wrap = document.createElement('div');
      wrap.className = 'officer-photo-wrap';
      if (o.photo) {
        var img = document.createElement('img');
        img.className = 'officer-photo'; img.src = o.photo; img.alt = o.name;
        var sil = document.createElement('div');
        sil.className = 'officer-silhouette hidden'; sil.innerHTML = SIL_SVG;
        img.onerror = function () { img.style.display = 'none'; sil.classList.remove('hidden'); };
        wrap.appendChild(img); wrap.appendChild(sil);
      } else {
        var sil = document.createElement('div');
        sil.className = 'officer-silhouette'; sil.innerHTML = SIL_SVG;
        wrap.appendChild(sil);
      }
      var gradient = document.createElement('div');
      gradient.className = 'officer-photo-gradient';
      wrap.appendChild(gradient);

      var footer = document.createElement('div');
      footer.className = 'officer-card-footer';
      footer.innerHTML =
        '<div class="officer-card-role">'  + (o.role   || '') + '</div>' +
        '<div class="officer-card-name">'  + (o.name   || '') + '</div>' +
        (o.tenure ? '<div class="officer-card-tenure">' + o.tenure + '</div>' : '');

      card.appendChild(wrap);
      card.appendChild(footer);
      grid.appendChild(card);
    });
  }

  // ── Build staff role cards (clean — no person shown) ──
  function buildStaffRoles(roles) {
    var grid = document.getElementById('staff-roles-grid');
    grid.innerHTML = '';

    roles.forEach(function (role, i) {
      var card = document.createElement('button');
      card.className = 'role-card';
      card.style.animationDelay = (i * 60) + 'ms';
      card.innerHTML =
        '<div class="role-card-short">' + role.role_short + '</div>' +
        '<div class="role-card-title">' + role.role + '</div>' +
        '<div class="role-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></div>';

      card.addEventListener('click', function () { showRoleDetail(role); });
      grid.appendChild(card);
    });
  }

  // ── Role detail screen ────────────────────────────────
  function showRoleDetail(role) {
    document.getElementById('role-detail-short').textContent = role.role_short;
    document.getElementById('role-detail-title').textContent = role.role;

    var body = document.getElementById('role-detail-body');
    body.innerHTML = '';

    // Current holder
    var section = document.createElement('div');
    section.className = 'role-detail-section';

    var currentLabel = document.createElement('div');
    currentLabel.className = 'role-detail-section-label';
    currentLabel.textContent = 'Current';
    section.appendChild(currentLabel);

    if (role.current && role.current.name) {
      section.appendChild(makePersonCard(role.role, role.current, true));
    } else {
      var empty = document.createElement('div');
      empty.className = 'role-detail-empty';
      empty.textContent = 'No current appointment holder on record.';
      section.appendChild(empty);
    }
    body.appendChild(section);

    // Previous holders
    if (role.previous && role.previous.length) {
      var prevSection = document.createElement('div');
      prevSection.className = 'role-detail-section';

      var prevLabel = document.createElement('div');
      prevLabel.className = 'role-detail-section-label';
      prevLabel.textContent = 'Previous';
      prevSection.appendChild(prevLabel);

      role.previous.forEach(function (p) {
        prevSection.appendChild(makePersonCard(role.role, p, false));
      });

      body.appendChild(prevSection);
    }

    setScreen('screen-role-detail', 'screen-staff');
  }

  function makePersonCard(roleLabel, person, isCurrent) {
    var card = document.createElement('div');
    card.className = 'person-card' + (person.bio ? ' clickable' : '');

    var photoWrap = document.createElement('div');
    photoWrap.className = 'person-photo-wrap';

    if (person.photo) {
      var img = document.createElement('img');
      img.className = 'person-photo'; img.src = person.photo; img.alt = person.name;
      var sil = document.createElement('div');
      sil.className = 'person-sil hidden'; sil.innerHTML = SIL_SVG;
      img.onerror = function () { img.style.display = 'none'; sil.classList.remove('hidden'); };
      photoWrap.appendChild(img); photoWrap.appendChild(sil);
    } else {
      var sil = document.createElement('div');
      sil.className = 'person-sil'; sil.innerHTML = SIL_SVG;
      photoWrap.appendChild(sil);
    }

    var shine = document.createElement('div');
    shine.className = 'person-photo-shine';
    photoWrap.appendChild(shine);

    var info = document.createElement('div');
    info.className = 'person-info';

    if (isCurrent) {
      var badge = document.createElement('div');
      badge.className = 'person-current-badge';
      badge.textContent = 'CURRENT';
      info.appendChild(badge);
    }

    var nameEl = document.createElement('div');
    nameEl.className = 'person-name';
    nameEl.textContent = person.name || '';
    info.appendChild(nameEl);

    if (person.tenure) {
      var tenureEl = document.createElement('div');
      tenureEl.className = 'person-tenure';
      tenureEl.textContent = person.tenure;
      info.appendChild(tenureEl);
    }

    if (person.bio) {
      var hint = document.createElement('div');
      hint.className = 'person-bio-hint';
      hint.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/></svg> Tap to view profile';
      info.appendChild(hint);
    }

    card.appendChild(photoWrap);
    card.appendChild(info);

    if (person.bio) {
      card.addEventListener('click', function () {
        openModal(roleLabel, person.name, person.bio, person.photo, person.tenure);
      });
    }

    return card;
  }

  // ── Load data ─────────────────────────────────────────
  if (typeof STAFF_DATA !== 'undefined') {
    buildInstructors(STAFF_DATA.instructors || []);
    buildStaffRoles(STAFF_DATA.staff_roles || []);
  } else {
    fetch('data.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        buildInstructors(data.instructors || []);
        buildStaffRoles(data.staff_roles || []);
      })
      .catch(function (e) { console.error('data.json load error', e); });
  }

})();
