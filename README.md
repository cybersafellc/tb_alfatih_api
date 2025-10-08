# API Docs

HOST API : https://api.rusnandapurnama.com

## Login semua role

- POST /public/users/auth

- Request Body :

```json
{
    "username": "example",
    "password": "example
}
```

- Response Body :

```json
{
  "status": 200,
  "message": "Berhasil masuk ke akun Kliksales",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5MjdhNzFkLTA0YjItNGNjZS1iMGVmLTY3OWVmMGIxZTU1YiIsInJvbGUiOiJzdGFmZiIsImlhdCI6MTc1OTkxODQ0MSwiZXhwIjoxNzU5OTQ3MjQxfQ.g9pJD9j05UJZ4DhRVVIzB4wyZ6uzqx_spE8A24--mIg",
    "user_details": {
      "id": "d927a71d-04b2-4cce-b0ef-679ef0b1e55b",
      "username": "staff",
      "role": "staff",
      "status": true,
      "img_profile": "/img/profile/default-profile.png",
      "created_at": "2025-10-08T09:54:07.000Z",
      "updated_at": "2025-10-08T09:54:07.000Z"
    }
  },
  "refrence": null,
  "error": false
}
```
