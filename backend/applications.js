// utils/applications.js

import fs from 'fs';
import path from 'path';

export function getApplications() {
  const filePath = path.join(process.cwd(), 'content/applications/applications.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);

  return data.applications; // Assuming the "applications" key holds the array of applications
}

export function getApplicationById(id) {
  const applications = getApplications();
  const application = applications.find(app => app.app_id === id);
  return application;
}
