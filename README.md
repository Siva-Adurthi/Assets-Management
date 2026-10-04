# Department Asset Management Portal — MERN Mini Project

This version includes the original portal requirements plus three requested extensions:

1. Faculty asset requests with Admin approval/rejection, including the faculty department.
2. Multiple admins, with an Admin-only Users page for creating admins/faculty and changing roles.
3. Optional asset image upload, displayed on Asset Details and My Assets.
4. Faculty release workflow: an approved assigned asset can be released after use.

## Stack
- React + Vite
- Node.js
- Express.js
- MongoDB Atlas / Mongoose
- JWT authentication
- Multer for optional asset images
- Postman for API testing

## Roles

### Faculty
- Register/login
- View/search assets
- View department assets
- View asset details
- Request available assets
- See the requesting department on the request
- Track/cancel own pending requests
- View currently assigned assets
- Release an assigned asset after use

### Admin
- Login
- Add/update/delete assets
- Optional asset image upload
- Assign assets to departments
- Review/approve/reject faculty requests
- Manage departments
- View reports
- Create additional admins/faculty
- Change user roles
- Manage faculty departments

## New database field on Assets
```text
imageUrl: String (optional)
assignedTo: ObjectId -> User (optional)
```

## New collection: AssetRequests
```text
requestId
facultyId
facultyDepartment
assetId
reason
requestDate
status
approvedBy
responseDate
releasedAt
adminRemark
```

## Project structure
```text
department-asset-management-portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/             # asset images (created automatically)
│   ├── .env.example
│   ├── package.json
│   ├── seedAdmin.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── api.js
    │   ├── constants.js
    │   ├── main.jsx
    │   ├── styles.css
    │   └── utils.js
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 1. MongoDB Atlas

Copy `backend/.env.example` to `backend/.env` and set:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

## 2. Start backend

```bash
cd backend
npm install
node seedAdmin.js
npm run dev
```

Default demo admin:

```text
Email: admin@assetportal.com
Password: Admin@123
```

Uploads are stored locally under `backend/uploads/` and are optional.

## 3. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## 4. Multiple Admins

Public registration deliberately creates Faculty accounts only. An existing Admin can open:

```text
Admin Dashboard -> Users
```

and create another Admin, or change an existing user's role to Admin.

The backend allows multiple admin users and protects admin endpoints with JWT + role authorization. An admin cannot change their own role from the Users page.

## 5. Faculty Asset Request Flow

```text
Faculty -> All Assets -> Available Asset -> Request
       -> Request stored as Pending
       -> Admin -> Asset Requests
       -> Accept & Assign / Reject
```

Approval performs these changes:

```text
Request.status = Approved
Asset.assetStatus = In Use
Asset.assignedTo = requesting Faculty
```

Rejection keeps the asset available.

The backend also checks availability again at approval time so an unavailable asset cannot be approved.

## 6. Optional Asset Image

Admin opens **Manage Assets -> Add Asset**.

The Asset Image field is optional. Accepted formats:

```text
JPG / JPEG / PNG / WEBP / GIF
Maximum: 5 MB
```

The stored image is served from `/uploads/...` and displayed on Asset Details.

Existing assets without an image continue to work and simply show `No image uploaded`.

## 7. Postman

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Assets
```http
GET    /api/assets
GET    /api/assets/:id
POST   /api/assets
PUT    /api/assets/:id
DELETE /api/assets/:id
PUT    /api/assets/:id/assign
```

`POST /api/assets` and `PUT /api/assets/:id` use `multipart/form-data` when uploading an image. The image field name is `image`.

Without image, the field can be omitted.

### Departments
```http
GET    /api/departments/public
GET    /api/departments
POST   /api/departments
PUT    /api/departments/:id
DELETE /api/departments/:id
```

### Requests
```http
POST /api/requests
GET  /api/requests/mine
GET  /api/requests
PUT  /api/requests/:id/approve
PUT  /api/requests/:id/reject
PUT  /api/requests/:id/cancel
```

### Users (Admin only)
```http
GET   /api/users
POST  /api/users
PATCH /api/users/:id
PATCH /api/users/:id/role
```

### Reports
```http
GET /api/reports/summary
GET /api/reports/category-distribution
```

For protected endpoints in Postman:

```text
Authorization: Bearer <JWT_TOKEN>
```

## 8. Purchase date JSON

For normal JSON requests:

```json
"purchaseDate": "2025-06-15"
```

Mongoose converts the valid ISO date string into a Date because the schema field is `type: Date`.

## 9. Notes

The supplied project guide defines the original collections and fields. The AssetRequests collection, imageUrl, assignedTo, user-management endpoints, and request workflow are extensions added specifically to support the requested features.

## Latest workflow features

- Faculty accounts store their department.
- Every asset request stores a department snapshot so the admin can see where the request came from.
- Approved assets are assigned to the requesting faculty member.
- Faculty can see active assignments and release an asset after use. Releasing changes the asset back to `Available` and clears `assignedTo`.
- Multiple administrator accounts are supported through the Admin Users screen.
- Public registration is faculty-only; administrators can create additional admin or faculty accounts.
- Asset images remain optional. Uploaded images appear in Asset Details and My Assets.
