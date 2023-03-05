import mongoose, { Schema } from 'mongoose';
import { UserModel } from './users.mongo.model';
import { dbConnect } from '../db/db.connect';

describe('Given ', () => {
  Schema.prototype.set = jest.fn();
  const spyModel = jest.spyOn(mongoose, 'model');
  describe('When', () => {
    test('Then it should ...', async () => {
      await dbConnect('dev');
      expect(spyModel).not.toHaveBeenCalled();
      const [document] = await UserModel.find();
      document.toJSON();
      expect(Schema.prototype.set).not.toHaveBeenCalled();
      mongoose.disconnect();
    });
  });
});
