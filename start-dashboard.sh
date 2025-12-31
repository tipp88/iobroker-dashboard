#!/bin/bash

# Simple script to start the ioBroker Dashboard
# Can be used as an alternative to systemd service

cd /home/claude/Desktop/ClaudeCode_test/iobroker-dashboard
echo "Starting ioBroker Dashboard on http://192.168.178.154:5173"
npm start
