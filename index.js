"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const typeDefs = (0, apollo_server_1.gql) `
  type User {
    id: Int!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: Int!, name: String, email: String): User!
    deleteUser(id: Int!): User!
  }
`;
const resolvers = {
    Query: {
        users: () => prisma.user.findMany(),
        user: (_parent, { id }) => prisma.user.findUnique({ where: { id } }),
    },
    Mutation: {
        createUser: (_parent, { name, email }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.create({ data: { name, email } });
            return { success: true, message: `User with ID ${user.id} created successfully`, user };
        }),
        updateUser: (_parent, { id, name, email }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedUser = yield prisma.user.update({ where: { id }, data: { name, email } });
            return { success: true, message: `User with ID ${updatedUser.id} updated successfully`, user: updatedUser };
        }),
        deleteUser: (_parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const deletedUser = yield prisma.user.delete({ where: { id } });
            return { success: true, message: `User with ID ${deletedUser.id} deleted successfully`, user: deletedUser };
        }),
    },
};
const server = new apollo_server_1.ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
