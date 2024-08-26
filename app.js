var domo = window.domo;
let projectData = [];
let filteredData = [];
domo
  .get("/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/")
  .then((response) => {
    if (!Array.isArray(response)) {
      throw new Error("Invalid project data format");
    }
    projectData = response;
    filteredData = projectData;

    console.log(projectData);

    populateDropdowns();
    updateCounts(projectData);
    updateChart();
  })
  .catch((error) => {
    console.error("Error fetching project data:", error);
  });

function populateDropdowns() {
  populateDropdown("gwcAccountManager", "gwcAccountManager", projectData);
  populateDropdown("projectLead", "gwcProjectManager", projectData);
  populateDropdown("domoContactName", "domoContacts", projectData);
  populateDropdown("preSalesStatus", "PreSalesData", projectData, true);
}

function populateDropdown(dropdownId, key, data, isStatus = false) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = '<option value="">Select</option>';
  const uniqueValues = [
    ...new Set(
      data.map((project) => {
        try {
          if (isStatus && key === "PreSalesData") {
            const preSalesData = JSON.parse(project.content[key]);
            return preSalesData && preSalesData.status
              ? preSalesData.status
              : "Not Started";
          } else if (key === "domoContacts") {
            const domoContacts = JSON.parse(project.content[key]);
            return domoContacts && domoContacts.length > 0
              ? domoContacts[0].person
              : "";
          } else {
            return project.content[key];
          }
        } catch (e) {
          console.error("Error parsing JSON:", e);
          return null;
        }
      })
    ),
  ].filter((value) => value !== null);

  uniqueValues.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    dropdown.appendChild(option);
  });
}

document
  .getElementById("gwcAccountManager")
  .addEventListener("change", function () {
    filterAndCountData("gwcAccountManager");
  });

document.getElementById("projectLead").addEventListener("change", function () {
  filterAndCountData("projectLead");
});

document
  .getElementById("domoContactName")
  .addEventListener("change", function () {
    filterAndCountData("domoContactName");
  });

document
  .getElementById("preSalesStatus")
  .addEventListener("change", function () {
    filterAndCountData("preSalesStatus");
  });

document.getElementById("clearFilters").addEventListener("click", clearFilters);

function filterAndCountData(triggeredBy) {
  const gwcAccountManager = document.getElementById("gwcAccountManager").value;
  const projectLead = document.getElementById("projectLead").value;
  const domoContactName = document.getElementById("domoContactName").value;
  const preSalesStatus = document.getElementById("preSalesStatus").value;

  filteredData = projectData.filter((project) => {
    try {
      const domoContacts = JSON.parse(project.content.domoContacts);
      const domoContactPerson =
        domoContacts && domoContacts.length > 0 ? domoContacts[0].person : "";
      const preSalesData = JSON.parse(project.content.PreSalesData);
      const preSalesStatusData = preSalesData
        ? preSalesData.status || "Not Started"
        : "Not Started"; // Default to 'Not Started' if status is not present

      return (
        (gwcAccountManager === "" ||
          project.content.gwcAccountManager === gwcAccountManager) &&
        (projectLead === "" ||
          project.content.gwcProjectManager === projectLead) &&
        (domoContactName === "" || domoContactPerson === domoContactName) &&
        (preSalesStatus === "" || preSalesStatusData === preSalesStatus)
      );
    } catch (e) {
      console.error("Error parsing JSON in filter:", e);
      return false;
    }
  });

  // Update dropdowns based on filtered data
  switch (triggeredBy) {
    case "gwcAccountManager":
      populateDropdown("projectLead", "gwcProjectManager", filteredData);
      populateDropdown("domoContactName", "domoContacts", filteredData);
      populateDropdown("preSalesStatus", "PreSalesData", filteredData, true);

      // Reset other dropdowns if they are not valid options for the selected account manager
      if (
        !filteredData.some(
          (project) => project.content.gwcProjectManager === projectLead
        )
      ) {
        document.getElementById("projectLead").value = "";
      }
      if (
        !filteredData.some((project) => {
          const domoContacts = JSON.parse(project.content.domoContacts);
          return (
            domoContacts &&
            domoContacts.length > 0 &&
            domoContacts[0].person === domoContactName
          );
        })
      ) {
        document.getElementById("domoContactName").value = "";
      }
      if (
        !filteredData.some((project) => {
          const preSalesData = JSON.parse(project.content.PreSalesData);
          return (
            preSalesData &&
            (preSalesData.status || "Not Started") === preSalesStatus
          );
        })
      ) {
        document.getElementById("preSalesStatus").value = "";
      }
      break;
    case "projectLead":
      populateDropdown("domoContactName", "domoContacts", filteredData);
      populateDropdown("preSalesStatus", "PreSalesData", filteredData, true);

      if (
        !filteredData.some((project) => {
          const preSalesData = JSON.parse(project.content.PreSalesData);
          return (
            preSalesData &&
            (preSalesData.status || "Not Started") === preSalesStatus
          );
        })
      ) {
        document.getElementById("preSalesStatus").value = "";
      }
      break;
    case "domoContactName":
      populateDropdown("preSalesStatus", "PreSalesData", filteredData, true);
      break;
  }

  updateCounts(filteredData);
  updateChart();
}

function clearFilters() {
  console.log("Clearing Filters");

  // Reset dropdown values
  document.getElementById("gwcAccountManager").value = "";
  document.getElementById("projectLead").value = "";
  document.getElementById("domoContactName").value = "";
  document.getElementById("preSalesStatus").value = "";

  filteredData = projectData.slice();
  populateDropdowns();
  updateCounts(filteredData);
  updateChart();
}

function updateCounts(data) {
  const nonArchivedData = data.filter(
    (project) => project.content.ProjectArchieveStatus !== "Yes"
  );

  const totalProjects = nonArchivedData.length;
  const activeProjects = countProjectsByStatus(nonArchivedData, "Active");
  const completedProjects = countProjectsByStatus(nonArchivedData, "Completed");
  const archivedProjects = countArchivedProjects(projectData); // Use original data to count archived projects

  const preSalesProjects = countProjectsInStage(
    nonArchivedData,
    "PreSalesData"
  );
  const projectInitiationProjects = countProjectsInStage(
    nonArchivedData,
    "ProjectInitiationData"
  );
  const projectExecutionProjects = countProjectsInStage(
    nonArchivedData,
    "ProjectExecutionData"
  );
  const projectClosureProjects = countProjectsInStage(
    nonArchivedData,
    "ProjectClosureData"
  );

  document.getElementById("total-projects").textContent = totalProjects;
  document.getElementById("active-projects").textContent = activeProjects;
  document.getElementById("completed-projects").textContent = completedProjects;

  document.getElementById("pre-sales").textContent = preSalesProjects;
  document.getElementById("project-initiation").textContent =
    projectInitiationProjects;
  document.getElementById("project-execution").textContent =
    projectExecutionProjects;
  document.getElementById("project-closure").textContent =
    projectClosureProjects;

  document.getElementById("archived-projects").textContent = archivedProjects;
}

function countProjectsByStatus(data, status) {
  return data.filter(
    (project) => project.content.ProjectOverallStatus === status
  ).length;
}

function countArchivedProjects(data) {
  return data.filter(
    (project) => project.content.ProjectArchieveStatus === "Yes"
  ).length;
}

function countProjectsInStage(data, stage) {
  return data.filter((project) => {
    try {
      const stageData = JSON.parse(project.content[stage]);
      return stageData && stageData.OverallStageStatus === "Active";
    } catch (e) {
      console.error("Error parsing JSON in stage data:", e);
      return false;
    }
  }).length;
}

function updateChart() {
  updateBarChart();
  updatePieChart();
  updateProjectManagerPieChart();
  updateProjectStatusPieChart();
  updateProjectManagerBarChart();
  projectleaddate();
  // updateIndustryPieChart();
  domocontactvscount();

  // renderProjectStatusBarChart();
  // renderProjectLeadDateLineChart();
  // renderProjectCountsBarChart();
  // renderProjectStatusPieChart();
  // renderProjectManagerPieChart();
  // renderGwcAccountManagerPieChart();
}

function updateTable(filteredData) {
  populateTable(filteredData);
  populateProjectInitiationTable(filteredData);
  populateProjectExecutionTable(filteredData);
}

function projectleaddate() {
  filteredData = filteredData.filter(
    (project) => project.content.ProjectArchieveStatus !== "Yes"
  );
  const projectLeadDates = filteredData.map(
    (item) => item.content.projectLeadDate
  );

  const dates = projectLeadDates.map((dateStr) => new Date(dateStr));

  const dateCounts = dates.reduce((acc, date) => {
    const dateKey = date.toISOString().split("T")[0];
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(dateCounts).sort();
  const counts = sortedDates.map((date) => dateCounts[date]);

  const chartContainer = document.getElementById("project-lead-date-chart");

  const data = [
    {
      x: sortedDates,
      y: counts,
      type: "scatter",
      mode: "lines+markers",
      marker: { size: 8 },
      line: { shape: "spline" },
    },
  ];

  const layout = {
    title: "Project Lead Date Distribution",
    xaxis: { title: "Project Lead Date" },
    yaxis: { title: "Count of Projects" },
  };

  const config = {
    displayModeBar: false,
    responsive: true,
  };

  Plotly.newPlot(chartContainer, data, layout, config);
}
function updateProjectManagerBarChart() {
  filteredData = filteredData.filter(
    (project) => project.content.ProjectArchieveStatus !== "Yes"
  );
  const accountManagers = filteredData.map(
    (project) => project.content.gwcAccountManager
  );
  const managerCounts = countManagers(accountManagers);
  const managerNames = Object.keys(managerCounts);
  const counts = Object.values(managerCounts);
  const managerChart = document.getElementById("project-manager-chart");
  const colors = [
    "#1BCFB4",
    "#FE9496",
    "#9E58FF",
    "#4BCBEB",
    "#D8B4FE",
    "#FFA2AB",
  ];
  const barColors = managerNames.map(
    (name, index) => colors[index % colors.length]
  );

  const data = [
    {
      x: managerNames,
      y: counts,
      type: "bar",
      name: "Account Managers",
      marker: {
        color: barColors,
      },
    },
  ];

  const layout = {
    title: "Project Counts by Account Manager",
    xaxis: {
      title: "Account Manager",
    },
    yaxis: {
      title: "Count of Projects",
    },
  };

  const config = {
    displayModeBar: false,
    responsive: true,
  };

  Plotly.newPlot(managerChart, data, layout, config);
}
function domocontactvscount() {
  filteredData = filteredData.filter(
    (project) => project.content.ProjectArchieveStatus !== "Yes"
  );
  const contactCounts = filteredData.reduce((acc, project) => {
    let parseddomo = JSON.parse(project.content.domoContacts);
    parseddomo.forEach((contact) => {
      if (acc[contact.person]) {
        acc[contact.person]++;
      } else {
        acc[contact.person] = 1;
      }
    });
    return acc;
  }, {});

  // Prepare data for Plotly
  const labels = Object.keys(contactCounts);
  const data = Object.values(contactCounts);

  const colors = ["#1BCFB4", "#FE9496", "#9E58FF", "#4BCBEB"];
  const barColors = labels.map((label, index) => colors[index % colors.length]);

  const trace = {
    y: labels,
    x: data,
    type: "bar",
    marker: {
      color: barColors,
    },
    orientation: "h",
  };

  const layout = {
    title: "Domo Contact vs Project Counts",
    xaxis: {
      title: "Project Count",
      zeroline: false,
      tickmode: "linear",
    },
    yaxis: {
      title: "Domo Contacts",
      automargin: true,
    },
  };

  const config = {
    displayModeBar: false,
    responsive: true,
  };

  Plotly.newPlot("domoContactChart", [trace], layout, config);
}

function countManagers(accountManagers) {
  const managerCounts = {};
  accountManagers.forEach((manager) => {
    if (managerCounts[manager]) {
      managerCounts[manager]++;
    } else {
      managerCounts[manager] = 1;
    }
  });
  return managerCounts;
}

function updateProjectStatusPieChart() {
  filteredData = filteredData.filter(
    (project) => project.content.ProjectArchieveStatus !== "Yes"
  );
  const projectStatuses = filteredData.map(
    (project) => project.content.ProjectOverallStatus
  );

  const statusCounts = {};
  projectStatuses.forEach((status) => {
    if (statusCounts[status]) {
      statusCounts[status]++;
    } else {
      statusCounts[status] = 1;
    }
  });

  const labels = Object.keys(statusCounts);
  const values = Object.values(statusCounts);

  const statusChart = document.getElementById("project-status-chart-pie");

  const colors = [
    "#1BCFB4",
    "#FE9496",
    "#9E58FF",
    "#4BCBEB",
    "#D8B4FE",
    "#FFA2AB",
  ];
  const pieColors = labels.map((label, index) => colors[index % colors.length]);

  const data = [
    {
      labels: labels,
      values: values,
      type: "pie",
      marker: {
        colors: pieColors,
      },
    },
  ];

  const layout = {
    title: "Overall Project Status Distribution",
  };

  Plotly.newPlot(statusChart, data, layout);
}

// function updateIndustryPieChart() {
//     const industries = filteredData.map(project => project.content.industry);

//     const industryCounts = {};
//     industries.forEach(industry => {
//         if (industryCounts[industry]) {
//             industryCounts[industry]++;
//         } else {
//             industryCounts[industry] = 1;
//         }
//     });

//     const labels = Object.keys(industryCounts);
//     const values = Object.values(industryCounts);

//     const industryChart = document.getElementById('project-industry-chart');

//     const data = [{
//         labels: labels,
//         values: values,
//         type: 'pie',
//         marker: {
//             colors: pieColors
//         }
//     }];

//     const layout = {
//         title: 'Project Distribution by Industry'
//     };

//     Plotly.newPlot(industryChart, data, layout);
// }

function updatePieChart() {
  filteredData = filteredData.filter(
    (project) => project.content.ProjectArchieveStatus !== "Yes"
  );
  const gwcAccountManagerData = filteredData.map(
    (project) => project.content.gwcAccountManager
  );

  const managerCounts = {};
  gwcAccountManagerData.forEach((manager) => {
    if (managerCounts[manager]) {
      managerCounts[manager]++;
    } else {
      managerCounts[manager] = 1;
    }
  });

  const managerLabels = Object.keys(managerCounts);
  const managerValues = Object.values(managerCounts);

  const managerChart = document.getElementById("gwc-account-manager-chart");

  const colors = [
    "#1BCFB4",
    "#FE9496",
    "#9E58FF",
    "#4BCBEB",
    "#D8B4FE",
    "#FFA2AB",
  ];
  const pieColors = managerLabels.map(
    (label, index) => colors[index % colors.length]
  );

  const data = [
    {
      labels: managerLabels,
      values: managerValues,
      type: "pie",
      marker: {
        colors: pieColors,
      },
    },
  ];

  const layout = {
    title: "GWC Account Manager Distribution",
  };

  Plotly.newPlot(managerChart, data, layout);
}

function updateProjectManagerPieChart() {
  filteredData = filteredData.filter(
    (project) => project.content.ProjectArchieveStatus !== "Yes"
  );
  const projectManagers = filteredData.map(
    (project) => project.content.gwcProjectManager
  );

  const managerCounts = {};
  projectManagers.forEach((manager) => {
    if (managerCounts[manager]) {
      managerCounts[manager]++;
    } else {
      managerCounts[manager] = 1;
    }
  });

  const labels = Object.keys(managerCounts);
  const values = Object.values(managerCounts);

  const managerChart = document.getElementById("project-manager-chart");

  const data = [
    {
      labels: labels,
      values: values,
      type: "pie",
      marker: {
        colors: [
          "#6A0DAD",
          "#2E0854",
          "#00BFFF",
          "#1E90FF",
          "#483D8B",
          "#4169E1",
        ], // Purple and Blue colors
      },
    },
  ];

  const layout = {
    title: "Project Distribution by GWC Project Manager",
  };

  Plotly.newPlot(managerChart, data, layout);
}

function updateBarChart() {
  filteredData = filteredData.filter(
    (project) => project.content.ProjectArchieveStatus !== "Yes"
  );
  const projectPresalesData = filteredData.map((project) => {
    const preSalesData = JSON.parse(project.content.PreSalesData);
    return {
      status: preSalesData.status || "Not Started",
      id: project.id,
    };
  });

  const statusCounts = {};
  projectPresalesData.forEach((project) => {
    const status = project.status;
    if (statusCounts[status]) {
      statusCounts[status]++;
    } else {
      statusCounts[status] = 1;
    }
  });

  const statusLabels = Object.keys(statusCounts);
  const statusValues = Object.values(statusCounts);

  const statusChart = document.getElementById("project-status-chart");

  const colors = ["#1BCFB4", "#FE9496", "#9E58FF", "#4BCBEB"];
  const barColors = statusLabels.map(
    (label, index) => colors[index % colors.length]
  );

  const data = [
    {
      x: statusLabels,
      y: statusValues,
      type: "bar",
      marker: {
        color: barColors,
      },
    },
  ];

  const config = {
    displayModeBar: false,
    responsive: true,
  };

  const layout = {
    title: "Project Count by Presales Status",
    xaxis: {
      title: "Presales Status",
      tickangle: -45, // Rotate x-axis labels for better readability
    },
    yaxis: {
      title: "Number of Projects",
    },
    margin: {
      l: 50,
      r: 50,
      b: 150, // Increase bottom margin to avoid overlap
      t: 50,
      pad: 7,
    },
    height: 500, // Set the desired height here
  };

  Plotly.newPlot(statusChart, data, layout, config);
  Plotly.newPlot(statusChart, data, layout, config);
}

// function renderProjectStatusBarChart() {
//     const projectStatuses = filteredData.map(project => project.content.ProjectOverallStatus);
//     const statusCounts = projectStatuses.reduce((acc, status) => {
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//     }, {});
//     const labels = Object.keys(statusCounts);
//     const values = Object.values(statusCounts);
//     const colors = ['#1BCFB4', '#FE9496', '#9E58FF', '#4BCBEB'];

//     new Chart(document.getElementById('project-status-chart'), {
//         type: 'bar',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Number of Projects',
//                 data: values,
//                 backgroundColor: colors
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 title: { display: true, text: 'Project Count by Overall Status' }
//             },
//             scales: {
//                 x: { title: { display: true, text: 'Project Status' } },
//                 y: { title: { display: true, text: 'Number of Projects' } }
//             }
//         }
//     });
// }

// function renderGwcAccountManagerPieChart() {
//     const gwcAccountManagerData = filteredData.map(project => project.content.gwcAccountManager);
//     const managerCounts = countManagers(gwcAccountManagerData);
//     const labels = Object.keys(managerCounts);
//     const values = Object.values(managerCounts);
//     const colors = ['#1BCFB4', '#FE9496', '#9E58FF', '#4BCBEB'];

//     new Chart(document.getElementById('gwc-account-manager-chart'), {
//         type: 'pie',
//         data: {
//             labels: labels,
//             datasets: [{
//                 data: values,
//                 backgroundColor: colors
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 title: { display: true, text: 'GWC Account Manager Distribution' }
//             }
//         }
//     });
// }

// function renderProjectManagerPieChart() {
//     const projectManagers = filteredData.map(project => project.content.gwcProjectManager);
//     const managerCounts = countManagers(projectManagers);
//     const labels = Object.keys(managerCounts);
//     const values = Object.values(managerCounts);
//     const colors = ['#6A0DAD', '#2E0854', '#00BFFF', '#1E90FF', '#483D8B', '#4169E1'];

//     new Chart(document.getElementById('project-manager-chart'), {
//         type: 'pie',
//         data: {
//             labels: labels,
//             datasets: [{
//                 data: values,
//                 backgroundColor: colors
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 title: { display: true, text: 'Project Distribution by GWC Project Manager' }
//             }
//         }
//     });
// }

// function renderProjectStatusPieChart() {
//     const projectStatuses = filteredData.map(project => project.content.ProjectOverallStatus);
//     const statusCounts = projectStatuses.reduce((acc, status) => {
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//     }, {});
//     const labels = Object.keys(statusCounts);
//     const values = Object.values(statusCounts);
//     const colors = ['#1BCFB4', '#FE9496', '#9E58FF', '#4BCBEB'];

//     new Chart(document.getElementById('project-status-chart-pie'), {
//         type: 'pie',
//         data: {
//             labels: labels,
//             datasets: [{
//                 data: values,
//                 backgroundColor: colors
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 title: { display: true, text: 'Overall Project Status Distribution' }
//             }
//         }
//     });
// }

// function renderProjectCountsBarChart() {
//     const projectStatuses = filteredData.map(project => project.content.ProjectOverallStatus);
//     const statusCounts = projectStatuses.reduce((acc, status) => {
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//     }, {});
//     const labels = Object.keys(statusCounts);
//     const values = Object.values(statusCounts);
//     const colors = ['#1BCFB4', '#FE9496', '#9E58FF', '#4BCBEB'];

//     new Chart(document.getElementById('project-counts-chart'), {
//         type: 'bar',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Number of Projects',
//                 data: values,
//                 backgroundColor: colors
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 title: { display: true, text: 'Project Count by Status' }
//             },
//             scales: {
//                 x: { title: { display: true, text: 'Project Status' } },
//                 y: { title: { display: true, text: 'Number of Projects' } }
//             }
//         }
//     });
// }

// function renderProjectLeadDateLineChart() {
//     const projectLeadDates = filteredData.map(item => item.content.projectLeadDate);
//     const dates = projectLeadDates.map(dateStr => new Date(dateStr));
//     const dateCounts = dates.reduce((acc, date) => {
//         const dateKey = date.toISOString().split('T')[0];
//         acc[dateKey] = (acc[dateKey] || 0) + 1;
//         return acc;
//     }, {});
//     const sortedDates = Object.keys(dateCounts).sort();
//     const counts = sortedDates.map(date => dateCounts[date]);

//     new Chart(document.getElementById('project-lead-date-chart'), {
//         type: 'line',
//         data: {
//             labels: sortedDates,
//             datasets: [{
//                 label: 'Count of Projects',
//                 data: counts,
//                 borderColor: '#42A5F5',
//                 fill: false,
//                 tension: 0.1
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 title: { display: true, text: 'Project Lead Date Distribution' }
//             },
//             scales: {
//                 x: { title: { display: true, text: 'Project Lead Date' } },
//                 y: { title: { display: true, text: 'Count of Projects' } }
//             }
//         }
//     });
// }

// function countManagers(managers) {
//     return managers.reduce((acc, manager) => {
//         acc[manager] = (acc[manager] || 0) + 1;
//         return acc;
//     }, {});
// }

// function populateTable(data) {
//     const tableBody = $('#presales-table-body');

//     if ($.fn.DataTable.isDataTable('#presales-table')) {
//         $('#presales-table').DataTable().destroy();
//     }
//     tableBody.empty();

//     data.forEach(project => {
//         const preSalesData = JSON.parse(project.content.PreSalesData);
//         const commentsHtml = preSalesData.comments && Array.isArray(preSalesData.comments)
//             ? preSalesData.comments.map(comment => `${comment.date}: ${comment.comment}`).join('<br>')
//             : '';

//         const row = `
//             <tr>
//                 <td>${project.content.clientName}</td>
//                 <td>${project.content.gwcAccountManager}</td>
//                 <td>${project.content.gwcProjectManager}</td>
//                 <td>${preSalesData.status}</td>
//                 <td>${commentsHtml}</td>
//             </tr>
//         `;
//         tableBody.append(row);
//     });

//     // Format current date and time
//     const currentDate = new Date();
//     const formattedDate = formatDate(currentDate);

//     $('#presales-table').DataTable({
//         dom: 'Bfrtip',
//         buttons: [
//             {
//                 extend: 'excelHtml5',
//                 text: 'Export as Excel',
//                 className: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
//                 filename: `presales_${formattedDate}`
//             }
//         ],
//         responsive: true,
//         scrollX: true,
//         paging: false,
//         searching: false,
//         ordering: false,
//         info: false
//     });
// }

// function formatDate(date) {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     let hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12; // Handle midnight
//     const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}${ampm}`;
//     return formattedDate;
// }
// $(document).ready(function() {
//     if (typeof jQuery === 'undefined' || typeof $.fn.DataTable === 'undefined') {
//         console.error('jQuery or DataTables not loaded properly.');
//         return;
//     }

// });

// function populateProjectInitiationTable(data) {
//     const tableBody = $('#project-initiation-table-body');

//     // Destroy existing DataTable if it exists
//     if ($.fn.DataTable.isDataTable('#project-initiation-table')) {
//         $('#project-initiation-table').DataTable().destroy();
//     }

//     // Clear table body
//     tableBody.empty();

//     // Iterate over each project data
//     data.forEach(project => {
//         try {
//             const projectInitiationData = project.content.ProjectInitiationData;

//             // Check if ProjectInitiationData exists
//             if (!projectInitiationData) {
//                 throw new Error('ProjectInitiationData is missing or undefined');
//             }

//             // Parse JSON data
//             let initiationData;
//             try {
//                 initiationData = JSON.parse(projectInitiationData);
//             } catch (error) {
//                 throw new Error(`Error parsing ProjectInitiationData JSON: ${error.message}`);
//             }

//             // Check if initiationData is valid
//             if (!initiationData) {
//                 throw new Error('Invalid ProjectInitiationData format');
//             }

//             // Extract resources and comments
//             const resources = project.content.resources || [];
//             const comments = initiationData.comments || [];

//             // Construct resources HTML
//             let resourcesHtml = '';
//             if (Array.isArray(resources) && resources.length > 0) {
//                 resourcesHtml = '<ul>';
//                 resources.forEach(resource => {
//                     resourcesHtml += `<li>${resource.name} (${resource.email})</li>`;
//                 });
//                 resourcesHtml += '</ul>';
//             } else {
//                 resourcesHtml = 'No resources';
//             }

//             // Construct comments HTML
//             let commentsHtml = '';
//             if (Array.isArray(comments) && comments.length > 0) {
//                 commentsHtml = '<ul>';
//                 comments.forEach(comment => {
//                     commentsHtml += `<li>${comment.date}: ${comment.comment}</li>`;
//                 });
//                 commentsHtml += '</ul>';
//             } else {
//                 commentsHtml = 'No comments';
//             }

//             // Construct table row
//             const row = `
//                 <tr>
//                     <td>${project.content.clientName}</td>
//                     <td>${project.content.gwcAccountManager}</td>
//                     <td>${project.content.gwcProjectManager}</td>
//                     <td>${initiationData.ProposedStartDate || ''}</td>
//                     <td>${initiationData.ProposedEndDate || ''}</td>
//                     <td>${initiationData.Timeline ? `${initiationData.Timeline.value} ${initiationData.Timeline.unit}` : ''}</td>
//                     <td>${initiationData.PlannedResourceNames || ''}</td>
//                     <td>${resourcesHtml}</td> <!-- Column for resources -->
//                     <td>${commentsHtml}</td> <!-- Column for comments -->
//                 </tr>
//             `;
//             tableBody.append(row);
//         } catch (error) {
//             console.error('Error processing project:', error);
//         }
//     });

//     // Initialize DataTables
//     $('#project-initiation-table').DataTable({
//         dom: 'Bfrtip',
//         buttons: [
//             {
//                 extend: 'excelHtml5',
//                 text: 'Export as Excel',
//                 className: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
//                 filename: `project_initiation_${Date.now()}`
//             }
//         ],
//         responsive: true,
//         scrollX: true,
//         paging: false,
//         searching: false,
//         ordering: false,
//         info: false
//     });
// }

// function populateProjectExecutionTable(data) {
//     const tableBody = $('#project-execution-table-body');

//     if ($.fn.DataTable.isDataTable('#project-execution-table')) {
//         $('#project-execution-table').DataTable().destroy();
//     }
//     tableBody.empty();

//     data.forEach(project => {
//         try {
//             const executionData = project.content.ProjectExecutionData;

//             if (!executionData) {
//                 throw new Error('ProjectExecutionData is missing or undefined');
//             }

//             // Parse JSON data
//             let executionDetails;
//             try {
//                 executionDetails = JSON.parse(executionData);
//             } catch (error) {
//                 throw new Error(`Error parsing ProjectExecutionData JSON: ${error.message}`);
//             }

//             // Check if executionDetails is valid
//             if (!executionDetails) {
//                 throw new Error('Invalid ProjectExecutionData format');
//             }

//             console.log('Parsed Execution Data:', executionDetails);

//             // Construct comments HTML
//             const commentsHtml = executionDetails.comments && Array.isArray(executionDetails.comments)
//                 ? executionDetails.comments.map(comment => `${comment.date}: ${comment.comment}`).join('<br>')
//                 : '';

//             // Construct table row
//             const row = `
//                 <tr>
//                     <td>${project.content.clientName}</td>
//                     <td>${project.content.gwcAccountManager}</td>
//                     <td>${project.content.gwcProjectManager}</td>
//                     <td>${executionDetails.ActualStartDate || ''}</td>
//                     <td>${executionDetails.ActualEndDate || ''}</td>
//                     <td>${executionDetails.PercentComplete || ''}</td>
//                     <td>${commentsHtml}</td>
//                 </tr>
//             `;
//             tableBody.append(row);
//         } catch (error) {
//             console.error('Error processing project for Project Execution Table:', error);
//         }
//     });

//     // Initialize DataTables
//     $('#project-execution-table').DataTable({
//         dom: 'Bfrtip',
//         buttons: [
//             {
//                 extend: 'excelHtml5',
//                 text: 'Export as Excel',
//                 className: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
//                 filename: `project_execution_${Date.now()}`
//             }
//         ],
//         responsive: true,
//         scrollX: true,
//         paging: false,
//         searching: false,
//         ordering: false,
//         info: false
//     });
// }

// function updateBarChart() {
//     const projectStatusData = filteredData.map(project => ({
//         status: project.content.ProjectOverallStatus,
//         id: project.id
//     }));

//     const statusCounts = {};
//     projectStatusData.forEach(project => {
//         const status = project.status;
//         if (statusCounts[status]) {
//             statusCounts[status]++;
//         } else {
//             statusCounts[status] = 1;
//         }
//     });

//     const statusLabels = Object.keys(statusCounts);
//     const statusValues = Object.values(statusCounts);

//     const statusChart = document.getElementById('project-status-chart');

//     const data = [{
//         x: statusLabels,
//         y: statusValues,
//         type: 'bar',
//         marker: {
//             color: ['#6A0DAD', '#2E0854', '#00BFFF', '#1E90FF', '#483D8B', '#4169E1'] // Purple and Blue colors
//         }
//     }];

//     const config = {
//         displayModeBar: false, // Remove the mode bar
//         responsive: true // Optional: make the chart responsive
//     };

//     const layout = {
//         title: 'Project Count by Status',
//         xaxis: {
//             title: 'Status'
//         },
//         yaxis: {
//             title: 'Number of Projects'
//         }
//     };

//     Plotly.newPlot(statusChart, data, layout, config); // Pass the config object here
// }

//old Code

// domo.get(`/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/`)
//     .then(projectData => {

// // const collectionName = 'ProjectTrackerDB-NewSet';
// // domo.get(`/domo/datastores/v1/collections/${collectionName}/documents`)
// //     .then(documents => {
// //         const documentIds = documents.map(doc => doc.id);

// //         if (documentIds.length > 0) {
// //             const idsQuery = documentIds.join(',');
// //             domo.delete(`/domo/datastores/v1/collections/${collectionName}/documents/bulk?ids=${idsQuery}`)
// //                 .then(response => {
// //                     console.log('Deleted documents:', response);
// //                 })
// //                 .catch(error => {
// //                     console.error('Error deleting documents:', error);
// //                 });
// //         } else {
// //             console.log('No documents found to delete.');
// //         }
// //     })
// //     .catch(error => {
// //         console.error('Error fetching documents:', error);
// //     });

//         function countProjectsByStatus(data, status) {
//             console.log(data);
//             return data.filter(project => project.content.ProjectOverallStatus === status).length;
//           }

//         function countProjectsInStage(data, stage) {
//             return data.filter(project => JSON.parse(project.content[stage]).OverallStageStatus === "Active").length;
//         }

//         const totalProjects = projectData.length;
//         const activeProjects = countProjectsByStatus(projectData, "Active");
//         const completedProjects = countProjectsByStatus(projectData, "Completed");

//         const preSalesProjects = countProjectsInStage(projectData, "PreSalesData");
//         const projectInitiationProjects = countProjectsInStage(projectData, "ProjectInitiationData");
//         const projectExecutionProjects = countProjectsInStage(projectData, "ProjectExecutionData");
//         const projectClosureProjects = countProjectsInStage(projectData, "ProjectClosureData");

//         document.getElementById('total-projects').textContent = totalProjects;
//         document.getElementById('active-projects').textContent = activeProjects;
//         document.getElementById('completed-projects').textContent = completedProjects;

//         document.getElementById('pre-sales').textContent = preSalesProjects;
//         document.getElementById('project-initiation').textContent = projectInitiationProjects;
//         document.getElementById('project-execution').textContent = projectExecutionProjects;
//         document.getElementById('project-closure').textContent = projectClosureProjects;

//     })
//     .catch(error => {
//         console.error('Error fetching project data:', error);
//     });
//     function generatePDF() {
//         try {
//             var element = document.getElementById('');
//             var opt = {
//                 margin: 0.6,
//                 filename: 'alubee_hourly_report.pdf',
//                 html2canvas: { scale: 6 },
//                 jsPDF: { unit: 'in', format: [12, 15], orientation: 'portrait' }
//             };

//             html2pdf().set(opt).from(element).save();
//         } catch (error) {
//             console.error('Error generating PDF:', error);
//         }
//     }
