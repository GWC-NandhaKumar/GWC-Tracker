function showNotification(message, color) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    notificationMessage.textContent = message;
    notification.className = `fixed top-5 right-5 p-4 rounded shadow-lg transition-transform transform duration-300 ease-in-out bg-${color}-500 translate-y-10`;

    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('translate-y-0');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('translate-y-0');
        notification.classList.add('translate-y-10');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 3000);
}

let developerData = [];

domo.get('/data/v1/emp_ds')
    .then(data => {
        developerData = data;
        console.log('Developer data loaded:', developerData); // For debugging
    })
    .catch(error => {
        console.error('Error fetching developer data:', error);
    });

console.log(developerData);
//<td class="py-3 px-6 text-left project-status ${getStatusClass(project.content.ProjectOverallStatus)}">${project.content.ProjectOverallStatus}</td>
                // <td class="py-3 px-6 text-left">
                //   <a href="./editproject.html?${project.id}">
                //   <i class="fas fa-edit"></i>
                //   </a>
                // <i class="fas fa-check cursor-pointer ml-2" title="Close Project" onclick='closeProject("${project.id}")'></i>
                //  </td>
                //<td class="text-left">${project.content.clientName}</td>

const queryString = window.location.search;
const id = queryString.substring(1);
console.log(id);

// $(document).ready(function () {
//     const url = id ? `/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/${id}` 
//                    : '/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/';

//     domo.get(url)
//         .then(data => {
//             const projectTableBody = document.getElementById('projectTableBody');
//             projectTableBody.innerHTML = '';

//             const projects = Array.isArray(data) ? data : [data];
//             projects.forEach(project => {  
//                 const row = document.createElement('tr');
//                 row.className = 'border-b text-[#000] hover:bg-white';

//                 row.innerHTML = `
//                 <tr class="w-full">
//                     <td class="text-left hover:text-blue-600">
//                         <a href="./project_detail.html?${project.id}">${project.content.projectName}</a>
//                     </td>
                    
//                     <td class="text-left">${project.content.gwcAccountManager}</td>
//                     <td class="text-left">${project.content.gwcProjectManager}</td>
//                     <td class="text-left">${project.content.projectLeadDate}</td>
//                     <td class="text-left cursor-pointer" onclick='updateStage(this, "PreSalesData", "${project.id}")'>
//                         ${getStageStatus(project.content.PreSalesData)}
//                     </td>
//                     <td class="text-left cursor-pointer" onclick='updateStage(this, "ProjectInitiationData", "${project.id}", ${JSON.stringify(project.content.PreSalesData)})'>
//                         ${getStageStatus(project.content.ProjectInitiationData)}
//                     </td>
//                     <td class="text-left cursor-pointer" onclick='updateStage(this, "ProjectExecutionData", "${project.id}", ${JSON.stringify(project.content.ProjectInitiationData)})'>
//                         ${getStageStatus(project.content.ProjectExecutionData)}
//                     </td>
//                     <td class="text-left cursor-pointer" onclick='updateStage(this, "ProjectClosureData", "${project.id}", ${JSON.stringify(project.content.ProjectExecutionData)})'>
//                         ${getStageStatus(project.content.ProjectClosureData)}
//                     </td>
//                     <td class="text-left">${project.content.innovationProject ? 'Yes' : 'No'}</td>
//                 </tr>
//                 `;

//                 function getStatusClass(status) {
//                     switch (status) {
//                         case "Closed":
//                             return "status-closed";
//                         case "Active":
//                             return "status-active";
//                         case "Completed":
//                             return "status-completed";
//                         default:
//                             return "";
//                     }
//                 }

//                 if (project.content.ProjectOverallStatus === "Closed") {
//                     row.style.backgroundColor = "#ffcccc"; // light red color
//                 }

//                 projectTableBody.appendChild(row);

//                 updateCellColor(row.cells[4], project.content.PreSalesData);
//                 updateCellColor(row.cells[5], project.content.ProjectInitiationData);
//                 updateCellColor(row.cells[6], project.content.ProjectExecutionData);
//                 updateCellColor(row.cells[7], project.content.ProjectClosureData);
//             });

//             $('#myTable').DataTable({
//                 "info": false,
//             });
//         });
// });
$(document).ready(function () {
    let table; // Declare table variable for scope

    const fetchData = () => {
        const url = id ? `/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/${id}` : '/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/';
        domo.get(url)
            .then(data => {
                const projectTableBody = document.getElementById('projectTableBody');
                projectTableBody.innerHTML = '';

                const projects = Array.isArray(data) ? data : [data];
                projects.forEach(project => {
                    // Check if project.projectarchievestatus !== 'Yes'
                    if (project.content.ProjectArchieveStatus === 'Yes') {
                        const row = document.createElement('tr');
                        row.className = 'border-b text-[#000] hover:bg-[#d4ebfc] ';
                      
                        row.innerHTML = `
                            <td class="text-left hover:text-blue-600">
                                <a href="./project_detail.html?${project.id}">${project.content.projectName}</a>
                            </td>
                            <td class="text-left">${project.content.gwcAccountManager}</td>
                            <td class="text-left">${project.content.gwcProjectManager}</td>
                            <td class="text-left">${project.content.projectLeadDate}</td>
                            <td class="text-left cursor-pointer">
                                ${getStageStatus(project.content.PreSalesData)}
                            </td>
                            <td class="text-left cursor-pointer">
                                ${getStageStatus(project.content.ProjectInitiationData)}
                            </td>
                            <td class="text-left cursor-pointer" >
                                ${getStageStatus(project.content.ProjectExecutionData)}
                            </td>
                            <td class="text-left cursor-pointer" >
                                ${getStageStatus(project.content.ProjectClosureData)}
                            </td>
                            <td class="text-center">${project.content.innovationProject ? 'Yes' : 'No'}</td>
                        `;

                        if (project.content.ProjectOverallStatus === "Closed") {
                            row.style.backgroundColor = "#ffcccc";
                        }

                        updateCellColor(row.cells[4], project.content.PreSalesData);
                        updateCellColor(row.cells[5], project.content.ProjectInitiationData);
                        updateCellColor(row.cells[6], project.content.ProjectExecutionData);
                        updateCellColor(row.cells[7], project.content.ProjectClosureData);

                        document.getElementById("date_filter_archived_page").style.display = "block"

                        projectTableBody.appendChild(row);
                    }
                });

                // Destroy existing DataTable if exists
                if ($.fn.DataTable.isDataTable('#myTable')) {
                    table.destroy();
                }

                // Initialize DataTable
                table = $('#myTable').DataTable({
                    "info": false,
                });

                // Event handlers for filtering
                $('#dateFilterInput').on('change', function () {
                    const filterValue = this.value;
                    table.column(3).search(filterValue).draw();
                });

                $('#calendarIcon').on('click', function () {
                    $('#dateFilterInput').focus();
                });

                $('#clearFilterBtn').on('click', function () {
                    $('#dateFilterInput').val('');
                    table.search('').draw();
                    fetchData();
                });

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    fetchData();
});


function getStageStatus(stageData) {
    try {
        console.log(JSON.parse(stageData).OverallStageStatus)
        return stageData ? JSON.parse(stageData).OverallStageStatus : 'Not Started';

    } catch (e) {
        console.error('Error parsing stage data:', e);
        return 'Not Started';
    }
}

function updateCellColor(cell, stageData) {
    try {
        const status = stageData ? JSON.parse(stageData).OverallStageStatus : 'Not Started';
        if (status === 'Completed') {
            cell.classList.add('bg-red-500');
        } else if (status === 'Active') {
            cell.classList.add('bg-yellow-500');
        } else {
            cell.classList.add('bg-[#d4ebfc] ');
        }
    } catch (e) {
        console.error('Error parsing stage data:', e);
    }
}
function addComment() {
    console.log('InsideAddCommentFUnction')
    const commentsContainer = document.getElementById('commentsContainer');
    const commentElement = document.createElement('div');
    commentElement.classList.add('flex', 'space-x-4', 'mt-4');
    commentElement.innerHTML = `
        <input type="date" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[30%] text-2xl p-2 h-auto rounded-md   sm:text-sm" required>
        <input type="text" placeholder="Comment/Remarks" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[60%]  text-2xl p-2 h-auto rounded-md   sm:text-sm" required>
    `;
    commentsContainer.appendChild(commentElement);
}
function addCommentBox(formname) {
    console.log('Function called with formname:', formname);
    const forms = document.getElementsByTagName('form');

    for (let i = 0; i < forms.length; i++) {
        const form = forms[i];

        if (form.classList.contains(formname)) {
            console.log('Form found:', form);

            const commentsContainer = form.querySelector('#commentsContainer');
            if (commentsContainer) {
                console.log('Comments container found:', commentsContainer);

                const commentElement = document.createElement('div');
                commentElement.classList.add('flex', 'space-x-4', 'mt-4');
                commentElement.innerHTML = `
                    <input type="date" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[30%] text-2xl p-2 h-auto rounded-md   sm:text-sm" required>
                    <input type="text" placeholder="Comment/Remarks" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[60%] text-2xl p-2 h-auto rounded-md   sm:text-sm" required>
                `;
                commentsContainer.appendChild(commentElement);

                console.log('Comment element added to form:', formname);
            } else {
                console.log('No comments container found in form:', formname);
            }
        }
    }

    if (document.getElementsByClassName(formname).length === 0) {
        console.log('No form found with the class name:', formname);
    }
}


function addPOCDeveloper() {
    const developersContainer = document.getElementById('POCDevelopersContainer');
    const developerElement = document.createElement('div');
    developerElement.classList.add('flex', 'space-x-4', 'mt-2', 'input-container');
    developerElement.innerHTML = `
        <input type="text" placeholder="Developer Name" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[50%] text-2xl p-2 h-auto rounded-md   sm:text-sm" oninput="window.autocomplete(this)" required>
        <input type="email" placeholder="Developer Email" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[50%] text-2xl p-2 h-auto rounded-md   sm:text-sm" readonly required>
        <ul class="autocomplete-list"></ul>
    `;
    developersContainer.appendChild(developerElement);
}

function autocomplete(inputElement) {
    const inputValue = inputElement.value.toLowerCase();
    const listContainer = inputElement.parentNode.querySelector('.autocomplete-list');
    listContainer.innerHTML = '';

    const suggestions = developerData.filter(dev => dev.emp_name.toLowerCase().includes(inputValue));

    suggestions.forEach(dev => {
        const item = document.createElement('li');
        item.textContent = dev.emp_name;
        item.onclick = () => {
            inputElement.value = dev.emp_name;
            inputElement.nextElementSibling.value = dev.emp_mail;
            listContainer.innerHTML = '';
        };
        listContainer.appendChild(item);
    });

    if (inputValue.length > 0 && suggestions.length > 0) {
        listContainer.style.display = 'block';
    } else {
        listContainer.style.display = 'none';
    }
}

document.addEventListener('click', function (event) {
    if (!event.target.matches('.autocomplete-list, input[type="text"]')) {
        const lists = document.querySelectorAll('.autocomplete-list');
        lists.forEach(list => list.style.display = 'none');
    }
});
function addResources() {
    const resourcesContainer = document.getElementById('ResourcesContainer');
    const resourcesElement = document.createElement('div');
    resourcesElement.classList.add('flex', 'space-x-4', 'mt-2', 'resource-item');
    resourcesElement.innerHTML = `
        <input type="text" placeholder="Resources Name" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[50%] text-2xl p-2 h-auto rounded-md   sm:text-sm resource-name" oninput="window.autocomplete(this)" required>
        <input type="email" placeholder="Resources Email" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[50%] text-2xl p-2 h-auto rounded-md   sm:text-sm resource-email" readonly required>
        <ul class="autocomplete-list"></ul>
    `;
    resourcesContainer.appendChild(resourcesElement);
}

function handleRadioChange(event, id, stage) {
    const forms = document.getElementsByTagName('form');
    let form = null;
    for (let i = 0; i < forms.length; i++) {
        if (forms[i].classList.contains(stage)) {
            form = forms[i];
            break;
        }
    }

    if (!form) {
        console.error(`Form with class '${stage}' not found.`);
        return;
    }
    const yesComment = form.querySelector(`#yes-comment-${id}`);
    const noComment = form.querySelector(`#no-comment-${id}`);

    if (!yesComment || !noComment) {
        console.error(`Comment elements with IDs '#yes-comment-${id}' or '#no-comment-${id}' not found within form.`);
        return;
    }

    if (event.target.value === 'yes') {
        yesComment.classList.remove('hidden');
        noComment.classList.add('hidden');
    } else {
        yesComment.classList.add('hidden');
        noComment.classList.remove('hidden');
    }
}
function PresalescollectFormData() {
    const form = document.getElementById('PresalesForm');
    const formData = new FormData(form);
    let PresaleStatus = document.getElementById('PresaleStatus').value;
    let OverallStageStatus = document.getElementById('OverallStageStatus').value;
    document.getElementById('stageName').value = "PreSalesStage";
    let StageName = document.getElementById('stageName').value;
    let leaddate = form.querySelector('#project_leaddate').value

    let comments = [];
    const commentsContainer = document.getElementById('commentsContainer');
    const commentElements = commentsContainer.querySelectorAll('div.flex');

    commentElements.forEach((commentElement) => {
        const date = commentElement.querySelector('input[type="date"]').value;
        const comment = commentElement.querySelector('input[type="text"]').value;
        comments.push({ date, comment });
    });

    let developers = [];
    const developersContainer = document.getElementById('POCDevelopersContainer');
    const developerElements = developersContainer.querySelectorAll('div.flex');

    developerElements.forEach((developerElement) => {
        const name = developerElement.querySelector('input[type="text"]').value;
        const email = developerElement.querySelector('input[type="email"]').value;
        developers.push({ name, email });
    });

    const checklistItems = [];
    const checklistContainer = document.getElementById('checklist-items');
    const checklistElements = checklistContainer.querySelectorAll('.checklist-item');

    checklistElements.forEach((checklistElement) => {
        const id = checklistElement.getAttribute('data-id');
        const engagement = form.querySelector(`input[name="engagement-${id}"]:checked`)?.value || '';
        const comment = checklistElement.querySelector(`#yes-comment-${id} input`)?.value || checklistElement.querySelector(`#no-comment-${id} input`)?.value || '';
        checklistItems.push({ id, engagement, comment });
    });

    const data = {
        StageName: StageName,
        status: PresaleStatus,
        comments: comments,
        POCdevelopers: developers,
        checklist: checklistItems,
        OverallStageStatus: OverallStageStatus
    };
   
    function getDaysFromLeadToCurrent(leaddateValue) {
        let leaddate = new Date(leaddateValue);
        let currentDate = new Date();
        let differenceInTime = currentDate - leaddate;
        let differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

        return differenceInDays;
    }
    let leaddateValue = document.querySelector('#project_leaddate').value;
    let daysFromLeadToCurrent = getDaysFromLeadToCurrent(leaddateValue);

    data.completedDate = new Date().toISOString().split('T')[0];
    data.daysFromLeadToCurrent = daysFromLeadToCurrent;

    const projectId = formData.get('project_id');
    domo.get('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId)
        .then(existingData => {
            const updatedDocument = existingData;
            console.log(updatedDocument.content.ProjectInitiationData)
            const stage2check = JSON.parse(updatedDocument.content.ProjectInitiationData)
            const stage3check = JSON.parse(updatedDocument.content.ProjectExecutionData)
            const stage4check = JSON.parse(updatedDocument.content.ProjectClosureData)

            if (stage2check.OverallStageStatus === "Completed" && OverallStageStatus === "Completed" && stage3check.OverallStageStatus === "Completed" && stage4check.OverallStageStatus === "Completed" === "Completed") {
                if (OverallStageStatus === "Completed") {
                    console.log(JSON.parse(updatedDocument.content.ProjectInitiationData))
                    updatedDocument.content.ProjectOverallStatus = "Completed"
                    updatedDocument.content.ProjectPresalesStatus = 'Completed'
                    updatedDocument.content.PreSalesData = JSON.stringify(data);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }
            }
            else {
                if (OverallStageStatus === "Completed") {
                    console.log(JSON.parse(updatedDocument.content.ProjectInitiationData));
                    if (PresaleStatus === 'Closed Lost') {
                        updatedDocument.content.ProjectArchieveStatus = 'Yes';
                        updatedDocument.content.PreSalesData = JSON.stringify(data);
                        updatedDocument.content.ProjectPresalesStatus = 'Closed';
                        
                    } else {
                        const stage2data = JSON.parse(updatedDocument.content.ProjectInitiationData);
                        stage2data.OverallStageStatus = 'Active';
                        updatedDocument.content.ProjectOverallStatus = "Active";
                        updatedDocument.content.ProjectPresalesStatus = 'Completed';
                        updatedDocument.content.ProjectInitiationStatus = 'Active';
                        stage2data.resources = developers;
                        updatedDocument.content.ProjectInitiationData = JSON.stringify(stage2data);
                        updatedDocument.content.PreSalesData = JSON.stringify(data);
                    }
                
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }
                if (OverallStageStatus === "Active") {
                    console.log(JSON.parse(updatedDocument.content.ProjectInitiationData))
                    const stage2data = JSON.parse(updatedDocument.content.ProjectInitiationData)
                    const stage3data = JSON.parse(updatedDocument.content.ProjectExecutionData)
                    const stage4data = JSON.parse(updatedDocument.content.ProjectClosureData)
                    stage2data.OverallStageStatus = 'Not Started'
                    stage3data.OverallStageStatus = 'Not Started'
                    stage4data.OverallStageStatus = 'Not Started'
                    updatedDocument.content.ProjectPresalesStatus = 'Active'
                    updatedDocument.content.ProjectInitiationStatus = 'Not Started'
                    updatedDocument.content.ProjectExecutionStatus = 'Not Started'
                    updatedDocument.content.ProjectClosureStatus = 'Not Started'
                    updatedDocument.content.ProjectOverallStatus = "Active"
                    updatedDocument.content.ProjectInitiationData = JSON.stringify(stage2data);
                    updatedDocument.content.ProjectExecutionData = JSON.stringify(stage3data);
                    updatedDocument.content.ProjectClosureData = JSON.stringify(stage4data);
                    updatedDocument.content.PreSalesData = JSON.stringify(data);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }

            }
        })
        .then(response => {
            showNotification('Project Presale Stage Updated Successfully.', 'green')
            form.reset()
            console.log('Document updated successfully:', response);
        })
        .catch(error => {
            showNotification('Error updating document', 'red')
            console.error('Error updating document:', error);
        });
}


function updateStage(cell, stage, projectId, previousStageData) {
    console.log(previousStageData);
    if (!previousStageData) {
        console.log(projectId);
        document.getElementById('PreSalePopUp').classList.remove('hidden');
        document.getElementById('ListProjectTable').classList.add('hidden');
        document.getElementById('project_id').value = projectId;
        domo.get('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId)
            .then(data => {
                console.log(data);
                PreSalesprefillForm(JSON.parse(data.content.PreSalesData),data.content.projectLeadDate);
                console.log(data.content);
            })
        document.getElementById('PreSaleclosePopup').addEventListener('click', () => {
            document.getElementById('PreSalePopUp').classList.add('hidden');
        });

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const textarea = event.target.nextElementSibling;
                const detailsDiv = event.target.nextElementSibling?.nextElementSibling;
                if (event.target.checked) {
                    if (textarea) {
                        textarea.classList.remove('hidden');
                    }
                    if (detailsDiv) {
                        detailsDiv.classList.remove('hidden');
                    }
                } else {
                    if (textarea) {
                        textarea.classList.add('hidden');
                    }
                    if (detailsDiv) {
                        detailsDiv.classList.add('hidden');
                    }
                }
            });
        });
    }
    const previousStageStatus = JSON.parse(previousStageData).OverallStageStatus;
    var jsonData = JSON.parse(previousStageData);
    let previousStageName = jsonData.StageName;
    console.log(previousStageName, previousStageStatus);
    if (previousStageStatus !== 'Completed') {
        showNotification('Complete the previous stage first.', 'red')
        return;
    }
    if (previousStageStatus == 'Completed') {
        if (previousStageName == 'PreSalesStage') {
            console.log('insideProjectInitiationForm')
            ProjectInitiationForm(projectId);
        }
        if (previousStageName == 'ProjectInitiationStage') {
            console.log('insideProjectInitiationForm')
            ProjectExecutionForm(projectId);
        }
        if (previousStageName == 'ProjectExecutionStage') {
            console.log('insideProjectExecutionStageForm')
            ProjectClosureForm(projectId);
        }

    }
}


document.addEventListener("DOMContentLoaded", function () {
    var labels = document.getElementsByTagName("label");
    for (var i = 0; i < labels.length; i++) {
        // Check if the label contains the text "entries per page"
        if (labels[i].textContent.includes("entries per page")) {
            // Hide the label
            labels[i].style.display = "none";
        }
    }
});




function PreSalesprefillForm(data,leaddate) {
    console.log("insidePrefill", data);
    console.log(developerData);

    data.POCdevelopers.forEach(val => {
        console.log(val.name);
        console.log(val.email);
    })


    const form = document.querySelector('form.stage1');
    if (!form) {
        console.error('Form with class "stage1" not found');
        return;
    }

    if (data.status) {
        form.querySelector('#PresaleStatus').value = data.status;
    }
    form.querySelector('#project_leaddate').value = leaddate;
    form.querySelector('#OverallStageStatus').value = data.OverallStageStatus;
    const comments = data.comments || [];
    comments.forEach(comment => {
        addComment();
        const lastCommentElement = form.querySelector('#commentsContainer > div:last-child');
        if (lastCommentElement) {
            const dateInput = lastCommentElement.querySelector('input[type="date"]');
            if (dateInput) dateInput.value = comment.date;
            const textInput = lastCommentElement.querySelector('input[type="text"]');
            if (textInput) textInput.value = comment.comment;
        }
    });

    const developers = data.POCdevelopers || [];
    developers.forEach(developer => {
        addPOCDeveloper();
        const lastDeveloperElement = form.querySelector('#POCDevelopersContainer > div:last-child');
        if (lastDeveloperElement) {
            const nameInput = lastDeveloperElement.querySelector('input[type="text"]');
            if (nameInput) nameInput.value = developer.name;
            const emailInput = lastDeveloperElement.querySelector('input[type="email"]');
            if (emailInput) emailInput.value = developer.email;
        }
    });

    const checklist = data.checklist || [];
    checklist.forEach(item => {
        const id = item.id;
        const engagement = item.engagement;
        const comment = item.comment;
        const engagementInput = form.querySelector(`input[name="engagement-${id}"][value="${engagement}"]`);
        if (engagementInput) {
            engagementInput.checked = true;
            if (engagement === 'yes') {
                const yesCommentElement = form.querySelector(`#yes-comment-${id}`);
                if (yesCommentElement) {
                    yesCommentElement.classList.remove('hidden');
                    const yesCommentInput = yesCommentElement.querySelector('input');
                    if (yesCommentInput) yesCommentInput.value = comment;
                }
            } else if (engagement === 'no') {
                const noCommentElement = form.querySelector(`#no-comment-${id}`);
                if (noCommentElement) {
                    noCommentElement.classList.remove('hidden');
                    const noCommentInput = noCommentElement.querySelector('input');
                    if (noCommentInput) noCommentInput.value = comment;
                }
            }
        }
    });
}
function PresalesFormrenderChecklistItems() {
    const checklistContainer = document.getElementById('checklist-items');
    checklistItems.forEach((item, index) => {
        const checklistElement = document.createElement('div');
        checklistElement.classList.add('checklist-item', 'p-4', 'bg-white', 'rounded-md', 'shadow-sm');
        checklistElement.setAttribute('data-id', index + 1);
        checklistElement.innerHTML = `
            <label class="block font-medium text-gray-700 mb-2">${index + 1}. ${item}</label>
            <div class="flex space-x-4 mb-2">
                <label class="flex items-center">
                    <input type="radio" name="engagement-${index + 1}" value="yes" onchange="handleRadioChange(event, ${index + 1},'stage1')" class="mr-2"> Yes
                </label>
                <label class="flex items-center">
                    <input type="radio" name="engagement-${index + 1}" value="no" onchange="handleRadioChange(event, ${index + 1},'stage1')" class="mr-2"> No
                </label>
            </div>
            <div id="yes-comment-${index + 1}" class="comment hidden mt-2">
                <input type="text" placeholder="Comment" class="border p-2 w-full rounded-md">
            </div>
            <div id="no-comment-${index + 1}" class="comment hidden mt-2">
                <input type="text" placeholder="Why not?" class="border p-2 w-full rounded-md">
            </div>
        `;
        checklistContainer.appendChild(checklistElement);
    });
}

function ProjectInitiationForm(projectId) {
    document.getElementById('ProjectInitiationPopUp').classList.remove('hidden');
    document.getElementById('ListProjectTable').classList.add('hidden');
    domo.get('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId)
        .then(data => {
            console.log(data);
            ProjectInitiationprefillForm(data.content.ProjectInitiationData, projectId,data.content.projectLeadDate);
            console.log(data.content);
        })

}
function ProjectInitiationcollectFormData() {
    let ProjectInitiationFormData = {
        StageName: "ProjectInitiationStage",
        status: "",
        comments: [],
        resources: [],
        checklist: [],
        Timeline: {
            value: "",
            unit: ""
        },
        ProposedStartDate: "",
        ProposedEndDate: "",
        SOWSigned: "",
        OverallStageStatus: "",
        completedDate:"",
        daysFromLeadToCurrent:""

    };

    let form = document.getElementById('Projectinitationform');
    if (!form) {
        console.error('Form with ID "Projectinitationform" not found.');
        return;
    }

    let leaddate = form.querySelector('#project_leaddate').value

    let overallStageStatus = form.elements['ProjectinitationOverallStageStatus'].value;
    ProjectInitiationFormData.OverallStageStatus = overallStageStatus;

    ProjectInitiationFormData.Timeline.value = form.elements['TimelineValue'].value;
    ProjectInitiationFormData.Timeline.unit = form.elements['TimelineUnit'].value;

    ProjectInitiationFormData.ProposedStartDate = form.elements['ProposedStartDate'].value;
    ProjectInitiationFormData.ProposedEndDate = form.elements['ProposedEndDate'].value;

    ProjectInitiationFormData.SOWSigned = form.elements['SOWSigned'].value;

    const commentsContainer = form.querySelector('#commentsContainer');
    if (!commentsContainer) {
        console.error('Comments container with ID "commentsContainer" not found.');
        return;
    }

    const commentElements = commentsContainer.querySelectorAll('div.flex');
    commentElements.forEach((commentElement) => {
        const date = commentElement.querySelector('input[type="date"]').value;
        const comment = commentElement.querySelector('input[type="text"]').value;
        if (comment.trim() !== "") {
            ProjectInitiationFormData.comments.push({ date, comment });
        }
    });

    const developersContainer = document.getElementById('ResourcesContainer');
    const developerElements = developersContainer.querySelectorAll('div.flex');

    developerElements.forEach((developerElement) => {
        const name = developerElement.querySelector('input[type="text"]').value;
        const email = developerElement.querySelector('input[type="email"]').value;
        ProjectInitiationFormData.resources.push({ name, email });
    });

    ProjectInitiationFormData.NumberOfResources = ProjectInitiationFormData.resources.length;

    function getDaysFromLeadToCurrent(leaddateValue) {
        let leaddate = new Date(leaddateValue);
        let currentDate = new Date();
        let differenceInTime = currentDate - leaddate;
        let differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

        return differenceInDays;
    }
    let leaddateValue = document.querySelector('#project_leaddate').value;
    let daysFromLeadToCurrent = getDaysFromLeadToCurrent(leaddateValue);

    ProjectInitiationFormData.completedDate = new Date().toISOString().split('T')[0];
    ProjectInitiationFormData.daysFromLeadToCurrent = daysFromLeadToCurrent;

    let checklistItems = form.querySelectorAll('.checklist-item');
    checklistItems.forEach(item => {
        let checklistId = item.dataset.id;
        let engagement = item.querySelector('input[type="radio"]:checked') ? item.querySelector('input[type="radio"]:checked').value : "";
        let comment = "";
        if (engagement === "yes") {
            comment = item.querySelector(`#yes-comment-${checklistId} input`).value;
        } else if (engagement === "no") {
            comment = item.querySelector(`#no-comment-${checklistId} input`).value;
        }
        ProjectInitiationFormData.checklist.push({
            id: checklistId,
            stage2: engagement,
            comment: comment
        });
    });

    console.log(ProjectInitiationFormData);


    const projectId = form.querySelector('#project_id').value;

    domo.get('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId)
        .then(existingData => {
            const updatedDocument = existingData;
            const stage1check = JSON.parse(updatedDocument.content.PreSalesData)
            const stage3check = JSON.parse(updatedDocument.content.ProjectExecutionData)
            const stage4check = JSON.parse(updatedDocument.content.ProjectClosureData)

            if (stage1check.OverallStageStatus === "Completed" && overallStageStatus === "Completed" && stage3check.OverallStageStatus === "Completed" && stage4check.OverallStageStatus === "Completed" === "Completed") {
                if (overallStageStatus === "Completed") {
                    console.log(JSON.parse(updatedDocument.content.ProjectInitiationData))
                    updatedDocument.content.ProjectOverallStatus = 'Completed'
                    updatedDocument.content.ProjectInitiationStatus = 'Completed'
                    
                    updatedDocument.content.ProjectInitiationData = JSON.stringify(ProjectInitiationFormData);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }
            }
            else {
                if (overallStageStatus === "Completed") {
                    console.log(JSON.parse(updatedDocument.content.ProjectInitiationData))
                    const stage3data = JSON.parse(updatedDocument.content.ProjectExecutionData)
                    stage3data.OverallStageStatus = 'Active'
                    updatedDocument.content.ProjectOverallStatus = 'Active'
                    updatedDocument.content.ProjectInitiationStatus = 'Completed'
                    updatedDocument.content.ProjectExecutionStatus = 'Active'
                    updatedDocument.content.ProjectInitiationData = JSON.stringify(ProjectInitiationFormData);
                    updatedDocument.content.ProjectExecutionData = JSON.stringify(stage3data);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }
                if (overallStageStatus === "Active") {
                    console.log(JSON.parse(updatedDocument.content.ProjectInitiationData))
                    const stage3data = JSON.parse(updatedDocument.content.ProjectExecutionData)
                    const stage4data = JSON.parse(updatedDocument.content.ProjectClosureData)
                    stage3data.OverallStageStatus = 'Not Started'
                    stage4data.OverallStageStatus = 'Not Started'
                    updatedDocument.content.ProjectOverallStatus = 'Active'
                     updatedDocument.content.ProjectInitiationStatus = 'Active'
                     
                    updatedDocument.content.ProjectInitiationData = JSON.stringify(ProjectInitiationFormData);
                    updatedDocument.content.ProjectExecutionData = JSON.stringify(stage3data);
                    updatedDocument.content.ProjectClosureData = JSON.stringify(stage4data);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }

            }

        })
        .then(response => {
            console.log('Document updated successfully:', response);
            showNotification('Project Initiation Stage Updated Successfully.', 'green')
            form.reset()

        })
        .catch(error => {
            console.error('Error updating document:', error);
            showNotification('Error updating document', 'red')
        });
}

function ProjectInitiationprefillForm(dataa, projectId,leaddate) {
    console.log("Prefill function called with data:", dataa, projectId);
    const data = JSON.parse(dataa);

    if (!data) {
        console.error("No data provided for prefill");
        return;
    }

    const form = document.querySelector('#Projectinitationform');
    if (!form) {
        console.error('Form with id "Projectinitationform" not found');
        return;
    }

    form.querySelector('#project_id').value = projectId;
    form.querySelector('#stageName').value = data.StageName || '';

    form.querySelector('#ProjectinitationOverallStageStatus').value = data.OverallStageStatus || 'Active';

    if (data.Timeline) {
        console.log(data.Timeline.value);
        form.querySelector('#TimelineValue').value = data.Timeline.value || '0';
        form.querySelector('#TimelineUnit').value = data.Timeline.unit || 'Days'; // Adjusted to 'Days' based on your data structure
    } else {
        form.querySelector('#TimelineValue').value = '0';
        form.querySelector('#TimelineUnit').value = 'Days'; // Default to 'Days' if Timeline data is not provided
    }

    form.querySelector('#ProposedStartDate').value = data.ProposedStartDate || '';
    form.querySelector('#ProposedEndDate').value = data.ProposedEndDate || '';
    form.querySelector('#project_leaddate').value = leaddate;

    form.querySelector('#SOWSigned').value = data.SOWSigned || 'No';


    const ResourcesContainer = document.getElementById('ResourcesContainer');
    ResourcesContainer.innerHTML = ''; // Clear existing content

    const resources = data.resources || [];
    resources.forEach(resource => {
        const ResourcesElement = document.createElement('div');
        ResourcesElement.classList.add('flex', 'space-x-4', 'mt-2');
        ResourcesElement.innerHTML = `
            <input type="text" placeholder="Resources Name" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[50%] text-2xl p-2 h-auto rounded-md   sm:text-sm" value="${resource.name}" oninput="window.autocomplete(this)" required>
            <input type="email" placeholder="Resources Email" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-[50%] text-2xl p-2 h-auto rounded-md   sm:text-sm" value="${resource.email}" required readonly>
            <ul class="autocomplete-list"></ul>
        `;
        ResourcesContainer.appendChild(ResourcesElement);
    });


    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = '';
    console.log(data.checklist);

    const comments = data.comments;
    if (Array.isArray(comments) && comments.length > 0) {
        comments.forEach(comment => {
            addCommentBox('stage2');
            const lastCommentElement = form.querySelector('#commentsContainer > div:last-child');
            if (lastCommentElement) {
                const dateInput = lastCommentElement.querySelector('input[type="date"]');
                if (dateInput) dateInput.value = comment.date;
                const textInput = lastCommentElement.querySelector('input[type="text"]');
                if (textInput) textInput.value = comment.comment;
            }
        });
    }
    const checklist = data.checklist || [];
    if (Array.isArray(checklist) && checklist.length > 0) {
        checklist.forEach(item => {
            const id = item.id;
            const engagement = item.stage2;
            const comment = item.comment;
            const engagementInput = form.querySelector(`input[name="stage2-${id}"][value="${engagement}"]`);
            if (engagementInput) {
                engagementInput.checked = true;
                if (engagement === 'yes') {
                    const yesCommentElement = form.querySelector(`#yes-comment-${id}`);
                    if (yesCommentElement) {
                        yesCommentElement.classList.remove('hidden');
                        const yesCommentInput = yesCommentElement.querySelector('input');
                        if (yesCommentInput) yesCommentInput.value = comment;
                    }
                } else if (engagement === 'no') {
                    const noCommentElement = form.querySelector(`#no-comment-${id}`);
                    if (noCommentElement) {
                        noCommentElement.classList.remove('hidden');
                        const noCommentInput = noCommentElement.querySelector('input');
                        if (noCommentInput) noCommentInput.value = comment;
                    }
                }
            }
        });
    }

    console.log("Form prefilled successfully.");

}

function ProjectExecutionForm(projectId) {
    document.getElementById('ProjectExecutionPopUp').classList.remove('hidden');
    document.getElementById('ListProjectTable').classList.add('hidden');
    domo.get('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId)
        .then(data => {
            console.log(data);
            ProjectExecutionprefillForm(data.content.ProjectExecutionData, projectId,data.content.projectLeadDate);
            console.log(data.content);
        })

}

function ProjectExecutionprefillForm(dataa, projectId,leaddate) {
    console.log('Inside ProjectExecutionprefillForm')
    const data = JSON.parse(dataa);
    const form = document.querySelector('#ProjectExecutionform');
    if (!form) {
        console.error('Form with id "Projectinitationform" not found');
        return;
    }
    form.querySelector('#project_id').value = projectId;
    form.querySelector('#stageName').value = data.StageName || '';

    form.querySelector('#ActualStartDate').value = data.ActualStartDate;
    form.querySelector('#ActualEndDate').value = data.ActualEndDate;
    form.querySelector('#PercentComplete').value = data.PercentComplete;
    form.querySelector('#DelayRisk').value = data.DelayRisk || '';
    form.querySelector('#ProjectExecutionOverallStageStatus').value = data.OverallStageStatus;

    form.querySelector('#project_leaddate').value = leaddate;

    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = '';
    console.log(data.checklist)

    const comments = data.comments;
    comments.forEach(comment => {
        addCommentBox('stage3');
        const lastCommentElement = form.querySelector('#commentsContainer > div:last-child');
        if (lastCommentElement) {
            const dateInput = lastCommentElement.querySelector('input[type="date"]');
            if (dateInput) {
                dateInput.value = comment.date;
                dateInput.class = comment.date;
            }
            const textInput = lastCommentElement.querySelector('input[type="text"]');
            if (textInput) textInput.value = comment.comment;
        }
    });

    const checklist = data.checklist || [];
    checklist.forEach(item => {
        const id = item.id;
        const engagement = item.stage3;
        const comment = item.comment;
        const engagementInput = form.querySelector(`input[name="stage3-${id}"][value="${engagement}"]`);
        if (engagementInput) {
            engagementInput.checked = true;
            if (engagement === 'yes') {
                const yesCommentElement = form.querySelector(`#yes-comment-${id}`);
                if (yesCommentElement) {
                    yesCommentElement.classList.remove('hidden');
                    const yesCommentInput = yesCommentElement.querySelector('input');
                    if (yesCommentInput) yesCommentInput.value = comment;
                }
            } else if (engagement === 'no') {
                const noCommentElement = form.querySelector(`#no-comment-${id}`);
                if (noCommentElement) {
                    noCommentElement.classList.remove('hidden');
                    const noCommentInput = noCommentElement.querySelector('input');
                    if (noCommentInput) noCommentInput.value = comment;
                }
            }
        }
    });

}

function ProjectExecutionCollectFromData() {
    let ProjectExecutionFormData = {
        StageName: "ProjectExecutionStage",
        comments: [],
        checklist: [],
        ActualStartDate: "",
        ActualEndDate: "",
        PercentComplete: "",
        DelayRisk: "",
        OverallStageStatus: "",
        completedDate:"",
        daysFromLeadToCurrent:""

    };

    let form = document.getElementById('ProjectExecutionform');
    if (!form) {
        console.error('Form with ID "ProjectExecutionform" not found.');
        return;
    }

    let overallStageStatus = form.elements['ProjectExecutionOverallStageStatus'].value;
    ProjectExecutionFormData.OverallStageStatus = overallStageStatus;

    let leaddate = form.querySelector('#project_leaddate').value

    console.log(leaddate)

    ProjectExecutionFormData.ActualStartDate = form.elements['ActualStartDate'].value;
    ProjectExecutionFormData.ActualEndDate = form.elements['ActualEndDate'].value;

    ProjectExecutionFormData.PercentComplete = form.elements['PercentComplete'].value;
    ProjectExecutionFormData.DelayRisk = form.elements['DelayRisk'].value;

    const commentsContainer = form.querySelector('#commentsContainer');
    if (!commentsContainer) {
        console.error('Comments container with ID "commentsContainer" not found.');
        return;
    }
    const commentElements = commentsContainer.querySelectorAll('div.flex');
    commentElements.forEach((commentElement) => {
        const date = commentElement.querySelector('input[type="date"]').value;
        const comment = commentElement.querySelector('input[type="text"]').value;
        if (comment.trim() !== "") {
            ProjectExecutionFormData.comments.push({ date, comment });
        }
    });


    let checklistItems = form.querySelectorAll('.checklist-item');
    checklistItems.forEach(item => {
        let checklistId = item.dataset.id;
        let engagement = item.querySelector('input[type="radio"]:checked') ? item.querySelector('input[type="radio"]:checked').value : "";
        let comment = "";
        if (engagement === "yes") {
            comment = item.querySelector(`#yes-comment-${checklistId} input`).value;
        } else if (engagement === "no") {
            comment = item.querySelector(`#no-comment-${checklistId} input`).value;
        }
        ProjectExecutionFormData.checklist.push({
            id: checklistId,
            stage3: engagement,
            comment: comment
        });
    });
    
    let currentDate = new Date();
    console.log(currentDate)
        
    function getDaysFromLeadToCurrent(leaddateValue) {
        let leaddate = new Date(leaddateValue);
        let currentDate = new Date();
        let differenceInTime = currentDate - leaddate;
        let differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

        return differenceInDays;
    }
    let leaddateValue = document.querySelector('#project_leaddate').value;
    let daysFromLeadToCurrent = getDaysFromLeadToCurrent(leaddateValue);

    ProjectExecutionFormData.completedDate = new Date().toISOString().split('T')[0];
    ProjectExecutionFormData.daysFromLeadToCurrent = daysFromLeadToCurrent;

    console.log(ProjectExecutionFormData);
    const projectId = form.querySelector('#project_id').value;

    domo.get('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId)
        .then(existingData => {
            const updatedDocument = existingData;
            const stage1check = JSON.parse(updatedDocument.content.PreSalesData)
            const stage2check = JSON.parse(updatedDocument.content.ProjectInitiationData)
            const stage4check = JSON.parse(updatedDocument.content.ProjectClosureData)

            if (stage1check.OverallStageStatus === "Completed" && overallStageStatus === "Completed" && stage2check.OverallStageStatus === "Completed" && stage4check.OverallStageStatus === "Completed" === "Completed") {
                if (overallStageStatus === "Completed") {
                    console.log(JSON.parse(updatedDocument.content.ProjectExecutionData))
                    updatedDocument.content.ProjectOverallStatus = 'Completed'
                     updatedDocument.content.ProjectExecutionStatus = 'Completed'
                    
                    updatedDocument.content.ProjectExecutionData = JSON.stringify(ProjectExecutionFormData);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }

            } else {
                if (overallStageStatus === "Completed") {
                    console.log(JSON.parse(updatedDocument.content.ProjectExecutionData))
                    const stage4data = JSON.parse(updatedDocument.content.ProjectClosureData)
                    stage4data.OverallStageStatus = 'Active'
                    updatedDocument.content.ProjectOverallStatus = 'Active'
                    updatedDocument.content.ProjectExecutionStatus = 'Completed'
                     updatedDocument.content.ProjectClosureStatus = 'Active'
                    updatedDocument.content.ProjectExecutionData = JSON.stringify(ProjectExecutionFormData);
                    updatedDocument.content.ProjectClosureData = JSON.stringify(stage4data);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }
                if (overallStageStatus === "Active") {
                    console.log(JSON.parse(updatedDocument.content.ProjectInitiationData))
                    const stage4data = JSON.parse(updatedDocument.content.ProjectExecutionData)
                    stage4data.OverallStageStatus = 'Not Started'
                    updatedDocument.content.ProjectOverallStatus = 'Active'
                 
                    updatedDocument.content.ProjectExecutionData = JSON.stringify(ProjectExecutionFormData);
                    updatedDocument.content.ProjectClosureData = JSON.stringify(stage4data);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }

            }

        })
        .then(response => {
            showNotification('Project Execution Stage Updated Successfully.', 'green')
            form.reset()
            console.log('Document updated successfully:', response);
        })
        .catch(error => {
            showNotification('Error updating document', 'red')
            console.error('Error updating document:', error);
        });

}

function ProjectClosureForm(projectId) {
    document.getElementById('ProjectClosurePopUp').classList.remove('hidden');
    document.getElementById('ListProjectTable').classList.add('hidden');
    domo.get('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId)
        .then(data => {
            console.log(data);
            ProjectClosureprefillForm(data.content.ProjectClosureData, projectId,data.content.projectLeadDate);
            console.log(data.content);
        })

}

function ProjectClosureprefillForm(dataa, projectId,leaddate) {
    console.log('Inside ProjectClosureformprefillForm')
    const data = JSON.parse(dataa);
    const form = document.querySelector('#ProjectClosureform');
    if (!form) {
        console.error('Form with id "ProjectClosureform" not found');
        return;
    }
    form.querySelector('#project_id').value = projectId;
    form.querySelector('#stageName').value = data.StageName || '';

    form.querySelector('#CompletionDate').value = data.CompletionDate || '';
    form.querySelector('#PaymentReceived').value = data.PaymentReceived;
    form.querySelector('#ProjectDocumentation').value = data.ProjectDocumentation;
    form.querySelector('#ClientAcceptance').value = data.ClientAcceptance || '';
    form.querySelector('#ProjectClosureOverallStageStatus').value = data.OverallStageStatus;
    form.querySelector('#project_leaddate').value = leaddate;

    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = '';
    console.log(data.checklist)

    const comments = data.comments;
    comments.forEach(comment => {
        addCommentBox('stage4');
        const lastCommentElement = form.querySelector('#commentsContainer > div:last-child');
        if (lastCommentElement) {
            const dateInput = lastCommentElement.querySelector('input[type="date"]');
            if (dateInput) {
                dateInput.value = comment.date;
                dateInput.class = "border border-gray-200 outline-[#6E2F8E] mt-1  block w-[30%] text-2xl p-2 h-auto rounded-md   sm:text-sm";
            }
            const textInput = lastCommentElement.querySelector('input[type="text"]');
            if (textInput) {
                textInput.value = comment.comment;
                textInput.class = "border border-gray-200 outline-[#6E2F8E] mt-1  block w-[70%] text-2xl p-2 h-auto rounded-md   sm:text-sm";
            }
        }
    });

    const checklist = data.checklist || [];
    checklist.forEach(item => {
        const id = item.id;
        const engagement = item.stage4;
        const comment = item.comment;
        const engagementInput = form.querySelector(`input[name="stage4-${id}"][value="${engagement}"]`);
        if (engagementInput) {
            engagementInput.checked = true;
            if (engagement === 'yes') {
                const yesCommentElement = form.querySelector(`#yes-comment-${id}`);
                if (yesCommentElement) {
                    yesCommentElement.classList.remove('hidden');
                    const yesCommentInput = yesCommentElement.querySelector('input');
                    if (yesCommentInput) yesCommentInput.value = comment;
                }
            } else if (engagement === 'no') {
                const noCommentElement = form.querySelector(`#no-comment-${id}`);
                if (noCommentElement) {
                    noCommentElement.classList.remove('hidden');
                    const noCommentInput = noCommentElement.querySelector('input');
                    if (noCommentInput) noCommentInput.value = comment;
                }
            }
        }
    });
}


function ProjectClosureCollectFromData() {
    let ProjectClosureFormData = {
        StageName: "ProjectClosureStage",
        comments: [],
        checklist: [],
        ClientAcceptance: "",
        PaymentReceived: "",
        ProjectDocumentation: "",
        CompletionDate: "",
        OverallStageStatus: "",
        completedDate:"",
        daysFromLeadToCurrent:""

    };

    let form = document.getElementById('ProjectClosureform');
    if (!form) {
        console.error('Form with ID "ProjectExecutionform" not found.');
        return;
    }

    let leaddate = form.querySelector('#project_leaddate').value

    let overallStageStatus = form.elements['ProjectClosureOverallStageStatus'].value;
    ProjectClosureFormData.OverallStageStatus = overallStageStatus;

    ProjectClosureFormData.ProjectDocumentation = form.elements['ProjectDocumentation'].value;
    ProjectClosureFormData.ClientAcceptance = form.elements['ClientAcceptance'].value;

    ProjectClosureFormData.PaymentReceived = form.elements['PaymentReceived'].value;
    ProjectClosureFormData.CompletionDate = form.elements['CompletionDate'].value;

    const commentsContainer = form.querySelector('#commentsContainer');
    if (!commentsContainer) {
        console.error('Comments container with ID "commentsContainer" not found.');
        return;
    }
    const commentElements = commentsContainer.querySelectorAll('div.flex');
    commentElements.forEach((commentElement) => {
        const date = commentElement.querySelector('input[type="date"]').value;
        const comment = commentElement.querySelector('input[type="text"]').value;
        if (comment.trim() !== "") {
            ProjectClosureFormData.comments.push({ date, comment });
        }
    });


    let checklistItems = form.querySelectorAll('.checklist-item');
    checklistItems.forEach(item => {
        let checklistId = item.dataset.id;
        let engagement = item.querySelector('input[type="radio"]:checked') ? item.querySelector('input[type="radio"]:checked').value : "";
        let comment = "";
        if (engagement === "yes") {
            comment = item.querySelector(`#yes-comment-${checklistId} input`).value;
        } else if (engagement === "no") {
            comment = item.querySelector(`#no-comment-${checklistId} input`).value;
        }
        ProjectClosureFormData.checklist.push({
            id: checklistId,
            stage4: engagement,
            comment: comment
        });
    });
        
    function getDaysFromLeadToCurrent(leaddateValue) {
        let leaddate = new Date(leaddateValue);
        let currentDate = new Date();
        let differenceInTime = currentDate - leaddate;
        let differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

        return differenceInDays;
    }
    let leaddateValue = document.querySelector('#project_leaddate').value;
    let daysFromLeadToCurrent = getDaysFromLeadToCurrent(leaddateValue);

    ProjectClosureFormData.completedDate = new Date().toISOString().split('T')[0];
    ProjectClosureFormData.daysFromLeadToCurrent = daysFromLeadToCurrent;

    console.log(ProjectClosureFormData);
    const projectId = form.querySelector('#project_id').value;

    domo.get('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId)
        .then(existingData => {
            const updatedDocument = existingData;

            const stage1check = JSON.parse(updatedDocument.content.PreSalesData)
            const stage2check = JSON.parse(updatedDocument.content.ProjectInitiationData)
            const stage3check = JSON.parse(updatedDocument.content.ProjectExecutionData)
            console.log(updatedDocument.content.ProjectOverallStatus)

            if (stage1check.OverallStageStatus === "Completed" && overallStageStatus === "Completed" && stage2check.OverallStageStatus === "Completed" && stage3check.OverallStageStatus === "Completed") {
                if (overallStageStatus === "Completed") {
                    console.log("inside last page")
                    updatedDocument.content.ProjectOverallStatus = 'Completed'
                    updatedDocument.content.ProjectClosureStatus = 'Completed'
                    updatedDocument.content.ProjectClosureData = JSON.stringify(ProjectClosureFormData);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }
            }
            else {
                if (overallStageStatus === "Completed") {
                    updatedDocument.content.ProjectOverallStatus = 'Active'
                    updatedDocument.content.ProjectClosureStatus = 'Completed'
                    updatedDocument.content.ProjectClosureData = JSON.stringify(ProjectClosureFormData);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }
                if (overallStageStatus === "Active") {
                    updatedDocument.content.ProjectOverallStatus = 'Active'
                    updatedDocument.content.ProjectClosureStatus = 'Active'
                    updatedDocument.content.ProjectClosureData = JSON.stringify(ProjectClosureFormData);
                    return domo.put('/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/' + projectId, updatedDocument);
                }
            }
        })
        .then(response => {
            showNotification('Project Closure Stage Updated Successfully.', 'green')
            form.reset()
            console.log('Document updated successfully:', response);
        })
        .catch(error => {
            showNotification('Error updating document', 'red')
            console.error('Error updating document:', error);
        });

}

function closeProject(projectId) {
    domo.get(`/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/${projectId}`)
        .then(data => {
            const project = data;
            project.content.ProjectOverallStatus = "Closed";

            domo.put(`/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/${projectId}`, project)
                .then(response => {
                    console.log('Project closed successfully:', response);
                    showNotification('Project status updated to Closed.', 'red')
                    location.reload();
                })
                .catch(error => {
                    console.error('Error updating project status:', error);
                    showNotification('Failed to update the project status', 'red')
                });
        })
        .catch(error => {
            console.error('Error fetching project data:', error);
            showNotification('Failed to fetch project data.', 'red')
            //alert('Failed to fetch project data');
        });
}
