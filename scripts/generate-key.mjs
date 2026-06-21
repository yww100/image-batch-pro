function checksum(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i) * (i + 1);
  }
  return sum % 37;
}

function randomSegment() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateLicenseKey() {
  const part1 = randomSegment();
  const targetChecksum = checksum(part1);
  let part2 = randomSegment();
  let attempts = 0;
  while (checksum(part2) !== targetChecksum && attempts < 10000) {
    part2 = randomSegment();
    attempts++;
  }
  return `BATCH-${part1}-${part2}`;
}

console.log('Generated license key:');
console.log(generateLicenseKey());
console.log('\nUse this format for all keys: BATCH-XXXX-XXXX');
