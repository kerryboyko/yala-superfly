import { db } from "~/database/db.server";
import omit from "lodash/omit";

type OrderByCriterion = { [key: string]: "asc" | "desc" | OrderByCriterion };
type OrderByCriteria = Array<OrderByCriterion>;

const hotness: OrderByCriteria = [
  { aggregatedHotness: "desc" },
  { aggregatedVotes: "desc" },
];
const newest: OrderByCriteria = [{ createdAt: "desc" }];
const mostSubscribers: OrderByCriteria = [
  { communitySubscribers: { _count: "desc" } },
];
const mostPosts: OrderByCriteria = [{ posts: { _count: "desc" } }];

export const countPosts = async () => await db.post.count();
export const countCommunities = async () =>
  await db.community.count({ where: { isPublic: true } });

export const genericFindPosts = async ({
  userId,
  pagination,
  subscriptions,
  orderBy,
}: {
  userId?: string;
  subscriptions?: Array<{ communityRoute: string }>;
  pagination: {
    perPage: number;
    skip: number;
  };
  orderBy: OrderByCriteria;
}) => {
  const numberPosts = await db.post.count();
  const posts = await db.post.findMany({
    where: subscriptions ? { OR: subscriptions } : {},
    orderBy,
    skip: pagination.skip,
    take: pagination.perPage,
    select: {
      _count: {
        select: {
          comments: true,
        },
      },
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      text: true,
      link: true,
      authorId: true,
      communityRoute: true,
      aggregatedVotes: true,
      community: {
        select: {
          name: true,
        },
      },
      postVotes: {
        where: {
          voterId: userId,
        },
        select: {
          value: true,
        },
      },
      author: {
        select: {
          userId: true,
          username: true,
        },
      },
      reactions: {
        select: {
          reactionName: true,
        },
      },
      tags: {
        select: {
          tagName: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    voteCount: post.aggregatedVotes,
    userVoted: post.postVotes[0]?.value || 0,
  }));
};

export const findHottestSubscribedPosts = async ({
  userId,
  pagination,
}: {
  userId?: string;
  pagination: {
    perPage: number;
    skip: number;
  };
}) => {
  const subscriptions = await db.communitySubscribers.findMany({
    where: {
      subscriberId: userId,
    },
    select: {
      communityRoute: true,
    },
  });

  const posts = await genericFindPosts({
    userId,
    subscriptions,
    pagination,
    orderBy: hotness,
  });
  return posts;
};

export const findHottestPosts = async ({
  userId,
  pagination,
}: {
  userId?: string;
  pagination: {
    perPage: number;
    skip: number;
  };
}) => {
  const posts = await genericFindPosts({
    userId,
    pagination,
    orderBy: hotness,
  });
  return posts;
};

export const findNewestPosts = async ({
  userId,
  pagination,
}: {
  userId?: string;
  pagination: {
    perPage: number;
    skip: number;
  };
}) => {
  const posts = await genericFindPosts({ userId, pagination, orderBy: newest });
  return posts;
};

export const genericFindCommunities = async ({
  userId,
  pagination,
  orderBy,
}: {
  userId?: string;
  pagination: {
    perPage: number;
    skip: number;
  };
  orderBy: OrderByCriteria;
}) => {
  const communities = await db.community.findMany({
    take: pagination.perPage,
    skip: pagination.skip,
    where: { isPublic: true },
    orderBy,
    select: {
      route: true,
      name: true,
      description: true,
      isPublic: true,
      _count: {
        select: {
          comments: true,
          posts: true,
        },
      },
      communitySubscribers: {
        select: {
          subscriberId: true,
        },
      },
    },
  });
  return communities.map((comm) => ({
    ...omit(comm, ["communitySubscribers"]),
    isSubscribed: comm.communitySubscribers
      .map((cs) => cs.subscriberId)
      .includes(userId || ""),
  }));
};

export const findPopularCommunities = async ({
  userId,
  pagination,
}: {
  userId?: string;
  pagination: {
    perPage: number;
    skip: number;
  };
}) => {
  const popularCommunities = await genericFindCommunities({
    userId,
    pagination,
    orderBy: mostSubscribers,
  });
  return popularCommunities;
};

export const findActiveCommunities = async ({
  userId,
  pagination,
}: {
  userId?: string;
  pagination: {
    perPage: number;
    skip: number;
  };
}) => {
  const activeCommunities = await genericFindCommunities({
    userId,
    pagination,
    orderBy: mostPosts,
  });
  return activeCommunities;
};
