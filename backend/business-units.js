// utils/business-units.js

import fs from 'fs';
import path from 'path';
import { buffer } from 'sharp/lib/is';

export function getBusinessUnits() {
  const filePath = path.join(process.cwd(), 'content/business-units/business-units.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);

  return data["business-units"]; // Assuming the "business-units" key holds the array of business-units
}

export function getBusinessUnitById(id) {
  const businessUnits = getBusinessUnits();
  const businessUnit = businessUnits.find(bu => bu.bu_id === id);
  return businessUnit;
}
