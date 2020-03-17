#!/bin/bash
set -Eeuo pipefail
set -x
npm run build
npm run start