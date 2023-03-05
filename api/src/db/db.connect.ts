import mongoose from 'mongoose';
import { config } from '../config.js';
import createDebug from 'debug';
const debug = createDebug('Social:connect');

const { user, passwd, cluster, dbName } = config;

export const dbConnect = () => {
  const uri = `mongodb+srv://${user}:${passwd}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  debug(uri);
  return mongoose.connect(uri);
};
