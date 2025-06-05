const mongoose = require('mongoose');

const connectDB = async () => {
    const connectionString = process.env.CONNECTION_MONGODB_STRING;
    try {
        const connection = await mongoose.connect(connectionString);
        console.log('Connected to MongoDB:',
                    connection.connection.host, ':',
                    connection.connection.port, ':',
                    connection.connection.name);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;