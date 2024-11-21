const request = require('supertest'); // To test the Express app
const { app, resetInactivityTimer, shutdownServer, startServer } = require('./app');

// // Mock the shutdownServer function so it doesn't actually shut down the server
// jest.mock('./app', () => ({
//   ...jest.requireActual('./app'),
//   shutdownServer: jest.fn(),
// }));

describe('Express App', () => {
  let server;

  // beforeAll(() => {
  //   // Start the server before all tests
  //   server = startServer();
  // });

  // beforeEach(() => {
  //   // Reset the inactivity timer before each test
  //   resetInactivityTimer();
  // });

  // afterAll(() => {
  //   // Ensure server is properly closed after all tests
  //   if (server) {
  //     server.close();
  //   }
  // });

  // afterEach(() => {
  //   // Optionally, reset any mocks or timers here
  //   jest.clearAllMocks();
  // });

  test('should respond with "Hello, world!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, world!');
  });

  // test('should reset inactivity timer on request', async () => {
  //   const spy = jest.spyOn(global, 'clearTimeout'); // Spy on clearTimeout

  //   // Send a request to reset the inactivity timer
  //   await request(app).get('/');

  //   // Check if the inactivity timer was reset (clearTimeout should be called)
  //   expect(spy).toHaveBeenCalled();
  //   spy.mockRestore(); // Clean up the spy
  // });

  // test('should not shut down server after inactivity in tests', async () => {
  //   // Ensure the shutdownServer is not called during tests
  //   await request(app).get('/');
  //   expect(shutdownServer).not.toHaveBeenCalled();
  // });
});
