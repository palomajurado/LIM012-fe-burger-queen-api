module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true,
    },
<<<<<<< HEAD
    autoStart: false,
    instance: {},
=======
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
>>>>>>> 13cff79a920c19a6efc5e7e35832a5543ae43b8f
  },
};
