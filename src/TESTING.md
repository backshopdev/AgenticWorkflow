# Testing This Project

## Test Commands
- `npm test` - runs the full test suite
- `npm run test:unit` - runs unit tests only
- `npm run test:integration` - runs integration tests only

## Test Coverage Requirements
- Minimum 80% unit test coverage
- All new features must have corresponding unit tests
- Critical paths must have integration test coverage

## Running Tests
1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Review results in the output below the test suite

## Adding New Tests
1. Place new test files in the `tests/` directory
2. Follow the existing test patterns and conventions
3. Ensure new tests are picked up by `npm test`
4. Update KTLO if testing standards change
