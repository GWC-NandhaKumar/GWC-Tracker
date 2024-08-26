import domojupyter as domo
import pandas as pd
import json

# Function to format comments from data
def format_comments(data):
    comments = data.get('comments', [])
    formatted_comments = []
    for comment in comments:
        date = comment.get('date', '')
        formatted_date = pd.to_datetime(date).strftime('%d-%m-%Y') if date else ''
        comment_text = comment.get('comment', '')
        formatted_comments.append(f'{formatted_date} : "{comment_text}"')
    return '<br>'.join(formatted_comments)

# Function to extract names and emails from contact lists
def extract_names_and_emails(contacts):
    names = [contact['person'] for contact in contacts if contact['person'] and contact['person'].lower() != 'na']
    emails = [contact['email'] for contact in contacts if contact['email'] and contact['email'].lower() != 'na']
    return ', '.join(names), ', '.join(emails)

# Function to fix JSON strings if possible
def fix_json_string(json_string):
    try:
        return json.loads(json_string)
    except json.JSONDecodeError:
        # Attempt to fix common JSON errors
        try:
            fixed_json_string = json_string.rstrip(',')  # Remove trailing commas
            return json.loads(fixed_json_string)
        except json.JSONDecodeError:
            return {}

# Assuming 'domo.read_dataframe' returns a Pandas DataFrame
input = domo.read_dataframe('Raw-InputDataset', query='SELECT * FROM table')

# Initialize an empty list to store processed data for each row
processed_rows = []

# Iterate through each row in the DataFrame
for index, row in input.iterrows():
    try:
        # Extract and parse JSON data for each column as needed
        presales_data = fix_json_string(row['PreSalesData']) if 'PreSalesData' in row and pd.notnull(row['PreSalesData']) else {}
        presales_keyname = {f"presales_{key}": value for key, value in presales_data.items()}
        
        initiation_data = fix_json_string(row['ProjectInitiationData']) if 'ProjectInitiationData' in row and pd.notnull(row['ProjectInitiationData']) else {}
        initiation_keyname = {f"initiation_{key}": value for key, value in initiation_data.items()}
        
        execution_data = fix_json_string(row['ProjectExecutionData']) if 'ProjectExecutionData' in row and pd.notnull(row['ProjectExecutionData']) else {}
        execution_keyname = {f"execution_{key}": value for key, value in execution_data.items()}
        
        closure_data = fix_json_string(row['ProjectClosureData']) if 'ProjectClosureData' in row and pd.notnull(row['ProjectClosureData']) else {}
        closure_keyname = {f"closure_{key}": value for key, value in closure_data.items()}
        
        domo_contacts = fix_json_string(row['domoContacts']) if 'domoContacts' in row and pd.notnull(row['domoContacts']) else []
        client_contacts = fix_json_string(row['clientContacts']) if 'clientContacts' in row and pd.notnull(row['clientContacts']) else []
        
        # Extract names and emails from domoContacts and clientContacts
        domo_contact_names, domo_contact_emails = extract_names_and_emails(domo_contacts)
        client_contact_names, client_contact_emails = extract_names_and_emails(client_contacts)
        
        # Format comments for each stage using the defined function
        presales_comments = format_comments(presales_data)
        initiation_comments = format_comments(initiation_data)
        execution_comments = format_comments(execution_data)
        closure_comments = format_comments(closure_data)
        
        # Extract Timeline value and unit from initiation_data
        initiation_timeline_value = initiation_data.get('Timeline', {}).get('value', '') if 'Timeline' in initiation_data else ''
        initiation_timeline_unit = initiation_data.get('Timeline', {}).get('unit', '') if 'Timeline' in initiation_data else ''
        
        # Combine all extracted data into a single dictionary for this row
        combined_data = {
            **row.to_dict(),  # Include all original columns
            **presales_keyname,
            **initiation_keyname,
            **execution_keyname,
            **closure_keyname,
            "domoContacts": domo_contact_names,
            "clientContacts": client_contact_names,
            "domoContactEmails": domo_contact_emails,
            "clientContactEmails": client_contact_emails,
            "presalesComments": presales_comments,
            "initiationComments": initiation_comments,
            "executionComments": execution_comments,
            "closureComments": closure_comments,
            "initiation_timeline_value": initiation_timeline_value,
            "initiation_timeline_unit": initiation_timeline_unit
        }
        
        # Append the processed data for this row to the list
        processed_rows.append(combined_data)
        
    except json.JSONDecodeError as e:
        print(f"JSONDecodeError at row {index}: {e}")
        print(f"Row data: {row}")
    except Exception as e:
        print(f"Unexpected error at row {index}: {e}")
        print(f"Row data: {row}")

# Convert the list of processed rows to a DataFrame
df = pd.DataFrame(processed_rows)

df['POC_developers'] = extract_names_and_emails()
df['Resources_developers'] = extract_names_and_emails()

# Print the DataFrame (or use it as needed)
print("DataFrame:")
print(df)



import domojupyter as domo
domo.write_dataframe(df, 'LeadTracker-Output')




after make df run another loop 

take this df[initiation_resources] have value like this

		('', '')
[{'name': 'Anjapulikannan J', 'email': 'anjapuli.kannan@gwcdata.ai'}, {'name': 'Madhu Sudhanan', 'email': 'madhu.sudhanan@gwcteq.com'}]	2.0	('', '')
		('', '')
		('', '')
[{'name': 'Vijay Prabhakaran', 'email': 'vijay.prabhakaran@gwcteq.com'}, {'name': 'Jawahar Venkatramanujam', 'email': 'jawahar.v@gwcteq.com'}]	2.0	('', '')
		('', '')
		('', '')


i need to create new 
initiation_resources_names column that value like this format 

Name 1, Name 2 

like this get me the code 

if have [] empty if have noting in that column 

leave empty in new column