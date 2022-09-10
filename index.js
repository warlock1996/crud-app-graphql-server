const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core')

const express = require('express')
const parser = require('body-parser')
// const cors = require('cors')
const http = require('http')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

async function start(typeDefs, resolvers) {
	const app = express()
	const httpServer = http.createServer(app)
	// app.use(cors())
	app.use(parser.json())

	const apolloServer = new ApolloServer({
		typeDefs,
		resolvers,
		csrfPrevention: false,
		cache: 'bounded',
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			ApolloServerPluginLandingPageLocalDefault({ embed: true }),
		],
	})
	await apolloServer.start()
	apolloServer.applyMiddleware({ app })
	await new Promise((resolve) => httpServer.listen(3000, () => resolve()))
	console.log('server started at port: 3000')
}

start(typeDefs, resolvers).catch((err) => console.log(err))
