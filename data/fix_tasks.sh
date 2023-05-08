#!/bin/bash

# Set default values
default_class="CUSTOM"
default_status="UNSTARTED"
default_snoozed=false
default_date="2023-01-01"

# Read tasks.json and update with default values for missing attributes
jq 'map(. + {class: (.class // "'$default_class'"),
             status: (.status // "'$default_status'"),
             dateAdded: (.dateAdded // "'$default_date'"),
             snoozed: (.snoozed // '$default_snoozed')})' tasks.json > tasks_fixed.json

