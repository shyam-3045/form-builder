# Form Builder with Airtable Integration

## Assignment Submission
![](https://img.shields.io/badge/Name-Shyam_S_M-blue) <br/>
![](https://img.shields.io/badge/Stack-MERN-green) <br/>
![](https://img.shields.io/badge/Integration-Airtable-orange)

---

## 🔧 Setup Instructions

### ✅ Prerequisites
- Node.js (v18+)
- npm
- MongoDB (local or Atlas)
- Airtable account

---

## 📦 Backend Setup

- git clone backend-repo-url
- cd backend
- npm install
- npm run dev

### .env setup 
Refer sample.env.example and import in your backend folder

###  Backend runs at: http://localhost:5000

---

## 📦 Frontend Setup

- git clone frontend-repo-url
- cd frontend/form-builder
- npm install
- npm run dev
  
### .env setup 
VITE_API_BASE_URL=http://localhost:5000

###  Frontend runs at: http://localhost:5173

---

## 🔐 Airtable OAuth Setup Guide

This project uses Airtable OAuth to allow users to securely access their Airtable bases and tables.


## ✅ Step 1: Create an Airtable Integration

1. Go to **Airtable → Account → Developer Hub**
2. Create a new **Integration**
3. Note down:
   - **Client ID**
   - **Client Secret**

---

## ✅ Step 2: Configure OAuth Redirect URI

Add the backend OAuth callback URL: http://localhost:5000/auth/airtable/callback


(Use deployed backend URL after deployment)

---

## ✅ Step 3: Enable Required OAuth Scopes

Enable the following scopes in Airtable:
 - data.records:read 
 - data.records:write 
 - schema.bases:read 
 - webhook:manage 
 - user.email:read


---

## ✅ Step 4: Store Credentials in Backend `.env`

```env
AIRTABLE_CLIENT_ID=<your-client-id>
AIRTABLE_CLIENT_SECRET=<your-client-secret>
AIRTABLE_REDIRECT_URI=http://localhost:5000/auth/airtable/callback

```
---

## 📊 Data Model Explanation

The application uses MongoDB with Mongoose to store form definitions, user data, responses, and webhook metadata.

---

### 👤 User Model
Stores authenticated Airtable users.

- `UserID`: Unique Airtable user identifier
- `email`: User email fetched from Airtable
- `accessToken`: Airtable OAuth access token
- `refreshToken`: Airtable OAuth refresh token
- `lastLoginAt`: Timestamp of last login

This model is created or updated during Airtable OAuth login.

---

### 📝 Form Model
Represents a dynamically created form linked to an Airtable base and table.

- `owner`: Reference to the User who created the form
- `title`: Title of the form
- `airtableBaseID`: Airtable Base ID
- `airtableTableID`: Airtable Table ID
- `questions`: List of questions generated from Airtable fields

Each form defines how user inputs map to Airtable fields.

---

### ❓ Question (Subdocument)
Stored inside the Form model.

- `questionKey`: Internal key used by frontend
- `fieldId`: Airtable Field ID
- `label`: Question label displayed in UI
- `type`: Field type (singleselect, multiselect, etc.)
- `required`: Whether the field is mandatory
- `conditionalRules`: Rules to control conditional visibility

This enables dynamic form rendering and conditional logic.

---

### 📥 FormResponse Model
Stores each form submission and links it to the corresponding Airtable record.

- `formID`: Reference to the Form
- `airtableRecordId`: Record ID created in Airtable
- `answers`: User submitted data
- `deletedInAirTable`: Flag to indicate Airtable deletion
- Timestamps: `createdAt`, `updatedAt`

Responses are synced with Airtable and tracked locally.

---

### 🔔 WebHook Model
Stores metadata for Airtable webhooks.

- `baseID`: Airtable Base ID
- `tableID`: Airtable Table ID
- `webhookID`: Airtable Webhook ID
- `expirationTime`: Webhook expiration timestamp
- `macSecretBase64`: Secret used for webhook validation
- `owner`: Reference to User who registered the webhook

Used to keep the local database in sync with Airtable changes.

---

## 🔁 Conditional Logic Explanation

This project supports conditional logic to control whether a question should be shown based on previous answers.

Each question can optionally have `conditionalRules`. If no rules are defined or null, it will returns true and the question will be  always displayed.

---

### How Conditional Logic Works

The `shouldShowQuestion` function determines whether a question should be visible.

1. If a question has **no conditional rules**, it is shown by default.
2. If rules exist, each condition is evaluated using the answeredSoFar.
3. Supported operators:
   - `equals`
   - `notEquals`
   - `contains`
4. String comparisons are handled in a **case-insensitive** manner.
5. Conditions can be combined using:
   - `AND` (all conditions must be true)
   - `OR` (at least one condition must be true)

---

### Evaluation Logic

- Each condition checks the answer of another question using `questionKey`
- If the required answer does not exist, the condition fails
- For `contains`:
  - Works with both strings and arrays (for multi-select fields)

---

### Final Decision

- If logic is `AND`, all conditions must pass
- If logic is `OR`, any one passing condition is sufficient
- The function returns `true` or `false`, which controls whether the question is to be displayed or not if True - display If false - do not display in frontend .

This approach allows dynamic and flexible form behavior without hardcoding question dependencies in the frontend.

---

## 🔔 Webhook Configuration (Airtable)

This project uses Airtable Webhooks to keep local database responses in sync with changes made directly in Airtable.

---

### Webhook Registration

A webhook is registered programmatically using the Airtable Webhooks API after successful OAuth authentication.

i Took Reference  from Airtable official example:
```
POST https://api.airtable.com/v0/bases/{baseId}/webhooks

Request Body:
{
"notificationUrl": "https://<backend-url>/webhooks/airtable",
"specification": {
"options": {
"filters": {
"dataTypes": ["tableData"],
"recordChangeScope": "<tableId>"
}
}
}
}
```


Successful registration returns:

- `webhookId`
- `expirationTime`
- `macSecretBase64`

These values are stored in MongoDB for future reference.

---

### Stored Webhook Metadata

After registration, webhook details are persisted in the database, including:

- Airtable Base ID
- Airtable Table ID
- Webhook ID
- Expiration time
- Webhook secret
- Owner (authenticated user)

📸 **Screenshot included**: Stored webhook document in MongoDB Atlas.

<img width="1577" height="691" alt="image" src="https://github.com/user-attachments/assets/d36986cb-1ac1-4857-9c95-ce23ae92e690" />

---

### ✅ Webhook Callback Endpoint

The backend exposes a webhook receiver endpoint: POST /webhooks/airtable

This endpoint is responsible for:
- Updating local records when Airtable records change
- Marking records as `deletedInAirTable = true` when deleted in Airtable

The endpoint has been **manually tested using Postman** and responds correctly.

📸 **Screenshot included**: Successful Postman call to webhook callback endpoint.

<img width="1471" height="674" alt="image" src="https://github.com/user-attachments/assets/7bc2fe00-9e13-4c0a-8188-93879196971b" />

---
### ⚠️  Behavior in Production

Both **frontend and backend are deployed online**, and:

- Webhook registration succeeds
- Webhook metadata is correctly stored in MongoDB
- Callback endpoint is publicly accessible and functional

However, **automatic webhook event delivery from Airtable was not observed and No Api calls occured ** during testing, even after deployment.

This appears to be a configuration / delivery issue outside the application logic, as:
- The webhook is registered correctly
- The callback endpoint works when invoked manually

---

### Summary

- ✅ Webhook creation implemented
- ✅ Webhook stored in database
- ✅ Callback endpoint implemented and tested
- ⚠️ Automatic Airtable trigger not observed during testing / production

---

## 🧩 Application Flow

1. User logs in using Airtable OAuth.
2. User selects an Airtable Base and Table.
3. Fields from the table are fetched.
4. User builds a form by selecting fields, renaming labels, and setting required fields.
5. The form schema is stored in MongoDB.
6. End users submit the form.
7. Responses are saved in Airtable and MongoDB.
8. Airtable webhooks are registered to keep data in sync.

### Demo Video - 
