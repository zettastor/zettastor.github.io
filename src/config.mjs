export const SITE = {
  name: "ZettaStor",

  origin: "https://zettastor.github.io",
  basePathname: "/",

  title: "ZettaStor DBS",
  description: "🚀 ZettaStor DBS is a free and ready to use framework.",

  googleAnalyticsId: false, // or "G-XXXXXXXXXX",
  googleSiteVerificationId: "orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M",
};

export const BLOG = {
  disabled: false,
  slug: "blog",

  postsWithoutBlogSlug: true,
  postsPerPage: 6,

  category: {
    disabled: false,
    slug: "category", // set empty to change from /category/some-slug to /some-slug
  },

  tag: {
    disabled: false,
    slug: "tag",
  },
};
