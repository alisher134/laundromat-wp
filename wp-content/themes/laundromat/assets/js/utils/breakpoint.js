function getBreakpoint() {
  const width = window.innerWidth;
  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  return 'lg';
}
