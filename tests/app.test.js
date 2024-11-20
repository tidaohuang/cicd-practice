// tests/app.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('should return 200 status and Hello, World! message', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});
