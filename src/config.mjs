export const SITE = {
  name: "ZettaStor",

  origin: "https://zdbs.io",
  basePathname: "/",

  title: "ZettaStor DBS",
  description: "ZettaStor DBS is a free and ready to use framework.",

  googleAnalyticsId: false, // or "G-XXXXXXXXXX",
  googleSiteVerificationId: "-",
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

export const SIDEBAR = {
  en: {
    'Users': [
      { text: 'OS Installation', link: SITE.basePathname + 'operatingsystem' },
      { text: 'Getting Started', link: SITE.basePathname + 'install' },
      { text: 'Advanced Configuration', link: SITE.basePathname + 'configuration' },
      { text: 'User Manual', link: SITE.basePathname + 'manual' },
    ],
    'Developers': [
      { text: 'How to Compile', link: SITE.basePathname + 'compile' },
      { text: 'Developer\'s Guide', link: SITE.basePathname + 'devguide' },
      { text: 'How to Contribute', link: SITE.basePathname + 'contributing' },
      { text: 'License', link: SITE.basePathname + 'agpl' },
    ],
  },
  zh: {
    '用户文档': [
      { text: '安装操作系统', link: SITE.basePathname + 'operatingsystem' },
      { text: '快速配置与部署', link: SITE.basePathname + 'install' },
      { text: '高级配置与定制', link: SITE.basePathname + 'configuration' },
      { text: '用户手册', link: SITE.basePathname + 'manual' },
    ],
    '开发文档': [
      { text: '编译说明', link: SITE.basePathname + 'compile' },
      { text: '开发指南', link: SITE.basePathname + 'devguide' },
      { text: '贡献代码', link: SITE.basePathname + 'contributing' },
      { text: '许可证', link: SITE.basePathname + 'agpl' },
    ],
    '分离部署': [
      { text: 'iSCSI 挂载', link: SITE.basePathname + 'iscsiadm' },
      { text: 'KVM 虚拟化', link: SITE.basePathname + 'kvm' },
      { text: 'VMware 虚拟化', link: '' },
      { text: '文件共享', link: '' },
    ],
    '超融合部署': [
      { text: 'KVM 虚拟化', link: 'kvmhci' },
      { text: 'VMware 虚拟化', link: '' },
      /*
      { text: 'Ｈyper-V', link: SITE.basePathname + '#' },
      { text: '华为FusionCompute', link: SITE.basePathname + '#' },
      { text: 'OpenStack', link: SITE.basePathname + '#' },
      //*/
    ],
  },
};