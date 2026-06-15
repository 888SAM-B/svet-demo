import requests
from ..core.config import settings

class EmailService:
    @staticmethod
    def send_enquiry_email(name: str, email: str, mobile: str, message: str, preferred_country: str) -> bool:
        """Relay website contact inquiries to administrative inbox via Brevo API"""
        api_key = settings.BREVO_API_KEY
        sender_name = settings.BREVO_SENDER_NAME
        sender_email = settings.BREVO_SENDER_EMAIL
        receiver_email = settings.BREVO_RECEIVER_EMAIL
        
        # Guard clause: bypass if keys or email details are missing
        if not api_key or api_key == "your_brevo_api_key_here" or not sender_email or not receiver_email:
            print("[EmailService] Brevo API parameters are incomplete. Bypassing email relay.")
            return False
            
        headers = {
            "accept": "application/json",
            "api-key": api_key,
            "content-type": "application/json"
        }
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #112D4E; line-height: 1.6;">
                <h2 style="color: #112D4E; border-bottom: 2px solid #3F72AF; padding-bottom: 8px;">New SVET Contact Inquiry</h2>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Mobile:</strong> {mobile}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Preferred Country:</strong> {preferred_country or 'N/A'}</p>
                <p><strong>Message / Comment:</strong></p>
                <blockquote style="border-left: 3px solid #3F72AF; padding: 10px 15px; margin: 15px 0; background-color: #F9F7F7; color: #112D4E;">
                    {message.replace(chr(10), '<br/>')}
                </blockquote>
            </body>
        </html>
        """
        
        payload = {
            "sender": {"name": sender_name, "email": sender_email},
            "to": [{"email": receiver_email, "name": "SVET Admin"}],
            "subject": f"New SVET Inquiry from {name}",
            "htmlContent": html_content
        }
        
        try:
            response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers, timeout=10)
            if response.status_code in [200, 201, 202]:
                print(f"[EmailService] Successfully sent inquiry email from {name}.")
                return True
            else:
                print(f"[EmailService] Brevo returned status code {response.status_code}: {response.text}")
                return False
        except Exception as e:
            print(f"[EmailService] Failed to send email via Brevo: {e}")
            return False

email_service = EmailService()
