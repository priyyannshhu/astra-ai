# Astra AI - Feature Implementation Guide

## Quick Start

All improvements have been implemented across 5 major phases. Here's how to use and test each feature:

---

## Phase 1: Authentication System

### Email Verification
```javascript
// User signup triggers email verification
// Token valid for 24 hours
POST /api/auth/signup
{
  name: "John Doe",
  email: "john@example.com",
  username: "johndoe",
  password: "securepass123",
  authMethod: "username"
}

// Verify email
POST /api/auth/verify-email
{
  email: "john@example.com",
  token: "verification_token_here"
}
```

### Password Reset
```javascript
// Request password reset
POST /api/auth/password-reset
{
  email: "john@example.com",
  action: "request"
}
// Returns reset token (valid 1 hour)

// Reset password with token
PUT /api/auth/password-reset
{
  email: "john@example.com",
  token: "reset_token_here",
  newPassword: "newsecurepass123"
}
```

### Change Password
```javascript
// Change password in settings (requires old password)
POST /api/auth/change-password
{
  userId: "user_id_here",
  oldPassword: "currentpassword",
  newPassword: "newsecurepassword",
  confirmPassword: "newsecurepassword"
}
```

### Session Management
```javascript
// Create session (on login)
POST /api/auth/session
{
  userId: "user_id_here",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
// Returns JWT token

// Get current session
GET /api/auth/session
// Returns user and session data

// Logout (revoke session)
DELETE /api/auth/session
// Clears httpOnly cookie
```

---

## Phase 2: User Dashboard

### Dashboard Features
- **Search**: Filter projects by name in real-time
- **Filter**: View active, archived, or all projects
- **Sort**: Sort by creation date, last accessed, or alphabetically
- **Project Cards**: View project metadata with quick access

### Usage in Dashboard
```javascript
// Dashboard automatically fetches:
const projects = useQuery(
  api.projects.GetUserProjects,
  { userId: userDetail._id, status: filterStatus }
);

// Search, filter, and sort applied client-side
filteredProjects = projects
  .filter(p => p.name.includes(searchQuery))
  .sort((a, b) => {
    if (sortBy === "recent") return b.createdAt - a.createdAt;
    if (sortBy === "accessed") return (b.lastAccessedAt || 0) - (a.lastAccessedAt || 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
  });
```

---

## Phase 3: Projects & Workspace Library

### Project Management
```javascript
// Create project
POST /api/projects (Convex)
{
  name: "My Awesome Website",
  description: "An AI-powered website builder",
  owner: userId,
  tags: ["web", "ai", "portfolio"],
  thumbnail: "image_url"
}

// Get user's projects
GET api.projects.GetUserProjects(userId, status)
// Returns array of projects with metadata

// Update project
PUT /api/projects
{
  projectId: "project_id",
  name: "Updated Name",
  description: "Updated description",
  tags: ["web", "updated"]
}

// Archive project
POST /api/projects/archive
{
  projectId: "project_id"
}

// Search projects
GET api.projects.SearchProjects(userId, query)
// Full-text search in name, description, and tags
```

### Workspace Sharing
```javascript
// Add collaborator
POST /api/workspace/share
{
  workspaceId: "workspace_id",
  collaboratorId: "user_id_to_add"
}

// Get collaborators
GET /api/workspace/share?workspaceId=workspace_id
// Returns array of collaborator objects

// Remove collaborator
DELETE /api/workspace/share
{
  workspaceId: "workspace_id",
  collaboratorId: "user_id_to_remove"
}
```

### Workspace Settings
```javascript
// Update workspace
PUT /api/workspace/settings
{
  workspaceId: "workspace_id",
  title: "Project Workspace",
  description: "My project description",
  isPublic: false
}

// Get workspace details
GET /api/workspace/settings?workspaceId=workspace_id

// Delete workspace
DELETE /api/workspace/settings
{
  workspaceId: "workspace_id"
}
```

---

## Phase 4: User Profile & Account Settings

### Profile Management
```javascript
// Get user profile
GET /api/profile?userId=user_id
// Returns profile with social links and preferences

// Update profile
PUT /api/profile
{
  userId: "user_id",
  displayName: "John Doe",
  website: "https://johndoe.com",
  location: "San Francisco, CA",
  company: "Tech Corp",
  phoneNumber: "+1-555-0000",
  bio: "Full-stack developer"
}

// Add social link
POST /api/profile
{
  userId: "user_id",
  action: "add-social",
  platform: "twitter",
  url: "https://twitter.com/johndoe"
}

// Remove social link
POST /api/profile
{
  userId: "user_id",
  action: "remove-social",
  platform: "twitter"
}
```

### Notification Preferences
```javascript
// Get current preferences
GET /api/profile/notifications?userId=user_id
// Returns preferences object

// Update preferences
PUT /api/profile/notifications
{
  userId: "user_id",
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    collabNotifications: true,
    projectUpdates: true,
    weeklyDigest: true
  }
}
```

### Account Deletion
```javascript
// Request account deletion
POST /api/profile/delete-account
{
  userId: "user_id",
  password: "user_password"
}
// Returns deletion token (valid 30 minutes)

// Confirm deletion
PUT /api/profile/delete-account
{
  userId: "user_id",
  deletionToken: "token_from_email"
}
// Account is soft-deleted with all data cleaned up
```

---

## Activity Logging

### How It Works
Every important action is logged for audit purposes:

```javascript
// Action examples logged:
- "ACCOUNT_CREATED"
- "EMAIL_VERIFIED"
- "PASSWORD_CHANGED"
- "PASSWORD_RESET"
- "SESSION_CREATED"
- "SESSION_REVOKED"
- "PROFILE_UPDATED"
- "WORKSPACE_SHARED"
- "PROJECT_CREATED"
- "ACCOUNT_DELETED"

// Fetch activity logs
GET api.activityLog.GetUserActivityLogs(userId, limit=20)
// Returns array of activities with timestamps
```

---

## Database Schema Reference

### Users Table
```javascript
{
  _id: "user_id",
  name: string,
  email: string (indexed),
  username: optional string (indexed),
  password: optional hashed password,
  picture: optional URL,
  uid: unique string (indexed),
  authMethod: "google" | "username" | "github",
  emailVerified: boolean,
  emailVerificationToken: optional string,
  emailVerificationExpiry: optional timestamp,
  resetToken: optional string,
  resetTokenExpiry: optional timestamp,
  deletionToken: optional string,
  deletionTokenExpiry: optional timestamp,
  bio: optional string,
  role: "user" | "admin" | "moderator",
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLoginAt: optional timestamp,
  isActive: boolean
}
```

### Projects Table
```javascript
{
  _id: "project_id",
  name: string,
  description: optional string,
  owner: userId (indexed),
  status: "active" | "archived" | "deleted" (indexed),
  tags: array of strings,
  thumbnail: optional URL,
  createdAt: timestamp,
  updatedAt: timestamp,
  lastAccessedAt: optional timestamp
}
```

### Sessions Table
```javascript
{
  _id: "session_id",
  userId: userId (indexed),
  token: JWT string (indexed),
  ipAddress: optional string,
  userAgent: optional string,
  expiresAt: timestamp,
  createdAt: timestamp
}
```

### User Profiles Table
```javascript
{
  _id: "profile_id",
  userId: userId (indexed),
  displayName: optional string,
  website: optional URL,
  location: optional string,
  company: optional string,
  phoneNumber: optional string,
  socialLinks: optional object { platform: url },
  preferences: optional object {
    emailNotifications: boolean,
    pushNotifications: boolean,
    smsNotifications: boolean,
    collabNotifications: boolean,
    projectUpdates: boolean,
    weeklyDigest: boolean,
    theme: string,
    language: string
  },
  updatedAt: timestamp
}
```

### Activity Log Table
```javascript
{
  _id: "log_id",
  userId: userId (indexed),
  action: string (indexed),
  resource: optional string,
  resourceId: optional string,
  details: optional object,
  createdAt: timestamp (indexed)
}
```

### Sessions Table (Workspace Collaboration)
```javascript
{
  _id: "workspace_id",
  // ... existing fields ...
  collaborators: array of userIds,
  isPublic: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## Environment Variables

Make sure these are set in your `.env.local`:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# GitHub OAuth (existing)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# JWT
JWT_SECRET=your_jwt_secret_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (for future use)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@astra-ai.com
```

---

## Testing the Features

### 1. Test Authentication Flow
- Create account with email verification
- Verify email via token
- Login
- Request password reset
- Reset password
- Login with new password
- Change password in settings

### 2. Test Dashboard
- Navigate to `/dashboard`
- Search for projects
- Filter by status
- Sort by different options
- Click on project to open

### 3. Test Profile Management
- Go to `/settings/profile`
- Update profile information
- Add social links
- Save and verify updates

### 4. Test Account Security
- Go to `/settings/security`
- Change password
- View active sessions
- Logout from specific session
- Request account deletion

### 5. Test Workspace Collaboration
- Create workspace
- Add collaborator
- Toggle public/private
- View collaborators
- Remove collaborator

---

## API Response Format

All API endpoints follow this format:

### Success Response
```javascript
{
  success: true,
  message: "Operation completed successfully",
  data: { /* result data */ }
}
```

### Error Response
```javascript
{
  error: "Error message",
  status: 400 // HTTP status code
}
```

---

## Key Functions Summary

### Authentication
- `SendEmailVerification` - Email verification flow
- `VerifyEmail` - Email confirmation
- `RequestPasswordReset` - Reset flow
- `ResetPassword` - Confirm reset
- `ChangePassword` - Update password
- `UpdateLastLogin` - Track logins

### Projects
- `CreateProject` - New project
- `GetUserProjects` - List projects
- `UpdateProject` - Edit project
- `ArchiveProject` - Archive
- `DeleteProject` - Delete
- `SearchProjects` - Search

### Sessions
- `CreateSession` - Create session
- `GetSessionByToken` - Verify session
- `RevokeSession` - Logout
- `RevokeAllSessions` - Logout all devices

### Activity
- `LogActivity` - Log action
- `GetUserActivityLogs` - Get history
- `GetLogsByAction` - Filter logs

### Profiles
- `SetUserProfile` - Create/update
- `GetUserProfile` - Retrieve
- `UpdatePreferences` - Update settings
- `UpdateSocialLinks` - Manage socials

---

## Common Issues & Solutions

### Issue: "emailVerificationToken is required"
**Solution**: Make sure email verification is sent before trying to verify. The token comes from the verification email.

### Issue: "Reset token has expired"
**Solution**: Reset tokens expire in 1 hour. Request a new reset if expired.

### Issue: "Session not found"
**Solution**: Create a new session via login. Sessions are stored in the database.

### Issue: "Collaborator not found"
**Solution**: Verify the user ID is correct before adding as collaborator.

### Issue: "Project not found"
**Solution**: Make sure project exists and belongs to the current user.

---

## Security Notes

1. **Always use HTTPS in production**
2. **Keep JWT_SECRET secure and never commit it**
3. **Passwords are hashed with bcryptjs (10 rounds)**
4. **Tokens are stored in secure httpOnly cookies**
5. **Sessions include IP and user agent for tracking**
6. **All sensitive actions are logged**
7. **Account deletion is soft (preserves audit trail)**

---

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Enable HTTPS
- [ ] Configure SMTP for emails
- [ ] Test all auth flows
- [ ] Test profile management
- [ ] Test workspace collaboration
- [ ] Verify activity logging
- [ ] Setup backups
- [ ] Configure monitoring
- [ ] Review security settings

---

For more details, see `IMPROVEMENTS_SUMMARY.md`
