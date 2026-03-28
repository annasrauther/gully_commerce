import fs from 'fs'
import { parse } from 'csv-parse/sync'

// Usage: npx ts-node scripts/build-pincode-map.ts path/to/pincodes.csv
const csvPath = process.argv[2]

if (!csvPath) {
  console.error('Please provide a path to the pincodes CSV file.')
  process.exit(1)
}

const fileContent = fs.readFileSync(csvPath, 'utf-8')
const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true
})

const pincodeMap: Record<string, string> = {}

records.forEach((record: any) => {
  const pin = record.Pincode
  const area = `${record.OfficeName}, ${record.District}`
  if (pin && area) {
    pincodeMap[pin] = area
  }
})

fs.writeFileSync('./public/pincodes.json', JSON.stringify(pincodeMap, null, 2))
console.log(`Successfully mapped ${Object.keys(pincodeMap).length} pincodes to /public/pincodes.json`)
