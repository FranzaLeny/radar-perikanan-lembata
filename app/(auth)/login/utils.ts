export function getCandidateEmails(input: string): string[] {
  const trimmed = input.toLowerCase().trim();
  const candidates = new Set<string>([trimmed]);

  // Variasi domain sipeka & minamutu
  candidates.add(
    trimmed.replace('@minamutu.lembata.go.id', '@sipeka.lembata.go.id')
  );
  candidates.add(
    trimmed.replace('@sipeka.lembata.go.id', '@minamutu.lembata.go.id')
  );

  // Variasi username pendek tanpa domain
  if (!trimmed.includes('@')) {
    if (trimmed === 'admin' || trimmed === 'administrator') {
      candidates.add('admin@sipeka.lembata.go.id');
      candidates.add('admin@minamutu.lembata.go.id');
    } else if (trimmed === 'pengelola' || trimmed === 'mutu') {
      candidates.add('pengelola@sipeka.lembata.go.id');
      candidates.add('mutu@minamutu.lembata.go.id');
      candidates.add('pengelola@minamutu.lembata.go.id');
      candidates.add('mutu@sipeka.lembata.go.id');
    } else if (trimmed === 'petugas') {
      candidates.add('petugas@sipeka.lembata.go.id');
      candidates.add('petugas@minamutu.lembata.go.id');
    } else if (
      trimmed === 'kadin' ||
      trimmed === 'kadis' ||
      trimmed === 'kepala'
    ) {
      candidates.add('kadin@sipeka.lembata.go.id');
      candidates.add('kadis@minamutu.lembata.go.id');
      candidates.add('kadin@minamutu.lembata.go.id');
      candidates.add('kadis@sipeka.lembata.go.id');
    } else {
      candidates.add(`${trimmed}@sipeka.lembata.go.id`);
      candidates.add(`${trimmed}@minamutu.lembata.go.id`);
    }
  }

  // Alias mutu <-> pengelola dan kadis <-> kadin
  if (trimmed.includes('mutu@')) {
    candidates.add(trimmed.replace('mutu@', 'pengelola@'));
    candidates.add(trimmed.replace('mutu@minamutu', 'pengelola@sipeka'));
  }
  if (trimmed.includes('pengelola@')) {
    candidates.add(trimmed.replace('pengelola@', 'mutu@'));
    candidates.add(trimmed.replace('pengelola@sipeka', 'mutu@minamutu'));
  }
  if (trimmed.includes('kadis@')) {
    candidates.add(trimmed.replace('kadis@', 'kadin@'));
    candidates.add(trimmed.replace('kadis@minamutu', 'kadin@sipeka'));
  }
  if (trimmed.includes('kadin@')) {
    candidates.add(trimmed.replace('kadin@', 'kadis@'));
    candidates.add(trimmed.replace('kadin@sipeka', 'kadis@minamutu'));
  }

  return Array.from(candidates);
}
