
## Getting started

To get started with this template, first install the pnpm dependencies:

```bash
pnpm install
```

Next, run the development server:

```bash
pnpm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.


# AWS SES
## Configuration
To test the validity of the SMPT endpoint, you can use the following command:
```bash
openssl s_client -crlf -quiet -starttls smtp -connect email-smtp.us-east-1.amazonaws.com:587
```
