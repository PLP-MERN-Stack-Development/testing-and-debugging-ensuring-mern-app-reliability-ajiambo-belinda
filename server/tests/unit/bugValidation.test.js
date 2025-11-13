import { body, validationResult } from 'express-validator';

// Test validation logic
describe('Bug Validation', () => {
  it('should validate correct bug data', async () => {
    const validBug = {
      title: 'Test Bug',
      description: 'This is a test bug description that is long enough',
      status: 'open',
      priority: 'medium',
      reporter: 'John Doe'
    };

    const req = { body: validBug };
    
    // Run validation chain
    for (const validation of [
      body('title').isLength({ min: 3, max: 100 }),
      body('description').isLength({ min: 10 }),
      body('status').isIn(['open', 'in-progress', 'resolved']),
      body('priority').isIn(['low', 'medium', 'high', 'critical']),
      body('reporter').isLength({ min: 2 })
    ]) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should reject invalid bug data', async () => {
    const invalidBug = {
      title: 'A', // Too short
      description: 'Short', // Too short
      status: 'invalid-status',
      priority: 'invalid-priority',
      reporter: 'J' // Too short
    };

    const req = { body: invalidBug };
    
    for (const validation of [
      body('title').isLength({ min: 3, max: 100 }),
      body('description').isLength({ min: 10 }),
      body('status').isIn(['open', 'in-progress', 'resolved']),
      body('priority').isIn(['low', 'medium', 'high', 'critical']),
      body('reporter').isLength({ min: 2 })
    ]) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(5);
  });
});