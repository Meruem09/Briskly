const express = require('express');
const cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const {clerkMiddleware} = require('@clerk/clerk-react')
