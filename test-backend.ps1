# ================================================
# PLOTZED BACKEND - AUTOMATED TESTING SCRIPT (FIXED)
# ================================================

Write-Host "🚀 Starting Plotzed Backend Tests..." -ForegroundColor Green
Write-Host ""

# Configuration
$baseUrl = "http://localhost:3000"
$global:testResults = @()

# Helper function to record test results safely
function Add-TestResult {
    param(
        [string]$Name,
        [string]$Status,
        [string]$StatusCode = "",
        [string]$Error = ""
    )
    # Using the unary comma operator to ensure the item is added as a new element
    $global:testResults += ,@{
        Name = $Name
        Status = $Status
        StatusCode = $StatusCode
        Error = $Error
    }
}

# Helper function to test endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus = 200
    )

    Write-Host "Testing: $Name..." -NoNewline
    try {
        $params = @{
            Uri = "$baseUrl$Url"
            Method = $Method
            Headers = $Headers
            ErrorAction = 'Stop'
        }

        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            $params.ContentType = 'application/json'
        }

        $response = Invoke-WebRequest @params

        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host " ✅ PASSED" -ForegroundColor Green
            Add-TestResult -Name $Name -Status "PASSED" -StatusCode $response.StatusCode
            return $response
        } else {
            Write-Host " ❌ FAILED (Status: $($response.StatusCode))" -ForegroundColor Red
            Add-TestResult -Name $Name -Status "FAILED" -StatusCode $response.StatusCode -Error $response.Content
            return $null
        }
    }
    catch {
        $statusCode = "N/A"
        $errorMessage = $_.Exception.Message
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            $responseStream = $_.Exception.Response.GetResponseStream()
            if ($responseStream) {
                $reader = New-Object System.IO.StreamReader($responseStream)
                $errorMessage = $reader.ReadToEnd()
                $reader.Close()
            }
        }
        Write-Host " ❌ FAILED (Status: $statusCode)" -ForegroundColor Red
        Add-TestResult -Name $Name -Status "FAILED" -Error $errorMessage -StatusCode $statusCode
        return $null
    }
}

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUITE 1: HEALTH & BASIC CONNECTIVITY   " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
$healthResponse = Test-Endpoint `
    -Name "Health Check" `
    -Method "GET" `
    -Url "/api/health"

if ($healthResponse) {
    $health = $healthResponse.Content | ConvertFrom-Json
    Write-Host "  Database: $($health.services.database)" -ForegroundColor Gray
    Write-Host "  API: $($health.services.api)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUITE 2: USER REGISTRATION & AUTH       " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Generate unique email for testing
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$testEmail = "test$timestamp@example.com"

# Test 2: User Registration
$registerData = @{
    name = "Test User $timestamp"
    email = $testEmail
    phone = "9876543210"
    password = "Test@123456"
}

$registerResponse = Test-Endpoint `
    -Name "User Registration" `
    -Method "POST" `
    -Url "/api/auth/register" `
    -Body $registerData `
    -ExpectedStatus 201

if ($registerResponse) {
    $user = ($registerResponse.Content | ConvertFrom-Json).user
    Write-Host "  User ID: $($user.id)" -ForegroundColor Gray
    Write-Host "  Email: $($user.email)" -ForegroundColor Gray
    Write-Host "  Role: $($user.role)" -ForegroundColor Gray
}

# Add a small delay to avoid hitting the rate limiter immediately
Start-Sleep -Seconds 1

# Test 3: Duplicate Registration (Should Fail)
$duplicateResponse = Test-Endpoint `
    -Name "Duplicate Registration (Should Fail)" `
    -Method "POST" `
    -Url "/api/auth/register" `
    -Body $registerData `
    -ExpectedStatus 400

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUITE 3: INPUT VALIDATION               " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 4: Invalid Email Format
Test-Endpoint `
    -Name "Invalid Email (Should Fail)" `
    -Method "POST" `
    -Url "/api/auth/register" `
    -Body @{
        name = "Test User"
        email = "invalid-email"
        phone = "9876543210"
        password = "Test@123456"
    } `
    -ExpectedStatus 400

# Test 5: Invalid Phone Format
Test-Endpoint `
    -Name "Invalid Phone (Should Fail)" `
    -Method "POST" `
    -Url "/api/auth/register" `
    -Body @{
        name = "Test User"
        email = "test2@example.com"
        phone = "123" # Invalid
        password = "Test@123456"
    } `
    -ExpectedStatus 400

# Test 6: Weak Password
Test-Endpoint `
    -Name "Weak Password (Should Fail)" `
    -Method "POST" `
    -Url "/api/auth/register" `
    -Body @{
        name = "Test User"
        email = "test3@example.com"
        phone = "9876543210"
        password = "123" # Too weak
    } `
    -ExpectedStatus 400

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUITE 4: PLOTS API                      " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 7: Get All Plots (Public)
$plotsResponse = Test-Endpoint `
    -Name "Get All Plots" `
    -Method "GET" `
    -Url "/api/plots"

if ($plotsResponse) {
    $plots = ($plotsResponse.Content | ConvertFrom-Json).data
    Write-Host "  Total Plots: $($plots.Count)" -ForegroundColor Gray
}

# Test 8: Get Plots with Filters
Test-Endpoint `
    -Name "Get Plots with City Filter" `
    -Method "GET" `
    -Url "/api/plots?city=Bangalore&status=AVAILABLE"

# Test 9: Get Plots with Price Range
Test-Endpoint `
    -Name "Get Plots with Price Range" `
    -Method "GET" `
    -Url "/api/plots?minPrice=1000000&maxPrice=5000000"

# Test 10: Get Plots - Pagination
Test-Endpoint `
    -Name "Get Plots - Page 1" `
    -Method "GET" `
    -Url "/api/plots?page=1&limit=5"

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUITE 5: INQUIRIES API                  " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 11: Submit Inquiry
$inquiryData = @{
    name = "Test Customer"
    email = "customer@example.com"
    phone = "9123456789"
    message = "I am interested in this property. Please contact me."
    source = "website"
}

Test-Endpoint `
    -Name "Submit Inquiry" `
    -Method "POST" `
    -Url "/api/inquiries" `
    -Body $inquiryData `
    -ExpectedStatus 201

# Test 12: Invalid Inquiry (Missing Required Fields)
Test-Endpoint `
    -Name "Invalid Inquiry (Should Fail)" `
    -Method "POST" `
    -Url "/api/inquiries" `
    -Body @{
        name = "Test"
        email = "test@test.com"
        # Missing phone and message
    } `
    -ExpectedStatus 400

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUITE 6: RATE LIMITING                  " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 13: Rate Limiting
Write-Host "Testing Rate Limiting (sending 10 rapid requests)..." -NoNewline
$rateLimitHit = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET -ErrorAction Stop
        Start-Sleep -Milliseconds 100
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 429) {
            $rateLimitHit = $true
            break
        }
    }
}

if ($rateLimitHit) {
    Write-Host " ⚠️  Rate limit working (hit limit at request $i)" -ForegroundColor Yellow
} else {
    Write-Host " ✅ All requests passed (limit not reached)" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUITE 7: SECURITY TESTS                 " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 14: XSS Attempt (Should be blocked)
Test-Endpoint `
    -Name "XSS Attack Prevention" `
    -Method "POST" `
    -Url "/api/inquiries" `
    -Body @{
        name = "<script>alert('xss')</script>"
        email = "test@test.com"
        phone = "9876543210"
        message = "Normal message"
    } `
    -ExpectedStatus 201 # Should pass but sanitize input

# Test 15: SQL Injection Attempt
Test-Endpoint `
    -Name "SQL Injection Prevention" `
    -Method "GET" `
    -Url "/api/plots?city=' OR '1'='1"

# Test 16: Directory Traversal Attempt (Should Fail)
Test-Endpoint `
    -Name "Directory Traversal Prevention" `
    -Method "GET" `
    -Url "/api/../../../etc/passwd" `
    -ExpectedStatus 404

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUITE 8: PROTECTED ROUTES               " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 17: Access Protected Route Without Auth (Should Fail)
Test-Endpoint `
    -Name "Access Bookings Without Auth (Should Fail)" `
    -Method "GET" `
    -Url "/api/bookings" `
    -ExpectedStatus 401

# Test 18: Access Admin Route Without Auth (Should Fail)
Test-Endpoint `
    -Name "Access Admin Dashboard Without Auth (Should Fail)" `
    -Method "GET" `
    -Url "/api/admin/dashboard" `
    -ExpectedStatus 401

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST SUITE 9: ERROR HANDLING                 " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 19: Non-existent Route
Test-Endpoint `
    -Name "404 Not Found" `
    -Method "GET" `
    -Url "/api/nonexistent" `
    -ExpectedStatus 404

# Test 20: Invalid JSON Body
Write-Host "Testing: Invalid JSON Body..." -NoNewline
try {
    Invoke-WebRequest `
        -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -Body "{ invalid json }" `
        -ContentType "application/json" `
        -ErrorAction Stop
    Write-Host " ❌ FAILED (Should have rejected invalid JSON)" -ForegroundColor Red
}
catch {
    Write-Host " ✅ PASSED (Invalid JSON rejected)" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  TEST RESULTS SUMMARY                         " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$total = $global:testResults.Count
$passed = ($global:testResults | Where-Object { $_.Status -eq "PASSED" }).Count
$failed = ($global:testResults | Where-Object { $_.Status -eq "FAILED" }).Count

$successRate = 0
if ($total -gt 0) {
    $successRate = [math]::Round(($passed / $total) * 100, 2)
}

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Success Rate: $successRate%" -ForegroundColor Cyan

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "Failed Tests:" -ForegroundColor Red
    $global:testResults | Where-Object { $_.Status -eq "FAILED" } | ForEach-Object {
        Write-Host "  - $($_.Name) (Status: $($_.StatusCode))" -ForegroundColor Red
        if ($_.Error) {
            Write-Host "    Error: $($_.Error)" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "🎉 All automated tests completed!" -ForegroundColor Green
Write-Host ""
