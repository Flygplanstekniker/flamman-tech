# Flamman Tech - Backend Integration Contracts

## API Contracts

### Contact Form Endpoint
- **Endpoint**: `POST /api/contact`
- **Purpose**: Handle contact form submissions and send emails
- **Request Body**:
  ```json
  {
    "name": "string (required)",
    "email": "string (required, valid email)",
    "phone": "string (optional)",
    "subject": "string (required)",
    "message": "string (required)"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Meddelande skickat framgångsrikt"
  }
  ```

## Data Mocking to Replace

### Mock Data in frontend/src/mock.js
- Contact form submission is currently showing toast messages only
- Need to replace with actual API call to backend

### Frontend Integration Changes Needed

1. **Contact.jsx**: 
   - Replace mock form submission with actual API call
   - Add proper error handling
   - Keep success toast messages

2. **Environment Variables**:
   - Backend will need SMTP credentials for email sending

## Backend Implementation Plan

1. **Email Service**:
   - SMTP configuration for sending emails
   - Email template for contact form submissions
   - Send to: melvin@flammantech.se
   - Include all form data in email

2. **Validation**:
   - Server-side form validation
   - Email format validation
   - Required fields validation

3. **Error Handling**:
   - Proper HTTP status codes
   - Swedish error messages
   - Rate limiting for spam protection

## Environment Variables Needed

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@flammantech.se
EMAIL_TO=melvin@flammantech.se
```

## Deployment Considerations for Hestia

1. **Static Files**: Frontend build files need to be served
2. **Backend Process**: FastAPI server needs to run as service
3. **Domain Configuration**: Both frontend and backend routing
4. **SSL Certificate**: HTTPS setup
5. **Environment Variables**: Secure storage of SMTP credentials