#!/bin/bash
cd /home/kavia/workspace/code-generation/silentsupport-28838-a5f9d0a7/fastapi_backend_workspace/fastapi_backend
source venv/bin/activate
flake8 .
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

