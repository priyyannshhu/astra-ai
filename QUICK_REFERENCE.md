# Astra AI - Quick Reference Card

## Key Files Added

### Convex Functions
| File | Purpose |
|------|---------|
| `/convex/sessions.js` | Session management (login/logout tracking) |
| `/convex/activityLog.js` | User activity auditing |
| `/convex/userProfiles.js` | Extended user profile data |
| `/convex/projects.js` | Project/workspace library |
| `/convex/users.js` | Enhanced with auth functions |

### API Routes
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/auth/session` | POST, GET, DELETE | Session creation, retrieval, logout |
| `/api/auth/change-password` | POST | Password change (requires current password) |
| `/api/workspace/share` | POST, GET, DELETE | Collaboration management |
| `/api/workspace/settings` | PUT, GET, DELETE | Workspace configuration |
| `/api/profile/notifications` | GET, PUT | Notification preferences |
| `/api/profile/delete-account` | POST, PUT | Account deletion workflow |

### Documentation
| File | Content |
|------|---------|
| `IMPROVEMENTS_SUMMARY.md` | Detailed implementation guide |
| `FEATURE_GUIDE.md` | How to use each feature |
| `QUICK_REFERENCE.md` | This file! |

---

## Features At A Glance

### Authentication
- Email verification (24-hour tokens)
- Password reset (1-hour tokens)
- Password change (with current password verification)
- Session management (JWT tokens, IP tracking)
- Account deactivation/deletion

### Dashboard
- Project search & filtering
- Sort by date/access/name
- Project library with metadata
- Workspace integration

### Projects
- Create, update, archive, delete
- Tag-based organization
- Thumbnail support
- Full-text search

### Collaboration
- Add/remove collaborators
- Public/private workspaces
- Collaborator list
- Shared workspace access

### User Profile
- Display name, website, location, company
- Phone number
- Social media links
- Bio/about section
- Profile image (via picture URL)

### Account Settings
- View/update profile info
- Social links management
- Notification preferences
- Session management
- Secure account deletion

### Security
- Activity logging (all actions)
- Session tracking (IP, user agent)
- Password hashing (bcryptjs)
- Token expiry management
- Audit trail preservation

---

## Common API Calls

### Create User Session
```bash
POST /api/auth/session
{
  "userId": "user_id",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### Get Active Sessions
```bash
GET /api/auth/session
```

### Change Password
```bash
POST /api/auth/change-password
{
  "userId": "user_id",
  "oldPassword": "current",
  "newPassword": "newsecure",
  "confirmPassword": "newsecure"
}
```

### Create Project
```bash
Convex: api.projects.CreateProject
{
  "name": "My Project",
  "description": "Project description",
  "owner": "user_id",
  "tags": ["web", "ai"]
}
```

### Share Workspace
```bash
POST /api/workspace/share
{
  "workspaceId": "workspace_id",
  "collaboratorId": "user_id"
}
```

### Update Profile
```bash
PUT /api/profile
{
  "userId": "user_id",
  "displayName": "John Doe",
  "website": "https://example.com",
  "location": "San Francisco, CA"
}
```

### Get Notifications
```bash
GET /api/profile/notifications?userId=user_id
```

### Request Account Deletion
```bash
POST /api/profile/delete-account
{
  "userId": "user_id",
  "password": "user_password"
}
```

---

## Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| users | User accounts | email, username, password, authMethod |
| workspace | Chat workspaces | messages, fileData, user, collaborators |
| projects | User projects | name, owner, status, tags |
| sessions | Active sessions | userId, token, expiresAt |
| activityLog | User actions | userId, action, resource, timestamp |
| userProfiles | Extended profiles | displayName, website, socialLinks, preferences |

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 404 | Not found |
| 500 | Server error |

---

## Timestamps

All timestamps are in milliseconds since epoch:
```javascript
Date.now() // Returns timestamp in ms
new Date(timestamp).toLocaleDateString() // Format for display
```

---

## Indices (for Query Performance)

| Table | Index | Field |
|-------|-------|-------|
| users | by_email | email |
| users | by_username | username |
| users | by_uid | uid |
| workspace | by_user | user |
| projects | by_owner | owner |
| projects | by_status | status |
| sessions | by_user | userId |
| sessions | by_token | token |
| activityLog | by_user | userId |
| activityLog | by_created | createdAt |
| userProfiles | by_user | userId |

---

## Validation Rules

| Field | Rule |
|-------|------|
| Password | Minimum 8 characters |
| Email | Valid email format |
| Username | Alphanumeric + underscore |
| Phone | Optional, any format |
| URL | Valid HTTP/HTTPS |

---

## Token Expiry Times

| Token Type | Duration |
|-----------|----------|
| Email Verification | 24 hours |
| Password Reset | 1 hour |
| Account Deletion | 30 minutes |
| Session | 30 days (default) |

---

## Actions Logged

```
- ACCOUNT_CREATED
- ACCOUNT_DELETED
- EMAIL_VERIFIED
- PASSWORD_CHANGED
- PASSWORD_RESET
- SESSION_CREATED
- SESSION_REVOKED
- PROFILE_UPDATED
- PROJECT_CREATED
- PROJECT_UPDATED
- PROJECT_ARCHIVED
- PROJECT_DELETED
- WORKSPACE_SHARED
- COLLABORATOR_ADDED
- COLLABORATOR_REMOVED
```

---

## Next Steps

1. **Setup Environment**: Add all env variables
2. **Test Auth**: Signup → Email verify → Login
3. **Create Project**: Test project creation and search
4. **Share Workspace**: Add collaborators
5. **Update Profile**: Complete user profile
6. **Review Logs**: Check activity logging
7. **Test Security**: Change password, delete account
8. **Deploy**: Push to production

---

## Support Files

- **IMPROVEMENTS_SUMMARY.md** - Full detailed guide
- **FEATURE_GUIDE.md** - How to use each feature
- **Code Comments** - In each file for implementation details

---

## Important Notes

- All passwords are hashed (never stored in plain text)
- Tokens are cryptographically random
- Session cookies are httpOnly for security
- All timestamps are in UTC
- Soft deletes preserve audit trail
- Activity logs are kept for compliance

---

**Last Updated**: Phase 5 Complete
**Total Features**: 30+
**New API Routes**: 8
**New Convex Functions**: 25+
**Files Created**: 10
**Files Enhanced**: 8
