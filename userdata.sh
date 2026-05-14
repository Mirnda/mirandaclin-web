#!/bin/bash
set -e
if ! command -v docker &>/dev/null; then
  if command -v amazon-linux-extras &>/dev/null; then
    amazon-linux-extras install docker -y
  elif command -v dnf &>/dev/null; then
    dnf install -y docker
  else
    apt-get update -y && apt-get install -y docker.io
  fi
  systemctl enable docker
  systemctl start docker
fi

if ! command -v nginx &> /dev/null; then
  sudo yum update -y
  sudo yum install -y nginx
fi