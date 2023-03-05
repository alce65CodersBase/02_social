import { User } from '../entities/user';
import { Repo } from './repo.interface';
import createDebug from 'debug';
import { UserModel } from './users.mongo.model';
import { HTTPError } from '../errors/errors';
const debug = createDebug('Social:repo:users');
export class UsersMongoRepo implements Repo<User> {
  private static instance: UsersMongoRepo;

  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance) {
      UsersMongoRepo.instance = new UsersMongoRepo();
    }

    return UsersMongoRepo.instance;
  }

  private constructor() {
    debug('Instantiate');
  }

  async query(): Promise<User[]> {
    debug('query');
    const data = await UserModel.find()
      .populate('friends', { friends: 0, enemies: 0 })
      .populate('enemies', { friends: 0, enemies: 0 });
    return data;
  }

  async queryId(id: string): Promise<User> {
    debug('queryId');
    const data = await UserModel.findById(id)
      .populate('friends', { friends: 0, enemies: 0 })
      .populate('enemies', { friends: 0, enemies: 0 });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async search(query: { [key: string]: unknown }): Promise<User[]> {
    debug('search');
    const data = await UserModel.find({ [query.key as string]: query.value })
      .populate('friends', { friends: 0, enemies: 0 })
      .populate('enemies', { friends: 0, enemies: 0 });
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('create');
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    })
      .populate('friends', { friends: 0, enemies: 0 })
      .populate('enemies', { friends: 0, enemies: 0 });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy');
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(404, 'Not found', 'Delete not posible: id not found');
  }
}
