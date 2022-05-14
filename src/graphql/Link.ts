import { prisma } from './../context';
import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
	name: "Link",
	definition(t) {
		t.nonNull.int("id");
		t.nonNull.string("description");
		t.nonNull.string("url")
	}
});

let links: NexusGenObjects["Link"][] = [
	{
		id: 1,
		url: "www.howtographql.com",
		description: "Fullstack tutorial for graphql"
	},
	{
		id: 2,
		url: "graphql.org",
		description: "GraphQL official website"
	},
];

export const LinkQuery = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.list.nonNull.field("feeds", {
			type: "Link",
			resolve(_parent, _args, context) {
				return context.prisma.link.findMany()
			}
		})
		// t.nonNull.field("feed", {
		// 	type: "Link",
		// 	args: {
		// 		id: nonNull(intArg())
		// 	},
		// 	resolve(parent, args, context) {
		// 		const {id} = args
		// 		console.log("parent:", parent)
		// 		console.log("context:", context)
		// 		const link = links.find(link => link.id === id)
		// 		if (link) {
		// 			return link
		// 		}
		// 	}
		// })
	}

})


export const LinkMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("post", {
			type: "Link",
			args: {
				description: nonNull(stringArg()),
				url: nonNull(stringArg())
			},
			resolve(_parent, args, context) {
				const newLink = context.prisma.link.create({
					data: {
						description: args.description,
						url: args.url
					}
				})
				return newLink
			}
		})
	}

})

