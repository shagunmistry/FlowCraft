# FlowCraft API Keys Feature - Setup Guide

This document provides instructions for setting up and using the API Keys feature in FlowCraft.

## Overview

The API Keys feature allows users to:
- Generate secure API keys for programmatic access
- Use API keys with the FlowCraft VS Code extension
- Authenticate API requests to generate and read diagrams
- Manage keys with custom expiration dates
- Revoke keys instantly when needed

## Architecture

### Database Schema

The feature uses a new `api_keys` table in Supabase with the following structure:

```sql
api_keys (
  id: UUID (primary key)
  user_id: UUID (foreign key to auth.users)
  key_hash: TEXT (SHA-256 hash of the key)
  key_preview: TEXT (masked preview)
  name: TEXT (user-friendly name)
  permissions: TEXT[] (array of permissions)
  created_at: TIMESTAMP
  last_used_at: TIMESTAMP
  expires_at: TIMESTAMP (nullable)
  is_active: BOOLEAN
)
```

### Security Features

- **Hashed Storage**: API keys are hashed using SHA-256 before storage
- **One-Time Display**: Full keys are only shown once during creation
- **Row Level Security**: Enabled with policies for user isolation
- **Expiration Support**: Custom expiration dates (30/90/365 days or never)
- **Instant Revocation**: Keys can be deleted immediately
- **Last Used Tracking**: Automatic timestamp updates on key usage

## Setup Instructions

### 1. Run Database Migration

Execute the SQL migration in your Supabase dashboard:

```bash
# Navigate to Supabase SQL Editor and run:
supabase/migrations/create_api_keys_table.sql
```

Or connect via CLI:

```bash
psql "postgresql://[CONNECTION_STRING]" < supabase/migrations/create_api_keys_table.sql
```

### 2. Verify Database Setup

Check that the table and policies were created:

```sql
-- Verify table exists
SELECT * FROM api_keys LIMIT 1;

-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'api_keys';

-- Verify policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'api_keys';
```

### 3. Test API Endpoints

The following endpoints are now available:

#### Create API Key
```bash
curl -X POST https://flowcraft.app/api/api-keys \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "name": "Test Key",
    "permissions": ["generate_diagrams", "read_diagrams"],
    "expires_at": "2025-12-31T23:59:59Z"
  }'
```

#### List API Keys
```bash
curl -X GET https://flowcraft.app/api/api-keys \
  -H "Cookie: your-session-cookie"
```

#### Delete API Key
```bash
curl -X DELETE https://flowcraft.app/api/api-keys/[key-id] \
  -H "Cookie: your-session-cookie"
```

### 4. Test API Key Authentication

Test that API keys work for authenticated endpoints:

```bash
# Generate a diagram using API key
curl -X POST https://flowcraft.app/api/generate-diagram \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer fc_live_your_api_key_here" \
  -d '{
    "title": "Test Diagram",
    "description": "A simple test diagram",
    "type": "Flow Diagram"
  }'

# Get diagrams using API key
curl -X GET https://flowcraft.app/api/get-diagrams \
  -H "Authorization: Bearer fc_live_your_api_key_here"
```

## File Structure

### New Files Created

```
src/
├── app/
│   ├── api/
│   │   ├── api-keys/
│   │   │   ├── route.ts                    # GET, POST endpoints
│   │   │   └── [id]/
│   │   │       └── route.ts                # DELETE, PATCH endpoints
│   ├── docs/
│   │   └── api/
│   │       └── page.tsx                    # API documentation page
│   ├── features/
│   │   └── api-keys/
│   │       └── page.tsx                    # Public announcement page
│   └── dashboard/
│       └── settings/
│           └── page.tsx                    # Updated with API key manager
├── components/
│   └── ApiKeys/
│       └── ApiKeyManager.tsx               # Main UI component
├── lib/
│   ├── api-keys.ts                         # Key generation utilities
│   └── api-key-auth.ts                     # Authentication middleware
├── types/
│   └── api-keys.ts                         # TypeScript types
└── supabase/
    └── migrations/
        └── create_api_keys_table.sql       # Database schema
```

### Modified Files

```
src/app/api/
├── generate-diagram/route.ts               # Added API key auth support
└── get-diagrams/route.ts                   # Added API key auth support
```

## Features

### API Key Management UI

Located in: `src/app/dashboard/settings/page.tsx`

Features:
- Create new API keys with custom names and expiration
- View all API keys with status indicators
- Copy key previews to clipboard
- Delete (revoke) keys instantly
- Visual indicators for expired/inactive keys
- Apple-inspired design aesthetic

### Public Pages

1. **Feature Announcement**: `/features/api-keys`
   - SEO optimized landing page
   - Feature highlights and benefits
   - Use cases and examples
   - FAQ section

2. **API Documentation**: `/docs/api`
   - Complete API reference
   - Code examples in multiple languages
   - Error handling guide
   - Best practices

## API Key Permissions

Current supported permissions:

- `generate_diagrams`: Create new diagrams via API
- `read_diagrams`: Retrieve existing diagrams

Additional permissions can be added by:
1. Updating `ApiKeyPermission` type in `src/types/api-keys.ts`
2. Modifying validation in `src/app/api/api-keys/route.ts`
3. Adding permission checks in relevant endpoints

## Security Best Practices

### For Users

1. **Never commit API keys** to version control
2. **Use environment variables** to store keys
3. **Rotate keys regularly** (every 90 days recommended)
4. **Use specific expiration dates** instead of "never expire"
5. **Revoke unused keys** immediately

### For Developers

1. **Key Format**: `fc_live_` prefix for easy identification
2. **Hashing**: Always hash keys before storage (SHA-256)
3. **One-time Display**: Full keys shown only during creation
4. **Rate Limiting**: Same limits as user's account plan
5. **Audit Logging**: Track last_used_at for monitoring

## Troubleshooting

### Common Issues

**Issue**: "Not authenticated" error when using API key

**Solution**: Verify the Authorization header format:
```
Authorization: Bearer fc_live_your_key_here
```

---

**Issue**: API key not found or expired

**Solution**: Check in dashboard settings:
- Verify key is still active
- Check expiration date
- Ensure key wasn't revoked

---

**Issue**: Database migration fails

**Solution**:
1. Check Supabase connection
2. Verify you have admin privileges
3. Check for existing table conflicts
4. Review Supabase logs for specific errors

## VS Code Extension Integration

To use API keys with the FlowCraft VS Code extension:

1. Install the FlowCraft extension from VS Code marketplace
2. Open extension settings
3. Add your API key in the "API Key" field
4. Start generating diagrams directly from VS Code

## Monitoring & Analytics

Track API key usage:

```sql
-- Most used API keys
SELECT
  name,
  last_used_at,
  created_at
FROM api_keys
WHERE user_id = 'your-user-id'
ORDER BY last_used_at DESC;

-- Expired keys that need cleanup
SELECT
  name,
  expires_at
FROM api_keys
WHERE expires_at < NOW()
  AND is_active = true;
```

## Future Enhancements

Potential improvements for future versions:

- [ ] Rate limiting per API key
- [ ] Usage analytics dashboard
- [ ] Webhook support
- [ ] Key rotation automation
- [ ] IP whitelist/blacklist
- [ ] Scoped permissions (read-only, write-only)
- [ ] Team API keys (shared across organization)
- [ ] API key templates

## Support

For issues or questions:

- **Documentation**: https://flowcraft.app/docs/api
- **Feature Page**: https://flowcraft.app/features/api-keys
- **Support**: Contact via dashboard settings

## License

This feature is part of FlowCraft and follows the same license terms.
