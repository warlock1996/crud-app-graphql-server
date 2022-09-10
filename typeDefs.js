const { gql } = require('apollo-server-express')

const schema = gql`
	scalar Date

	type User {
		id: ID
		name: String
		country: String
		createdAt: Date
	}

	input createUserInput {
		name: String!
		country: String!
	}

	input updateUserInput {
		id: ID!
		name: String!
		country: String!
	}

	type Query {
		"get all users"
		getAllUsers: [User]
		"get user by name"
		getUserByName(name: String): User
		"search user by name"
		searchUser(search: String): [User!]!
	}

	type Mutation {
		"create new user"
		createUser(data: createUserInput!): User
		"update user with new information"
		updateUser(data: updateUserInput!): User
		"delete user by id"
		deleteUser(id: String!): User
	}
`

module.exports = schema
