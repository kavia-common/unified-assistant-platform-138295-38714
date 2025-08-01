#!/bin/bash
cd /home/kavia/workspace/code-generation/unified-assistant-platform-138295-38714/chatbot_platform_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

