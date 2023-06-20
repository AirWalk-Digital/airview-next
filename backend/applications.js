// utils/applications.js

export async function getComplianceData() {
  try {
    console.log("h");
    const res = await fetch(
      `${process.env.AIRVIEW_API_URL}/compliance/?$select=applicationName,controlSeverity,environmentName`
    );

    const apiData = await res.json();
    return apiData;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export async function getApplications() {
  try {
    const res = await fetch(`${process.env.AIRVIEW_API_URL}/applications/`);
    const apiData = await res.json();
    return apiData;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function getApplicationById(id) {
  const applications = getApplications();
  const application = applications.find((app) => app.app_id === id);
  return application;
}
