export type ApiKeyPermission = 'generate_diagrams' | 'read_diagrams';

export interface ApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  key_preview: string;
  name: string;
  permissions: ApiKeyPermission[];
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

export interface CreateApiKeyRequest {
  name: string;
  permissions: ApiKeyPermission[];
  expires_at?: string | null;
}

export interface CreateApiKeyResponse {
  id: string;
  key: string; // Full key, only shown once
  key_preview: string;
  name: string;
  permissions: ApiKeyPermission[];
  created_at: string;
  expires_at: string | null;
}

export interface ApiKeyListItem {
  id: string;
  key_preview: string;
  name: string;
  permissions: ApiKeyPermission[];
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}
