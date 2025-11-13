import request from 'supertest';
import app from '../../server.js';
import Bug from '../../models/Bug.js';

describe('Bugs API Integration Tests', () => {
  let testBug;

  beforeEach(async () => {
    // Create a test bug for update/delete tests
    testBug = await Bug.create({
      title: 'Initial Test Bug',
      description: 'This is an initial test bug description',
      status: 'open',
      priority: 'high',
      reporter: 'Test User'
    });
  });

  describe('GET /api/bugs', () => {
    it('should fetch all bugs', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/bugs', () => {
    it('should create a new bug', async () => {
      const newBug = {
        title: 'New Test Bug',
        description: 'This is a detailed description of the new test bug',
        status: 'open',
        priority: 'medium',
        reporter: 'Jane Doe',
        stepsToReproduce: ['Step 1', 'Step 2'],
        environment: {
          os: 'Windows 10',
          browser: 'Chrome',
          version: '115.0'
        }
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(newBug)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newBug.title);
      expect(response.body.data.description).toBe(newBug.description);
    });

    it('should reject invalid bug data', async () => {
      const invalidBug = {
        title: 'A', // Too short
        description: 'Short', // Too short
        reporter: 'J' // Too short
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeInstanceOf(Array);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    it('should update an existing bug', async () => {
      const updates = {
        title: 'Updated Test Bug',
        status: 'in-progress',
        assignee: 'Developer'
      };

      const response = await request(app)
        .put(`/api/bugs/${testBug._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.status).toBe(updates.status);
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = '64a1b2c3d4e5f67890123456';
      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    it('should delete an existing bug', async () => {
      const response = await request(app)
        .delete(`/api/bugs/${testBug._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify bug is actually deleted
      const deletedBug = await Bug.findById(testBug._id);
      expect(deletedBug).toBeNull();
    });
  });
});