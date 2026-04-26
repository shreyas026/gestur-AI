@echo off
REM RAG Integration Test Script for Windows
REM This script tests the RAG endpoints to verify they're working correctly

setlocal enabledelayedexpansion

REM Configuration
set API_URL=http://localhost:5000/api/translate
set TOKEN=

echo ===================================
echo GesturAI RAG Integration Tests
echo ===================================
echo.

REM Check if token is provided
if "%TOKEN%"=="" (
  echo Error: JWT token not provided
  echo Set TOKEN variable in this script or run:
  echo   set TOKEN=your_jwt_token_here
  pause
  exit /b 1
)

REM Test 1: Get RAG Stats
echo Test 1: Get RAG Service Statistics
echo.
curl -X GET "%API_URL%/rag/stats" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json"
echo.
echo.

REM Test 2: RAG Translation - Emotion Context
echo Test 2: RAG Translation - Emotion Context
echo.
curl -X POST "%API_URL%/rag" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"I am very happy today!\",\"includeMetadata\":true}"
echo.
echo.

REM Test 3: RAG Translation - Question Context
echo Test 3: RAG Translation - Question Context
echo.
curl -X POST "%API_URL%/rag" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"What is your name?\",\"includeMetadata\":true}"
echo.
echo.

REM Test 4: Compare Translations
echo Test 4: Compare Standard vs RAG Translation
echo.
curl -X POST "%API_URL%/compare" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"Hello, how are you today?\"}"
echo.
echo.

REM Test 5: Clear Cache
echo Test 5: Clear RAG Cache
echo.
curl -X POST "%API_URL%/rag/clear-cache" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json"
echo.
echo.

echo ===================================
echo All Tests Completed
echo ===================================
echo.
echo Next steps:
echo 1. Review the responses above
echo 2. Check if RAG metadata is being returned
echo 3. Verify confidence scores and detected contexts
echo 4. Compare match rates between standard and RAG
echo.
echo Documentation:
echo - RAG_README.md: Complete RAG system documentation
echo - API_ENDPOINTS.md: Detailed API endpoint reference
echo.

pause
