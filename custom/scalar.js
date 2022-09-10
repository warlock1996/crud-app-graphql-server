const { GraphQLScalarType} =  require("graphql")

exports.DateScalar = new GraphQLScalarType({
    name: "Date",
    serialize: function (value) {
        return new Date(value).getTime()
    },
    parseValue: function (value) {
        if(Number.isInteger(value) || typeof value === 'string')  {
            return new Date(value)
        }
    },
    parseLiteral: function (value) { 
        if(Number.isInteger(value) || typeof value === 'string')  {
            return new Date(value)
        }
    }
})