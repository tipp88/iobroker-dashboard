#!/bin/bash

# Installation script for ioBroker Dashboard service

echo "Installing ioBroker Dashboard as a system service..."

# Copy service file
sudo cp /home/claude/Desktop/ClaudeCode_test/iobroker-dashboard/iobroker-dashboard.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable iobroker-dashboard

# Start the service
sudo systemctl start iobroker-dashboard

# Check status
echo ""
echo "Service status:"
sudo systemctl status iobroker-dashboard

echo ""
echo "Dashboard is now available at: http://192.168.178.154:5173"
