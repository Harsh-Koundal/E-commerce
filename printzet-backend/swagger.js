import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'PrintZet API',
    description: 'Auto-generated Swagger documentation',
  },
  host: process.env.HOST || 'localhost:5020',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: "Protected",
      description: "Routes requiring Bearer Token"
    }
  ],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'JWT authorization token'
    }
  },
  definitions: {
    ErrorResponse: {
      message: "Error message",
      code: "HTTP status code",
      type: "Error type"
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './server.js',
  './routes/accessoryorderRoutes.js',
  './routes/vendorAuth.js',
  './routes/vendor.js',
  './routes/vendorServiceRoutes.js',
  './routes/phonepayRoute.js',
  './routes/cart.js',
  './routes/careerRoutes.js',
  './routes/support-feedbackRoutes.js',
  './routes/savedDesignRoutes.js',
  './routes/documentRoutes.js',
  './routes/userRoutes.js',
  './routes/categoryRoutes.js',
  './routes/accessoryRoutes.js',
  './routes/orderRoutes.js',
  './routes/adminRoutes.js',
];

// Generate Swagger documentation
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);