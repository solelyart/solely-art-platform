# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - generic [ref=e6]: Sign In Required
    - generic [ref=e7]:
      - paragraph [ref=e8]: You need to be signed in to book an artist.
      - link "Sign In" [ref=e9] [cursor=pointer]:
        - /url: https://manus.im/app-auth?appId=b8XDdB8n6irgSrJYrYA6i8&redirectUri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Foauth%2Fcallback&state=aHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9vYXV0aC9jYWxsYmFjaw%3D%3D&type=signIn
      - link "Back to Artist Profile" [ref=e10] [cursor=pointer]:
        - /url: /artist/150001
```