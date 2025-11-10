import fs from 'fs';

console.log('Start');

fs.readFile('test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('읽기 오류:', err);
    return;
  }
  console.log('File:', data.trim());
});

console.log('End');