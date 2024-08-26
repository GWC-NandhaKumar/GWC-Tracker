document.addEventListener('DOMContentLoaded', function() {
    

    let developerData = [];

    domo.get('/data/v1/emp_ds')
        .then(data => {
            developerData = data.filter(dev => dev.emp_name);
        })
        .catch(error => {
            console.error('Error fetching developer data:', error);
        });

        domo.get('/data/v1/domo_contact')
        .then(data => {
            console.log('Domo contact data loaded:', data); // For debugging
            domoContactData = data;
        })
        .catch(error => {
            console.error('Error fetching developer data:', error);
        });
    
        


    const accountManagerInput = document.getElementById('gwc-account-manager');
    const projectManagerInput = document.getElementById('gwc-project-manager');
    const accountManagerSuggestions = document.getElementById('account-manager-suggestions');
    const projectManagerSuggestions = document.getElementById('project-manager-suggestions');

    let selectedAccountManager = null;
    let selectedProjectManager = null;

    accountManagerInput.addEventListener('input', function() {
        showSuggestions(accountManagerInput, accountManagerSuggestions, 'accountManager');
    });

    projectManagerInput.addEventListener('input', function() {
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
                    
                    suggestionItem.addEventListener('click', function() {
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

    document.addEventListener('click', function(event) {
        if (!accountManagerSuggestions.contains(event.target) && event.target !== accountManagerInput) {
            accountManagerSuggestions.innerHTML = '';
            accountManagerSuggestions.classList.add('hidden');
        }
        if (!projectManagerSuggestions.contains(event.target) && event.target !== projectManagerInput) {
            projectManagerSuggestions.innerHTML = '';
            projectManagerSuggestions.classList.add('hidden');
        }
    });

    const addDomoContactButton = document.getElementById('add-domo-contact');
    const addClientContactButton = document.getElementById('add-client-contact');
    const projectForm = document.getElementById('project-form');

    let domoContactCount = 1;
    let clientContactCount = 1;
    let domoContactData = [];


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

    addDomoContactButton.addEventListener('click', function() {
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
    
    addDomoContactEventListeners(1);


    addClientContactButton.addEventListener('click', function() {
        const clientContactsSection = document.getElementById('client-contacts-section');

        const clientContactGroup = document.createElement('div');
        clientContactGroup.className = 'client-contact-group border-t border-gray-200 pt-5';
        clientContactGroup.innerHTML = `
            <h3 class="text-xl font-semibold leading-6 text-gray-900 mb-4">Client Contact ${++clientContactCount}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label for="client-contact-person-${clientContactCount}" class="text-xl block text-sm font-medium text-gray-700">Client Contact Person</label>
                    <input type="text" id="client-contact-person-${clientContactCount}" name="client-contact-person-${clientContactCount}" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-full text-2xl p-2 h-auto rounded-md   sm:text-sm">
                </div>
                <div>
                    <label for="client-email-${clientContactCount}" class="text-xl block text-sm font-medium text-gray-700">Client Email</label>
                    <input type="email" id="client-email-${clientContactCount}" name="client-email-${clientContactCount}" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-full text-2xl p-2 h-auto rounded-md   sm:text-sm">
                </div>
                <div>
                    <label for="client-phone-${clientContactCount}" class="text-xl block text-sm font-medium text-gray-700">Contact Mobile Number</label>
                    <input type="text" id="client-phone-${clientContactCount}" name="client-phone-${clientContactCount}" class="border border-gray-200 outline-[#6E2F8E] mt-1  block w-full text-2xl p-2 h-auto rounded-md   sm:text-sm">
                </div>
            </div>
        `;
        clientContactsSection.appendChild(clientContactGroup);
    });

    projectForm.addEventListener('submit', function(event) {
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
        const Started = { OverallStageStatus:"Active"};
        const notStarted = { OverallStageStatus:"Not Started"};

        const finalData = {
            content: {
                projectName: formDataObj['project-name'],
                clientName: formDataObj['client-name'],
                industry: formDataObj['industry'],
                gwcAccountManager: formDataObj['gwc-account-manager'],
                gwcAccountManagerEmail: selectedAccountManager ? selectedAccountManager.emp_mail : '',
                gwcAccountManagerDomoId: selectedAccountManager ? selectedAccountManager.emp_id : '',
                gwcProjectManager: formDataObj['gwc-project-manager'],
                gwcProjectManagerEmail: selectedProjectManager ? selectedProjectManager.emp_mail : '',
                gwcProjectManagerDomoId: selectedProjectManager ? selectedProjectManager.emp_id : '',
                projectDescription: formDataObj['project-description'],
                innovationProject: formDataObj['innovation-project'],
                projectLeadDate: formDataObj['project-date'],
                domoContacts: JSON.stringify(domoContacts),
                clientContacts: JSON.stringify(clientContacts),
                PreSalesData: JSON.stringify(Started),
                ProjectInitiationData: JSON.stringify(notStarted),
                ProjectExecutionData: JSON.stringify(notStarted),
                ProjectClosureData: JSON.stringify(notStarted),
                ProjectOverallStatus: 'Active',
                ProjectPresalesStatus : 'Active',
                ProjectInitiationStatus : 'Not Started',
                ProjectExecutionStatus : 'Not Started',
                ProjectClosureStatus : 'Not Started',
                ProjectArchieveStatus : "No"
            }
        };

        console.log(finalData)

        domo.post(`/domo/datastores/v1/collections/ProjectTrackerDB-NewSet/documents/`, finalData)
            .then(response => {
                console.log('ProjectCreated:', response);
                projectForm.reset();
                showNotification('Project Created Successfully.', 'green')
                alert('Form submitted successfully!');
            })
            .catch(error => {
                console.error('Error sending data to Domo:', error);
                alert('Failed');
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
