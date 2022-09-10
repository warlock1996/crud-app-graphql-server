const fs = require('fs/promises')
const path = require('path')
const { DateScalar } = require("./custom/scalar.js")

const readFile = async () => {
	try {
		return await fs.readFile(path.join(__dirname, 'data.json')).then((res) => JSON.parse(res.toString()))
	} catch (error) {
		console.log('file error', error)
	}
}

const writeFile = async (payload, overwrite = false) => {
	try {
		const result = await readFile()
		if(!overwrite) {
			result.push(payload)
			await fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(result))
			return result
		} else {
			await fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(payload))
			return payload
		}

	} catch (error) {
		console.log('write error', error)
	}
}

const resolvers = {
	Date: DateScalar,
	Query: {
		getAllUsers: async (parent, args, context, info) => {
			const result = await readFile()
			return result
		},
		getUserByName: async (parent, args, context, info) => {
			const result = await readFile()
			const index = result.findIndex((usr) => usr.name === args.name)
			return index >= 0 ? result[index] : null
		},
		searchUser: async (parent, args, context, info) => {
			const result = await readFile()
			const searchResults = result.filter((usr) => usr.name.indexOf(args.search) >= 0)
			return searchResults
		},
	},
	Mutation: {
		createUser: async (parent, args, context, info) => {
			const users = await readFile()
			let nextId = 1
			if (users.length > 0) {
				nextId = Number(users[users.length - 1]['id']) + 1
			}
			const payload = { id: nextId.toString(), ...args.data, createdAt: new Date() }
			const appended = await writeFile(payload)
			return appended.pop()
		},
		updateUser: async (parent, args, context, info) => {
			const result = await readFile()
			const index = result.findIndex((usr) => usr.id === args.data.id)
			if (index === -1) return null

			result[index] = { ...result[index], ...args.data }
			await writeFile(result, true)
			return result[index]
		},
		deleteUser: async (parent, args, context, info) => {
			const result = await readFile()
			const index = result.findIndex((usr) => usr.id === args.id)
			if (index === -1) return null
			const toBeDeleted = result[index]
			result.splice(index, 1)
			await writeFile(result, true)
			return toBeDeleted
		},
	},
}

module.exports = resolvers
