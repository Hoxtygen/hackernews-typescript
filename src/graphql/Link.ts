// import { prisma } from './../context';
import { extendType, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
	name: "Link",
	definition(t) {
		t.nonNull.int("id");
		t.nonNull.string("description");
		t.nonNull.string("url");
		t.field("postedBy", {
			type: "User",
			resolve(parent, args, context) {
				return context.prisma.link
						.findUnique({where: {id: parent.id}})
						.postedBy();
			}
		})
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

