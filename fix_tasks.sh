#!/bin/bash

# Set default values
default_class="CUSTOM"
default_status="UNSTARTED"
default_snoozed=false

# Read tasks.json and update with default values for missing attributes
jq 'map(. + {class: (.class // "'$default_class'"),
             status: (.status // "'$default_status'"),
             snoozed: (.snoozed // '$default_snoozed')})' tasks.json > tasks_fixed.json

