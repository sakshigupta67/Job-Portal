# Project Overview

Insiderjobs is a React/Vite job portal backed by an Express, MongoDB, and Mongoose API. Job seekers browse and apply for visible jobs. Recruiters register, post jobs, manage visibility, and review applications.

The project uses two authentication systems:

- Clerk authenticates job seekers.
- JWT tokens authenticate recruiters/companies.

# Tech Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS, Clerk React
- Backend: Node.js, Express 5, Mongoose, MongoDB
- Authentication: Clerk for users, JSON Web Tokens and bcrypt for companies
- Uploads: Multer with Cloudinary or local `/uploads` fallback
- Editor: Quill
- Notifications: React Toastify
- Monitoring: Sentry

# Project Structure

## Frontend

- `client/src/App.jsx`: React route configuration
- `client/src/main.jsx`: React providers and application bootstrap
- `client/src/context/AppContext.jsx`: jobs, search state, company authentication, and API base URL
- `client/src/components/`: shared navigation, search, job cards, recruiter login, and layout components
- `client/src/pages/`: routed job seeker and recruiter pages
- `client/src/assets/assets.js`: images, icons, categories, locations, and fallback sample jobs

## Backend

- `server/server.js`: Express application, middleware, route mounting, webhook, and error handling
- `server/routes/`: Express route definitions
- `server/controllers/`: request handlers and database operations
- `server/models/`: Mongoose schemas
- `server/middlewares/auth.js`: recruiter and user authentication middleware
- `server/config/`: database, upload, and monitoring setup
- `server/utils/cloudinary.js`: file storage integration

# Frontend Routes

| Feature | Route | Component | Purpose | Access |
|---|---|---|---|---|
| Home and job search | `/` | `Home.jsx` | Browse, search, filter, and paginate visible jobs | Public |
| Project feature map | `/features` | `Features.jsx` | Reference the implemented application features | Public |
| Job details and application | `/apply-job/:id` | `ApplyJob.jsx` | View one job and apply | Public page; Clerk user required to apply |
| Applied jobs and resume | `/applications` | `Applications.jsx` | View application statuses and manage resume | Clerk user |
| Recruiter dashboard | `/dashboard` | `Dashboard.jsx` | Recruiter layout and protected navigation | Company JWT |
| Add job | `/dashboard/add-job` | `AddJob.jsx` | Create a job posting | Company JWT |
| Manage jobs | `/dashboard/manage-jobs` | `ManageJobs.jsx` | View jobs, applicant counts, and visibility | Company JWT |
| View applications | `/dashboard/view-applications` | `ViewApplication.jsx` | Review and update candidate applications | Company JWT |

`/apply-job/:id` is a dynamic route. A real job ID is supplied by `JobCard.jsx` when a user clicks Apply now or Learn more.

# Backend APIs

## Public APIs

| API | Method | Purpose | Controller | Authentication |
|---|---|---|---|---|
| `/` | GET | API health response | `server.js` | None |
| `/api/jobs` | GET | List visible jobs with optional query filtering and pagination | `jobController.getJobs` | None |
| `/api/jobs/:id` | GET | Get one job and its company | `jobController.getJobById` | None |
| `/api/company/register` | POST | Register a company and upload its logo | `companyController.registerCompany` | None |
| `/api/company/login` | POST | Authenticate a company and issue JWT | `companyController.loginCompany` | None |
| `/api/users/:id` | GET | Read a user profile document | `userController.getUserById` | None |
| `/webhooks` | POST | Synchronize Clerk user events | `webhooks.clerkWebhooks` | Svix signature |

## Job seeker APIs

| API | Method | Purpose | Controller | Authentication |
|---|---|---|---|---|
| `/api/jobs/me/applications` | GET | List the current user's applications | `jobController.getApplicationsForUser` | `protectUser` |
| `/api/jobs/:jobId/apply` | POST | Submit an application | `jobController.applyToJob` | `protectUser` |
| `/api/users/:id/resume` | PATCH | Replace the user's resume | `userController.updateResume` | `protectUser` |
| `/api/jobs/upload-resume` | POST | Upload a resume and save its URL | `jobController.uploadResume` | `protectUser`; currently unused by frontend |

## Recruiter APIs used by the frontend

| API | Method | Purpose | Controller | Authentication |
|---|---|---|---|---|
| `/api/company/me` | GET | Read the logged-in company | `companyController.getCompanyData` | `protectCompany` |
| `/api/company/post-job` | POST | Create a job | `companyController.postJob` | `protectCompany` |
| `/api/company/list-jobs` | GET | List the company's jobs with applicant counts | `companyController.getCompanyPostedJobs` | `protectCompany` |
| `/api/company/change-visibility` | POST | Show or hide a job | `companyController.changeVisibility` | `protectCompany` |
| `/api/company/applicants` | GET | List applications for the company | `companyController.getCompanyJobApplicants` | `protectCompany` |
| `/api/company/change-status` | POST | Accept or reject an application | `companyController.changeJobApplicationsStatus` | `protectCompany` |

## Registered but currently unused recruiter API family

`server/routes/jobRoutes.js` also registers the following older or duplicate endpoints. No current frontend component calls them:

- `POST /api/jobs/company/create`
- `GET /api/jobs/company/my-jobs`
- `PATCH /api/jobs/company/:id/visibility`
- `GET /api/jobs/company/applications`
- `PATCH /api/jobs/company/applications/status`

# Database Models

| Model | Purpose | Important Fields |
|---|---|---|
| `User` | Clerk-synchronized job seeker | `_id`, `name`, `email`, `resume`, `image` |
| `Company` | Recruiter account | `name`, `email`, `password`, `image` |
| `Job` | Job listing | `title`, `description`, `category`, `location`, `level`, `salary`, `companyId`, `isVisible`, `date` |
| `Application` | Job seeker application | `jobId`, `userId`, `companyId`, `resume`, `status`, `appliedAt` |

Application statuses are `Pending`, `Accepted`, and `Rejected`.

# Authentication Flow

## Job seekers

1. `ClerkProvider` is configured in `client/src/main.jsx`.
2. Clerk supplies the signed-in user through `useUser()`.
3. Frontend requests use `useAuth().getToken()`.
4. The token is sent as `Authorization: Bearer <token>`.
5. `protectUser` validates the token and sets `req.user`.
6. Clerk webhooks at `/webhooks` create and update the MongoDB `User` document.

## Recruiters

1. `RecruiterLogin.jsx` submits to `/api/company/login` or `/api/company/register`.
2. The server checks the company password with bcrypt.
3. The server returns a JWT.
4. `AppContext` stores the JWT as `companyToken` in local storage.
5. Recruiter requests send that token as a Bearer token.
6. `protectCompany` verifies the token and loads `req.company`.

# User Flow

```text
Home.jsx
  -> Hero.jsx and JobListing.jsx
  -> JobCard.jsx
  -> /apply-job/:id
  -> ApplyJob.jsx
  -> POST /api/jobs/:jobId/apply
  -> Application document
  -> /applications
```

# Job Search Flow

1. `AppContext.fetchJobs()` calls `GET /api/jobs`.
2. `jobController.getJobs` returns visible jobs populated with company information.
3. `JobListing.jsx` filters title, location, category, and location selections in memory.
4. `JobCard.jsx` displays each result.
5. Clicking a card navigates to `/apply-job/:id`.

The backend supports `title`, `location`, `category`, `page`, `limit`, and `sort` query parameters, although the current frontend performs filtering and pagination locally.

# Job Application Flow

1. `JobCard.jsx` navigates to `/apply-job/:id`.
2. `ApplyJob.jsx` loads the job from context or `GET /api/jobs/:id`.
3. The page loads the job seeker's profile and checks existing applications.
4. The user must be signed in and have a resume.
5. `ApplyJob.jsx` sends `POST /api/jobs/:jobId/apply` with `resumeUrl`.
6. `jobController.applyToJob` prevents duplicates and creates an `Application` document.
7. `Applications.jsx` retrieves the result from `GET /api/jobs/me/applications`.

# Saved Jobs Flow

Saved jobs or bookmarks are not implemented in the current codebase. There is no saved-job model, API, route, state, or UI.

# Profile Flow

There is no separate profile page. The job seeker's profile is read internally through `GET /api/users/:id` and resume management is embedded in `/applications`.

# Admin/Recruiter Flow

There is no admin role or admin panel. Recruiters use the company dashboard:

```text
RecruiterLogin.jsx
  -> /dashboard/add-job
  -> POST /api/company/post-job
  -> /dashboard/manage-jobs
  -> POST /api/company/change-visibility
  -> /dashboard/view-applications
  -> POST /api/company/change-status
```

# Important Components

- `Navbar.jsx`: home navigation, Applied Jobs link, recruiter login, Clerk login, and recruiter dashboard button
- `Hero.jsx`: title and location search inputs
- `JobListing.jsx`: category/location filters and local pagination
- `JobCard.jsx`: job summary and navigation to the dynamic job route
- `ApplyJob.jsx`: job detail display, related jobs, resume check, and application submission
- `Applications.jsx`: resume management and submitted application table
- `RecruiterLogin.jsx`: company login and two-step registration modal
- `Dashboard.jsx`: recruiter shell and nested dashboard navigation
- `AddJob.jsx`: Quill-based job creation form
- `ManageJobs.jsx`: company job table and visibility controls
- `ViewApplication.jsx`: candidate review and status controls
- `AppContext.jsx`: jobs, recruiter token, recruiter profile, and shared search state

# Important Files

- `client/src/App.jsx`
- `client/src/main.jsx`
- `client/src/context/AppContext.jsx`
- `client/src/pages/Features.jsx`
- `server/server.js`
- `server/middlewares/auth.js`
- `server/routes/companyRoutes.js`
- `server/routes/jobRoutes.js`
- `server/routes/userRoutes.js`
- `server/controllers/companyController.js`
- `server/controllers/jobController.js`
- `server/controllers/userController.js`
- `server/controllers/webhooks.js`
- `server/models/User.js`
- `server/models/Company.js`
- `server/models/Job.js`
- `server/models/Application.js`

# Environment Variables

## Client

- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_BACKEND_URL`

If `VITE_BACKEND_URL` is absent, the client defaults to `http://localhost:3000`.

## Server

- `MONGODB_URI`
- `CLIENT_URL`
- `PORT`
- `JWT_SECRET`
- `CLERK_WEBHOOK_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `VERCEL`

# How to Run Frontend

```powershell
cd client
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

# How to Run Backend

```powershell
cd server
npm install
npm start
```

Backend URL: `http://localhost:3000`

# Important URLs

- Frontend: `http://localhost:5173`
- Feature map: `http://localhost:5173/features`
- Home and search: `http://localhost:5173/`
- Applications: `http://localhost:5173/applications`
- Recruiter add job: `http://localhost:5173/dashboard/add-job`
- Recruiter manage jobs: `http://localhost:5173/dashboard/manage-jobs`
- Recruiter applications: `http://localhost:5173/dashboard/view-applications`
- Backend health check: `http://localhost:3000/`

# Known Issues and Boundaries

- The frontend uses Clerk tokens while `protectUser` currently verifies JWTs with `JWT_SECRET`; these token systems must be compatible in the deployed configuration.
- `jobRoutes.js` contains an unused duplicate recruiter API family under `/api/jobs/company/*`.
- The previous-page handler in `JobListing.jsx` does not correctly enforce a minimum page of 1.
- The user profile endpoint is public and returns the stored user document.
- App Store and Play Store links are placeholders.
- There is no custom frontend not-found page.

# How to Remember This Project

The shortest mental model is:

```text
Job seekers browse -> inspect -> apply -> track applications.
Recruiters register -> post jobs -> manage visibility -> review candidates.
```

If you forget this project again, open `PROJECT_GUIDE.md` and visit `/features`.
