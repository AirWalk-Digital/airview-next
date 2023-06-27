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

export async function getComplianceAggregation(applicationId) {
  try {
    const res = await fetch(
      `${process.env.AIRVIEW_API_URL}/aggregations/compliance/${applicationId}`
    );
    const apiData = await res.json();
    return apiData.map((m) => ({ ...m, instances: [] }));
    return apiData;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getApplicationById(id) {
  const applications = await getApplications();
  const application = applications.find((app) => app.id === Number(id));
  return application;
}
