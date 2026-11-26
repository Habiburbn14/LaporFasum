import { ROLE, roleOf } from '../stores/useAuthStore';

const KECAMATAN_BY_ID = {
  1: 'Babat',
  2: 'Bluluk',
  3: 'Brondong',
  4: 'Deket',
  5: 'Glagah',
  6: 'Kalitengah',
  7: 'Karangbinangun',
  8: 'Karanggeneng',
  9: 'Kedungpring',
  10: 'Kembangbahu',
  11: 'Lamongan',
  12: 'Laren',
  13: 'Maduran',
  14: 'Mantup',
  15: 'Modo',
  16: 'Ngimbang',
  17: 'Paciran',
  18: 'Pucuk',
  19: 'Sambeng',
  20: 'Sarirejo',
  21: 'Sekaran',
  22: 'Solokuro',
  23: 'Sugio',
  24: 'Sukodadi',
  25: 'Sukorame',
  26: 'Tikung',
  27: 'Turi',
};

/**
 * Resolve consistent display labels for Admin Kabupaten and Admin Kecamatan.
 * Ensures Kabupaten accounts always show Kabupaten identity and Kecamatan
 * accounts always show Kecamatan identity regardless of fallback names.
 */
export function getAdminIdentity(user) {
  const role = roleOf(user);
  const rawKec =
    user?.nama_kecamatan ||
    user?.kecamatan ||
    (user?.id_kecamatan ? KECAMATAN_BY_ID[Number(user.id_kecamatan)] : null);

  if (role === ROLE.ADMIN_KECAMATAN) {
    const kecName = rawKec ? String(rawKec).trim() : '';
    return {
      role,
      title: kecName ? `Admin Kecamatan ${kecName}` : 'Admin Kecamatan',
      subtitle: kecName ? `Pemerintah Kecamatan ${kecName}` : 'Pemerintah Kecamatan Lamongan',
      sidebarSubtitle: kecName ? `Kecamatan ${kecName}` : 'Admin Kecamatan',
      initials: kecName ? kecName.charAt(0).toUpperCase() : 'K',
      email: user?.email || 'kecamatan@lamongan.go.id',
    };
  }

  return {
    role,
    title: 'Admin Kabupaten Lamongan',
    subtitle: 'Dinas PUPR Lamongan',
    sidebarSubtitle: 'Kabupaten Lamongan',
    initials: 'AK',
    email: user?.email || 'admin@lamongan.go.id',
  };
}

