/**
 * LibraryReg - Data Management & LocalStorage Handler
 */

const STORAGE_KEY = 'libraryreg_members';

// Default initial data matching the assignment mockup screenshot
const INITIAL_MEMBERS = [
  {
    id: 'MEM-1001',
    nama: 'Andi Pratama',
    nim: '230101001',
    prodi: 'Informatika',
    jenis: 'Mahasiswa',
    telepon: '081234567890',
    email: 'andi@email.com',
    alamat: 'Jl. Merdeka No. 12, Kota Pendidikan',
    tanggalDaftar: '2026-09-01',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'MEM-1002',
    nama: 'Siti Rahma',
    nim: '230101002',
    prodi: 'Sistem Informasi',
    jenis: 'Mahasiswa',
    telepon: '081234567891',
    email: 'siti@email.com',
    alamat: 'Jl. Melati Blok C No. 5, Sleman',
    tanggalDaftar: '2026-09-02',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'MEM-1003',
    nama: 'Budi Santoso',
    nim: '19810319',
    prodi: 'Dosen',
    jenis: 'Dosen',
    telepon: '081234567892',
    email: 'budi@univ.ac.id',
    alamat: 'Perum Dosen Indah No. 8, Yogyakarta',
    tanggalDaftar: '2026-09-05',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'MEM-1004',
    nama: 'Maya Lestari',
    nim: '230101003',
    prodi: 'Manajemen',
    jenis: 'Mahasiswa',
    telepon: '081234567893',
    email: 'maya@email.com',
    alamat: 'Jl. Cendrawasih No. 17, Bantul',
    tanggalDaftar: '2026-09-10',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'MEM-1005',
    nama: 'Rizky Kurniawan',
    nim: '230101004',
    prodi: 'Akuntansi',
    jenis: 'Tenaga Kependidikan',
    telepon: '081234567894',
    email: 'rizky@email.com',
    alamat: 'Jl. Flamboyan No. 22, Kotagede',
    tanggalDaftar: '2026-09-12',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  }
];

// Initialize Storage if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
  }
}

// Get all members
function getMembers() {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    console.error('Error reading localStorage:', e);
    return [];
  }
}

// Save members array to localStorage
function saveMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

// Find member by ID
function getMemberById(id) {
  const members = getMembers();
  return members.find(m => m.id === id);
}

// Check if NIM/NIP already exists (exclude currentId if editing)
function isNimExists(nim, excludeId = null) {
  const members = getMembers();
  return members.some(m => m.nim.trim().toLowerCase() === nim.trim().toLowerCase() && m.id !== excludeId);
}

// Add new member
function addMember(memberData) {
  const members = getMembers();
  
  if (isNimExists(memberData.nim)) {
    return { success: false, message: `NIM/NIP ${memberData.nim} sudah terdaftar!` };
  }

  const newMember = {
    id: 'MEM-' + (Math.floor(1000 + Math.random() * 9000)),
    ...memberData,
    tanggalDaftar: memberData.tanggalDaftar || new Date().toISOString().split('T')[0],
    avatar: memberData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(memberData.nama)}&background=2563eb&color=fff&size=120`
  };

  members.unshift(newMember); // Insert at beginning
  saveMembers(members);
  return { success: true, data: newMember, message: 'Pendaftaran anggota berhasil diselesaikan!' };
}

// Update existing member
function updateMember(id, updatedData) {
  const members = getMembers();
  const index = members.findIndex(m => m.id === id);

  if (index === -1) {
    return { success: false, message: 'Data anggota tidak ditemukan.' };
  }

  if (isNimExists(updatedData.nim, id)) {
    return { success: false, message: `NIM/NIP ${updatedData.nim} sudah digunakan oleh anggota lain!` };
  }

  members[index] = { ...members[index], ...updatedData };
  saveMembers(members);
  return { success: true, data: members[index], message: 'Data anggota berhasil diperbarui!' };
}

// Delete member
function deleteMember(id) {
  let members = getMembers();
  const initialLength = members.length;
  members = members.filter(m => m.id !== id);

  if (members.length === initialLength) {
    return { success: false, message: 'Anggota gagal dihapus atau tidak ditemukan.' };
  }

  saveMembers(members);
  return { success: true, message: 'Anggota berhasil dihapus.' };
}

// Reset data to defaults if needed
function resetToDefaultData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
  return INITIAL_MEMBERS;
}
