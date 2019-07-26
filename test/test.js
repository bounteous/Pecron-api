require('../src/modules/db.module');
const expect = require('chai').expect;
const pecronUserModule = require('../src/user/user.module')();

describe('PECRON Api testing', () => {
  describe('Testing user endpoints', () => {
    it('Create admin', async () => {
      const createAdmin = await pecronUserModule.createDefaultAdmin();
      expect(createAdmin).to.equal(0);
    });
  });
});
