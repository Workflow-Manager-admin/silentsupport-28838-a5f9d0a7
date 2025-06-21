#!/bin/bash
cd /home/kavia/workspace/code-generation/silentsupport-28838-a5f9d0a7/react_frontend_workspace/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

