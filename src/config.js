exports.port = process.argv[2] || process.env.PORT || 8080;
<<<<<<< HEAD
exports.dbUrl = process.env.DB_URL
  || process.env.MONGO_URL
  || 'mongodb://localhost:27017/burguer-queen-test';
=======
exports.dbUrl = process.env.MONGO_URL || process.env.DB_URL || 'mongodb://localhost:27017/burguer-queen-test';
>>>>>>> 13cff79a920c19a6efc5e7e35832a5543ae43b8f
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';
