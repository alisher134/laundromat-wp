function getScrollProgress(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementStart = rect.top;

  const startPosition = windowHeight;
  const endPosition = windowHeight * 0.5;

  const distance = startPosition - endPosition;
  const currentPosition = elementStart;

  let progress = 1 - (currentPosition - endPosition) / distance;
  progress = Math.max(0, Math.min(1, progress));

  return progress;
}

function getScrollProgressCenter(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementCenter = rect.top + rect.height / 2;
  const viewportCenter = windowHeight / 2;
  const viewportBottom = windowHeight;

  const startPosition = viewportBottom;
  const endPosition = viewportCenter;

  const distance = startPosition - endPosition;
  const currentPosition = elementCenter;

  let progress = 1 - (currentPosition - endPosition) / distance;
  progress = Math.max(0, Math.min(1, progress));

  return progress;
}

function getGridScrollProgress(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementTop = rect.top;
  const elementHeight = rect.height;

  let progress = (windowHeight - elementTop) / elementHeight;
  progress = Math.max(0, Math.min(1, progress));

  return progress;
}

function getCardScrollProgress(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementTop = rect.top;
  const elementHeight = rect.height;
  const elementCenter = elementTop + elementHeight / 2;
  const viewportCenter = windowHeight / 2;

  const startPoint = windowHeight;
  const endPoint = viewportCenter - elementHeight / 2;

  let progress = (startPoint - elementTop) / (startPoint - endPoint);
  progress = Math.max(0, Math.min(1, progress));

  return progress;
}

function getCardScrollProgressStartCenter(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementTop = rect.top;

  const startEnd = windowHeight;
  const startCenter = windowHeight / 2;

  let progress = (startEnd - elementTop) / (startEnd - startCenter);
  progress = Math.min(Math.max(progress, 0), 1);

  return progress;
}

function getMapScrollProgress(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementTop = rect.top;

  const startPoint = windowHeight;
  const endPoint = windowHeight * 0.3;

  let progress = (startPoint - elementTop) / (startPoint - endPoint);
  progress = Math.max(0, Math.min(1, progress));

  return progress;
}

function getImageScrollProgress(img) {
  const card = img.closest('article') || img.closest('.tips-card');
  if (!card) return 0;

  const rect = card.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementTop = rect.top;

  const startEnd = windowHeight;
  const startCenter = windowHeight / 2;

  let progress = (startEnd - elementTop) / (startEnd - startCenter);
  progress = Math.min(Math.max(progress, 0), 1);

  if (progress <= 0) return 0.8;
  if (progress >= 0.65) return 1;

  const normalizedProgress = progress / 0.65;
  return 0.8 + 0.2 * normalizedProgress;
}

function transformProgress(progress, inputRange, outputRange, clamp = false) {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;

  if (progress <= inputMin) return outputMin;
  if (progress >= inputMax) return outputMax;

  const inputRangeSize = inputMax - inputMin;
  const outputRangeSize = outputMax - outputMin;
  const normalizedProgress = (progress - inputMin) / inputRangeSize;

  return outputMin + normalizedProgress * outputRangeSize;
}

function transformProgressToScale(progress) {
  if (progress <= 0) return 0.8;
  if (progress >= 0.65) return 1;

  const normalizedProgress = progress / 0.65;
  return 0.8 + 0.2 * normalizedProgress;
}
