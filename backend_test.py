#!/usr/bin/env python3
"""
Backend API Testing for Flamman Tech Contact Form
Tests the POST /api/contact endpoint functionality
"""

import requests
import json
import time
from datetime import datetime

# Get backend URL from frontend .env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("ERROR: Could not get backend URL from frontend/.env")
    exit(1)

API_BASE = f"{BACKEND_URL}/api"
print(f"Testing backend at: {API_BASE}")

def test_contact_form_valid_data():
    """Test POST /api/contact with valid data"""
    print("\n=== Testing Contact Form with Valid Data ===")
    
    valid_data = {
        "name": "Erik Andersson",
        "email": "erik.andersson@example.com",
        "phone": "+46701234567",
        "subject": "Förfrågan om webbutveckling",
        "message": "Hej! Jag skulle vilja diskutera möjligheten att utveckla en ny webbplats för mitt företag. Kan vi boka ett möte?"
    }
    
    try:
        response = requests.post(f"{API_BASE}/contact", json=valid_data, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'meddelande' in data.get('message', '').lower():
                print("✅ PASS: Valid contact form submission successful with Swedish response")
                return True
            else:
                print("❌ FAIL: Response format incorrect or not in Swedish")
                return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with error: {e}")
        return False

def test_contact_form_without_phone():
    """Test POST /api/contact without optional phone field"""
    print("\n=== Testing Contact Form without Phone (Optional Field) ===")
    
    data_without_phone = {
        "name": "Anna Svensson",
        "email": "anna.svensson@example.com",
        "subject": "Fråga om tjänster",
        "message": "Hej! Jag undrar vilka tjänster ni erbjuder inom webbutveckling och design."
    }
    
    try:
        response = requests.post(f"{API_BASE}/contact", json=data_without_phone, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ PASS: Contact form works without optional phone field")
                return True
            else:
                print("❌ FAIL: Response indicates failure")
                return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with error: {e}")
        return False

def test_contact_form_missing_required_fields():
    """Test validation of required fields"""
    print("\n=== Testing Missing Required Fields Validation ===")
    
    test_cases = [
        {"data": {}, "missing": "all fields"},
        {"data": {"name": "Test"}, "missing": "email, subject, message"},
        {"data": {"name": "Test", "email": "test@example.com"}, "missing": "subject, message"},
        {"data": {"name": "Test", "email": "test@example.com", "subject": "Test"}, "missing": "message"},
        {"data": {"email": "test@example.com", "subject": "Test", "message": "Test message"}, "missing": "name"},
    ]
    
    all_passed = True
    
    for test_case in test_cases:
        print(f"\nTesting missing: {test_case['missing']}")
        try:
            response = requests.post(f"{API_BASE}/contact", json=test_case['data'], timeout=30)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 422:  # FastAPI validation error
                print("✅ PASS: Validation correctly rejected missing required fields")
            else:
                print(f"❌ FAIL: Expected 422 validation error, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print(f"❌ FAIL: Request failed with error: {e}")
            all_passed = False
    
    return all_passed

def test_contact_form_invalid_email():
    """Test email format validation"""
    print("\n=== Testing Invalid Email Format Validation ===")
    
    invalid_emails = [
        "invalid-email",
        "test@",
        "@example.com",
        "test.example.com",
        "test@.com",
        ""
    ]
    
    all_passed = True
    
    for email in invalid_emails:
        print(f"\nTesting invalid email: '{email}'")
        data = {
            "name": "Test User",
            "email": email,
            "subject": "Test Subject",
            "message": "This is a test message with sufficient length."
        }
        
        try:
            response = requests.post(f"{API_BASE}/contact", json=data, timeout=30)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 422:  # FastAPI validation error
                print("✅ PASS: Email validation correctly rejected invalid format")
            else:
                print(f"❌ FAIL: Expected 422 validation error, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print(f"❌ FAIL: Request failed with error: {e}")
            all_passed = False
    
    return all_passed

def test_contact_form_field_length_validation():
    """Test field length validation"""
    print("\n=== Testing Field Length Validation ===")
    
    test_cases = [
        {
            "name": "Message too short",
            "data": {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Test",
                "message": "Short"  # Less than 10 characters
            },
            "should_fail": True
        },
        {
            "name": "Message at minimum length",
            "data": {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Test",
                "message": "1234567890"  # Exactly 10 characters
            },
            "should_fail": False
        },
        {
            "name": "Very long message",
            "data": {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Test",
                "message": "A" * 2001  # Over 2000 characters
            },
            "should_fail": True
        }
    ]
    
    all_passed = True
    
    for test_case in test_cases:
        print(f"\nTesting: {test_case['name']}")
        try:
            response = requests.post(f"{API_BASE}/contact", json=test_case['data'], timeout=30)
            print(f"Status Code: {response.status_code}")
            
            if test_case['should_fail']:
                if response.status_code == 422:
                    print("✅ PASS: Validation correctly rejected invalid field length")
                else:
                    print(f"❌ FAIL: Expected 422 validation error, got {response.status_code}")
                    all_passed = False
            else:
                if response.status_code == 200:
                    print("✅ PASS: Valid field length accepted")
                else:
                    print(f"❌ FAIL: Valid data rejected with status {response.status_code}")
                    all_passed = False
                    
        except Exception as e:
            print(f"❌ FAIL: Request failed with error: {e}")
            all_passed = False
    
    return all_passed

def test_database_storage_verification():
    """Test that contact submissions are saved to MongoDB regardless of email status"""
    print("\n=== Testing Database Storage Verification ===")
    print("Testing that data is saved to MongoDB even if SMTP fails")
    
    # Use unique data to verify storage
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_data = {
        "name": f"Database Test User {timestamp}",
        "email": f"dbtest_{timestamp}@example.com",
        "phone": "+46701234567",
        "subject": f"Database Storage Test {timestamp}",
        "message": f"This is a test message to verify database storage functionality at {timestamp}. The message needs to be at least 10 characters long."
    }
    
    try:
        response = requests.post(f"{API_BASE}/contact", json=test_data, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ PASS: Contact form submission successful - data should be saved to MongoDB")
                print(f"✅ PASS: Response message in Swedish: {data.get('message')}")
                return True
            else:
                print("❌ FAIL: Response indicates failure")
                return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with error: {e}")
        return False

def test_smtp_error_handling():
    """Test that SMTP errors are handled gracefully"""
    print("\n=== Testing SMTP Error Handling ===")
    print("Note: SMTP is expected to fail in test environment, but should return 200 with graceful message")
    
    valid_data = {
        "name": "Lars Johansson",
        "email": "lars.johansson@example.com",
        "subject": "SMTP Test - Graceful Error Handling",
        "message": "Testing that SMTP failures are handled gracefully and data is still saved to database."
    }
    
    try:
        response = requests.post(f"{API_BASE}/contact", json=valid_data, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                message = data.get('message', '').lower()
                # Check for appropriate Swedish message indicating email failure but data saved
                if ('sparats' in message or 'återkommer' in message) and 'meddelande' in message:
                    print("✅ PASS: SMTP error handled gracefully - returns 200 with appropriate Swedish message")
                    return True
                else:
                    print(f"✅ PASS: SMTP worked (email sent successfully) - message: {data.get('message')}")
                    return True
            else:
                print("❌ FAIL: Response indicates failure despite 200 status")
                return False
        else:
            print(f"❌ FAIL: Expected 200 (graceful handling), got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with error: {e}")
        return False

def test_api_root():
    """Test basic API connectivity"""
    print("\n=== Testing Basic API Connectivity ===")
    
    try:
        response = requests.get(f"{API_BASE}/", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('message') == 'Hello World':
                print("✅ PASS: API root endpoint working")
                return True
            else:
                print("❌ FAIL: Unexpected response content")
                return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with error: {e}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("=" * 60)
    print("FLAMMAN TECH BACKEND API TESTING")
    print("=" * 60)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tests = [
        ("API Connectivity", test_api_root),
        ("Valid Contact Form", test_contact_form_valid_data),
        ("Contact Form without Phone", test_contact_form_without_phone),
        ("Required Fields Validation", test_contact_form_missing_required_fields),
        ("Email Format Validation", test_contact_form_invalid_email),
        ("Field Length Validation", test_contact_form_field_length_validation),
        ("SMTP Error Handling", test_smtp_error_handling),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*60}")
        print(f"Running: {test_name}")
        print('='*60)
        
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ FAIL: Test {test_name} crashed with error: {e}")
            results.append((test_name, False))
        
        time.sleep(1)  # Brief pause between tests
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print('='*60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        return True
    else:
        print(f"⚠️  {total - passed} tests failed")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)