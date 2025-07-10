const fs = require('fs');

// Read the CSV file
const csvContent = fs.readFileSync('Account-Analytics-2025-07-10.csv', 'utf8');
const lines = csvContent.trim().split('\n');

// Remove header
const dataLines = lines.slice(1);

console.log(`Processing ${dataLines.length} data rows...`);

// Function to parse CSV line respecting quoted values
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i-1] === ',')) {
      inQuotes = true;
    } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      i++;
      continue;
    } else if (char !== '"' || inQuotes) {
      current += char;
    }
    i++;
  }
  
  result.push(current);
  return result;
}

// Convert CSV data to raw string format for JavaScript
let rawDataString = '';
dataLines.forEach((line, index) => {
  if (line.trim()) {
    const fields = parseCSVLine(line);
    if (fields.length >= 35) {
      // Escape quotes and add to raw data string
      const escapedLine = fields.map(field => `"${field}"`).join(',');
      rawDataString += escapedLine + '\n';
    }
  }
});

// Remove last newline
rawDataString = rawDataString.trim();

console.log('Raw data string length:', rawDataString.length);
console.log('First few lines of output:');
console.log(rawDataString.split('\n').slice(0, 3).join('\n'));

// Write the raw data string to a file
fs.writeFileSync('csv-raw-data.txt', rawDataString);
console.log('Raw data written to csv-raw-data.txt');
