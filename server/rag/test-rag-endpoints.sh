#!/bin/bash

# RAG Integration Test Script
# This script tests the RAG endpoints to verify they're working correctly

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:5000/api/translate"
TOKEN="" # Set this to your JWT token

echo -e "${BLUE}=== GesturAI RAG Integration Tests ===${NC}\n"

# Check if token is provided
if [ -z "$TOKEN" ]; then
  echo -e "${RED}Error: JWT token not provided${NC}"
  echo "Set TOKEN environment variable:"
  echo "  export TOKEN='your_jwt_token_here'"
  exit 1
fi

# Test 1: Get RAG Stats
echo -e "${YELLOW}Test 1: Get RAG Service Statistics${NC}"
curl -X GET "$API_URL/rag/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"
echo ""

# Test 2: RAG Translation - Emotion Context
echo -e "${YELLOW}Test 2: RAG Translation (Emotion Context)${NC}"
curl -X POST "$API_URL/rag" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am very happy today!",
    "includeMetadata": true
  }' | jq '.' || echo "Failed"
echo ""

# Test 3: RAG Translation - Question Context
echo -e "${YELLOW}Test 3: RAG Translation (Question Context)${NC}"
curl -X POST "$API_URL/rag" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is your name?",
    "includeMetadata": true
  }' | jq '.' || echo "Failed"
echo ""

# Test 4: RAG Translation - Food Context
echo -e "${YELLOW}Test 4: RAG Translation (Food Context)${NC}"
curl -X POST "$API_URL/rag" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I want to eat lunch",
    "includeMetadata": true
  }' | jq '.' || echo "Failed"
echo ""

# Test 5: Compare Translations
echo -e "${YELLOW}Test 5: Compare Standard vs RAG Translation${NC}"
curl -X POST "$API_URL/compare" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you today?"
  }' | jq '.' || echo "Failed"
echo ""

# Test 6: RAG Translation - Without Metadata
echo -e "${YELLOW}Test 6: RAG Translation (Without Metadata)${NC}"
curl -X POST "$API_URL/rag" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Thank you very much",
    "includeMetadata": false
  }' | jq '.' || echo "Failed"
echo ""

# Test 7: Clear Cache
echo -e "${YELLOW}Test 7: Clear RAG Cache${NC}"
curl -X POST "$API_URL/rag/clear-cache" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"
echo ""

# Test 8: Verify Cache Cleared
echo -e "${YELLOW}Test 8: Verify Cache Stats After Clear${NC}"
curl -X GET "$API_URL/rag/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"
echo ""

echo -e "${GREEN}=== All Tests Completed ===${NC}"
echo ""
echo "Next steps:"
echo "1. Review the responses above"
echo "2. Check if RAG metadata is being returned"
echo "3. Verify confidence scores and detected contexts"
echo "4. Compare match rates between standard and RAG"
echo ""
echo "Documentation:"
echo "- RAG_README.md: Complete RAG system documentation"
echo "- API_ENDPOINTS.md: Detailed API endpoint reference"
