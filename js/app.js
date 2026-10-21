/**
 * LibraryReg - Application Controller & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize storage
  initializeStorage();

  // Highlight current nav link
  highlightActiveNav();

  // Page specific initializers
  if (document.getElementById('memberTableBody')) {
    initDataAnggotaPage();
  }

  if (document.getElementById('registrationForm')) {
    initRegistrationPage();
  }

  if (document.getElementById('statsTotalAnggota')) {
    updateLandingStats();
  }

  // Setup officer login modal simulation
  setupOfficerLogin();
});

// Toast notification helper
function showToast(title, message, type = 'success') {
  let toastEl = document.getElementById('liveToast');
  if (!toastEl) {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.innerHTML = `
      <div id="liveToast" class="toast align-items-center text-bg-primary border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong class="d-block toast-title"></strong>
            <span class="toast-message"></span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    toastEl = document.getElementById('liveToast');
  }

  toastEl.className = `toast align-items-center border-0 shadow text-bg-${type === 'error' ? 'danger' : type === 'warning' ? 'warning text-dark' : 'primary'}`;
  toastEl.querySelector('.toast-title').textContent = title;
  toastEl.querySelector('.toast-message').textContent = message;

  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
}

// Highlight Active Nav
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .sidebar-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

// Update Landing Page Stats
function updateLandingStats() {
  const members = getMembers();
  const el = document.getElementById('statsTotalAnggota');
  if (el) {
    el.textContent = `${(10000 + members.length).toLocaleString('id-ID')}+`;
  }
}

// Setup Officer Login Simulation
function setupOfficerLogin() {
  const loginForm = document.getElementById('officerLoginForm');
  if (!loginForm) return;

  const btnFillDemo = document.getElementById('btnFillDemoLogin');
  if (btnFillDemo) {
    btnFillDemo.addEventListener('click', () => {
      document.getElementById('loginUsername').value = 'petugas_perpus';
      document.getElementById('loginPassword').value = 'perpustakaan2026';
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginUsername').value;
    const pass = document.getElementById('loginPassword').value;

    if (user && pass) {
      showToast('Login Berhasil', `Selamat datang, ${user}! Mengalihkan ke halaman Data Anggota...`, 'success');
      const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      if (loginModal) loginModal.hide();
      setTimeout(() => {
        window.location.href = 'data-anggota.html';
      }, 1200);
    } else {
      showToast('Login Gagal', 'Mohon isi username dan password.', 'error');
    }
  });
}

/* ==========================================================================
   REGISTRATION PAGE CONTROLLER
   ========================================================================== */
function initRegistrationPage() {
  const form = document.getElementById('registrationForm');
  const nimInput = document.getElementById('regNim');

  // Real-time NIM check feedback
  if (nimInput) {
    nimInput.addEventListener('blur', () => {
      const val = nimInput.value.trim();
      if (val && isNimExists(val)) {
        nimInput.classList.add('is-invalid');
        const feedback = nimInput.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.textContent = 'NIM/NIP ini sudah terdaftar!';
        }
      } else if (val) {
        nimInput.classList.remove('is-invalid');
        nimInput.classList.add('is-valid');
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      showToast('Validasi Gagal', 'Harap periksa kembali semua kolom yang wajib diisi!', 'warning');
      return;
    }

    const memberData = {
      nama: document.getElementById('regNama').value.trim(),
      nim: document.getElementById('regNim').value.trim(),
      prodi: document.getElementById('regProdi').value,
      jenis: document.getElementById('regJenis').value,
      telepon: document.getElementById('regTelepon').value.trim(),
      email: document.getElementById('regEmail').value.trim(),
      alamat: document.getElementById('regAlamat').value.trim()
    };

    const result = addMember(memberData);

    if (result.success) {
      showToast('Pendaftaran Berhasil!', `Selamat ${result.data.nama}, keanggotaan Anda telah aktif.`, 'success');
      form.reset();
      form.classList.remove('was-validated');
      nimInput.classList.remove('is-valid');

      // Show Member Card Modal
      showDigitalCardModal(result.data);
    } else {
      showToast('Pendaftaran Ditolak', result.message, 'error');
      nimInput.classList.add('is-invalid');
      nimInput.focus();
    }
  });
}

// Show Digital Card Modal
function showDigitalCardModal(member) {
  let modalEl = document.getElementById('cardModal');
  if (!modalEl) {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="modal fade" id="cardModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title fw-bold text-primary"><i class="bi bi-card-heading me-2"></i>Kartu Anggota Digital</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
              <div class="member-card-preview mb-4 text-white">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 class="mb-0 fw-bold">PERPUSTAKAAN UNIVERSITAS</h6>
                    <small class="opacity-75">Kartu Tanda Anggota Resmi</small>
                  </div>
                  <div class="card-chip"></div>
                </div>
                <div class="row align-items-center mt-3">
                  <div class="col-4 text-center">
                    <img id="cardAvatar" src="" class="rounded-circle border border-2 border-white shadow-sm" width="80" height="80" alt="Foto">
                  </div>
                  <div class="col-8">
                    <h5 id="cardNama" class="fw-bold mb-1"></h5>
                    <p id="cardNim" class="small mb-1 font-monospace"></p>
                    <span id="cardBadge" class="badge bg-light text-dark fw-bold"></span>
                    <p id="cardProdi" class="small mt-1 mb-0 opacity-75"></p>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-4 pt-2 border-top border-white-50 small">
                  <span id="cardId">ID: </span>
                  <span id="cardDate">Berlaku Sejak: </span>
                </div>
              </div>
              <div class="alert alert-success d-flex align-items-center mb-0 py-2" role="alert">
                <i class="bi bi-check-circle-fill fs-5 me-2"></i>
                <small>Data tersimpan di sistem lokal (localStorage) perpustakaan.</small>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <a href="data-anggota.html" class="btn btn-outline-primary btn-sm me-auto">Lihat di Data Anggota</a>
              <button type="button" class="btn btn-primary btn-sm" onclick="window.print()"><i class="bi bi-printer me-1"></i>Cetak Kartu</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(div);
    modalEl = document.getElementById('cardModal');
  }

  document.getElementById('cardNama').textContent = member.nama;
  document.getElementById('cardNim').textContent = `NIM/NIP: ${member.nim}`;
  document.getElementById('cardBadge').textContent = member.jenis;
  document.getElementById('cardProdi').textContent = member.prodi;
  document.getElementById('cardAvatar').src = member.avatar || 'https://via.placeholder.com/80';
  document.getElementById('cardId').textContent = `NO: ${member.id}`;
  document.getElementById('cardDate').textContent = `Terdaftar: ${member.tanggalDaftar || 'Hari Ini'}`;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

/* ==========================================================================
   DATA ANGGOTA (MANAGEMENT/ADMIN PAGE) CONTROLLER
   ========================================================================== */
let currentPage = 1;
const itemsPerPage = 5;
let filteredList = [];

function initDataAnggotaPage() {
  const searchInput = document.getElementById('searchMember');
  const filterJenis = document.getElementById('filterJenis');
  const filterProdi = document.getElementById('filterProdi');
  const btnTambahModal = document.getElementById('btnOpenAddModal');
  const addForm = document.getElementById('adminAddMemberForm');
  const editForm = document.getElementById('adminEditMemberForm');
  const confirmDeleteBtn = document.getElementById('btnConfirmDelete');

  // Initial load
  filterAndRenderMembers();

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      filterAndRenderMembers();
    });
  }

  // Filter Jenis handler
  if (filterJenis) {
    filterJenis.addEventListener('change', () => {
      currentPage = 1;
      filterAndRenderMembers();
    });
  }

  // Filter Prodi handler
  if (filterProdi) {
    filterProdi.addEventListener('change', () => {
      currentPage = 1;
      filterAndRenderMembers();
    });
  }

  // Admin Add Member Form submit
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!addForm.checkValidity()) {
        addForm.classList.add('was-validated');
        return;
      }

      const newMember = {
        nama: document.getElementById('adminAddNama').value.trim(),
        nim: document.getElementById('adminAddNim').value.trim(),
        prodi: document.getElementById('adminAddProdi').value,
        jenis: document.getElementById('adminAddJenis').value,
        telepon: document.getElementById('adminAddTelepon').value.trim(),
        email: document.getElementById('adminAddEmail').value.trim(),
        alamat: document.getElementById('adminAddAlamat').value.trim()
      };

      const result = addMember(newMember);
      if (result.success) {
        showToast('Berhasil Ditambahkan', `Anggota ${result.data.nama} berhasil didaftarkan.`, 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('addMemberModal'));
        if (modal) modal.hide();
        addForm.reset();
        addForm.classList.remove('was-validated');
        filterAndRenderMembers();
      } else {
        showToast('Gagal Menambah', result.message, 'error');
      }
    });
  }

  // Admin Edit Member Form submit
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!editForm.checkValidity()) {
        editForm.classList.add('was-validated');
        return;
      }

      const id = document.getElementById('adminEditId').value;
      const updated = {
        nama: document.getElementById('adminEditNama').value.trim(),
        nim: document.getElementById('adminEditNim').value.trim(),
        prodi: document.getElementById('adminEditProdi').value,
        jenis: document.getElementById('adminEditJenis').value,
        telepon: document.getElementById('adminEditTelepon').value.trim(),
        email: document.getElementById('adminEditEmail').value.trim(),
        alamat: document.getElementById('adminEditAlamat').value.trim()
      };

      const result = updateMember(id, updated);
      if (result.success) {
        showToast('Berhasil Diperbarui', `Data anggota ${result.data.nama} telah diupdate.`, 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editMemberModal'));
        if (modal) modal.hide();
        filterAndRenderMembers();
      } else {
        showToast('Gagal Memperbarui', result.message, 'error');
      }
    });
  }

  // Delete Confirmation handler
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      const id = confirmDeleteBtn.getAttribute('data-delete-id');
      if (id) {
        const result = deleteMember(id);
        if (result.success) {
          showToast('Dihapus', result.message, 'success');
          const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
          if (modal) modal.hide();
          filterAndRenderMembers();
        } else {
          showToast('Gagal', result.message, 'error');
        }
      }
    });
  }

  // Reset to default sample data button
  const btnResetData = document.getElementById('btnResetSampleData');
  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      if (confirm('Kembalikan ke data awal bawaan sistem?')) {
        resetToDefaultData();
        showToast('Reset Data', 'Data anggota telah dikembalikan ke contoh awal.', 'info');
        filterAndRenderMembers();
      }
    });
  }
}

function filterAndRenderMembers() {
  const allMembers = getMembers();
  const searchVal = (document.getElementById('searchMember')?.value || '').toLowerCase().trim();
  const jenisVal = document.getElementById('filterJenis')?.value || '';
  const prodiVal = document.getElementById('filterProdi')?.value || '';

  filteredList = allMembers.filter(m => {
    const matchesSearch = 
      m.nama.toLowerCase().includes(searchVal) ||
      m.nim.toLowerCase().includes(searchVal) ||
      m.prodi.toLowerCase().includes(searchVal) ||
      m.email.toLowerCase().includes(searchVal);

    const matchesJenis = !jenisVal || m.jenis === jenisVal;
    const matchesProdi = !prodiVal || m.prodi === prodiVal;

    return matchesSearch && matchesJenis && matchesProdi;
  });

  renderTable();
  renderPagination();
}

function renderTable() {
  const tbody = document.getElementById('memberTableBody');
  const countIndicator = document.getElementById('dataCountInfo');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (filteredList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-5 text-muted">
          <i class="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
          Tidak ada data anggota yang cocok dengan kriteria pencarian.
        </td>
      </tr>
    `;
    if (countIndicator) countIndicator.textContent = 'Menampilkan 0 dari 0 data';
    return;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredList.length);
  const currentItems = filteredList.slice(startIndex, endIndex);

  currentItems.forEach((m, idx) => {
    const rowNum = startIndex + idx + 1;
    let badgeClass = 'badge-mahasiswa';
    if (m.jenis === 'Dosen') badgeClass = 'badge-dosen';
    if (m.jenis === 'Tenaga Kependidikan') badgeClass = 'badge-tendik';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-muted fw-semibold">${rowNum}</td>
      <td>
        <div class="d-flex align-items-center">
          <img src="${m.avatar || 'https://via.placeholder.com/40'}" class="table-avatar shadow-sm" alt="${m.nama}">
          <div>
            <span class="fw-bold text-dark d-block">${m.nama}</span>
            <small class="text-muted d-md-none">${m.nim}</small>
          </div>
        </div>
      </td>
      <td class="fw-medium font-monospace">${m.nim}</td>
      <td>${m.prodi}</td>
      <td><span class="badge-role ${badgeClass}">${m.jenis}</span></td>
      <td class="text-secondary">${m.telepon}</td>
      <td class="text-secondary">${m.email}</td>
      <td>
        <div class="action-btn-group">
          <button type="button" class="action-btn btn-view" title="Lihat Kartu/Detail" onclick="viewMemberDetail('${m.id}')">
            <i class="bi bi-eye"></i>
          </button>
          <button type="button" class="action-btn btn-edit" title="Edit Anggota" onclick="openEditModal('${m.id}')">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button type="button" class="action-btn btn-delete" title="Hapus Anggota" onclick="openDeleteModal('${m.id}', '${m.nama.replace(/'/g, "\\'")}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (countIndicator) {
    countIndicator.textContent = `Menampilkan ${startIndex + 1} - ${endIndex} dari ${filteredList.length} data`;
  }
}

function renderPagination() {
  const paginationWrapper = document.getElementById('paginationControls');
  if (!paginationWrapper) return;

  paginationWrapper.innerHTML = '';
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  if (totalPages <= 1) return;

  // Prev Button
  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevLi.innerHTML = `<button class="page-link" aria-label="Previous"><i class="bi bi-chevron-left"></i></button>`;
  prevLi.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      renderPagination();
    }
  });
  paginationWrapper.appendChild(prevLi);

  // Page numbers
  for (let p = 1; p <= totalPages; p++) {
    const pageLi = document.createElement('li');
    pageLi.className = `page-item ${currentPage === p ? 'active' : ''}`;
    pageLi.innerHTML = `<button class="page-link">${p}</button>`;
    pageLi.addEventListener('click', () => {
      currentPage = p;
      renderTable();
      renderPagination();
    });
    paginationWrapper.appendChild(pageLi);
  }

  // Next Button
  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  nextLi.innerHTML = `<button class="page-link" aria-label="Next"><i class="bi bi-chevron-right"></i></button>`;
  nextLi.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
      renderPagination();
    }
  });
  paginationWrapper.appendChild(nextLi);
}

// Global action handlers for Table buttons
window.viewMemberDetail = function(id) {
  const member = getMemberById(id);
  if (member) {
    showDigitalCardModal(member);
  } else {
    showToast('Kesalahan', 'Data anggota tidak ditemukan.', 'error');
  }
};

window.openEditModal = function(id) {
  const member = getMemberById(id);
  if (!member) return;

  document.getElementById('adminEditId').value = member.id;
  document.getElementById('adminEditNama').value = member.nama;
  document.getElementById('adminEditNim').value = member.nim;
  document.getElementById('adminEditProdi').value = member.prodi;
  document.getElementById('adminEditJenis').value = member.jenis;
  document.getElementById('adminEditTelepon').value = member.telepon;
  document.getElementById('adminEditEmail').value = member.email;
  document.getElementById('adminEditAlamat').value = member.alamat;

  const modal = new bootstrap.Modal(document.getElementById('editMemberModal'));
  modal.show();
};

window.openDeleteModal = function(id, nama) {
  const confirmBtn = document.getElementById('btnConfirmDelete');
  const namePlaceholder = document.getElementById('deleteMemberName');
  
  if (confirmBtn) confirmBtn.setAttribute('data-delete-id', id);
  if (namePlaceholder) namePlaceholder.textContent = nama;

  const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
  modal.show();
};
