import { extendType, nonNull, objectType, stringArg, intArg } from "nexus";

export const Link = objectType({
	name: "Link",
	definition(t) {
		t.nonNull.int("id");
		t.nonNull.string("description");
		t.nonNull.string("url");
		t.nonNull.dateTime("createdAt")
		t.field("postedBy", {
			type: "User",
			resolve(parent, args, context) {
				return context.prisma.link
					.findUnique({ where: { id: parent.id } })
					.postedBy();
			}
		});
		t.nonNull.list.nonNull.field("voters", {
			type: "User",
			resolve(parent, args, context) {
				return context.prisma.link
					.findUnique({ where: { id: parent.id } })
					.voters()
			}
		})
	}
});

export const LinkQuery = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.list.nonNull.field("feeds", {
			type: "Link",
			args: {
				filter: stringArg(),
				skip: intArg(),
				take: intArg()
			},
			resolve(_parent, args, context) {
				const where = args.filter ? {
					OR: [
						{ description: { contains: args.filter } },
						{ url: { contains: args.filter } }
					],
				} : {}
				return context.prisma.link.findMany({
					where,
					skip: args?.skip as number | undefined, //There is a type mismatch between the Nexus generated type (number | undefined | null) and the type expected by Prisma (number | undefined) for these two options. For this reason, typecasting is needed.
					take: args?.take as number | undefined	//same as skip and 
				})
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
				const { description, url } = args
				const { userId } = context
				if (!userId) {
					throw new Error("Cannot post withoug logging in...");
				}
				const newLink = context.prisma.link.create({
					data: {
						description,
						url,
						postedBy: { connect: { id: userId } }
					}
				})
				return newLink
			}
		})
	}

})

