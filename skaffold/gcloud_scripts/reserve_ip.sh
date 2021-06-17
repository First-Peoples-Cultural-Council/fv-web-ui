#!/bin/sh
echo "Reserving a global ip address"
gcloud compute addresses create fv-skaffold --global
echo "Requesting details of IP address (for DNS registration)"
gcloud compute addresses describe fv-skaffold --global
