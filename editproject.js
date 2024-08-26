function showHoverImg(element) {
    const defaultImg = element.querySelector('[id^="default-img"]');
    const hoverImg = element.querySelector('[id^="hover-img"]');
    defaultImg.style.display = 'none';
    hoverImg.style.display = 'block';
}

function hideHoverImg(element) {
    const defaultImg = element.querySelector('[id^="default-img"]');
    const hoverImg = element.querySelector('[id^="hover-img"]');
    defaultImg.style.display = 'block';
    hoverImg.style.display = 'none';
}
document.addEventListener('DOMContentLoaded', function () {

    
    const queryString = window.location.search;
    const id = queryString.substring(1);
    console.log(id);
    const projectForm = document.getElementById('project-form');
    const projectId = id;

    let domoContactCount = 0;
    let clientContactCount = 0;

    let developerData = [];

    let domoContactData = [];

    domo.get('/data/v1/emp_ds')
        .then(data => {
            developerData = data.filter(dev => dev.emp_name);
        })
        .catch(error => {
            console.error('Error fetching developer data:', error);
        });

    domo.get('/data/v1/domo_contact')
        .then(data => {
            console.log('Domo contact data loaded:', data);
            domoContactData = data;
        })
        .catch(error => {
            console.error('Error fetching domo contact data:', error);
        })
        .finally(() => {
            setupEventListeners();
        });

    function setupEventListeners() {
        const accountManagerInput = document.getElementById('gwc-account-manager');
        const projectManagerInput = document.getElementById('gwc-project-manager');
        const accountManagerSuggestions = document.getElementById('account-manager-suggestions');
        const projectManagerSuggestions = document.getElementById('project-manager-suggestions');

        accountManagerInput.addEventListener('input', function () {
            showSuggestions(accountManagerInput, accountManagerSuggestions, 'accountManager');
        });

        projectManagerInput.addEventListener('input', function () {
            showSuggestions(projectManagerInput, projectManagerSuggestions, 'projectManager');
        });

        function showSuggestions(inputElement, suggestionListElement, type) {
            const query = inputElement.value.toLowerCase();
            suggestionListElement.innerHTML = '';
            suggestionListElement.classList.add('hidden');

            if (query.length > 0) {
                const filteredData = developerData.filter(dev => dev.emp_name && dev.emp_name.toLowerCase().includes(query));
                if (filteredData.length > 0) {
                    filteredData.forEach(dev => {
                        const suggestionItem = document.createElement('li');
                        suggestionItem.textContent = dev.emp_name;
                        suggestionItem.classList.add('p-2', 'cursor-pointer', 'hover:bg-gray-200');
                        suggestionItem.dataset.empId = dev.emp_id;
                        suggestionItem.dataset.empMail = dev.emp_mail;

                        suggestionItem.addEventListener('click', function () {
                            inputElement.value = dev.emp_name;
                            if (type === 'accountManager') {
                                selectedAccountManager = dev;
                            } else if (type === 'projectManager') {
                                selectedProjectManager = dev;
                            }
                            console.log({
                                emp_id: dev.emp_id,
                                emp_mail: dev.emp_mail,
                                emp_name: dev.emp_name
                            });
                            suggestionListElement.innerHTML = '';
                            suggestionListElement.classList.add('hidden');
                        });

                        suggestionListElement.appendChild(suggestionItem);
                    });
                    suggestionListElement.classList.remove('hidden');
                }
            }
        }

        function domoShowSuggestions(input, suggestionsBox, inputId) {
            const value = input.value.toLowerCase();
            const filteredSuggestions = domoContactData.filter(contact => contact.domusername && contact.domusername.toLowerCase().includes(value));
            suggestionsBox.innerHTML = '';
            suggestionsBox.classList.remove('hidden');
            filteredSuggestions.forEach(contact => {
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = contact.domusername;
                suggestionItem.className = 'cursor-pointer p-2 hover:bg-gray-200';
                suggestionItem.addEventListener('click', () => {
                    input.value = contact.domusername;
                    document.getElementById(`domo-contact-email-${inputId}`).value = contact.domouseremail;
                    suggestionsBox.classList.add('hidden');
                    selectedDomoContact = contact;
                });
                suggestionsBox.appendChild(suggestionItem);
            });
        }

        function addDomoContactEventListeners(contactId) {
            const contactPersonInput = document.getElementById(`domo-contact-person-${contactId}`);
            const suggestionsBox = document.getElementById(`domo-contact-suggestions-${contactId}`);

            contactPersonInput.addEventListener('input', () => {
                domoShowSuggestions(contactPersonInput, suggestionsBox, contactId);
            });

            document.addEventListener('click', (event) => {
                if (!suggestionsBox.contains(event.target) && event.target !== contactPersonInput) {
                    suggestionsBox.classList.add('hidden');
                }
            });
        }

        const addDomoContactButton = document.getElementById('add-domo-contact');

        addDomoContactButton.addEventListener('click', function adddomocount() {
            const domoContactsSection = document.getElementById('domo-contacts-section');

            const domoContactGroup = document.createElement('div');
            domoContactGroup.className = 'domo-contact-group border-t border-gray-200 pt-5';
            domoContactGroup.innerHTML = `
                    <h3 class="text-md font-semibold leading-6 text-gray-900 mb-4">DOMO Contact ${++domoContactCount}</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label for="domo-contact-person-${domoContactCount}" class="text-md block text-sm font-medium text-gray-700">DOMO Contact Person</label>
                            <input type="text" id="domo-contact-person-${domoContactCount}" name="domo-contact-person-${domoContactCount}" class="border border-gray-200 outline-[#6E2F8E] mt-1 block w-full text-md p-2 h-auto rounded-md sm:text-sm" required>
                            <ul id="domo-contact-suggestions-${domoContactCount}" class="hidden border border-gray-200 mt-1 bg-white rounded-md shadow-lg"></ul>
                        </div>
                        <div>
                            <label for="domo-contact-email-${domoContactCount}" class="text-md block text-sm font-medium text-gray-700">DOMO Contact Email</label>
                            <input type="email" id="domo-contact-email-${domoContactCount}" name="domo-contact-email-${domoContactCount}" class="border border-gray-200 outline-[#6E2F8E] mt-1 block w-full text-md p-2 h-auto rounded-md sm:text-sm" required>
                        </div>
                    </div>
                `;
            domoContactsSection.appendChild(domoContactGroup);
            addDomoContactEventListeners(domoContactCount);
        });


        const clientContactInput = document.getElementById('client-contact-person');
        const clientEmailInput = document.getElementById('client-contact-email');

        clientContactInput.addEventListener('input', function () {
            showClientSuggestions(clientContactInput);
        });

        function showClientSuggestions(inputElement) {
            const query = inputElement.value.toLowerCase();
            const filteredData = developerData.filter(dev => dev.emp_name && dev.emp_name.toLowerCase().includes(query));
            if (filteredData.length > 0) {
                const selectedClient = filteredData[0];
                clientContactInput.value = selectedClient.emp_name;

                clientEmailInput.value = selectedClient.emp_mail || '';
            }
        }
    }

domo.get(`/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/${projectId}`)
.then(data => {
    const project = data.content;
    document.getElementById('Project_name').textContent = "Edit Prospect - " + project.projectName;

    document.getElementById('project-name').value = project.projectName;
    document.getElementById('client-name').value = project.clientName;
    document.getElementById('industry').value = project.industry;
    document.getElementById('gwc-account-manager').value = project.gwcAccountManager;
    document.getElementById('gwc-project-manager').value = project.gwcProjectManager;
    document.getElementById('project-date').value = project.projectLeadDate;
    document.getElementById('innovation-project').value = project.innovationProject;
    document.getElementById('project-description').value = project.projectDescription;

    const domoContactsSection = document.getElementById('domo-contacts-section');
    domoContactsSection.innerHTML = '';
    const domoContacts = JSON.parse(project.domoContacts);
    domoContactCount = domoContacts.length;
    domoContacts.forEach((contact, index) => {
        addDomoContact(index + 1, contact.person, contact.email);
    });

    const clientContactsSection = document.getElementById('client-contacts-section');
    clientContactsSection.innerHTML = '';
    const clientContacts = JSON.parse(project.clientContacts);
    clientContactCount = clientContacts.length;
    clientContacts.forEach((contact, index) => {
        addClientContact(index + 1, contact.person, contact.email, contact.phone);
    });
})
.catch(error => {
    console.error('Error fetching data:', error);
});

function domoShowSuggestions(input, suggestionsBox, inputId) {
const value = input.value.toLowerCase();
const filteredSuggestions = domoContactData.filter(contact => contact.domusername && contact.domusername.toLowerCase().includes(value));
suggestionsBox.innerHTML = '';
suggestionsBox.classList.remove('hidden');
filteredSuggestions.forEach(contact => {
    const suggestionItem = document.createElement('li');
    suggestionItem.textContent = contact.domusername;
    suggestionItem.className = 'cursor-pointer p-2 hover:bg-gray-200';
    suggestionItem.addEventListener('click', () => {
        input.value = contact.domusername;
        document.getElementById(`domo-contact-email-${inputId}`).value = contact.domouseremail;
        suggestionsBox.classList.add('hidden');
    });
    suggestionsBox.appendChild(suggestionItem);
});
}
function addDomoContactEventListeners(contactId) {
const contactPersonInput = document.getElementById(`domo-contact-person-${contactId}`);
const suggestionsBox = document.getElementById(`domo-contact-suggestions-${contactId}`);
contactPersonInput.addEventListener('input', () => {
    domoShowSuggestions(contactPersonInput, suggestionsBox, contactId);
});
document.addEventListener('click', (event) => {
    if (!suggestionsBox.contains(event.target) && event.target !== contactPersonInput) {
        suggestionsBox.classList.add('hidden');
    }
});
}

function addDomoContact(index, person = '', email = '') {
const domoContactsSection = document.getElementById('domo-contacts-section');
const domoContactGroup = document.createElement('div');
domoContactGroup.className = 'domo-contact-group border-t border-gray-200 pt-5';
domoContactGroup.innerHTML = `
    <h3 class="text-md font-semibold leading-6 text-gray-900 mb-4">DOMO Contact ${index}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
            <label for="domo-contact-person-${index}" class="text-md block text-sm font-medium text-gray-700">DOMO Contact Person</label>
            <input type="text" id="domo-contact-person-${index}" name="domo-contact-person-${index}" value="${person}" class="border border-gray-200 outline-[#6E2F8E] mt-1 block w-full text-md p-2 h-auto rounded-md sm:text-sm" required>
            <ul id="domo-contact-suggestions-${index}" class="hidden border border-gray-200 mt-1 bg-white rounded-md shadow-lg"></ul>
        </div>
        <div>
            <label for="domo-contact-email-${index}" class="text-md block text-sm font-medium text-gray-700">DOMO Contact Email</label>
            <input type="email" id="domo-contact-email-${index}" name="domo-contact-email-${index}" value="${email}" class="border border-gray-200 outline-[#6E2F8E] mt-1 block w-full text-md p-2 h-auto rounded-md sm:text-sm" required>
        </div>
    </div>
`;
domoContactsSection.appendChild(domoContactGroup);
addDomoContactEventListeners(index);
}

// Add client contact input fields
function addClientContact(index, person = '', email = '', phone = '') {
const clientContactsSection = document.getElementById('client-contacts-section');
const clientContactGroup = document.createElement('div');
clientContactGroup.className = 'client-contact-group border-t border-gray-200 pt-5';
clientContactGroup.innerHTML = `
    <h3 class="text-xl font-semibold leading-6 text-gray-900 mb-4">Client Contact ${index}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
            <label for="client-contact-person-${index}" class="text-xl block text-sm font-medium text-gray-700">Client Contact Person</label>
            <input type="text" id="client-contact-person-${index}" name="client-contact-person-${index}" value="${person}" class="border border-gray-200 outline-[#6E2F8E] mt-1 block w-full text-2xl p-2 h-auto rounded-md sm:text-sm">
        </div>
        <div>
            <label for="client-email-${index}" class="text-xl block text-sm font-medium text-gray-700">Client Email</label>
            <input type="email" id="client-email-${index}" name="client-email-${index}" value="${email}" class="border border-gray-200 outline-[#6E2F8E] mt-1 block w-full text-2xl p-2 h-auto rounded-md sm:text-sm">
        </div>
        <div>
            <label for="client-phone-${index}" class="text-xl block text-sm font-medium text-gray-700">Contact Mobile Number</label>
            <input type="text" id="client-phone-${index}" name="client-phone-${index}" value="${phone}" class="border border-gray-200 outline-[#6E2F8E] mt-1 block w-full text-2xl p-2 h-auto rounded-md sm:text-sm">
        </div>
    </div>
`;
clientContactsSection.appendChild(clientContactGroup);
}
document.getElementById('add-client-contact').addEventListener('click', () => {
    clientContactCount++;
    addClientContact(clientContactCount);
});
// Ensure at least one DOMO contact and one client contact are present
if (domoContactCount === 0) {
addDomoContact(1);
}
if (clientContactCount === 0) {
addClientContact(1);
}

// Handle form submission
projectForm.addEventListener('submit', function (event) {
event.preventDefault();
const formData = new FormData(projectForm);
const formDataObj = Object.fromEntries(formData.entries());
const domoContacts = [];
for (let i = 1; i <= domoContactCount; i++) {
    const domoContact = {
        person: formDataObj[`domo-contact-person-${i}`],
        email: formDataObj[`domo-contact-email-${i}`]
    };
    domoContacts.push(domoContact);
}
const clientContacts = [];
for (let i = 1; i <= clientContactCount; i++) {
    const clientContact = {
        person: formDataObj[`client-contact-person-${i}`],
        email: formDataObj[`client-email-${i}`],
        phone: formDataObj[`client-phone-${i}`]
    };
    clientContacts.push(clientContact);
}
domo.get(`/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/${projectId}`)
    .then(response => {
        const updatedDocument = response;
        updatedDocument.content.projectName = formDataObj['project-name'];
        updatedDocument.content.clientName = formDataObj['client-name'];
        updatedDocument.content.industry = formDataObj['industry'];
        updatedDocument.content.gwcAccountManager = formDataObj['gwc-account-manager'];
        updatedDocument.content.gwcProjectManager = formDataObj['gwc-project-manager'];
        updatedDocument.content.projectDescription = formDataObj['project-description'];
        updatedDocument.content.innovationProject = formDataObj['innovation-project'];
        updatedDocument.content.projectLeadDate = formDataObj['project-date'];
        updatedDocument.content.domoContacts = JSON.stringify(domoContacts);
        updatedDocument.content.clientContacts = JSON.stringify(clientContacts);
        console.log(updatedDocument)
        domo.put(`/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/${projectId}`, updatedDocument)
            .then(res => {
                console.log('Project updated successfully:', res);
                alert('Project updated successfully!');
                showNotification("Project updated successfully!", "green")
            })
            .catch(error => {
                console.error('Error updating project:', error);
                alert('Failed to update the project.');
                showNotification("Failed to update the project.", "red")
            });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch project data.');
    });
});

});




function showNotification(message, color) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    notificationMessage.textContent = message;
    notification.className = `fixed top-5 right-5 p-4 rounded shadow-lg transition-transform transform duration-300 ease-in-out bg-${color}-500 translate-y-10`;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('translate-y-0');
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('translate-y-0');
        notification.classList.add('translate-y-10');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 3000);
}
