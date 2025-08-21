
// --- backend/---
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');



//Routes
const authRoutes = require('./routes/authRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const agentRoutes = require('./routes/agentRoutes');
const organizationUserRoutes = require('./routes/organizationUserRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/organization', organizationRoutes); // <-- NEW
app.use('/api/agents', agentRoutes);
app.use('/api/users', organizationUserRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));