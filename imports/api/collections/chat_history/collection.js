import { Mongo } from 'meteor/mongo';

export const ChatHistory = new Mongo.Collection("chat_history");
