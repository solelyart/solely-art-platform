# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "Booking Management" [level=1] [ref=e5]
      - paragraph [ref=e6]: View and manage your bookings and client.
    - generic [ref=e8]:
      - generic [ref=e10]:
        - img [ref=e11]
        - textbox "Search bookings..." [ref=e14]
      - generic [ref=e15]:
        - textbox [ref=e16]:
          - /placeholder: Start date
        - textbox [ref=e17]:
          - /placeholder: End date
    - generic [ref=e18]:
      - tablist [ref=e19]:
        - tab "All (0)" [selected] [ref=e20] [cursor=pointer]
        - tab "Pending (0)" [ref=e21] [cursor=pointer]
        - tab "Accepted (0)" [ref=e22] [cursor=pointer]
        - tab "Declined (0)" [ref=e23] [cursor=pointer]
        - tab "Completed (0)" [ref=e24] [cursor=pointer]
        - tab "Cancelled (0)" [ref=e25] [cursor=pointer]
      - tabpanel "All (0)" [ref=e26]:
        - generic [ref=e27]:
          - img [ref=e28]
          - heading "No Bookings Found" [level=3] [ref=e30]
          - paragraph [ref=e31]: You don't have any bookings yet.
```